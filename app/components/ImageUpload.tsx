"use client";

import React, { useRef, useCallback } from "react";
import Image from "next/image";
import { generateId } from "../utils/generateId";
import { ImageWithCaption } from "../types/section";

/**
 * Converts a File to base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image to the server
 */
async function uploadImage(
  file: File
): Promise<{ imageId: string; url?: string }> {
  const base64Image = await fileToBase64(file);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      base64Image,
      filename: file.name,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload image");
  }

  const result = await response.json();
  return { imageId: result.imageId, url: result.url };
}

interface ImageUploadProps {
  images: ImageWithCaption[];
  maxImages: number;
  onImagesChange: (images: ImageWithCaption[]) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  label?: string;
  isWithCaption?: boolean;
}

export default function ImageUpload({
  images,
  maxImages,
  onImagesChange,
  onUploadingChange,
  label = "Images",
  isWithCaption = true,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<ImageWithCaption[]>(images);

  // Keep ref in sync with images prop
  React.useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Notify parent when uploading state changes
  React.useEffect(() => {
    const isUploading = images.some((img) => img.uploadStatus === "uploading");
    onUploadingChange?.(isUploading);
  }, [images, onUploadingChange]);

  const updateImageInState = useCallback(
    (imageId: string, updates: Partial<ImageWithCaption>) => {
      const currentImages = imagesRef.current;
      const updatedImages = currentImages.map((img) =>
        img.id === imageId ? { ...img, ...updates } : img
      );
      imagesRef.current = updatedImages;
      onImagesChange(updatedImages);
    },
    [onImagesChange]
  );

  const handleUploadImage = useCallback(
    async (image: ImageWithCaption) => {
      if (!image.file) return;

      // Set uploading status
      updateImageInState(image.id, { uploadStatus: "uploading" });

      try {
        const { imageId, url } = await uploadImage(image.file);
        // Update with success status
        updateImageInState(image.id, {
          uploadStatus: "success",
          uploadedImageId: imageId,
          preview: url || image.preview,
        });
      } catch (error) {
        // Update with error status
        updateImageInState(image.id, {
          uploadStatus: "error",
          uploadError: error instanceof Error ? error.message : "Upload failed",
        });
      }
    },
    [updateImageInState]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = maxImages - images.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);
    const newImages: ImageWithCaption[] = filesToAdd.map((file) => ({
      id: generateId(),
      file,
      preview: URL.createObjectURL(file),
      caption: "",
      uploadStatus: "pending" as const,
    }));

    const allImages = [...images, ...newImages];
    imagesRef.current = allImages;
    onImagesChange(allImages);
    e.target.value = "";

    // Start uploading each new image
    for (const image of newImages) {
      handleUploadImage(image);
    }
  };

  const handleRetryUpload = (image: ImageWithCaption) => {
    handleUploadImage(image);
  };

  const handleCaptionChange = (id: string, caption: string) => {
    onImagesChange(
      images.map((img) => (img.id === id ? { ...img, caption } : img))
    );
  };

  const handleRemoveImage = (id: string) => {
    const imageToRemove = images.find((img) => img.id === id);
    // Only revoke blob URLs (not external URLs from loaded images)
    if (imageToRemove?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    onImagesChange(images.filter((img) => img.id !== id));
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label} ({images.length}/{maxImages})
      </label>      
      {/* Image previews */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-zinc-200 dark:bg-zinc-700">
              <Image
                src={image.preview}
                alt={image.caption || "Uploaded image"}
                fill
                className="object-cover"
              />
              {/* Upload status overlay */}
              {image.uploadStatus === "uploading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="h-8 w-8 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-white">Uploading...</span>
                  </div>
                </div>
              )}
              {image.uploadStatus === "error" && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500/70">
                  <div className="flex flex-col items-center gap-2 px-2 text-center">
                    <svg
                      className="h-8 w-8 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs font-medium text-white">
                      {image.uploadError || "Upload failed"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRetryUpload(image)}
                      className="rounded bg-white px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
              {image.uploadStatus === "success" && (
                <div className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
            {(isWithCaption && index != 0) && (<input
              type="text"
              placeholder="Enter caption..."
              value={image.caption}
              onChange={(e) => handleCaptionChange(image.id, e.target.value)}
              className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
            />)}
            <button
              type="button"
              onClick={() => handleRemoveImage(image.id)}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Upload buttons */}
      {images.length < maxImages && (
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Upload Image
          </button>
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Take Photo
          </button>
        </div>
      )}
    </div>
  );
}

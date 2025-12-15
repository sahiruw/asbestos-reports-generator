import { NextRequest, NextResponse } from "next/server";

const IMAGE_UPLOAD_ENDPOINT = process.env.IMAGE_UPLOAD_ENDPOINT!;

export async function POST(request: NextRequest) {
  try {
    const { base64Image, filename } = await request.json();

    if (!base64Image) {
      return NextResponse.json(
        { error: "Base64 image data is required" },
        { status: 400 }
      );
    }

    // Send the image to the external upload endpoint
    const response = await fetch(IMAGE_UPLOAD_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base64: base64Image,
        fileName: filename || "image.jpg",
      }),
    });

    

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const result = await response.json();
    console.log("Upload response status:", result);

    return NextResponse.json({
      success: true,
      imageId: result.id || result.imageId || result.fileId,
      url: result.url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      {
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

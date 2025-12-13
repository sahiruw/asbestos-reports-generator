"use client";

import React from "react";
import ImageUpload, { ImageWithCaption } from "./ImageUpload";
import { generateId } from "../utils/generateId";

export interface SectionData {
  id: string;
  sampleNo: string;
  idSymbol: string;
  location: string;
  itemMaterialProduct: string;
  quantityExtent: string;
  asbestosType: string;
  notAccessed: boolean;
  notAccessedReason: string;
  isExternal: boolean;
  accessibility: string;
  condition: string;
  image: ImageWithCaption | null;
}

interface SectionFormProps {
  section: SectionData;
  index: number;
  onUpdate: (section: SectionData) => void;
  onRemove: () => void;
}

export default function SectionForm({
  section,
  index,
  onUpdate,
  onRemove,
}: SectionFormProps) {
  const handleChange = (
    field: keyof SectionData,
    value: string | boolean | ImageWithCaption | null
  ) => {
    onUpdate({ ...section, [field]: value });
  };

  const handleImageChange = (images: ImageWithCaption[]) => {
    handleChange("image", images.length > 0 ? images[0] : null);
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Section {index + 1}
        </h3>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
        >
          Remove Section
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Sample No */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Sample No
          </label>
          <input
            type="text"
            value={section.sampleNo}
            onChange={(e) => handleChange("sampleNo", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
            placeholder="Enter sample no"
          />
        </div>

        {/* ID Symbol */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            ID Symbol
          </label>
          <input
            type="text"
            value={section.idSymbol}
            onChange={(e) => handleChange("idSymbol", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
            placeholder="Enter ID symbol"
          />
        </div>

        {/* Location */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Location
          </label>
          <input
            type="text"
            value={section.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
            placeholder="Enter location"
          />
        </div>

        {/* Item/Material/Product */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Item/Material/Product
          </label>
          <input
            type="text"
            value={section.itemMaterialProduct}
            onChange={(e) => handleChange("itemMaterialProduct", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
            placeholder="Enter item/material/product"
          />
        </div>

        {/* Quantity/Extent */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Quantity/Extent
          </label>
          <input
            type="text"
            value={section.quantityExtent}
            onChange={(e) => handleChange("quantityExtent", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
            placeholder="Enter quantity/extent"
          />
        </div>

        {/* Asbestos Type */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Asbestos Type
          </label>
          <select
            value={section.asbestosType}
            onChange={(e) => handleChange("asbestosType", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
          >
            <option value="">Select type</option>
            <option value="Chrysotile">Chrysotile (White)</option>
            <option value="Amosite">Amosite (Brown)</option>
            <option value="Crocidolite">Crocidolite (Blue)</option>
            <option value="Tremolite">Tremolite</option>
            <option value="Anthophyllite">Anthophyllite</option>
            <option value="Actinolite">Actinolite</option>
            <option value="NAD">No Asbestos Detected (NAD)</option>
            <option value="Presumed">Presumed ACM</option>
          </select>
        </div>

        {/* Accessibility */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Accessibility
          </label>
          <select
            value={section.accessibility}
            onChange={(e) => handleChange("accessibility", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
          >
            <option value="">Select accessibility</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Condition
          </label>
          <select
            value={section.condition}
            onChange={(e) => handleChange("condition", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
          >
            <option value="">Select condition</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="mt-4 flex flex-wrap gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={section.notAccessed}
            onChange={(e) => handleChange("notAccessed", e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
          />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            Not Accessed
          </span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={section.isExternal}
            onChange={(e) => handleChange("isExternal", e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
          />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            External (X)
          </span>
        </label>
      </div>

      {/* Not Accessed Reason */}
      {section.notAccessed && (
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Reason for Not Accessing
          </label>
          <input
            type="text"
            value={section.notAccessedReason}
            onChange={(e) => handleChange("notAccessedReason", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
            placeholder="Enter reason"
          />
        </div>
      )}

      {/* Section Image */}
      <div className="mt-4">
        <ImageUpload
          images={section.image ? [section.image] : []}
          maxImages={1}
          onImagesChange={handleImageChange}
          label="Section Image"
        />
      </div>
    </div>
  );
}

export function createEmptySection(): SectionData {
  return {
    id: generateId(),
    sampleNo: "",
    idSymbol: "",
    location: "",
    itemMaterialProduct: "",
    quantityExtent: "",
    asbestosType: "",
    notAccessed: false,
    notAccessedReason: "",
    isExternal: false,
    accessibility: "",
    condition: "",
    image: null,
  };
}

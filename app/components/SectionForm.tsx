"use client";

import { ImageWithCaption, SectionData } from "../types/section";
import ImageUpload from "./ImageUpload";



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
    value: string | boolean | number | ImageWithCaption | null
  ) => {
    onUpdate({ ...section, [field]: value });
  };

  const handleImageChange = (images: ImageWithCaption[]) => {
    handleChange("image", images.length > 0 ? images[0] : null);
  };

  // Calculate Material Assessment Total (sum of all 4 scores)
  const materialAssessmentTotal =
    section.productType +
    section.damageDeteriorationScore +
    section.surfaceTreatment +
    section.asbestosTypeScore || 0;

  // Total Score is the same as Material Assessment Total in this context
  const totalScore = materialAssessmentTotal;

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

          <input
            type="text"
            value={section.asbestosType}
            onChange={(e) => handleChange("asbestosType", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
            placeholder="Enter sample no"
          />
        </div>

        {/* Accessibility */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Accessibility
          </label>
           <input
            type="text"
            value={section.accessibility}
            onChange={(e) => handleChange("accessibility", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
            placeholder="Accessibility"
          />
        </div>

        {/* Condition */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Condition
          </label>
           <input
            type="text"
            value={section.condition}
            onChange={(e) => handleChange("condition", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
            placeholder="Condition"
          />
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

      {/* Material Assessment Algorithm */}
      <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-600 dark:bg-zinc-700/50">
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
          Material Assessment Algorithm
        </h4>
        
        {/* Table Layout */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-300 dark:border-zinc-600">
                <th className="px-2 py-2 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                  Parameter
                </th>
                <th className="px-2 py-2 text-center font-semibold text-zinc-700 dark:text-zinc-300">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-200 dark:border-zinc-600">
                <td className="px-2 py-2 text-zinc-700 dark:text-zinc-300">
                  Product Type (1-3)
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    min={1}
                    max={3}
                    value={section.productType}
                    onChange={(e) => handleChange("productType", Math.min(3, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-20 rounded-md border border-zinc-300 bg-white px-2 py-1 text-center text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
                  />
                </td>
              </tr>
              <tr className="border-b border-zinc-200 dark:border-zinc-600">
                <td className="px-2 py-2 text-zinc-700 dark:text-zinc-300">
                  Damage/Deterioration (0-3)
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    min={0}
                    max={3}
                    value={section.damageDeteriorationScore}
                    onChange={(e) => handleChange("damageDeteriorationScore", Math.min(3, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-20 rounded-md border border-zinc-300 bg-white px-2 py-1 text-center text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
                  />
                </td>
              </tr>
              <tr className="border-b border-zinc-200 dark:border-zinc-600">
                <td className="px-2 py-2 text-zinc-700 dark:text-zinc-300">
                  Surface Treatment (0-3)
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    min={0}
                    max={3}
                    value={section.surfaceTreatment}
                    onChange={(e) => handleChange("surfaceTreatment", Math.min(3, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-20 rounded-md border border-zinc-300 bg-white px-2 py-1 text-center text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
                  />
                </td>
              </tr>
              <tr className="border-b border-zinc-200 dark:border-zinc-600">
                <td className="px-2 py-2 text-zinc-700 dark:text-zinc-300">
                  Asbestos Type (1-3)
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    min={1}
                    max={3}
                    value={section.asbestosTypeScore}
                    onChange={(e) => handleChange("asbestosTypeScore", Math.min(3, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-20 rounded-md border border-zinc-300 bg-white px-2 py-1 text-center text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
                  />
                </td>
              </tr>
              <tr className="border-b border-zinc-300 bg-blue-50 dark:border-zinc-600 dark:bg-blue-900/20">
                <td className="px-2 py-2 font-semibold text-blue-700 dark:text-blue-300">
                  Material Assessment Total (a)
                </td>
                <td className="px-2 py-2 text-center text-lg font-bold text-blue-900 dark:text-blue-100">
                  {materialAssessmentTotal}
                </td>
              </tr>
              <tr className="bg-green-50 dark:bg-green-900/20">
                <td className="px-2 py-2 font-semibold text-green-700 dark:text-green-300">
                  Total Score
                </td>
                <td className="px-2 py-2 text-center text-lg font-bold text-green-900 dark:text-green-100">
                  {totalScore}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Management and Control Actions */}
      <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-600 dark:bg-zinc-700/50">
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
          Management and Control Actions
        </h4>
        
        {/* Table Layout */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-300 dark:border-zinc-600">
                <th className="px-2 py-2 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                  Action
                </th>
                <th className="px-2 py-2 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                  Timescale
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-200 dark:border-zinc-600">
                <td className="px-2 py-2 text-zinc-700 dark:text-zinc-300">Label</td>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={section.actionLabel}
                    onChange={(e) => handleChange("actionLabel", e.target.value)}
                    placeholder="e.g., Immediate"
                    className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
                  />
                </td>
              </tr>
              <tr className="border-b border-zinc-200 dark:border-zinc-600">
                <td className="px-2 py-2 text-zinc-700 dark:text-zinc-300">Monitor condition/Re-inspect</td>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={section.actionMonitorReinspect}
                    onChange={(e) => handleChange("actionMonitorReinspect", e.target.value)}
                    placeholder="e.g., 12/2026 – Unless ACM Removed"
                    className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
                  />
                </td>
              </tr>
              <tr className="border-b border-zinc-200 dark:border-zinc-600">
                <td className="px-2 py-2 text-zinc-700 dark:text-zinc-300">Encapsulate or Enclose</td>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={section.actionEncapsulateEnclose}
                    onChange={(e) => handleChange("actionEncapsulateEnclose", e.target.value)}
                    placeholder="e.g., Until Safe Removal"
                    className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
                  />
                </td>
              </tr>
              <tr className="border-b border-zinc-200 dark:border-zinc-600">
                <td className="px-2 py-2 text-zinc-700 dark:text-zinc-300">Operate Safe System of Work</td>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={section.actionSafeSystemOfWork}
                    onChange={(e) => handleChange("actionSafeSystemOfWork", e.target.value)}
                    placeholder="e.g., Immediate"
                    className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
                  />
                </td>
              </tr>
              <tr className="border-b border-zinc-200 dark:border-zinc-600">
                <td className="px-2 py-2 text-zinc-700 dark:text-zinc-300">Remove by Competent Contractor</td>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={section.actionRemoveCompetentContractor}
                    onChange={(e) => handleChange("actionRemoveCompetentContractor", e.target.value)}
                    placeholder="e.g., Prior to Disturbance"
                    className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
                  />
                </td>
              </tr>
              <tr className="border-b border-zinc-200 dark:border-zinc-600">
                <td className="px-2 py-2 text-zinc-700 dark:text-zinc-300">Remove by Licensed Contractor</td>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={section.actionRemoveLicensedContractor}
                    onChange={(e) => handleChange("actionRemoveLicensedContractor", e.target.value)}
                    placeholder="e.g., X"
                    className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
                  />
                </td>
              </tr>
              <tr className="border-b border-zinc-200 dark:border-zinc-600">
                <td className="px-2 py-2 text-zinc-700 dark:text-zinc-300">Manage Access</td>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={section.actionManageAccess}
                    onChange={(e) => handleChange("actionManageAccess", e.target.value)}
                    placeholder="e.g., Immediate"
                    className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

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


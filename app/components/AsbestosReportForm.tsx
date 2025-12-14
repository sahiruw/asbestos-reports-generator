"use client";

import React, { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";
import SectionForm from "./SectionForm";
import { DefaultValues } from "../utils/defaults";
import { ImageWithCaption, SectionData, FormData } from "../types/section";



export default function AsbestosReportForm() {
  const [formData, setFormData] = useState<FormData>({
    client: "",
    projectNo: "",
    address: "",
    dateOfSurvey: "",
    reinspectionDate: "",
    numberOfStoreys: "",
    outbuildings: "",
    buildingImages: [],
    sections: [],
  });
  const [defaults, setDefaults] = useState<DefaultValues>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch default values from Google Sheets on component mount
  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        const response = await fetch("/api/defaults");
        if (response.ok) {
          const data: DefaultValues = await response.json();
          setDefaults(data);
        }
      } catch (error) {
        console.error("Failed to fetch defaults:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDefaults();
  }, []);

  const handleInputChange = (
    field: keyof Omit<FormData, "buildingImages" | "sections">,
    value: string
  ) => {
    const updates: Partial<FormData> = { [field]: value };

    // Auto-calculate reinspection date when date of survey changes
    if (field === "dateOfSurvey" && value) {
      const surveyDate = new Date(value);
      surveyDate.setFullYear(surveyDate.getFullYear() + 1);
      updates.reinspectionDate = surveyDate.toISOString().split("T")[0];
    }

    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleBuildingImagesChange = (images: ImageWithCaption[]) => {
    setFormData((prev) => ({ ...prev, buildingImages: images }));
  };

  const handleAddSection = () => {

    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, {} as SectionData],
    }));
  };

  const handleUpdateSection = (index: number, section: SectionData) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) => (i === index ? section : s)),
    }));
  };

  const handleRemoveSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await fetch("/api/submit-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit report");
      }

      setSubmitSuccess(`Report submitted successfully! Report ID: ${result.reportId}`);
      console.log("Report submitted:", result);
    } catch (error) {
      console.error("Error submitting report:", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Asbestos Survey Report
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Complete all fields to generate your report
        </p>
      </div>

      {/* Common Fields Section */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Project Information
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Client */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Client
            </label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => handleInputChange("client", e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              placeholder="Enter client name"
              required
            />
          </div>

          {/* Project No */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Project No
            </label>
            <input
              type="text"
              value={formData.projectNo}
              onChange={(e) => handleInputChange("projectNo", e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              placeholder="Enter project number"
              required
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows={2}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              placeholder="Enter full address"
              required
            />
          </div>

          {/* Date of Survey */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Date of Survey
            </label>
            <input
              type="date"
              value={formData.dateOfSurvey}
              onChange={(e) => handleInputChange("dateOfSurvey", e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              required
            />
          </div>

          {/* Reinspection Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Reinspection Date
            </label>
            <input
              type="date"
              value={formData.reinspectionDate}
              onChange={(e) =>
                handleInputChange("reinspectionDate", e.target.value)
              }
              className="w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-600 dark:text-zinc-100"
              readOnly
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Auto-calculated (Survey Date + 1 year)
            </p>
          </div>

          {/* Number of Storeys */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Number of Storeys
            </label>
            <input
              type="number"
              min="1"
              value={formData.numberOfStoreys}
              onChange={(e) =>
                handleInputChange("numberOfStoreys", e.target.value)
              }
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              placeholder="Enter number"
            />
          </div>

          {/* Outbuildings */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Outbuildings
            </label>
            <input
              type="text"
              value={formData.outbuildings}
              onChange={(e) => handleInputChange("outbuildings", e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              placeholder="Describe outbuildings"
            />
          </div>
        </div>

        {/* Building Images */}
        <div className="mt-6">
          <ImageUpload
            images={formData.buildingImages}
            maxImages={5}
            onImagesChange={handleBuildingImagesChange}
            label="Building Images"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Survey Sections ({formData.sections.length})
          </h2>
        </div>

        {formData.sections.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-600 dark:bg-zinc-800/50">
            <p className="text-zinc-500 dark:text-zinc-400">
              No sections added yet. Click &quot;Add Section&quot; to create one.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.sections.map((section, index) => (
              <SectionForm
                key={`section-${index}`}
                section={section}
                index={index}
                onUpdate={(s) => handleUpdateSection(index, s)}
                onRemove={() => handleRemoveSection(index)}
                defaults={defaults}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">

          <button
            type="button"
            onClick={handleAddSection}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Section
          </button>
        </div>
      </div>      {/* Submit Button */}
      <div className="flex flex-col items-center gap-4 pt-4">
        {submitError && (
          <div className="w-full rounded-md bg-red-50 p-4 text-center text-red-700 dark:bg-red-900/20 dark:text-red-400">
            <p className="font-medium">Error</p>
            <p className="text-sm">{submitError}</p>
          </div>
        )}
        {submitSuccess && (
          <div className="w-full rounded-md bg-green-50 p-4 text-center text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <p className="font-medium">Success</p>
            <p className="text-sm">{submitSuccess}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-green-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400 sm:w-auto"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-5 w-5 animate-spin"
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
              Submitting...
            </span>
          ) : (
            "Generate Report"
          )}
        </button>
      </div>
    </form>
  );
}

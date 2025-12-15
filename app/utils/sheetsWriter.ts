import { getGoogleServices } from "./google";
import { FormData, SectionData, ImageWithCaption } from "../types/section";

// The spreadsheet ID for storing report data
const REPORTS_SPREADSHEET_ID = process.env.REPORTS_SPREADSHEET_ID!;

// Sheet names within the spreadsheet
const SHEETS = {
  MAIN: "main",
  SECTIONS: "sections",
  IMAGES: "images",
} as const;

/**
 * Generates a unique report ID based on project number and timestamp
 */
export function generateReportId(projectNo: string): string {
  const timestamp = Date.now();
  const sanitizedProjectNo = projectNo.replace(/[^a-zA-Z0-9]/g, "");
  return `RPT-${sanitizedProjectNo}-${timestamp}`;
}

/**
 * Writes form data to Google Sheets across three sheets: main, sections, and images
 */
export async function writeReportToSheets(formData: FormData): Promise<{
  reportId: string;
  success: boolean;
}> {
  const { sheets } = await getGoogleServices();
  const reportId = generateReportId(formData.projectNo);
  const submittedAt = new Date().toISOString();

  try {
    // Prepare data for main sheet
    const mainRow = prepareMainSheetRow(reportId, formData, submittedAt);

    // Prepare data for sections sheet
    const sectionRows = prepareSectionSheetRows(reportId, formData.sections);

    // Prepare data for images sheet (building images + section images)
    const imageRows = prepareImageSheetRows(reportId, formData);

    // Batch update all three sheets
    await Promise.all([
      appendToSheet(sheets, SHEETS.MAIN, [mainRow]),
      sectionRows.length > 0
        ? appendToSheet(sheets, SHEETS.SECTIONS, sectionRows)
        : Promise.resolve(),
      imageRows.length > 0
        ? appendToSheet(sheets, SHEETS.IMAGES, imageRows)
        : Promise.resolve(),
    ]);

    return { reportId, success: true };
  } catch (error) {
    console.error("Error writing report to sheets:", error);
    throw error;
  }
}

/**
 * Appends rows to a specific sheet
 */
async function appendToSheet(
  sheets: Awaited<ReturnType<typeof getGoogleServices>>["sheets"],
  sheetName: string,
  rows: (string | number | boolean)[][]
): Promise<void> {
  await sheets.spreadsheets.values.append({
    spreadsheetId: REPORTS_SPREADSHEET_ID,
    range: `${sheetName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: rows,
    },
  });
}

/**
 * Prepares the main sheet row with project information
 */
function prepareMainSheetRow(
  reportId: string,
  formData: FormData,
  submittedAt: string
): (string | number)[] {
  return [
    reportId,
    formData.client,
    formData.projectNo,
    formData.address,
    formData.dateOfSurvey,
    formData.reinspectionDate,
    formData.numberOfStoreys,
    formData.outbuildings,
    formData.sections.length, // Number of sections
    formData.buildingImages.length, // Number of building images
    submittedAt,
  ];
}

/**
 * Prepares section sheet rows
 * Each section gets its own row linked to the report by reportId
 */
function prepareSectionSheetRows(
  reportId: string,
  sections: SectionData[]
): (string | number | boolean)[][] {
  return sections.map((section, index) => {
    const sectionId = `${reportId}-SEC-${String(index + 1).padStart(3, "0")}`;
    return [
      sectionId,
      reportId,
      index + 1, // Section order/number
      section.sampleNo || "",
      section.idSymbol || "",
      section.location || "",
      section.itemMaterialProduct || "",
      section.quantityExtent || "",
      section.asbestosType || "",
      section.notAccessed ? "Yes" : "No",
      section.notAccessedReason || "",
      section.isExternal ? "Yes" : "No",
      section.accessibility || "",
      section.condition || "",
      // Material Assessment Algorithm scores
      section.productType || 0,
      section.damageDeteriorationScore || 0,
      section.surfaceTreatment || 0,
      section.asbestosTypeScore || 0,
      // Management and Control Actions
      section.actionLabel || "",
      section.actionMonitorReinspect || "",
      section.actionEncapsulateEnclose || "",
      section.actionSafeSystemOfWork || "",
      section.actionRemoveCompetentContractor || "",
      section.actionRemoveLicensedContractor || "",
      section.actionManageAccess || "",
      // Has image flag
      section.image ? "Yes" : "No",
    ];
  });
}

/**
 * Prepares image sheet rows
 * Includes both building images and section images
 */
function prepareImageSheetRows(
  reportId: string,
  formData: FormData
): (string | number)[][] {
  const rows: (string | number)[][] = [];

  // Add building images
  formData.buildingImages.forEach((image, index) => {
    const imageId = `${reportId}-IMG-BLD-${String(index + 1).padStart(3, "0")}`;
    rows.push([
      imageId,
      reportId,
      "", // No section ID for building images
      "building", // Image type
      index + 1, // Image order
      image.caption || "",
      image.uploadedImageId || "", // Uploaded image ID from the image service
    ]);
  });

  // Add section images
  formData.sections.forEach((section, sectionIndex) => {
    if (section.image) {
      const sectionId = `${reportId}-SEC-${String(sectionIndex + 1).padStart(3, "0")}`;
      const imageId = `${reportId}-IMG-SEC-${String(sectionIndex + 1).padStart(3, "0")}`;
      rows.push([
        imageId,
        reportId,
        sectionId,
        "section", // Image type
        1, // Image order within section (always 1 since each section has max 1 image)
        section.image.caption || "",
        section.image.uploadedImageId || "", // Uploaded image ID from the image service
      ]);
    }
  });

  return rows;
}



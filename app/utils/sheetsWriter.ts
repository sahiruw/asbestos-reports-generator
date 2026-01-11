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

// Default starting project number
const DEFAULT_PROJECT_PREFIX = "GHM";
const DEFAULT_PROJECT_SUFFIX = "-AS";
const DEFAULT_STARTING_NUMBER = 1000;

/**
 * Generates the next project number by reading the last project number from the spreadsheet
 * Format: GHM1000-AS, GHM1001-AS, etc.
 */
export async function getNextProjectNumber(): Promise<string> {
  const { sheets } = await getGoogleServices();

  try {
    // Get all values from column C (projectNo column)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: REPORTS_SPREADSHEET_ID,
      range: `${SHEETS.MAIN}!C:C`,
    });

    const values = response.data.values;

    // If no data or only header, return the starting project number
    if (!values || values.length <= 1) {
      return `${DEFAULT_PROJECT_PREFIX}${DEFAULT_STARTING_NUMBER}${DEFAULT_PROJECT_SUFFIX}`;
    }

    // Get the last non-empty value (skip header row)
    let lastProjectNo = "";
    for (let i = values.length - 1; i >= 1; i--) {
      if (values[i] && values[i][0]) {
        lastProjectNo = values[i][0];
        break;
      }
    }

    // If no valid project number found, return starting number
    if (!lastProjectNo) {
      return `${DEFAULT_PROJECT_PREFIX}${DEFAULT_STARTING_NUMBER}${DEFAULT_PROJECT_SUFFIX}`;
    }

    // Parse the project number (format: GHM1000-AS)
    const match = lastProjectNo.match(/^([A-Za-z]+)(\d+)(-[A-Za-z]+)?$/);
    if (!match) {
      // If format doesn't match, return starting number
      console.warn(`Unexpected project number format: ${lastProjectNo}`);
      return `${DEFAULT_PROJECT_PREFIX}${DEFAULT_STARTING_NUMBER}${DEFAULT_PROJECT_SUFFIX}`;
    }

    const prefix = match[1];
    const number = parseInt(match[2], 10);
    const suffix = match[3] || DEFAULT_PROJECT_SUFFIX;

    // Increment the number
    const nextNumber = number + 1;

    return `${prefix}${nextNumber}${suffix}`;
  } catch (error) {
    console.error("Error getting next project number:", error);
    // Return starting number on error
    return `${DEFAULT_PROJECT_PREFIX}${DEFAULT_STARTING_NUMBER}${DEFAULT_PROJECT_SUFFIX}`;
  }
}

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
      // Additional fields
      section.specificRecommendations || "",
      section.isLicensed ? "Yes" : "No",
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

/**
 * Constructs a viewable URL from a Google Drive file ID using our proxy API
 */
function getImageUrl(fileIdOrUrl: string): string {
  if (!fileIdOrUrl) return "";
  
  // If it's already a full URL (not a Google Drive URL), return it as-is
  if (fileIdOrUrl.startsWith("http://") || fileIdOrUrl.startsWith("https://")) {
    // If it's a Google Drive URL, extract the ID and use our proxy
    const driveMatch = fileIdOrUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      return `/api/image/${driveMatch[1]}`;
    }
    return fileIdOrUrl;
  }
  
  // Use our proxy API to serve the image
  return `/api/image/${fileIdOrUrl}`;
}

/**
 * Reads a report from Google Sheets by report ID
 */
export async function getReportFromSheets(reportId: string): Promise<FormData | null> {
  const { sheets } = await getGoogleServices();

  try {
    // Fetch data from all three sheets in parallel
    const [mainResponse, sectionsResponse, imagesResponse] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId: REPORTS_SPREADSHEET_ID,
        range: `${SHEETS.MAIN}!A:K`,
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: REPORTS_SPREADSHEET_ID,
        range: `${SHEETS.SECTIONS}!A:AC`,
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: REPORTS_SPREADSHEET_ID,
        range: `${SHEETS.IMAGES}!A:G`,
      }),
    ]);

    const mainRows = mainResponse.data.values || [];
    const sectionRows = sectionsResponse.data.values || [];
    const imageRows = imagesResponse.data.values || [];

    // Find the main row for this report (skip header row)
    const mainRow = mainRows.find((row, index) => index > 0 && row[0] === reportId);
    if (!mainRow) {
      return null;
    }

    // Parse main data
    // Columns: reportId, client, projectNo, address, dateOfSurvey, reinspectionDate, numberOfStoreys, outbuildings, sectionsCount, buildingImagesCount, submittedAt
    const formData: FormData = {
      client: mainRow[1] || "",
      projectNo: mainRow[2] || "",
      address: mainRow[3] || "",
      dateOfSurvey: mainRow[4] || "",
      reinspectionDate: mainRow[5] || "",
      numberOfStoreys: mainRow[6] || "",
      outbuildings: mainRow[7] || "",
      buildingImages: [],
      sections: [],
    };

    // Parse building images (filter by reportId and type = "building")
    const buildingImageRows = imageRows.filter(
      (row, index) => index > 0 && row[1] === reportId && row[3] === "building"
    );
    formData.buildingImages = buildingImageRows.map((row) => ({
      id: row[0] || "",
      file: null,
      preview: getImageUrl(row[6] || ""), // Construct proper image URL
      caption: row[5] || "",
      uploadStatus: "success" as const,
      uploadedImageId: row[6] || "",
    }));

    // Parse sections (filter by reportId)
    const reportSectionRows = sectionRows.filter(
      (row, index) => index > 0 && row[1] === reportId
    );
    
    // Parse section images
    const sectionImageRows = imageRows.filter(
      (row, index) => index > 0 && row[1] === reportId && row[3] === "section"
    );
    const sectionImageMap = new Map<string, { caption: string; uploadedImageId: string }>();
    for (const row of sectionImageRows) {
      sectionImageMap.set(row[2], { // sectionId
        caption: row[5] || "",
        uploadedImageId: row[6] || "",
      });
    }

    formData.sections = reportSectionRows.map((row) => {
      const sectionId = row[0];
      const imageData = sectionImageMap.get(sectionId);
      
      return {
        id: sectionId,
        sampleNo: row[3] || "",
        idSymbol: row[4] || "",
        location: row[5] || "",
        itemMaterialProduct: row[6] || "",
        quantityExtent: row[7] || "",
        asbestosType: row[8] || "",
        notAccessed: row[9] === "Yes",
        notAccessedReason: row[10] || "",
        isExternal: row[11] === "Yes",
        accessibility: row[12] || "",
        condition: row[13] || "",
        // Material Assessment Algorithm scores
        productType: parseInt(row[14], 10) || 0,
        damageDeteriorationScore: parseInt(row[15], 10) || 0,
        surfaceTreatment: parseInt(row[16], 10) || 0,
        asbestosTypeScore: parseInt(row[17], 10) || 0,
        // Management and Control Actions
        actionLabel: row[18] || "",
        actionMonitorReinspect: row[19] || "",
        actionEncapsulateEnclose: row[20] || "",
        actionSafeSystemOfWork: row[21] || "",
        actionRemoveCompetentContractor: row[22] || "",
        actionRemoveLicensedContractor: row[23] || "",
        actionManageAccess: row[24] || "",
        // Additional fields
        specificRecommendations: row[25] || "",
        isLicensed: row[26] === "Yes",
        // Image
        image: imageData ? {
          id: sectionId + "-img",
          file: null,
          preview: getImageUrl(imageData.uploadedImageId), // Construct proper image URL
          caption: imageData.caption,
          uploadStatus: "success" as const,
          uploadedImageId: imageData.uploadedImageId,
        } : null,
      } as SectionData;
    });

    return formData;
  } catch (error) {
    console.error("Error reading report from sheets:", error);
    throw error;
  }
}



import { NextRequest, NextResponse } from "next/server";
import { writeReportToSheets } from "../../utils/sheetsWriter";
import { FormData } from "../../types/section";

export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json();

    // Validate required fields
    const validationError = validateFormData(formData);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    // Write to Google Sheets
    const result = await writeReportToSheets(formData);

    return NextResponse.json({
      success: true,
      reportId: result.reportId,
      message: "Report submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting report:", error);
    return NextResponse.json(
      { 
        error: "Failed to submit report",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * Validates the form data before submission
 */
function validateFormData(formData: FormData): string | null {
  if (!formData.client?.trim()) {
    return "Client name is required";
  }
  if (!formData.projectNo?.trim()) {
    return "Project number is required";
  }
  if (!formData.address?.trim()) {
    return "Address is required";
  }
  if (!formData.dateOfSurvey) {
    return "Date of survey is required";
  }
  return null;
}

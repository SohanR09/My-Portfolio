import { getResume, uploadResume } from "@/lib/services/site-settings";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const resume = await getResume();
    return NextResponse.json(resume || {});
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Upload the resume
    const resume = await uploadResume(file);

    return NextResponse.json(resume);
  } catch (error) {
    console.error("Error uploading resume:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to upload resume",
      },
      { status: 500 }
    );
  }
}

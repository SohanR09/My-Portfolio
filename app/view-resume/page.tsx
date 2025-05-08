"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ResumeSetting } from "@/lib/services/site-settings";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaDownload } from "react-icons/fa";

// Dynamically import the PDF viewer component to avoid SSR issues
const PDFViewer = dynamic(() => import("@/components/PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[80vh] flex items-center justify-center">
      <Skeleton className="w-full h-full" />
    </div>
  ),
});

export default function ResumePage() {
  const [resume, setResume] = useState<ResumeSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch("/api/site-settings/resume");
        if (response.ok) {
          const data = await response.json();
          setResume(data);
        } else {
          setError("Failed to load resume");
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError(err instanceof Error ? err.message : "Failed to load resume");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="w-full h-[80vh]" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h1 className="text-2xl font-bold mb-4">Resume Not Found</h1>
          <p className="text-gray-500 mb-6">
            {error ||
              "No resume has been uploaded yet. Please upload a resume in the admin dashboard."}
          </p>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <FaArrowLeft /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2">
            <FaArrowLeft /> Back to Home
          </Button>
        </Link>
        <a
          href={resume.url}
          download={resume.filename}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="flex items-center gap-2">
            <FaDownload /> Download Resume
          </Button>
        </a>
      </div>

      <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden">
        <PDFViewer url={resume.url} />
      </div>
    </div>
  );
}

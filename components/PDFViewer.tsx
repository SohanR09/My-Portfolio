"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url: string;
}

export default function PDFViewer({ url }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.25);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF:", error);
    setError(error);
    setLoading(false);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset;
      return newPageNumber >= 1 && newPageNumber <= (numPages || 1)
        ? newPageNumber
        : prevPageNumber;
    });
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function zoomIn() {
    setScale((prevScale) => Math.min(prevScale + 0.2, 2.0));
  }

  function zoomOut() {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.6));
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4 p-4 rounded-t-lg ">
        <div className="flex items-center gap-2">
          <Button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <FaChevronLeft className="dark:text-gray-100" />
            <span className="hidden md:flex">Previous</span>
          </Button>
          <span className="mx-2 dark:text-stone-900">
            Page {pageNumber} of {numPages || "--"}
          </span>
          <Button
            onClick={nextPage}
            disabled={!numPages || pageNumber >= numPages}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <span className="hidden md:flex">Next</span>
            <FaChevronRight className="dark:text-gray-100" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={zoomOut}
            variant="outline"
            size="sm"
            className="dark:text-gray-100"
          >
            -
          </Button>
          <span className="mx-2 dark:text-stone-900">
            {Math.round(scale * 100)}%
          </span>
          <Button
            onClick={zoomIn}
            variant="outline"
            size="sm"
            className="dark:text-gray-100"
          >
            +
          </Button>
        </div>
      </div>

      <div className="overflow-auto w-full max-h-[70vh] flex justify-center bg-gray-200 p-4">
        {loading && <div className="text-center py-10">Loading PDF...</div>}
        {error && (
          <div className="text-center py-10 text-red-500">
            Error loading PDF: {error.message}
          </div>
        )}
        {url && (
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className="text-center py-10">Loading PDF...</div>}
            error={
              <div className="text-center py-10 text-red-500">
                Failed to load PDF
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={<div className="text-center py-10">Loading page...</div>}
              error={
                <div className="text-center py-10 text-red-500">
                  Failed to load page
                </div>
              }
            />
          </Document>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type { Paper } from "@/types/paper";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  paper: Paper | null;
  page?: number;
  highlightText?: string;
  highlightEvidence?: string;
}

export default function PdfViewer({
  paper,
  page = 1,
  highlightEvidence = "",
}: Props) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);

  const viewerRef = useRef<HTMLDivElement>(null);
  function normalize(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/[^\w\s.,:%₹$()-]/g, "")
    .trim()
    .toLowerCase();
   }
  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  useEffect(() => {
  const timer = setTimeout(() => {
    if (!viewerRef.current) return;

    const spans = Array.from(
      viewerRef.current.querySelectorAll(
        ".react-pdf__Page__textContent span"
      )
    ) as HTMLSpanElement[];

    spans.forEach((span) =>
      span.classList.remove("research-highlight")
    );

    if (!highlightEvidence.trim()) return;

    const target = normalize(highlightEvidence);

    const pageText = spans
      .map((span) => normalize(span.textContent || ""))
      .join(" ");

    let start = pageText.indexOf(target);

// Fallback 1: collapse spaces
if (start === -1) {
  start = pageText.replace(/\s+/g, "")
    .indexOf(target.replace(/\s+/g, ""));
}

// Fallback 2: search longest phrase
if (start === -1) {

  const words = target
    .split(" ")
    .filter(w => w.length > 3);

  let best = "";

  for (const word of words) {
    if (word.length > best.length) {
      best = word;
    }
  }

  if (best) {
    start = pageText.indexOf(best);
  }
}

if (start === -1) {
  console.log("Evidence not found:", target);
  console.log("Page text:", pageText);
  return;
}

    let cursor = 0;

    spans.forEach((span) => {
      const text = normalize(span.textContent || "");

      if (!text) return;

      const spanStart = cursor;
      const spanEnd = cursor + text.length;

      const targetStart = start;
      const targetEnd = start + target.length;

      const overlaps =
        spanEnd >= targetStart &&
        spanStart <= targetEnd;

      if (overlaps) {
    span.classList.add("research-highlight");

    if (
        !viewerRef.current?.querySelector(".research-highlight")
    ) {
        span.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }
}

      cursor += text.length + 1;
    });
  }, 250);

  return () => clearTimeout(timer);
}, [highlightEvidence, currentPage]);

  if (!paper) {
    return (
      <div className="h-full rounded-xl border flex items-center justify-center bg-white">
        <p className="text-slate-500">
          Select a PDF to preview
        </p>
      </div>
    );
  }

  const pdfUrl = `http://127.0.0.1:8000/papers/file/${paper.id}`;

  return (
    <div className="h-full min-h-0 flex flex-col rounded-xl border bg-slate-100">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage((p) => Math.max(1, p - 1))
          }
        >
          Previous
        </button>

        <span className="font-medium">
          Page {currentPage} / {numPages || "-"}
        </span>

        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          disabled={currentPage === numPages}
          onClick={() =>
            setCurrentPage((p) => Math.min(numPages, p + 1))
          }
        >
          Next
        </button>
      </div>

      <div
        ref={viewerRef}
        className="flex-1 overflow-auto flex justify-center p-4"
      >
        <Document
          file={pdfUrl}
          loading="Loading PDF..."
          error="Failed to load PDF."
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);

            if (currentPage > numPages) {
              setCurrentPage(numPages);
            }
          }}
        >
          <Page
            pageNumber={currentPage}
            width={720}
            renderTextLayer
            renderAnnotationLayer
          />
        </Document>
      </div>
    </div>
  );
}
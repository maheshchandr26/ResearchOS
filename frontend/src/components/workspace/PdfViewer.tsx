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
  const lastScrolledRef = useRef<string>("");

  // Always-current values for the observer's callback to read, so the
  // observer itself never needs to be torn down/recreated when these change.
  const highlightEvidenceRef = useRef(highlightEvidence);
  const currentPageRef = useRef(currentPage);

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
    lastScrolledRef.current = "";
  }, [highlightEvidence]);

  useEffect(() => {
    highlightEvidenceRef.current = highlightEvidence;
    currentPageRef.current = currentPage;
  }, [highlightEvidence, currentPage]);

  function applyHighlight() {
    if (!viewerRef.current) return;

    const evidence = highlightEvidenceRef.current;
    const pageForKey = currentPageRef.current;

    const spans = Array.from(
      viewerRef.current.querySelectorAll(".react-pdf__Page__textContent span")
    ) as HTMLSpanElement[];

    console.log("SPANS FOUND:", spans.length);

    spans.forEach((span) => span.classList.remove("research-highlight"));

    if (!evidence.trim()) return;

    const target = normalize(evidence);
    const pageText = spans.map((span) => normalize(span.textContent || "")).join(" ");

    let start = pageText.indexOf(target);
    let matchLength = target.length;

    if (start === -1) {
      const pattern = target
        .split(" ")
        .filter(Boolean)
        .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("\\s+");
      const match = pageText.match(new RegExp(pattern));
      if (match && match.index !== undefined) {
        start = match.index;
        matchLength = match[0].length;
      }
    }

    if (start === -1) {
      const words = target.split(" ").filter((w) => w.length > 3);
      let best = "";
      for (const word of words) {
        if (word.length > best.length) best = word;
      }
      if (best) {
        start = pageText.indexOf(best);
        matchLength = best.length;
      }
    }

    console.log("SEARCHING FOR:", target);
    console.log("IN PAGE TEXT:", pageText);

    if (start === -1) {
      console.log("Evidence not found:", target);
      return;
    }

    let cursor = 0;
    let firstMatch: HTMLSpanElement | null = null;

    spans.forEach((span) => {
      const text = normalize(span.textContent || "");
      const spanStart = cursor;
      const spanEnd = cursor + text.length;
      cursor += text.length + 1;

      if (!text) return;

      const overlaps = spanEnd >= start && spanStart <= start + matchLength;
      if (overlaps) {
        span.classList.add("research-highlight");
        if (!firstMatch) firstMatch = span;
      }
    });

    console.log(
      "HIGHLIGHTED SPANS ADDED (immediately):",
      viewerRef.current.querySelectorAll(".research-highlight").length
    );

    if (firstMatch) {
      const key = `${pageForKey}::${evidence}`;
      if (lastScrolledRef.current !== key) {
        lastScrolledRef.current = key;
        (firstMatch as HTMLSpanElement).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }

  // Set up ONCE, for the component's whole lifetime — not torn down and
  // recreated on every text-layer re-render. The MutationObserver alone is
  // enough to catch the text layer appearing/changing at any point; we no
  // longer depend on onRenderTextLayerSuccess/textLayerVersion for this,
  // which was what caused the effect (and observer) to be recreated in a
  // tight loop any time react-pdf re-rendered the text layer on its own.
  useEffect(() => {
    if (!viewerRef.current) return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    function scheduleHighlight() {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyHighlight, 150);
    }

    scheduleHighlight();

    const observer = new MutationObserver(() => {
      scheduleHighlight();
    });
    observer.observe(viewerRef.current, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, []); // <-- empty deps: created once, lives for the component's lifetime

  // Whenever evidence or page actually change, trigger a fresh pass directly
  // too (in addition to whatever the observer catches).
  useEffect(() => {
    const t = setTimeout(applyHighlight, 150);
    return () => clearTimeout(t);
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
    <div className="h-full min-h-0 flex flex-col rounded-xl border bg-slate-900">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-slate">
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
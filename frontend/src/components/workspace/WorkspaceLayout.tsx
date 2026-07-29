import { useState } from "react";

import PdfSidebar from "./PdfSidebar";
import PdfViewer from "./PdfViewer";

import ResearchAssistant from "@/components/workspace/assistant/ResearchAssistant";

import type { Paper } from "@/types/paper";

interface Props {
  projectId: number;
  papers: Paper[];
  selectedPaper: Paper | null;
  onSelectPaper: (paper: Paper) =>void;
  onDeletePaper: (paperId: number) => void;
  onSourceClick: (
    paperId: number,
    page: number,
    evidence: string
) => void;
}

export default function WorkspaceLayout({
  projectId,
  papers,
  selectedPaper,
  onSelectPaper,
  onDeletePaper,
}: Props) {
  const [selectedPage, setSelectedPage] = useState(1);
  const [highlightEvidence, setHighlightEvidence] = useState("");

  return (
    <div className="grid grid-cols-12 gap-6 h-[85vh]">

      {/* Left Sidebar */}

      <div className="col-span-2 h-full">
        <PdfSidebar
          papers={papers}
          selectedPaper={selectedPaper}
          onSelect={paper => {
            onSelectPaper(paper);
            setSelectedPage(1);
            setHighlightEvidence("");
          }}
          onDelete={onDeletePaper}
        />
      </div>

      {/* PDF Viewer */}

      <div className="col-span-7 h-full min-h-0">
        <PdfViewer
          paper={selectedPaper}
          page={selectedPage}
          highlightEvidence={highlightEvidence}
        />
      </div>

      {/* AI Chat */}

        <div className="col-span-3 h-full min-h-0 border rounded-xl overflow-hidden">      
           <ResearchAssistant
  projectId={projectId}
  selectedPaper={selectedPaper}
  onSourceClick={(paperId, page, evidence) => {
    const paper = papers.find((p) => p.id === paperId);

    if (paper) {
      onSelectPaper(paper);
    }

    setSelectedPage(page);
    setHighlightEvidence(evidence);
  }}
/>
      </div>

    </div>
  );
}
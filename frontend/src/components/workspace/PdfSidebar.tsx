import { useMemo, useState } from "react";
import {
  FileText,
  Search,
  Trash2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Paper } from "@/types/paper";

interface Props {
  papers: Paper[];
  selectedPaper: Paper | null;
  onSelect: (paper: Paper) => void;
  onDelete: (paperId: number) => void;
}

export default function PdfSidebar({
  papers,
  selectedPaper,
  onSelect,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredPapers = useMemo(() => {
    return papers.filter((paper) =>
      paper.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [papers, search]);

  return (
    <Card className="h-[85vh] rounded-2xl border-slate-800 bg-slate-900 text-slate-100 overflow-hidden">

      {/* Header */}

      <div className="border-b border-slate-800 p-4">

        <h2 className="text-lg font-semibold flex items-center gap-2">
          📚 Papers
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          {papers.length} document{papers.length !== 1 ? "s" : ""}
        </p>

        <div className="relative mt-4">

          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={16}
          />

          <input
            type="text"
            placeholder="Search papers..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-9 pr-3 py-2 text-sm outline-none transition focus:border-blue-500"
          />

        </div>

      </div>

      {/* Paper List */}

      <div className="overflow-y-auto h-[calc(85vh-150px)] p-3 space-y-3">

        {filteredPapers.length === 0 ? (

          <div className="text-center mt-16">

            <FileText
              size={40}
              className="mx-auto text-slate-600"
            />

            <p className="mt-3 text-sm text-slate-400">
              No papers found
            </p>

          </div>

        ) : (

          filteredPapers.map((paper) => {

            const selected =
              selectedPaper?.id === paper.id;

            return (
              <div
                key={paper.id}
                onClick={() => onSelect(paper)}
                className={`
                  group
                  cursor-pointer
                  rounded-2xl
                  border
                  p-4
                  transition-all
                  duration-200

                  ${
                    selected
                      ? "border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/10"
                      : "border-slate-800 bg-slate-950 hover:border-slate-600 hover:-translate-y-0.5"
                  }
                `}
              >

                <div className="flex justify-between items-start">

                  <div className="flex gap-3 flex-1">

                    <div
                      className={`
                        rounded-xl
                        p-2
                        ${
                          selected
                            ? "bg-blue-500 text-white"
                            : "bg-slate-800 text-slate-300"
                        }
                      `}
                    >
                      <FileText size={18} />
                    </div>

                    <div className="flex-1 min-w-0">

                      <p className="truncate font-medium">
                        {paper.title}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {(paper.file_size / 1024).toFixed(1)} KB
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(paper.id);
                    }}
                    className="rounded-lg p-2 text-slate-500 opacity-0 transition hover:bg-red-600 hover:text-white group-hover:opacity-100"
                    title="Delete PDF"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>
            );
          })

        )}

      </div>

    </Card>
  );
}
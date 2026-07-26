interface Props {
  role: "user" | "assistant";
  content: string;
  sources?: {
    paper_id: number;
    paper_name: string;
    page: number;
    evidence: string;
    highlight_text: string;
    confidence: string;
  }[];

  onSourceClick: (
    paperId: number,
    page: number,
    evidence: string
  ) => void;
  
}

export default function MessageBubble({
  role,
  content,
  sources,
  onSourceClick,
}: Props) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[85%]
          rounded-2xl
          px-5
          py-4
          shadow-sm
          ${
            isUser
              ? "bg-blue-600 text-white"
              : "border border-slate-800 bg-slate-900 text-slate-100"
          }
        `}
      >
        {!isUser && (
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-blue-400">
            🤖 Research Assistant
          </div>
        )}

        <div className="whitespace-pre-wrap leading-7 text-[15px]">
          {content}
        </div>

        {sources && sources.length > 0 && (
          <div className="mt-5 border-t border-slate-700 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Sources
            </p>

            <div className="space-y-2">
              {sources.map((source, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                  onSourceClick(
                    source.paper_id,
                  source.page,
                    source.evidence,
                    )
                     }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-left transition hover:border-blue-500 hover:bg-slate-700"
                >
                  <div className="font-medium text-sm text-white">
                    📄 {source.paper_name}
                  </div>

                  <div className="mt-2 text-xs text-slate-400">
  Page {source.page}
</div>

<div className="mt-3 rounded-lg bg-slate-900 p-2 text-xs italic text-slate-300">
  {source.evidence}
</div>

<div className="mt-2 text-[11px] text-green-400 font-medium">
  🟢 {source.confidence} Confidence
</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
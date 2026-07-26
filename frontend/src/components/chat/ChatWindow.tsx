import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

interface Message {
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
}

interface Props {
  messages: Message[];
  loading: boolean;
  onSourceClick: (paperId: number, page: number, evidence: string) => void;
}

export default function ChatWindow({
  messages,
  loading,
  onSourceClick,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 bg-slate-950">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="max-w-sm text-center">
            <div className="mb-4 text-5xl">🤖</div>

            <h2 className="text-lg font-semibold text-white">
              Research Assistant
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Ask questions about the PDFs in this project.
            </p>

            <div className="mt-6 space-y-2 text-left text-sm">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-slate-300">
                💡 Summarize this document
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-slate-300">
                📄 Explain page 2
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-slate-300">
                🔍 Find important information
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              role={message.role}
              content={message.content}
              sources={message.sources}
              onSourceClick={onSourceClick}
            />
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-slate-400">
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500 delay-150" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500 delay-300" />
              <span className="text-sm">Researching...</span>
            </div>
          )}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
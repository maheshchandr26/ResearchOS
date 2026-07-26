import { useState } from "react";
import { Send } from "lucide-react";

interface Props {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [message, setMessage] = useState("");

  function sendMessage() {
    if (!message.trim()) return;

    onSend(message.trim());
    setMessage("");
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="border-t border-slate-800 bg-slate-950 p-4">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 focus-within:border-blue-500 transition-colors">

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your papers..."
          className="flex-1 bg-transparent text-white placeholder:text-slate-500 outline-none"
        />

        <button
          onClick={sendMessage}
          disabled={!message.trim()}
          className="rounded-xl bg-blue-600 p-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={18} />
        </button>

      </div>
    </div>
  );
}
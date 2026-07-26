import { useState } from "react";

import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

import { askQuestion } from "@/services/chatService";

interface Props {
  projectId: number;
  onSourceClick: (paperId: number, page: number, evidence: string) => void;
}

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

export default function ChatLayout({
  projectId,
  onSourceClick,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! Ask me anything about the papers in this project.",
    },
  ]);
  
  async function handleSend(question: string) {

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    setLoading(true);

    try {
      const response = await askQuestion(
        projectId,
        question
      );

      setLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.answer,
          sources: response.sources,
        },
      ]);
    } catch (error) {
      console.error(error);

      setLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong while contacting the AI.",
        },
      ]);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ChatWindow
        messages={messages}
        loading={loading}
        onSourceClick={onSourceClick}
      />

      <ChatInput
        onSend={handleSend}
      />
    </div>
  );
}
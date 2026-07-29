import { useState } from "react";
import {
    MessageSquare,
    FileText,
} from "lucide-react";

import ChatLayout from "@/components/chat/ChatLayout";
import SummaryPanel from "@/components/workspace/assistant/panels/SummaryPanel";

import type { Paper } from "@/types/paper";

interface Props {
    projectId: number;
    selectedPaper: Paper | null;
    onSourceClick: (
        paperId: number,
        page: number,
        evidence: string
    ) => void;
}

type Tab = "chat" | "summary";

export default function ResearchAssistant({
    projectId,
    selectedPaper,
    onSourceClick,
}: Props) {

    const [tab, setTab] = useState<Tab>("chat");

    const tabs = [
        {
            id: "chat",
            label: "Chat",
            icon: MessageSquare,
        },
        {
            id: "summary",
            label: "Summary",
            icon: FileText,
        },
    ] as const;

    return (
        <div className="flex flex-col h-full bg-slate-950">

            {/* Header */}

            <div className="border-b border-slate-800 px-5 py-5">

                <h2 className="text-xl font-bold text-white">
                    Research Assistant
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                    Chat with your documents or explore the AI-generated summary.
                </p>

            </div>

            {/* Tabs */}

            <div className="px-5 pt-5">

                <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1">

                    {tabs.map((item) => {

                        const Icon = item.icon;

                        const active = tab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setTab(item.id)}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-200
                                    ${
                                        active
                                            ? "bg-slate-800 text-white shadow"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    }`}
                            >
                                <Icon size={17} />

                                {item.label}

                            </button>
                        );

                    })}

                </div>

            </div>

            {/* Content */}

            <div className="flex-1 overflow-hidden pt-5">

                {tab === "chat" && (

                    <ChatLayout
                        projectId={projectId}
                        onSourceClick={onSourceClick}
                    />

                )}

                {tab === "summary" && (

                    <SummaryPanel
                        paper={selectedPaper}
                    />

                )}

            </div>

        </div>
    );
}
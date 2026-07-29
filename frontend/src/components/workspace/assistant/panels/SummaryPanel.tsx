import {
    FileText,
    Calendar,
    BookOpen,
    Hash,
} from "lucide-react";

import ReactMarkdown from "react-markdown";

import type { Paper } from "@/types/paper";

interface Props {
    paper: Paper | null;
}

export default function SummaryPanel({ paper }: Props) {

    if (!paper) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="max-w-sm text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800">
                        <FileText
                            size={30}
                            className="text-blue-400"
                        />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-white">
                        No Paper Selected
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                        Select a paper from the sidebar to view its
                        AI-generated summary.
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div className="h-full space-y-5 overflow-y-auto px-5 pb-5">

            {/* AI Summary */}

            <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-lg">

                <div className="flex items-center gap-3 border-b border-slate-700 px-6 py-5">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">

                        <FileText
                            size={20}
                            className="text-blue-400"
                        />

                    </div>

                    <div>

                        <h2 className="text-lg font-semibold text-white">
                            AI Summary
                        </h2>

                        <p className="text-sm text-slate-400">
                            Structured overview of the uploaded research paper
                        </p>

                    </div>

                </div>

                <div className="px-6 py-6">

                    {paper.summary ? (

                        <div
                            className="
                                prose
                                prose-invert
                                max-w-none

                                prose-headings:text-white
                                prose-headings:font-semibold

                                prose-h1:text-2xl
                                prose-h2:text-xl

                                prose-p:text-slate-300
                                prose-p:leading-7

                                prose-strong:text-white

                                prose-ul:text-slate-300
                                prose-li:text-slate-300

                                prose-a:text-blue-400
                            "
                        >
                            <ReactMarkdown>
                                {paper.summary}
                            </ReactMarkdown>
                        </div>

                    ) : (

                        <div className="py-10 text-center text-slate-400">
                            No summary available.
                        </div>

                    )}

                </div>

            </div>

            {/* Paper Information */}

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">

                <h3 className="mb-5 text-lg font-semibold text-white">
                    Paper Information
                </h3>

                <div className="space-y-5">

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3 text-slate-400">

                            <BookOpen size={18} />

                            <span>Pages</span>

                        </div>

                        <span className="font-medium text-white">
                            {paper.page_count ?? "-"}
                        </span>

                    </div>

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3 text-slate-400">

                            <Hash size={18} />

                            <span>Words</span>

                        </div>

                        <span className="font-medium text-white">
                            {paper.word_count?.toLocaleString() ?? "-"}
                        </span>

                    </div>

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3 text-slate-400">

                            <Calendar size={18} />

                            <span>Uploaded</span>

                        </div>

                        <span className="font-medium text-white">
                            {new Date(
                                paper.uploaded_at
                            ).toLocaleDateString()}
                        </span>

                    </div>

                </div>

            </div>

            {/* Filename */}

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">

                <h3 className="mb-4 text-lg font-semibold text-white">
                    Filename
                </h3>

                <div className="break-all rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-300">
                    {paper.filename}
                </div>

            </div>

        </div>
    );
}
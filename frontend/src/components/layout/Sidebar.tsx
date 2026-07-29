import { Link, useLocation } from "react-router-dom";
import { FolderOpen } from "lucide-react";

export default function Sidebar() {
    const location = useLocation();

    const isProjects = location.pathname === "/";

    return (
        <aside className="w-52 bg-slate-900 border-r border-slate-800 text-white flex flex-col">

            {/* Logo */}

            <div className="px-6 py-7 border-b border-slate-800">

                <h1 className="text-2xl font-bold tracking-tight">
                    ResearchOS
                </h1>

                <p className="mt-1 text-xs text-slate-400">
                    AI Research Workspace
                </p>

            </div>

            {/* Navigation */}

            <nav className="flex-1 px-3 py-5">

                <Link
                    to="/"
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
                        ${
                            isProjects
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                >

                    <FolderOpen size={20} />

                    <span>Projects</span>

                </Link>

            </nav>

        </aside>
    );
}
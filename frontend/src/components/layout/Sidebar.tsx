import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold">
        ResearchOS
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <Link
          to="/"
          className="block w-full text-left p-3 rounded-lg hover:bg-slate-800"
        >
          📁 Projects
        </Link>

        <button className="w-full text-left p-3 rounded-lg hover:bg-slate-800">
          📄 Papers
        </button>

        <Link
          to="/chat"
          className="block w-full text-left p-3 rounded-lg hover:bg-slate-800"
        >
          💬 Chat
        </Link>

        <button className="w-full text-left p-3 rounded-lg hover:bg-slate-800">
          ⚙ Settings
        </button>
      </nav>
    </aside>
  );
}
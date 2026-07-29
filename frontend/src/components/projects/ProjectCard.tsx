import type { Project } from "@/types/project";
import { Card, CardContent } from "@/components/ui/card";
import {
  FolderOpen,
  Trash2,
  Pencil,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  project: Project;
  onDelete: (projectId: number) => void;
  onRename: (project: Project) => void;
}

export default function ProjectCard({
  project,
  onDelete,
  onRename,
}: Props) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/projects/${project.id}`)}
      className="
        group
        cursor-pointer
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500
        hover:shadow-xl
      "
    >
      <CardContent className="p-6">

        {/* Top Section */}

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-500/10 p-3">
              <FolderOpen className="h-6 w-6 text-blue-400" />
            </div>

            <div>

              <h2 className="text-xl font-semibold text-white">
                {project.title}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {project.field || "Research Project"}
              </p>

            </div>

          </div>

          <div className="flex gap-2">

            <button
              onClick={(e) => {
                e.stopPropagation();
                onRename(project);
              }}
              className="
                rounded-lg
                p-2
                text-slate-400
                transition
                hover:bg-slate-800
                hover:text-white
              "
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              className="
                rounded-lg
                p-2
                text-slate-400
                transition
                hover:bg-red-600
                hover:text-white
              "
            >
              <Trash2 className="h-4 w-4" />
            </button>

          </div>

        </div>

        {/* Description */}

        <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-400">

          {project.description?.trim()
            ? project.description
            : "No description provided for this project."}

        </p>

        {/* Footer */}

        <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-4">

          <div className="flex items-center gap-2 text-xs text-slate-500">

            <Calendar className="h-4 w-4" />

            <span>
              {new Date(project.created_at).toLocaleDateString()}
            </span>

          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-blue-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">

            <span>Open</span>

            <ArrowRight className="h-4 w-4" />

          </div>

        </div>

      </CardContent>
    </Card>
  );
}
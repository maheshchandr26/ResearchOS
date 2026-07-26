import type { Project } from "@/types/project";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface Props {
  project: Project;
  onDelete: (projectId: number) => void;
  onRename: (
    project: Project
  ) => void;
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
      className="cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 hover:border-blue-500"
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">

  <FolderOpen className="h-8 w-8 text-blue-500" />

  <div className="flex gap-2">

    <button
      onClick={(e) => {
        e.stopPropagation();
        onRename(project);
      }}
      className="p-2 rounded-md hover:bg-blue-600 hover:text-white"
    >
      <Pencil className="h-4 w-4" />
    </button>

    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete(project.id);
      }}
      className="p-2 rounded-md hover:bg-red-600 hover:text-white"
    >
      <Trash2 className="h-4 w-4" />
    </button>

  </div>

</div>

        <h2 className="text-xl font-semibold mt-4">
          {project.title}
        </h2>

        <p className="text-sm text-muted-foreground mt-2">
          {project.description}
        </p>

        <div className="mt-6 flex justify-between text-xs text-muted-foreground">
          <span>{project.field}</span>

          <span>
            {new Date(project.created_at).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
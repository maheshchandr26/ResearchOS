import { useEffect, useState } from "react";

import Layout from "@/components/layout/Layout";
import ProjectCard from "@/components/projects/ProjectCard";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";
import { Button } from "@/components/ui/button";

import {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
} from "@/services/projectService";

import type { Project } from "@/types/project";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);

  const [renameProject, setRenameProject] =
    useState<Project | null>(null);

  const [renameTitle, setRenameTitle] =
    useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteProject(
    projectId: number
  ) {
    const confirmDelete = window.confirm(
      "Delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProject(projectId);
      await loadProjects();
    } catch (error) {
      console.error(error);
      alert("Failed to delete project.");
    }
  }

  async function handleRenameProject() {
    if (!renameProject || !renameTitle.trim()) return;

    try {
      await updateProject(
        renameProject.id,
        renameTitle
      );

      setRenameProject(null);
      setRenameTitle("");

      await loadProjects();
    } catch (error) {
      console.error(error);
      alert("Failed to rename project.");
    }
  }

  return (
    <Layout>

      {/* Hero Section */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

        <div>

          <h1 className="text-4xl font-bold tracking-tight text-white">
            ResearchOS
          </h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Your AI-powered research workspace.
            Organize projects, upload research
            papers, and chat with them using AI.
          </p>

        </div>

        <Button
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl h-11 px-6 text-white"
        >
          + New Project
        </Button>

      </div>

      {/* Project Count */}

      <div className="mb-6">

        <h2 className="text-lg font-semibold text-slate-300">

          {projects.length} Project
          {projects.length !== 1 && "s"}

        </h2>

      </div>

      {/* Projects */}

      {projects.length === 0 ? (

        <div className="flex flex-col items-center justify-center py-28">

          <div className="text-6xl">
            📂
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-white">
            No Projects Yet
          </h2>

          <p className="mt-3 max-w-md text-center text-slate-400">
            Create your first project, upload
            research papers, and start asking
            questions using AI.
          </p>

          <Button
            onClick={() => setOpen(true)}
            className="mt-8 bg-blue-600 hover:bg-blue-700"
          >
            + Create Your First Project
          </Button>

        </div>

      ) : (

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">

          {projects.map((project) => (

            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDeleteProject}
              onRename={(project) => {
                setRenameProject(project);
                setRenameTitle(project.title);
              }}
            />

          ))}

        </div>

      )}

      {/* Create Project */}

      <CreateProjectDialog
        open={open}
        onOpenChange={setOpen}
        onCreate={async (data) => {
          await createProject(data);
          await loadProjects();
        }}
      />

      {/* Rename Dialog */}

      {renameProject && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

          <div className="w-96 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">

            <h2 className="text-xl font-semibold text-white">
              Rename Project
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Give your project a new name.
            </p>

            <input
              value={renameTitle}
              onChange={(e) =>
                setRenameTitle(e.target.value)
              }
              className="mt-5 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500"
            />

            <div className="mt-6 flex justify-end gap-3">

              <Button
                variant="outline"
                onClick={() => {
                  setRenameProject(null);
                  setRenameTitle("");
                }}
              >
                Cancel
              </Button>

              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleRenameProject}
              >
                Save Changes
              </Button>

            </div>

          </div>

        </div>

      )}

    </Layout>
  );
}
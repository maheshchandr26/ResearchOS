import { useEffect, useState } from "react";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";
import {
  createProject,
  deleteProject,
  updateProject} 
from "@/services/projectService";
import Layout from "@/components/layout/Layout";
import ProjectCard from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";

import { getProjects } from "@/services/projectService";
import type { Project } from "@/types/project";


export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [renameProject, setRenameProject] = useState<Project | null>(null);
const [renameTitle, setRenameTitle] = useState("");
  const [open, setOpen] = useState(false);
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
    await updateProject(renameProject.id, renameTitle);

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
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-white">
        Projects
      </h1>

      <Button
  className="bg-blue-600 hover:bg-blue-700 text-white"
  onClick={() => setOpen(true)}
>
  + New Project
</Button>
    </div>

    {projects.length === 0 ? (
      <div className="text-center mt-32 text-gray-400">
        No projects found.
      </div>
    ) : (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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

    {/* Dialog goes here */}
    <CreateProjectDialog
      open={open}
      onOpenChange={setOpen}
      onCreate={async (data) => {
        await createProject(data);
        await loadProjects();
      }}
    />
    {renameProject && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-zinc-900 p-6 rounded-lg w-96">
      <h2 className="text-xl font-semibold text-white mb-4">
        Rename Project
      </h2>

      <input
        value={renameTitle}
        onChange={(e) => setRenameTitle(e.target.value)}
        className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-700"
      />

      <div className="flex justify-end gap-3 mt-6">
        <Button
          variant="outline"
          onClick={() => {
            setRenameProject(null);
            setRenameTitle("");
          }}
        >
          Cancel
        </Button>

        <Button onClick={handleRenameProject}>
          Save
        </Button>
      </div>
    </div>
  </div>
)}
  </Layout>
);
}
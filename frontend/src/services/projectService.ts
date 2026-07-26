import { api } from "@/api/client";
import type { Project } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
  const response = await api.get("/projects");
  return response.data;
}

export async function createProject(data: {
  title: string;
  description: string;
  field: string;
}) {
  const response = await api.post("/projects", data);
  return response.data;
}
export async function getProject(id: number) {
  const response = await api.get(`/projects/${id}`);
  return response.data;
}
export async function deleteProject(
  projectId: number
) {
  return api.delete(`/projects/${projectId}`);
}
export async function updateProject(
  projectId: number,
  title: string
) {
  return api.put(`/projects/${projectId}`, {
    title,
  });
}
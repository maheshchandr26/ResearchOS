import { api } from "@/api/client";

export async function getProjectPapers(projectId: number) {
  const response = await api.get(`/papers/project/${projectId}`);
  return response.data;
}
export async function deletePaper(
    paperId: number
) {
    return api.delete(
        `/papers/${paperId}`
    );
}
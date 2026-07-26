import { api } from "@/api/client";

export async function askQuestion(
  projectId: number,
  question: string
) {

  const response = await api.post("/chat", {
    project_id: projectId,
    question,
  });

  return response.data;
}
import { api } from "@/api/client";

export async function uploadPdf(
  projectId: number,
  file: File
) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    `/papers/upload/${projectId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";

import { getProject } from "@/services/projectService";
import { uploadPdf } from "@/services/uploadService";
import {
  getProjectPapers,
  deletePaper,
} from "@/services/paperService";

import type { Paper } from "@/types/paper";

export default function ProjectPage() {
  const { id } = useParams();

  const [project, setProject] = useState<any>();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] =
    useState<Paper | null>(null);

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  async function loadProject() {
    const data = await getProject(Number(id));
    setProject(data);

    const paperData = await getProjectPapers(Number(id));

    setPapers(paperData);

    if (paperData.length > 0) {
      setSelectedPaper(paperData[0]);
    } else {
      setSelectedPaper(null);
    }
  }

  async function handleUpload(file: File) {
    if (!id) return;

    try {
      await uploadPdf(Number(id), file);

      const paperData = await getProjectPapers(Number(id));

      setPapers(paperData);

      setSelectedPaper(
        paperData[paperData.length - 1]
      );

      alert("PDF uploaded successfully.");

    } catch (error: any) {

      console.error(error);

      alert(
        error.response?.data?.detail ||
        error.message
      );
    }
  }

  async function handleDeletePaper(
    paperId: number
  ) {
    if (!id) return;

    const confirmDelete = window.confirm(
      "Delete this PDF?"
    );

    if (!confirmDelete) return;

    try {

      await deletePaper(paperId);

      const paperData = await getProjectPapers(
        Number(id)
      );

      setPapers(paperData);

      if (paperData.length > 0) {
        setSelectedPaper(paperData[0]);
      } else {
        setSelectedPaper(null);
      }

    } catch (error: any) {

      console.error(error);

      alert(
        error.response?.data?.detail ||
        error.message
      );
    }
  }

  if (!project) {
    return (
      <Layout>
        Loading...
      </Layout>
    );
  }

  return (
    <Layout>
      <WorkspaceHeader
        title={project.title}
        onUpload={handleUpload}
      />

      <WorkspaceLayout
      projectId={Number(id)}
      papers={papers}
      selectedPaper={selectedPaper}
      onSelectPaper={setSelectedPaper}
      onDeletePaper={handleDeletePaper}
      />
    </Layout>
  );
}
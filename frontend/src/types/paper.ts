export interface Paper {
  id: number;
  project_id: number;

  title: string;
  filename: string;

  file_path: string;

  file_size: number;

  uploaded_at: string;

  page_count: number | null;

  word_count: number | null;

  summary: string | null;
}
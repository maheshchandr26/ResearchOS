import type { Paper } from "@/types/paper";
import { Card } from "@/components/ui/card";

interface Props {
  paper: Paper | null;
}

export default function PaperInfo({ paper }: Props) {
  if (!paper) {
    return (
      <Card className="h-[75vh] p-5 flex items-center justify-center">
        <p className="text-muted-foreground">
          No paper selected
        </p>
      </Card>
    );
  }

  return (
    <Card className="h-[75vh] overflow-y-auto p-5">
      <h2 className="text-lg font-semibold mb-5">
        Paper Information
      </h2>

      <div className="space-y-5">

        <div>
          <p className="text-xs uppercase text-muted-foreground">
            File Name
          </p>

          <p className="font-medium break-all">
            {paper.filename}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <p className="text-xs uppercase text-muted-foreground">
              Pages
            </p>

            <p className="font-medium">
              {paper.page_count ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-muted-foreground">
              Words
            </p>

            <p className="font-medium">
              {paper.word_count?.toLocaleString() ?? "-"}
            </p>
          </div>

        </div>

        <div>
          <p className="text-xs uppercase text-muted-foreground">
            File Size
          </p>

          <p className="font-medium">
            {(paper.file_size / 1024).toFixed(1)} KB
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Uploaded
          </p>

          <p className="font-medium">
            {new Date(paper.uploaded_at).toLocaleString()}
          </p>
        </div>

        <hr />

        <div>
          <p className="text-xs uppercase text-muted-foreground mb-2">
            AI Summary
          </p>

          {paper.summary ? (
            <div className="rounded-lg border p-4 bg-muted/40">
              <p className="text-sm leading-7 whitespace-pre-wrap">
                {paper.summary}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Summary not available.
            </p>
          )}
        </div>

      </div>
    </Card>
  );
}
import { Button } from "@/components/ui/button";

interface Props {
  onSelect: (file: File) => void;
}

export default function UploadPdfButton({
  onSelect,
}: Props) {
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    onSelect(file);
  }

  return (
    <>
      <input
        id="pdf-upload"
        type="file"
        accept=".pdf"
        hidden
        onChange={handleChange}
      />

      <Button
        onClick={() =>
          document
            .getElementById("pdf-upload")
            ?.click()
        }
      >
        Upload PDF
      </Button>
    </>
  );
}
import UploadPdfButton from "./UploadPdfButton";

interface Props {
  title: string;
  onUpload: (file: File) => void;
}

export default function WorkspaceHeader({
  title,
  onUpload,
}: Props) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm px-6 py-5">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {title}
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            AI-powered research workspace
          </p>
        </div>

        <div className="flex items-center gap-3">

          <UploadPdfButton onSelect={onUpload} />

        </div>

      </div>

    </div>
  );
}
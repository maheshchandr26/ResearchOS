import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: {
    title: string;
    description: string;
    field: string;
  }) => Promise<void>;
}

export default function CreateProjectDialog({
  open,
  onOpenChange,
  onCreate,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [field, setField] = useState("");

  async function handleCreate() {
    if (!title.trim()) return;

    await onCreate({
      title,
      description,
      field,
    });

    setTitle("");
    setDescription("");
    setField("");

    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>
            New Research Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <Input
  className="bg-slate-800 border-slate-700 text-white"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
  className="bg-slate-800 border-slate-700 text-white"
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <Input
  className="bg-slate-800 border-slate-700 text-white"
            placeholder="Research Field"
            value={field}
            onChange={(e) => setField(e.target.value)}
          />

        </div>

        <DialogFooter>

          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button onClick={handleCreate}>
            Create
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
import { FileArchive, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatBytes } from "@/lib/format";
import { validateZipFile } from "@/services/certificate.service";
import { cn } from "@/lib/utils";

export function FileUpload({
  onFileAccepted,
  progress,
  busy,
}: {
  onFileAccepted: (file: File) => void;
  progress?: number;
  busy?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  function handle(selected: File | undefined) {
    if (!selected) return;
    const result = validateZipFile(selected);
    if (!result.ok) {
      setError(result.message ?? "The uploaded ZIP is invalid.");
      setFile(null);
      return;
    }
    setError(null);
    setFile(selected);
    onFileAccepted(selected);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handle(e.dataTransfer.files[0]);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border-strong bg-muted/30 px-6 py-10 text-center transition-colors",
          dragging && "border-primary bg-accent/50",
        )}
      >
        <UploadCloud className="size-6 text-muted-foreground" aria-hidden />
        <div>
          <p className="text-sm font-medium">Drop Certificates.zip here</p>
          <p className="mt-1 text-xs text-muted-foreground">
            ZIP archive containing PDF certificates · maximum 200 MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          className="sr-only"
          aria-label="Select certificates ZIP file"
          onChange={(e) => handle(e.target.files?.[0])}
        />
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
          Choose file
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      {file && (
        <div className="surface-card flex flex-wrap items-center gap-3 p-3">
          <FileArchive className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(file.size)} · uploaded {new Date().toLocaleTimeString("en-GB")}
            </p>
          </div>
          {typeof progress === "number" && (
            <div className="w-full sm:w-48">
              <Progress value={progress} aria-label="Upload progress" />
              <p className="mt-1 text-right text-xs tabular-nums text-muted-foreground">
                {progress}%
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

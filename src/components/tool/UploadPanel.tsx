import { useState, useCallback } from "react";
import { Upload, File, X, FileText, Presentation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface UploadPanelProps {
  acceptedTypes?: string[];
  onFileSelect?: (file: File | null) => void;
  title?: string;
  description?: string;
}

export function UploadPanel({
  acceptedTypes = ["PDF", "PPT", "PPTX", "TXT"],
  onFileSelect,
  title = "Upload Your File",
  description,
}: UploadPanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        setFile(droppedFile);
        onFileSelect?.(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        onFileSelect?.(selectedFile);
      }
    },
    [onFileSelect]
  );

  const handleRemove = useCallback(() => {
    setFile(null);
    onFileSelect?.(null);
  }, [onFileSelect]);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText className="h-8 w-8 text-destructive" />;
    if (ext === "ppt" || ext === "pptx")
      return <Presentation className="h-8 w-8 text-accent" />;
    return <File className="h-8 w-8 text-primary" />;
  };

  return (
    <div className="panel h-full flex flex-col">
      <h3 className="mb-1 text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      )}

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "upload-zone flex flex-col items-center justify-center h-full min-h-[200px] cursor-pointer",
                isDragging && "border-primary bg-primary/5"
              )}
            >
              <div
                className={cn(
                  "mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary transition-colors",
                  isDragging && "bg-primary/10"
                )}
              >
                <Upload
                  className={cn(
                    "h-6 w-6 text-muted-foreground transition-colors",
                    isDragging && "text-primary"
                  )}
                />
              </div>
              <p className="mb-2 text-sm font-medium text-foreground">
                Drag and drop your file here
              </p>
              <p className="mb-4 text-xs text-muted-foreground">
                or click to browse
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {acceptedTypes.map((type) => (
                  <span
                    key={type}
                    className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {type}
                  </span>
                ))}
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={acceptedTypes
                  .map((t) => `.${t.toLowerCase()}`)
                  .join(",")}
              />
            </label>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex items-start gap-4 rounded-xl border border-border bg-secondary/30 p-4">
              {getFileIcon(file.name)}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={handleRemove}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleRemove}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Replace file
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

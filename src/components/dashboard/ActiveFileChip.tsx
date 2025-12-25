import { FileText, Presentation, File, X } from "lucide-react";
import { motion } from "framer-motion";
import { useActiveFile } from "@/contexts/FileContext";
import { Button } from "@/components/ui/button";

export function ActiveFileChip() {
  const { activeFile, clearActiveFile } = useActiveFile();

  if (!activeFile) return null;

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText className="h-4 w-4" />;
    if (ext === "ppt" || ext === "pptx") return <Presentation className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm"
    >
      <span className="text-primary">{getFileIcon(activeFile.name)}</span>
      <span className="font-medium text-foreground">Active File:</span>
      <span className="text-muted-foreground max-w-[200px] truncate">
        {activeFile.name}
      </span>
      <span className="text-xs text-muted-foreground">
        ({(activeFile.size / 1024 / 1024).toFixed(1)} MB)
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={clearActiveFile}
        className="h-6 w-6 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
      >
        <X className="h-3 w-3" />
      </Button>
    </motion.div>
  );
}

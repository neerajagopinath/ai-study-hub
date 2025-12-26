import { FileText, Presentation, File, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveFile } from "@/contexts/FileContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function GlobalFileBanner() {
  const { activeFile, clearActiveFile } = useActiveFile();

  if (!activeFile) return null;

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText className="h-5 w-5" />;
    if (ext === "ppt" || ext === "pptx") return <Presentation className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const getFileType = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toUpperCase();
    return ext || "FILE";
  };

  const getTypeBadgeColor = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "bg-destructive/10 text-destructive border-destructive/20";
    if (ext === "ppt" || ext === "pptx") return "bg-accent/10 text-accent border-accent/20";
    return "bg-primary/10 text-primary border-primary/20";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full bg-card border-b border-border/50 shadow-sm"
      >
        <div className="container py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-secondary text-muted-foreground flex-shrink-0">
                {getFileIcon(activeFile.name)}
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Active File</span>
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] px-1.5 py-0 h-4 ${getTypeBadgeColor(activeFile.name)}`}
                  >
                    {getFileType(activeFile.name)}
                  </Badge>
                </div>
                <p className="font-medium text-foreground truncate text-sm">
                  {activeFile.name}
                </p>
              </div>
              
              <span className="text-xs text-muted-foreground hidden sm:block flex-shrink-0">
                {(activeFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  // Trigger file replacement by clearing and focusing upload
                  clearActiveFile();
                }}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Replace</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearActiveFile}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

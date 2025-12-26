import { motion } from "framer-motion";
import { Upload, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: "upload" | "output" | "general";
}

export function EmptyState({
  title = "No file uploaded",
  description = "Upload a file to get started with AI-powered analysis",
  actionLabel = "Upload File",
  onAction,
  type = "upload",
}: EmptyStateProps) {
  const illustrations = {
    upload: (
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
        >
          <Upload className="h-10 w-10 text-primary" />
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-accent flex items-center justify-center"
        >
          <Sparkles className="h-3 w-3 text-accent-foreground" />
        </motion.div>
      </div>
    ),
    output: (
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="h-20 w-20 rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center"
        >
          <FileText className="h-10 w-10 text-muted-foreground" />
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, -5, 0],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <Sparkles className="h-3 w-3 text-primary" />
        </motion.div>
      </div>
    ),
    general: (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="h-20 w-20 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center"
      >
        <Sparkles className="h-10 w-10 text-muted-foreground" />
      </motion.div>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full min-h-[250px] text-center p-6"
    >
      {illustrations[type]}
      
      <motion.h4
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mt-4 text-base font-medium text-foreground"
      >
        {title}
      </motion.h4>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-2 text-sm text-muted-foreground max-w-xs"
      >
        {description}
      </motion.p>

      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <Button onClick={onAction} variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

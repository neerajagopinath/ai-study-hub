import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlobalFileBanner } from "./GlobalFileBanner";
import { 
  FocusModeToggle, 
  FocusModeOverlay,
  useFocusMode 
} from "./FocusMode";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  onGenerate?: () => void;
  isGenerating?: boolean;
  focusModeContent?: ReactNode;
}

function ToolLayoutInner({
  title,
  description,
  children,
  onGenerate,
  isGenerating,
  focusModeContent,
}: ToolLayoutProps) {
  const { isFocusMode } = useFocusMode();

  return (
    <>
      <GlobalFileBanner />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[calc(100vh-4rem)] py-6"
      >
        <div className="container">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
              </motion.div>
            </div>

            <div className="hidden md:block">
              <FocusModeToggle />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isFocusMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
                className="grid gap-5 lg:grid-cols-3"
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>

          {onGenerate && !isFocusMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex justify-center"
            >
              <Button
                size="lg"
                onClick={onGenerate}
                disabled={isGenerating}
                className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 btn-press"
              >
                {isGenerating ? "Generating..." : "Generate with AI"}
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Focus Mode Overlay */}
      {focusModeContent && (
        <FocusModeOverlay>
          {focusModeContent}
        </FocusModeOverlay>
      )}
    </>
  );
}

export function ToolLayout(props: ToolLayoutProps) {
  return <ToolLayoutInner {...props} />;
}

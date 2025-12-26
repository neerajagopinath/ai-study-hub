import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lightbulb, BookOpen, TrendingUp, Target } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ExplainWhyProps {
  isVisible?: boolean;
  reasons?: {
    type: "relevance" | "frequency" | "syllabus" | "importance";
    text: string;
  }[];
}

const iconMap = {
  relevance: Target,
  frequency: TrendingUp,
  syllabus: BookOpen,
  importance: Lightbulb,
};

const defaultReasons = [
  {
    type: "relevance" as const,
    text: "These topics have appeared frequently in recent exams and are marked as high-priority in your syllabus.",
  },
  {
    type: "frequency" as const,
    text: "Based on analysis of past 5 years' question papers, these concepts have a 78% probability of appearing.",
  },
  {
    type: "syllabus" as const,
    text: "These align with Units 3-5 of your syllabus which typically carry higher weightage.",
  },
];

export function ExplainWhySection({ isVisible = true, reasons = defaultReasons }: ExplainWhyProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 border border-border/50 rounded-lg overflow-hidden bg-secondary/20"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-foreground">
            Why these topics were selected
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {reasons.map((reason, index) => {
                const Icon = iconMap[reason.type];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30"
                  >
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {reason.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

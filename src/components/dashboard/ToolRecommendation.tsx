import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useToolUsage } from "@/hooks/useToolUsage";
import { Button } from "@/components/ui/button";

export function ToolRecommendation() {
  const { getRecommendation } = useToolUsage();
  const recommendation = getRecommendation();

  if (!recommendation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border border-primary/20 p-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Based on your activity, we recommend:
            </p>
            <p className="text-lg font-semibold text-foreground">
              {recommendation.title}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {recommendation.reason}
            </p>
          </div>
        </div>
        <Button asChild className="shrink-0">
          <Link to={recommendation.path}>Open Tool</Link>
        </Button>
      </div>
    </motion.div>
  );
}

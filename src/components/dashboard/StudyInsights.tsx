import { motion } from "framer-motion";
import { 
  BarChart3, 
  FileText, 
  Clock, 
  TrendingUp,
  Sparkles 
} from "lucide-react";
import { useToolUsage } from "@/hooks/useToolUsage";
import { useEffect, useState } from "react";

interface InsightCard {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
}

const toolNames: Record<string, string> = {
  "/tools/study-kit": "Study Kit",
  "/tools/speaker-notes": "Speaker Notes",
  "/tools/summarizer": "Summarizer",
  "/tools/predictive": "Predictive",
  "/tools/optimizer": "Optimizer",
};

export function StudyInsights() {
  const { usageData } = useToolUsage();
  const [filesStudied, setFilesStudied] = useState(0);

  useEffect(() => {
    // Track files from localStorage
    const stored = localStorage.getItem("ai-study-companion-files-count");
    if (stored) {
      setFilesStudied(parseInt(stored, 10));
    }
  }, []);

  // Calculate insights
  const totalUsage = usageData.reduce((acc, t) => acc + t.usageCount, 0);
  const mostUsedTool = [...usageData].sort((a, b) => b.usageCount - a.usageCount)[0];
  const recentActivity = usageData.filter(
    (t) => Date.now() - t.lastUsed < 7 * 24 * 60 * 60 * 1000
  ).length;

  const insights: InsightCard[] = [
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Most Used Tool",
      value: mostUsedTool ? toolNames[mostUsedTool.toolPath] || "Study Kit" : "Study Kit",
      subtext: mostUsedTool ? `${mostUsedTool.usageCount} uses` : "Start exploring",
      color: "text-primary bg-primary/10",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Files Studied",
      value: filesStudied.toString(),
      subtext: "Documents processed",
      color: "text-success bg-success/10",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Weekly Activity",
      value: recentActivity.toString(),
      subtext: "Tools used this week",
      color: "text-accent bg-accent/10",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: "Total Sessions",
      value: totalUsage.toString(),
      subtext: "AI generations",
      color: "text-info bg-info/10",
    },
  ];

  if (totalUsage === 0 && filesStudied === 0) {
    return null; // Don't show if no activity
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Study Insights</h3>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 + index * 0.05 }}
            className="p-4 rounded-xl bg-card border border-border/50 hover:border-border transition-all duration-200 hover:shadow-md group"
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${insight.color} mb-3 transition-transform group-hover:scale-110`}>
              {insight.icon}
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {insight.value}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
              {insight.label}
            </div>
            <div className="text-xs text-muted-foreground">
              {insight.subtext}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

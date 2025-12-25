import { useCallback, useEffect, useState } from "react";

interface ToolUsage {
  toolPath: string;
  usageCount: number;
  lastUsed: number;
}

interface ToolRecommendation {
  path: string;
  title: string;
  reason: string;
}

const STORAGE_KEY = "ai-study-companion-tool-usage";

const toolTitles: Record<string, string> = {
  "/tools/study-kit": "Smart Study Kit Generator",
  "/tools/speaker-notes": "Speaker Notes & Viva Prep",
  "/tools/summarizer": "Syllabus-Aware Summarizer",
  "/tools/predictive": "Predictive Study Assistant",
  "/tools/optimizer": "Study Workflow Optimizer",
};

export function useToolUsage() {
  const [usageData, setUsageData] = useState<ToolUsage[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUsageData(JSON.parse(stored));
    }
  }, []);

  const trackToolUsage = useCallback((toolPath: string) => {
    setUsageData((prev) => {
      const existing = prev.find((t) => t.toolPath === toolPath);
      const updated = existing
        ? prev.map((t) =>
            t.toolPath === toolPath
              ? { ...t, usageCount: t.usageCount + 1, lastUsed: Date.now() }
              : t
          )
        : [...prev, { toolPath, usageCount: 1, lastUsed: Date.now() }];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getRecommendation = useCallback((): ToolRecommendation | null => {
    if (usageData.length === 0) {
      // First-time user: recommend the most popular starting tool
      return {
        path: "/tools/study-kit",
        title: "Smart Study Kit Generator",
        reason: "Great for first-time users",
      };
    }

    // Find most used tool
    const mostUsed = [...usageData].sort((a, b) => b.usageCount - a.usageCount)[0];
    
    // Find most recently used
    const mostRecent = [...usageData].sort((a, b) => b.lastUsed - a.lastUsed)[0];

    // If user frequently uses study-kit, recommend predictive
    if (mostUsed.toolPath === "/tools/study-kit" && mostUsed.usageCount >= 2) {
      const hasUsedPredictive = usageData.some(t => t.toolPath === "/tools/predictive");
      if (!hasUsedPredictive) {
        return {
          path: "/tools/predictive",
          title: toolTitles["/tools/predictive"],
          reason: "Complement your study kits with past paper analysis",
        };
      }
    }

    // If user uses speaker-notes, recommend summarizer for better prep
    if (mostUsed.toolPath === "/tools/speaker-notes") {
      const hasUsedSummarizer = usageData.some(t => t.toolPath === "/tools/summarizer");
      if (!hasUsedSummarizer) {
        return {
          path: "/tools/summarizer",
          title: toolTitles["/tools/summarizer"],
          reason: "Check syllabus coverage before your presentation",
        };
      }
    }

    // Default: recommend the least used tool
    const allToolPaths = Object.keys(toolTitles);
    const unusedTools = allToolPaths.filter(
      (path) => !usageData.some((t) => t.toolPath === path)
    );

    if (unusedTools.length > 0) {
      const randomUnused = unusedTools[0];
      return {
        path: randomUnused,
        title: toolTitles[randomUnused],
        reason: "Try something new",
      };
    }

    // If all tools used, recommend most recent for continuity
    return {
      path: mostRecent.toolPath,
      title: toolTitles[mostRecent.toolPath],
      reason: "Continue where you left off",
    };
  }, [usageData]);

  return { trackToolUsage, getRecommendation, usageData };
}

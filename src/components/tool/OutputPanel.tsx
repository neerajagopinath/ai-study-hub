import { useState, useEffect } from "react";
import { Copy, Download, Trash2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SkeletonLoader } from "./SkeletonLoader";
import { EmptyState } from "./EmptyState";
import { ExplainWhySection } from "./ExplainWhySection";

export interface OutputTab {
  id: string;
  label: string;
  content: string;
}

interface OutputPanelProps {
  tabs: OutputTab[];
  isLoading?: boolean;
  onClear?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showExplainWhy?: boolean;
}

export function OutputPanel({ 
  tabs, 
  isLoading = false, 
  onClear,
  activeTab: controlledActiveTab,
  onTabChange,
  showExplainWhy = true,
}: OutputPanelProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || "");
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const { toast } = useToast();

  const activeTab = controlledActiveTab || internalActiveTab;
  const setActiveTab = (tab: string) => {
    setInternalActiveTab(tab);
    onTabChange?.(tab);
  };

  // Update activeTab when tabs change
  useEffect(() => {
    if (tabs.length > 0 && !tabs.find(t => t.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  const handleCopy = async () => {
    const currentContent = tabs.find((t) => t.id === activeTab)?.content || "";
    await navigator.clipboard.writeText(currentContent);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied successfully.",
    });
  };

  const handleDownload = () => {
    const currentContent = tabs.find((t) => t.id === activeTab)?.content || "";
    const blob = new Blob([currentContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}-output.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
    toast({
      title: "Downloaded",
      description: "File has been downloaded successfully.",
    });
  };

  const hasContent = tabs.some((tab) => tab.content.length > 0);

  return (
    <div className="panel h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">AI Output</h3>
        {hasContent && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className={`h-8 px-2 text-muted-foreground hover:text-foreground btn-press ${copySuccess ? 'success-pulse bg-success/10 text-success' : ''}`}
            >
              {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className={`h-8 px-2 text-muted-foreground hover:text-foreground btn-press ${downloadSuccess ? 'success-pulse bg-success/10 text-success' : ''}`}
            >
              {downloadSuccess ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-8 px-2 text-muted-foreground hover:text-destructive btn-press"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="bg-secondary/50 w-full justify-start h-10 p-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="flex-1 mt-4 data-[state=inactive]:hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="output-container h-full min-h-[250px] overflow-auto"
              >
                {isLoading ? (
                  <SkeletonLoader lines={8} showHeader={true} />
                ) : tab.content ? (
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                    {tab.content}
                  </pre>
                ) : (
                  <EmptyState
                    type="output"
                    title="No content yet"
                    description="Upload a file and configure options to generate AI-powered study materials"
                  />
                )}
              </motion.div>
            </TabsContent>
          ))}
        </AnimatePresence>
      </Tabs>

      {/* Explain Why Section */}
      {hasContent && showExplainWhy && !isLoading && (
        <ExplainWhySection isVisible={true} />
      )}
    </div>
  );
}

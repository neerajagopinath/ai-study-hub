import { useState } from "react";
import { Copy, Download, Trash2, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface OutputTab {
  id: string;
  label: string;
  content: string;
}

interface OutputPanelProps {
  tabs: OutputTab[];
  isLoading?: boolean;
  onClear?: () => void;
}

export function OutputPanel({ tabs, isLoading = false, onClear }: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");
  const { toast } = useToast();

  const handleCopy = async () => {
    const currentContent = tabs.find((t) => t.id === activeTab)?.content || "";
    await navigator.clipboard.writeText(currentContent);
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-8 px-2 text-muted-foreground hover:text-destructive"
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
              className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="flex-1 mt-4 data-[state=inactive]:hidden"
          >
            <div className="output-container h-full min-h-[250px] overflow-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Processing your file...
                  </p>
                </div>
              ) : tab.content ? (
                <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                  {tab.content}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="mb-4 h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload a file and configure options to generate output
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

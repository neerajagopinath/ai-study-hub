import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface QualitySettings {
  outputLength: "short" | "medium" | "detailed";
  tone: "simple" | "exam" | "technical";
  bulletPoints: boolean;
}

interface AIQualityControlsProps {
  settings: QualitySettings;
  onChange: (settings: QualitySettings) => void;
}

export function AIQualityControls({ settings, onChange }: AIQualityControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-lg border border-border/50 bg-secondary/30 p-4 space-y-4"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Settings2 className="h-4 w-4 text-primary" />
        <span>AI Output Quality</span>
      </div>

      {/* Output Length */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Output Length</Label>
        <ToggleGroup
          type="single"
          value={settings.outputLength}
          onValueChange={(value) =>
            value && onChange({ ...settings, outputLength: value as QualitySettings["outputLength"] })
          }
          className="justify-start"
        >
          <ToggleGroupItem
            value="short"
            size="sm"
            className="text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            Short
          </ToggleGroupItem>
          <ToggleGroupItem
            value="medium"
            size="sm"
            className="text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            Medium
          </ToggleGroupItem>
          <ToggleGroupItem
            value="detailed"
            size="sm"
            className="text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            Detailed
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Tone */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Tone</Label>
        <ToggleGroup
          type="single"
          value={settings.tone}
          onValueChange={(value) =>
            value && onChange({ ...settings, tone: value as QualitySettings["tone"] })
          }
          className="justify-start"
        >
          <ToggleGroupItem
            value="simple"
            size="sm"
            className="text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            Simple
          </ToggleGroupItem>
          <ToggleGroupItem
            value="exam"
            size="sm"
            className="text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            Exam-Ready
          </ToggleGroupItem>
          <ToggleGroupItem
            value="technical"
            size="sm"
            className="text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            Technical
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Bullet vs Paragraph */}
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Bullet Points</Label>
        <Switch
          checked={settings.bulletPoints}
          onCheckedChange={(checked) =>
            onChange({ ...settings, bulletPoints: checked })
          }
        />
      </div>
    </motion.div>
  );
}

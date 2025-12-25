import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export interface ToolOption {
  id: string;
  label: string;
  type: "select" | "toggle" | "checkbox";
  options?: { value: string; label: string }[];
  defaultValue?: string | boolean;
}

interface OptionsPanelProps {
  title?: string;
  options: ToolOption[];
  values: Record<string, string | boolean>;
  onChange: (id: string, value: string | boolean) => void;
}

export function OptionsPanel({
  title = "Smart Options",
  options,
  values,
  onChange,
}: OptionsPanelProps) {
  return (
    <div className="panel h-full flex flex-col">
      <h3 className="mb-4 text-base font-semibold text-foreground">{title}</h3>

      <div className="space-y-5">
        {options.map((option) => (
          <div key={option.id}>
            {option.type === "select" && option.options && (
              <div className="space-y-2">
                <Label
                  htmlFor={option.id}
                  className="text-sm font-medium text-foreground"
                >
                  {option.label}
                </Label>
                <Select
                  value={(values[option.id] as string) || ""}
                  onValueChange={(value) => onChange(option.id, value)}
                >
                  <SelectTrigger id={option.id} className="w-full bg-background">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {option.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {option.type === "toggle" && (
              <div className="flex items-center justify-between">
                <Label
                  htmlFor={option.id}
                  className="text-sm font-medium text-foreground"
                >
                  {option.label}
                </Label>
                <Switch
                  id={option.id}
                  checked={values[option.id] as boolean}
                  onCheckedChange={(checked) => onChange(option.id, checked)}
                />
              </div>
            )}

            {option.type === "checkbox" && (
              <div className="flex items-center gap-3">
                <Checkbox
                  id={option.id}
                  checked={values[option.id] as boolean}
                  onCheckedChange={(checked) =>
                    onChange(option.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={option.id}
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

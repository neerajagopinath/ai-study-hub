import { useState, useEffect, useCallback } from "react";
import { QualitySettings } from "@/components/tool/AIQualityControls";

interface ToolSettings {
  options: Record<string, string | boolean>;
  qualitySettings: QualitySettings;
  activeTab: string;
}

const SETTINGS_KEY = "ai-study-companion-tool-settings";

const defaultQualitySettings: QualitySettings = {
  outputLength: "medium",
  tone: "exam",
  bulletPoints: true,
};

export function useToolSettings(toolId: string, defaultOptions: Record<string, string | boolean>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [options, setOptions] = useState<Record<string, string | boolean>>(defaultOptions);
  const [qualitySettings, setQualitySettings] = useState<QualitySettings>(defaultQualitySettings);
  const [activeTab, setActiveTab] = useState<string>("");

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        const allSettings: Record<string, ToolSettings> = JSON.parse(stored);
        const toolSettings = allSettings[toolId];
        if (toolSettings) {
          setOptions({ ...defaultOptions, ...toolSettings.options });
          setQualitySettings({ ...defaultQualitySettings, ...toolSettings.qualitySettings });
          if (toolSettings.activeTab) {
            setActiveTab(toolSettings.activeTab);
          }
        }
      } catch (e) {
        console.error("Failed to load tool settings:", e);
      }
    }
    setIsLoaded(true);
  }, [toolId, defaultOptions]);

  // Save settings whenever they change
  const saveSettings = useCallback((
    newOptions: Record<string, string | boolean>,
    newQuality: QualitySettings,
    newActiveTab: string
  ) => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    const allSettings: Record<string, ToolSettings> = stored ? JSON.parse(stored) : {};
    
    allSettings[toolId] = {
      options: newOptions,
      qualitySettings: newQuality,
      activeTab: newActiveTab,
    };
    
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(allSettings));
  }, [toolId]);

  const updateOptions = useCallback((id: string, value: string | boolean) => {
    setOptions(prev => {
      const updated = { ...prev, [id]: value };
      saveSettings(updated, qualitySettings, activeTab);
      return updated;
    });
  }, [saveSettings, qualitySettings, activeTab]);

  const updateQualitySettings = useCallback((settings: QualitySettings) => {
    setQualitySettings(settings);
    saveSettings(options, settings, activeTab);
  }, [saveSettings, options, activeTab]);

  const updateActiveTab = useCallback((tab: string) => {
    setActiveTab(tab);
    saveSettings(options, qualitySettings, tab);
  }, [saveSettings, options, qualitySettings]);

  return {
    isLoaded,
    options,
    qualitySettings,
    activeTab,
    updateOptions,
    updateQualitySettings,
    updateActiveTab,
  };
}

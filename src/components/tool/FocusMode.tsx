import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, AlignLeft, AlignJustify, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface FocusModeContextType {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  exitFocusMode: () => void;
  fontSize: number;
  lineHeight: number;
  contentWidth: "narrow" | "medium" | "wide";
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setContentWidth: (width: "narrow" | "medium" | "wide") => void;
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined);

export function FocusModeProvider({ children }: { children: ReactNode }) {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [contentWidth, setContentWidth] = useState<"narrow" | "medium" | "wide">("medium");

  const toggleFocusMode = useCallback(() => {
    setIsFocusMode(prev => !prev);
  }, []);

  const exitFocusMode = useCallback(() => {
    setIsFocusMode(false);
  }, []);

  // ESC key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFocusMode) {
        exitFocusMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocusMode, exitFocusMode]);

  return (
    <FocusModeContext.Provider
      value={{
        isFocusMode,
        toggleFocusMode,
        exitFocusMode,
        fontSize,
        lineHeight,
        contentWidth,
        setFontSize,
        setLineHeight,
        setContentWidth,
      }}
    >
      {children}
    </FocusModeContext.Provider>
  );
}

export function useFocusMode() {
  const context = useContext(FocusModeContext);
  if (!context) {
    throw new Error("useFocusMode must be used within FocusModeProvider");
  }
  return context;
}

export function FocusModeToggle() {
  const { isFocusMode, toggleFocusMode } = useFocusMode();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleFocusMode}
      className="gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5"
    >
      {isFocusMode ? (
        <>
          <Minimize2 className="h-4 w-4" />
          <span className="hidden sm:inline">Exit Focus</span>
        </>
      ) : (
        <>
          <Maximize2 className="h-4 w-4" />
          <span className="hidden sm:inline">Focus Mode</span>
        </>
      )}
    </Button>
  );
}

export function FocusModeControls() {
  const {
    fontSize,
    lineHeight,
    contentWidth,
    setFontSize,
    setLineHeight,
    setContentWidth,
    exitFocusMode,
  } = useFocusMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-lg"
    >
      <div className="container py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* Font Size */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Size</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-medium w-6 text-center">{fontSize}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Line Height */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Spacing</span>
              <Slider
                value={[lineHeight]}
                onValueChange={([val]) => setLineHeight(val)}
                min={1.2}
                max={2.2}
                step={0.1}
                className="w-20"
              />
            </div>

            {/* Content Width */}
            <div className="hidden md:flex items-center gap-1">
              <span className="text-xs text-muted-foreground mr-1">Width</span>
              {(["narrow", "medium", "wide"] as const).map((width) => (
                <Button
                  key={width}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-2 text-xs capitalize",
                    contentWidth === width && "bg-secondary text-foreground"
                  )}
                  onClick={() => setContentWidth(width)}
                >
                  {width === "narrow" ? (
                    <AlignLeft className="h-3 w-3" />
                  ) : width === "wide" ? (
                    <AlignJustify className="h-3 w-3" />
                  ) : (
                    <div className="h-3 w-3 flex items-center justify-center">
                      <div className="w-2.5 h-0.5 bg-current rounded" />
                    </div>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={exitFocusMode}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Exit Focus</span>
            <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border bg-secondary px-1.5 text-[10px] font-medium text-muted-foreground">
              ESC
            </kbd>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function FocusModeOverlay({ children }: { children: ReactNode }) {
  const { isFocusMode, fontSize, lineHeight, contentWidth } = useFocusMode();

  const widthClasses = {
    narrow: "max-w-2xl",
    medium: "max-w-4xl",
    wide: "max-w-6xl",
  };

  if (!isFocusMode) return <>{children}</>;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-background overflow-auto"
      >
        <FocusModeControls />
        <div
          className={cn("mx-auto px-6 pt-20 pb-12", widthClasses[contentWidth])}
          style={{ fontSize: `${fontSize}px`, lineHeight }}
        >
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface FileContextType {
  activeFile: File | null;
  setActiveFile: (file: File | null) => void;
  clearActiveFile: () => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [activeFile, setActiveFileState] = useState<File | null>(null);

  const setActiveFile = useCallback((file: File | null) => {
    setActiveFileState(file);
  }, []);

  const clearActiveFile = useCallback(() => {
    setActiveFileState(null);
  }, []);

  return (
    <FileContext.Provider value={{ activeFile, setActiveFile, clearActiveFile }}>
      {children}
    </FileContext.Provider>
  );
}

export function useActiveFile() {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error("useActiveFile must be used within a FileProvider");
  }
  return context;
}

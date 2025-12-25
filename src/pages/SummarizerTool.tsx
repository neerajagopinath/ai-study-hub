import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, FileText, CheckCircle2, AlertCircle, Circle } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToolUsage } from "@/hooks/useToolUsage";

interface UnitProgress {
  name: string;
  status: "covered" | "partial" | "not-covered";
  progress: number;
  summary: string;
}

const SummarizerTool = () => {
  const { trackToolUsage } = useToolUsage();
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
  const [notesFile, setNotesFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [units, setUnits] = useState<UnitProgress[]>([]);

  useEffect(() => {
    trackToolUsage("/tools/summarizer");
  }, [trackToolUsage]);

  const handleAnalyze = async () => {
    if (!syllabusFile || !notesFile) return;

    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));

    setUnits([
      {
        name: "Unit 1: Introduction & Fundamentals",
        status: "covered",
        progress: 95,
        summary: "Comprehensive coverage of basic concepts, definitions, and foundational theories. All major topics addressed with detailed explanations.",
      },
      {
        name: "Unit 2: Core Principles",
        status: "covered",
        progress: 88,
        summary: "Strong coverage of main principles and their applications. Minor gaps in advanced examples that can be supplemented.",
      },
      {
        name: "Unit 3: Advanced Concepts",
        status: "partial",
        progress: 62,
        summary: "Partial coverage detected. Missing detailed explanations for theoretical frameworks. Recommend additional study material.",
      },
      {
        name: "Unit 4: Applications & Case Studies",
        status: "partial",
        progress: 45,
        summary: "Limited case study coverage. Theory is present but practical applications need more depth. Focus area for exam preparation.",
      },
      {
        name: "Unit 5: Recent Developments",
        status: "not-covered",
        progress: 15,
        summary: "Minimal coverage. This unit requires significant attention. Recommend prioritizing this topic in your study plan.",
      },
    ]);

    setIsAnalyzing(false);
  };

  const getStatusIcon = (status: UnitProgress["status"]) => {
    switch (status) {
      case "covered":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "partial":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "not-covered":
        return <Circle className="h-5 w-5 text-destructive" />;
    }
  };

  const getStatusLabel = (status: UnitProgress["status"]) => {
    switch (status) {
      case "covered":
        return "Covered";
      case "partial":
        return "Partially Covered";
      case "not-covered":
        return "Not Covered";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-6">
        <div className="container">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Syllabus-Aware Summarizer
            </h1>
            <p className="text-muted-foreground mb-8">
              Compare your notes against the syllabus to identify gaps and get AI-powered summaries.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Syllabus Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="panel"
            >
              <h3 className="text-base font-semibold text-foreground mb-4">
                Upload Syllabus
              </h3>
              <label className="upload-zone flex flex-col items-center justify-center min-h-[150px] cursor-pointer">
                {syllabusFile ? (
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{syllabusFile.name}</p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSyllabusFile(null);
                        }}
                        className="text-sm text-primary hover:underline"
                      >
                        Replace file
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Drop your syllabus PDF here
                    </p>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => setSyllabusFile(e.target.files?.[0] || null)}
                />
              </label>
            </motion.div>

            {/* Notes Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="panel"
            >
              <h3 className="text-base font-semibold text-foreground mb-4">
                Upload Your Notes
              </h3>
              <label className="upload-zone flex flex-col items-center justify-center min-h-[150px] cursor-pointer">
                {notesFile ? (
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-accent" />
                    <div>
                      <p className="font-medium text-foreground">{notesFile.name}</p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setNotesFile(null);
                        }}
                        className="text-sm text-primary hover:underline"
                      >
                        Replace file
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Drop your notes PDF here
                    </p>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => setNotesFile(e.target.files?.[0] || null)}
                />
              </label>
            </motion.div>
          </div>

          <div className="flex justify-center mb-8">
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={!syllabusFile || !notesFile || isAnalyzing}
              className="px-8"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Coverage"}
            </Button>
          </div>

          {/* Results */}
          {units.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Coverage Analysis
              </h2>

              {units.map((unit, index) => (
                <motion.div
                  key={unit.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="panel"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(unit.status)}
                      <h3 className="font-medium text-foreground">{unit.name}</h3>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        unit.status === "covered"
                          ? "bg-success/10 text-success"
                          : unit.status === "partial"
                          ? "bg-warning/10 text-warning"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {getStatusLabel(unit.status)}
                    </span>
                  </div>

                  <Progress value={unit.progress} className="h-2 mb-3" />

                  <p className="text-sm text-muted-foreground">{unit.summary}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SummarizerTool;

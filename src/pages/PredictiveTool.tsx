import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, FileText, Plus, X, TrendingUp, Star, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

interface Topic {
  name: string;
  frequency: number;
  priority: "must-study" | "high-probability" | "moderate";
}

const PredictiveTool = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;

    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));

    setTopics([
      { name: "Data Structures & Algorithms", frequency: 95, priority: "must-study" },
      { name: "Object-Oriented Programming", frequency: 88, priority: "must-study" },
      { name: "Database Management Systems", frequency: 82, priority: "high-probability" },
      { name: "Operating System Concepts", frequency: 75, priority: "high-probability" },
      { name: "Computer Networks", frequency: 68, priority: "high-probability" },
      { name: "Software Engineering Principles", frequency: 55, priority: "moderate" },
      { name: "Web Technologies", frequency: 45, priority: "moderate" },
      { name: "Machine Learning Basics", frequency: 35, priority: "moderate" },
    ]);

    setIsAnalyzing(false);
  };

  const getPriorityBadge = (priority: Topic["priority"]) => {
    switch (priority) {
      case "must-study":
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-destructive/10 text-destructive">
            <Star className="h-3 w-3" /> Must Study
          </span>
        );
      case "high-probability":
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-warning/10 text-warning">
            <TrendingUp className="h-3 w-3" /> High Probability
          </span>
        );
      case "moderate":
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-info/10 text-info">
            <AlertTriangle className="h-3 w-3" /> Moderate
          </span>
        );
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
              Predictive Study Assistant
            </h1>
            <p className="text-muted-foreground mb-8">
              Analyze past question papers to predict important topics and prioritize your study.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="panel mb-6"
          >
            <h3 className="text-base font-semibold text-foreground mb-4">
              Upload Past Question Papers
            </h3>

            <div className="space-y-3 mb-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleFileRemove(index)}
                    className="p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors">
              <Plus className="h-4 w-4" />
              Add Question Paper
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                multiple
                onChange={handleFileAdd}
              />
            </label>
          </motion.div>

          <div className="flex justify-center mb-8">
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={files.length === 0 || isAnalyzing}
              className="px-8"
            >
              {isAnalyzing ? "Analyzing Patterns..." : "Analyze Question Papers"}
            </Button>
          </div>

          {/* Results */}
          {topics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Topic Frequency Analysis
              </h2>

              <div className="panel">
                <div className="space-y-4">
                  {topics.map((topic, index) => (
                    <motion.div
                      key={topic.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground">
                            {topic.name}
                          </span>
                          {getPriorityBadge(topic.priority)}
                        </div>
                        <div className="h-3 rounded-full bg-secondary overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${topic.frequency}%` }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                            className={`h-full rounded-full ${
                              topic.priority === "must-study"
                                ? "bg-destructive"
                                : topic.priority === "high-probability"
                                ? "bg-warning"
                                : "bg-info"
                            }`}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground w-12 text-right">
                        {topic.frequency}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PredictiveTool;

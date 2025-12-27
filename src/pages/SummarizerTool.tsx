import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Circle,
  Play,
  ChevronRight,
  Sparkles,
  Lightbulb,
  Zap,
  BookOpen,
  TrendingUp,
} from "lucide-react";
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
  const [showDemoModal, setShowDemoModal] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroTextY = useTransform(scrollYProgress, [0, 0.25], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const particlesOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

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

  /* -------------------------------------------------------------------------- */
  /*                          CUSTOM ENGAGEMENT COMPONENTS                      */
  /* -------------------------------------------------------------------------- */

  // Floating Particles for ambient engagement (self-contained)
  const FloatingParticles = ({ opacity = 1 }: { opacity?: number }) => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/20 rounded-full"
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -50, 100, 0],
            opacity: [0.2, 1, 0.2],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      <FloatingParticles opacity={Number(particlesOpacity)} />
      <Navbar />

      <main className="flex-1">
        {/* ------------------------------------------------------------------ */}
        {/*                               HERO OVERVIEW                        */}
        {/* ------------------------------------------------------------------ */}
        <section className="relative h-[120vh]">
          <motion.div
            style={{ y: heroTextY, opacity: heroOpacity }}
            className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_var(--primary)_0%,_transparent_50%)]" />

            <div className="container relative z-10 text-center px-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors absolute top-4 left-4 z-20"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="inline-flex items-center gap-2 bg-primary/10 px-5 py-2 rounded-full mb-6"
              >
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                Syllabus-Aware Summarizer
              </motion.div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-6 leading-tight">
                Uncover Hidden Gaps
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed">
                Map your notes to the syllabus with AI precision. Spot missing topics, get instant summaries, and build a bulletproof study plan. 
                <br /> <span className="text-primary font-semibold">From blind spots to full coverage—effortlessly.</span>
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDemoModal(true)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Play className="h-5 w-5" />
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/*                          STEPS HOW TO USE                         */}
        {/* ------------------------------------------------------------------ */}
        <section className="py-8 relative">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Your 3-Step Syllabus Sync
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Simple, powerful, transformative. Follow these steps to turn syllabus stress into study superpowers.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Upload Syllabus",
                  description: "Drop your course syllabus PDF. AI parses units, topics, and weightages in seconds.",
                  icon: BookOpen,
                },
                {
                  step: "02",
                  title: "Add Your Notes",
                  description: "Upload your lecture notes or study docs. Drag, drop, done—no prep needed.",
                  icon: FileText,
                },
                {
                  step: "03",
                  title: "AI Reveals & Summarizes",
                  description: "Get gap analysis, unit summaries, and prioritized fixes. Instant insights, zero guesswork.",
                  icon: Lightbulb,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="text-center p-8 rounded-2xl bg-card border border-border/30 shadow-lg group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="text-5xl font-bold text-primary/20 mb-4 group-hover:text-primary/30 transition-colors">
                      {item.step}
                    </div>
                    <div className="h-12 w-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/*                          TOOL USAGE AREA                           */}
        {/* ------------------------------------------------------------------ */}
        <section className="py-16" id="use-tool">
          <div className="container max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Sync Your Syllabus?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Scroll no more—start analyzing now. Upload, analyze, conquer.
              </p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              {/* Syllabus Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="panel"
              >
                <h3 className="text-base font-semibold text-foreground mb-4">
                  Upload Syllabus
                </h3>
                <label className="upload-zone flex flex-col items-center justify-center min-h-[150px] cursor-pointer border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors">
                  {syllabusFile ? (
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{syllabusFile.name}</p>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
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
                        Drop your syllabus PDF here or click to browse
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="panel"
              >
                <h3 className="text-base font-semibold text-foreground mb-4">
                  Upload Your Notes
                </h3>
                <label className="upload-zone flex flex-col items-center justify-center min-h-[150px] cursor-pointer border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors">
                  {notesFile ? (
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-accent" />
                      <div>
                        <p className="font-medium text-foreground">{notesFile.name}</p>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
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
                        Drop your notes PDF here or click to browse
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
                {isAnalyzing ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Coverage...
                  </>
                ) : (
                  "Analyze Coverage"
                )}
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
                  Coverage Analysis Results
                </h2>

                {units.map((unit, index) => (
                  <motion.div
                    key={unit.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="panel border-l-4 border-primary/20 p-6 rounded-r-lg"
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

                    <Progress value={unit.progress} className="h-2 mb-3"/>

                    <p className="text-sm text-muted-foreground">{unit.summary}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDemoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4">Syllabus Summarizer Demo</h3>
              <div className="relative w-full h-64 bg-muted rounded-lg mb-4 flex items-center justify-center">
                <video className="w-full h-full object-cover rounded-lg" controls>
                  <source src="/demos/summarizer.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="text-muted-foreground mb-6">See how AI maps your notes to the syllabus in real-time. Gaps highlighted, summaries generated—magic in motion.</p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground"
                >
                  Close
                </button>
                <Button onClick={() => setShowDemoModal(false)} className="inline-flex items-center gap-2">
                  Start Analyzing <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SummarizerTool;
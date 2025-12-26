import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Presentation,
  BookOpen,
  FileQuestion,
  TrendingUp,
  Play,
  Sparkles,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/* -------------------------------------------------------------------------- */
/*                                   DATA                                     */
/* -------------------------------------------------------------------------- */

const tools = [
  {
    id: 0,
    icon: BookOpen,
    title: "Syllabus-Aware Summarizer",
    description:
      "Upload your syllabus and notes. Instantly identify missing topics, weak areas, and get unit-wise summaries aligned to your exam.",
    path: "/tools/summarizer",
    demoGif: "/demos/summarizer.gif",
  },
  {
    id: 1,
    icon: FileText,
    title: "Smart Study Kit Generator",
    description:
      "Convert PDFs into structured notes, definitions, flashcards, and revision sheets automatically.",
    path: "/tools/study-kit",
    demoGif: "/demos/study-kit.gif",
  },
  {
    id: 2,
    icon: Presentation,
    title: "Speaker Notes & Viva Prep",
    description:
      "Turn slides into speaker notes with AI-generated viva questions and model answers.",
    path: "/tools/speaker-notes",
    demoGif: "/demos/speaker-notes.gif",
  },
  {
    id: 3,
    icon: FileQuestion,
    title: "Predictive Study Assistant",
    description:
      "Analyze past question papers to predict high-weightage topics and optimize study focus.",
    path: "/tools/predictive",
    demoGif: "/demos/predictive.gif",
  },
  {
    id: 4,
    icon: TrendingUp,
    title: "Study Workflow Optimizer",
    description:
      "Track sessions, avoid burnout, and improve efficiency with AI-powered insights.",
    path: "/tools/optimizer",
    demoGif: "/demos/optimizer.gif",
  },
];

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

const Tools = () => {
  const [activeTool, setActiveTool] = useState(0);
  const tool = tools[activeTool];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* ------------------------------------------------------------------ */}
        {/*                               HERO                                 */}
        {/* ------------------------------------------------------------------ */}
        <section className="py-24 text-center">
          <div className="container max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Study Toolkit
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Choose the Tool You Need
            </h1>
            <p className="text-xl text-muted-foreground">
              No order. No pressure. Pick what helps you right now.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/*                       TOOL SELECTOR LAYOUT                          */}
        {/* ------------------------------------------------------------------ */}
        <section className="py-24">
          <div className="container grid md:grid-cols-[320px_1fr] gap-12 items-start">

            {/* TOOL LIST (STICKY) */}
            <div className="space-y-2 md:sticky md:top-24">
              {tools.map((t, index) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTool(index)}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition ${
                    index === activeTool
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card hover:bg-muted"
                  }`}
                >
                  <t.icon className="h-5 w-5" />
                  <span className="font-semibold">{t.title}</span>
                </button>
              ))}
            </div>

            {/* TOOL DETAIL PANEL */}
            <AnimatePresence mode="wait">
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-4xl font-bold">{tool.title}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {tool.description}
                </p>

                <div className="rounded-2xl overflow-hidden border shadow-xl">
                  <img
                    src={tool.demoGif}
                    alt={tool.title}
                    className="w-full h-auto"
                  />
                </div>

                <div className="flex gap-4">
                  <a
                    href={tool.path}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold"
                  >
                    Open Tool
                  </a>
                  <button className="inline-flex items-center gap-2 border px-6 py-3 rounded-full">
                    <Play className="h-4 w-4" />
                    Watch Demo
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tools;

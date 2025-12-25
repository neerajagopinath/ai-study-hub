import { motion } from "framer-motion";
import {
  FileText,
  Presentation,
  BookOpen,
  FileQuestion,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FeatureCard } from "@/components/dashboard/FeatureCard";

const features = [
  {
    icon: FileText,
    title: "Smart Study Kit Generator",
    description:
      "Transform your exam PDFs into comprehensive study materials with key concepts, definitions, and revision sheets.",
    path: "/tools/study-kit",
    color: "blue" as const,
  },
  {
    icon: Presentation,
    title: "Speaker Notes & Viva Prep",
    description:
      "Convert presentations into detailed speaker notes with potential viva questions for confident delivery.",
    path: "/tools/speaker-notes",
    color: "amber" as const,
  },
  {
    icon: BookOpen,
    title: "Syllabus-Aware Summarizer",
    description:
      "Compare your notes against the syllabus to identify gaps and get AI-powered summaries for each unit.",
    path: "/tools/summarizer",
    color: "green" as const,
  },
  {
    icon: FileQuestion,
    title: "Predictive Study Assistant",
    description:
      "Analyze past question papers to predict important topics and prioritize your study time effectively.",
    path: "/tools/predictive",
    color: "purple" as const,
  },
  {
    icon: TrendingUp,
    title: "Study Workflow Optimizer",
    description:
      "Track your study sessions, get personalized insights, and optimize your learning workflow.",
    path: "/tools/optimizer",
    color: "rose" as const,
  },
];

const Tools = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              All Study Tools
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose from our collection of AI-powered tools designed to enhance your academic journey.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={feature.path} {...feature} index={index} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tools;

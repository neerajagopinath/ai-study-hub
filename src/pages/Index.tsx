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
import { ToolRecommendation } from "@/components/dashboard/ToolRecommendation";
import { ActiveFileChip } from "@/components/dashboard/ActiveFileChip";

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

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Powered by AI
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
                Your AI-Powered{" "}
                <span className="gradient-text">Academic Companion</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Transform your study materials into powerful learning resources.
                Study smarter, not longer, with intelligent tools designed for
                academic success.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16">
          <div className="container">
            {/* Active File Chip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mb-6 flex justify-center"
            >
              <ActiveFileChip />
            </motion.div>

            {/* Smart Recommendation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <ToolRecommendation />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Smart Study Tools
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Choose a tool to get started with AI-enhanced studying
              </p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <FeatureCard key={feature.path} {...feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16 border-t border-border/50">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { value: "5+", label: "AI-Powered Tools" },
                { value: "∞", label: "Study Materials" },
                { value: "0", label: "Setup Required" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center p-6 rounded-xl bg-card border border-border/50"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

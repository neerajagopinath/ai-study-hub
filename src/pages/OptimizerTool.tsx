import { motion } from "framer-motion";
import { ArrowLeft, FileText, Clock, Zap, Target, TrendingUp, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const stats = [
  { icon: FileText, label: "Files Studied", value: "12", color: "text-primary" },
  { icon: Zap, label: "Tools Used", value: "8", color: "text-accent" },
  { icon: Clock, label: "Hours This Week", value: "15.5", color: "text-info" },
  { icon: Target, label: "Topics Covered", value: "24", color: "text-success" },
];

const weeklyData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 1.5 },
  { day: "Thu", hours: 4 },
  { day: "Fri", hours: 2 },
  { day: "Sat", hours: 1.5 },
  { day: "Sun", hours: 1 },
];

const suggestions = [
  {
    icon: TrendingUp,
    title: "Increase Study Time on Weekends",
    description: "Your weekend study hours are lower than weekdays. Consider dedicating 2-3 hours on Saturday for revision.",
  },
  {
    icon: Target,
    title: "Focus on Unit 5",
    description: "Based on your syllabus analysis, Unit 5 needs more attention. Prioritize this topic in your next study session.",
  },
  {
    icon: Lightbulb,
    title: "Try Active Recall",
    description: "You've been using the summarizer a lot. Try the Practice Questions tool for better retention.",
  },
];

const OptimizerTool = () => {
  const maxHours = Math.max(...weeklyData.map((d) => d.hours));

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
              Study Workflow Optimizer
            </h1>
            <p className="text-muted-foreground mb-8">
              Track your progress and get personalized insights to optimize your learning.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="panel flex items-center gap-4"
              >
                <div className={`p-3 rounded-xl bg-secondary ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Weekly Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="panel"
            >
              <h3 className="text-base font-semibold text-foreground mb-6">
                Weekly Study Hours
              </h3>

              <div className="flex items-end justify-between gap-2 h-40">
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.hours / maxHours) * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                      className="w-full max-w-[40px] rounded-t-lg bg-primary/80 hover:bg-primary transition-colors"
                    />
                    <span className="text-xs text-muted-foreground font-medium">
                      {day.day}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total this week</span>
                <span className="font-semibold text-foreground">
                  {weeklyData.reduce((acc, d) => acc + d.hours, 0)} hours
                </span>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="panel"
            >
              <h3 className="text-base font-semibold text-foreground mb-4">
                Recent Activity
              </h3>

              <div className="space-y-4">
                {[
                  { tool: "Smart Study Kit", file: "Chapter 5 Notes.pdf", time: "2 hours ago" },
                  { tool: "Syllabus Summarizer", file: "Syllabus.pdf", time: "5 hours ago" },
                  { tool: "Speaker Notes", file: "Presentation.pptx", time: "Yesterday" },
                  { tool: "Predictive Assistant", file: "Past Papers (3)", time: "2 days ago" },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.tool}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.file}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* AI Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">
              AI Study Suggestions
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="panel hover:border-primary/30 transition-colors cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <suggestion.icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {suggestion.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {suggestion.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OptimizerTool;

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Zap,
  Shield,
  Users,
  Users2,
  Code,
  Lightbulb,
  Calendar,
  Star,
  ChevronRight,
  Sparkles,
  TrendingUp,
  FileText,
  Presentation,
  Settings, // Added import for Settings icon
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const values = [
  {
    icon: Zap,
    title: "Efficiency First",
    description: "Every feature is designed to save you time and maximize your learning outcomes. AI parses your materials in seconds, delivering tailored insights.",
  },
  {
    icon: Shield,
    title: "Privacy Focused",
    description: "Your study materials stay on your device. We don't store or share your files. End-to-end encryption ensures your data is yours alone.",
  },
  {
    icon: Users,
    title: "Student-Centric",
    description: "Built by students, for students. We understand the challenges you face—from late-night crams to syllabus overload.",
  },
  {
    icon: BookOpen,
    title: "Academic Excellence",
    description: "Tools grounded in proven study techniques and learning science. From spaced repetition to predictive analytics, we back it with research.",
  },
];

const team = [
  {
    name: "NEERAJA GOPINATH",
    role: "Founder & Visionary",
    bio: "A passionate educator and entrepreneur, Neeraja founded AI Study Companion to bridge the gap between technology and effective learning. With a background in cognitive science, she ensures every tool empowers students to thrive.",
    avatar: "/avatars/neeraja.jpg", // Placeholder
    social: "@neeraja_gopinath",
  },
  {
    name: "HARESH SAINAATH S",
    role: "Tech Lead & Innovator",
    bio: "Haresh is the technical wizard behind the seamless AI integrations. A full-stack developer with expertise in machine learning, he crafts features that feel intuitive and powerful, turning complex algorithms into effortless study aids.",
    avatar: "/avatars/haresh.jpg", // Placeholder
    social: "@haresh_sainaath",
  },
];

const timeline = [
  {
    year: "2024",
    event: "Idea Spark",
    description: "Conceived during a late-night study session, the vision for AI-powered study tools takes shape.",
    icon: Lightbulb,
  },
  {
    year: "2025 Q1",
    event: "Beta Launch",
    description: "First tools roll out—Study Kit Generator and Syllabus Summarizer—tested with 500+ students.",
    icon: TrendingUp,
  },
  {
    year: "2025 Q2",
    event: "Full Release",
    description: "All core features live, including predictive questions and workflow optimizer. 10K users onboarded.",
    icon: Zap,
  },
  {
    year: "2026",
    event: "Global Expansion",
    description: "Multi-language support and collaborative features. Aiming for 1M students worldwide.",
    icon: Users2,
  },
];

const howItWorksSteps = [
  {
    step: "01",
    title: "Upload Your Materials",
    description: "Simply upload your PDFs, presentations, or notes to any of our tools. Drag & drop or paste—it's that easy.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Customize Settings",
    description: "Choose your preferences - exam type, summary depth, output format, and more. AI adapts to your style.",
    icon: Settings,
  },
  {
    step: "03",
    title: "Get AI-Powered Results",
    description: "Receive comprehensive study materials, questions, and insights instantly. Download, share, or integrate into your workflow.",
    icon: Presentation,
  },
];

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

// Infinite Marquee for brain-rotting loop (self-contained)
const InfiniteScrollMarquee = ({ successes = [] }: { successes?: string[] }) => {
  const items = [...successes, ...successes];
  return (
    <div className="overflow-hidden py-8 bg-gradient-to-r from-primary/5 to-secondary/5">
      <motion.div
        className="flex"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {items.map((success, i) => (
          <div key={i} className="flex-shrink-0 px-8 text-xl font-semibold text-primary">
            {success} ✨
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// ParallaxText (self-contained, simple implementation)
const ParallaxText = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const x = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <motion.div ref={ref} style={{ x }} className="whitespace-nowrap">
      {children}
    </motion.div>
  );
};

const About = () => {
  const [currentTeamMember, setCurrentTeamMember] = useState(0);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Auto-cycle team highlights
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTeamMember((prev) => (prev + 1) % team.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <FloatingParticles />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative h-[120vh]">
          <motion.div
            style={{ y }}
            className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5" />
            <div className="container relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto text-center px-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                  className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6"
                >
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  Powered by Cutting-Edge AI
                </motion.div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-6 leading-tight">
                  About AI Study Companion
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Revolutionizing how college students conquer their semesters. From chaos to clarity, one AI-powered tool at a time. Dive in and see the magic.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  Explore Tools <ChevronRight className="h-5 w-5" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Mission */}
        <section className="py-12">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  We believe that every student deserves access to powerful study tools. 
                  Traditional methods? Time sinks. Ineffective. Chaos.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  That's why we created AI Study Companion—to democratize academic success with intelligent, 
                  AI-powered tools that adapt to your learning style and laser-focus on what matters most.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 text-primary font-semibold"
                >
                  Join the Revolution <ChevronRight className="h-4 w-4" />
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="flex items-start gap-4 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/30 hover:border-primary/30 transition-all"
                  >
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mt-1">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Meet the Minds Behind It
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A duo of innovators turning study struggles into triumphs.
              </p>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-2">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.2 }}
                  whileHover={{ scale: 1.02, y: -10 }}
                  className={`relative p-8 rounded-2xl border border-border/50 overflow-hidden group ${
                    index === currentTeamMember ? "ring-2 ring-primary/50" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-lg"
                    />
                    <h3 className="text-2xl font-bold text-center mb-2">
                      {member.name}
                    </h3>
                    <p className="text-primary font-semibold text-center mb-4">
                      {member.role}
                    </p>
                    <p className="text-muted-foreground text-center leading-relaxed mb-4">
                      {member.bio}
                    </p>
                    <div className="flex justify-center">
                      <a
                        href={`https://x.com/${member.social}`}
                        className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                      >
                        Follow on X <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 relative">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-12"
            >
              Our Journey So Far
            </motion.h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary/20 to-transparent" />
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.2 }}
                  className={`flex items-center mb-12 ${
                    index % 2 === 0 ? "flex-row-reverse justify-end" : "justify-start"
                  }`}
                >
                  <div className={`w-1/2 p-6 rounded-2xl ${index % 2 === 0 ? "ml-auto" : "mr-auto"} bg-card/50 backdrop-blur-sm border border-border/30`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold">{item.event}</h3>
                        <p className="text-sm text-primary">{item.year}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gradient-to-b from-secondary/20 to-muted/10">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Three simple steps to transform your study experience. Seamless. Powerful. Yours.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {howItWorksSteps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="text-center p-8 rounded-2xl bg-card border border-border/30 shadow-lg group"
                >
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center">
          <div className="container max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Level Up Your Studies?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of students already transforming their academic journey.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Get Started Free <Sparkles className="h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
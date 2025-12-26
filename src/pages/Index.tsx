import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
  FileText,
  Presentation,
  BookOpen,
  FileQuestion,
  TrendingUp,
  Zap,
  Lightbulb,
  Users,
  Star,
  Play,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FeatureCard } from "@/components/dashboard/FeatureCard";

/* -------------------------------------------------------------------------- */
/*                                   DATA                                     */
/* -------------------------------------------------------------------------- */


const painLines = [
  "Too many PDFs piling up like digital hoarding.",
  "Too little time, endless deadlines closing in.",
  "No idea what actually matters in the syllabus chaos.",
  "Studying feels like guessing in the dark.",
  "Last-minute cramming that never sticks.",
  "Viva questions that blindside you every time.",
];

const transformationSlides = [
  {
    title: "Upload Once",
    subtitle: "PDFs, PPTs, syllabus, question papers — we ingest it all.",
    icon: FileText,
    image: "/illustrations/upload.png",
  },
  {
    title: "AI Understands Your Subject",
    subtitle: "Not generic summaries — syllabus-aware, context-smart magic.",
    icon: Sparkles,
    image: "/illustrations/ai-understand.png",
  },
  {
    title: "Predict What Matters",
    subtitle: "Focus where marks are most likely.",
    icon: TrendingUp,
    image: "/illustrations/predict.png",
  },
  {
    title: "Walk Into Exams Calm",
    subtitle: "Prepared. Structured. Confident.",
    icon: Zap,
    image: "/illustrations/exam-calm.png",
  },
  // Added more slides for longer engagement
  {
    title: "Iterate & Evolve",
    subtitle: "Your study plan adapts as you learn. AI learns with you.",
    icon: Lightbulb,
    image: "/illustrations/iterate.png",
  },
  {
    title: "Share & Collaborate",
    subtitle: "Team up with study buddies. Shared notes, group predictions.",
    icon: Users,
    image: "/illustrations/collaborate.png",
  },
];

const testimonials = [
  {
    quote: "This app turned my semester from survival mode to domination. Predictions saved my GPA!",
    author: "Alex R., CS Major",
    rating: 5,
    avatar: "/avatars/alex.jpg",
  },
  {
    quote: "The syllabus mapper? Game-changer. No more blind spots in exams.",
    author: "Priya S., Med Student",
    rating: 5,
    avatar: "/avatars/priya.jpg",
  },
  {
    quote: "Workflow optimizer feels like having a personal coach. Less burnout, more A's.",
    author: "Jordan L., Business",
    rating: 5,
    avatar: "/avatars/jordan.jpg",
  },
  // More for scrolling engagement
  {
    quote: "Flashcards that actually work. Spaced repetition on steroids.",
    author: "Sam K., Engineering",
    rating: 5,
    avatar: "/avatars/sam.jpg",
  },
];

const stats = [
  { value: "10K+", label: "Students Powered" },
  { value: "500K", label: "Docs Processed" },
  { value: "4.9/5", label: "Avg Rating" },
  { value: "24/7", label: "AI Uptime" },
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
const InfiniteScrollMarquee = () => {
  const successes = ["Aced Finals", "GPA Boosted", "Zero Panic", "Top 1%", "Mastered Syllabus", "Viva Slayed"];
  return (
    <div className="overflow-hidden py-8 bg-gradient-to-r from-primary/5 to-secondary/5">
      <motion.div
        className="flex"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...successes, ...successes].map((success, i) => (
          <div key={i} className="flex-shrink-0 px-8 text-xl font-semibold text-primary">
            {success} ✨
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// Inline TestimonialCard (self-contained)
const TestimonialCard = ({ quote, author, rating, avatar }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, rotateY: 5 }}
    className="p-6 bg-card border border-border/50 rounded-2xl shadow-lg"
  >
    <div className="flex mb-4">
      {[...Array(rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-yellow-400" />)}
    </div>
    <p className="text-muted-foreground mb-4 italic">"{quote}"</p>
    <div className="flex items-center gap-3">
      <img src={avatar} alt={author} className="w-10 h-10 rounded-full" />
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-muted-foreground">Verified User</p>
      </div>
    </div>
  </motion.div>
);

type ParallaxStepProps = {
  slide: any;
  index: number;
};

const ParallaxStep = ({ slide, index }: ParallaxStepProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 80%"],
  });

  const isRightAligned = index % 2 !== 0;

  const textX = useTransform(
    scrollYProgress,
    [0, 1],
    isRightAligned ? ["120px", "0px"] : ["-120px", "0px"]
  );

  const imageX = useTransform(
    scrollYProgress,
    [0, 1],
    isRightAligned ? ["-120px", "0px"] : ["120px", "0px"]
  );

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["40px", "0px"]);

  return (
    <div ref={ref} className="py-32">
      <div
        className={`container grid gap-12 items-center ${
          isRightAligned
            ? "md:grid-cols-[1fr_1.2fr]"
            : "md:grid-cols-[1.2fr_1fr]"
        }`}
      >
        {/* TEXT */}
        <motion.div
          style={{ x: textX, opacity }}
          className={`space-y-6 ${
            isRightAligned ? "md:order-2 text-right" : "text-left"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center ${
              isRightAligned ? "ml-auto" : ""
            }`}
          >
            <slide.icon className="h-7 w-7 text-primary" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold">
            {slide.title}
          </h2>

          <p className="text-lg text-muted-foreground max-w-md">
            {slide.subtitle}
          </p>
        </motion.div>

        {/* IMAGE */}
        <motion.div
          style={{ x: imageX, y: imageY, opacity }}
          className={`${isRightAligned ? "md:order-1" : ""}`}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-card border border-border/50">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};


/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

const Index = () => {
  const [showDemoModal, setShowDemoModal] = useState(false); // For quick demo engagement
  const [currentFeature, setCurrentFeature] = useState(0);

  /* ------------------------------ HERO SCROLL ------------------------------ */
  const { scrollYProgress } = useScroll();
  const heroTextY = useTransform(scrollYProgress, [0, 0.25], [0, -120]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const particlesOpacity = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 0.3])); // Fade particles on scroll

  // Auto-advance feature highlight for engagement
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentFeature((prev) => (prev + 1) % features.length);
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, []);
  

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden relative">
      <FloatingParticles opacity={Number(particlesOpacity)} />
      <Navbar />

      <main className="flex-1">
        {/* ------------------------------------------------------------------ */}
        {/*                               HERO                                 */}
        {/* ------------------------------------------------------------------ */}
        <section className="relative h-[150vh]">
          <motion.div
            style={{ scale: heroScale }}
            className="sticky top-0 h-screen overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/10 opacity-70" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_var(--primary)_0%,_transparent_50%)]" />

            <motion.div
              style={{ y: heroTextY, opacity: heroOpacity }}
              className="relative z-10 h-full flex items-center justify-center"
            >
              <div className="text-center max-w-4xl px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6"
                >
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative flex h-2 w-2"
                  >
                    <motion.span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </motion.span>
                  Powered by AI ✨
                </motion.div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                  Your <span className="gradient-text bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Entire Semester</span>
                  <br /> Organized by AI
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  Stop drowning in notes. Start studying with clarity, structure, and confidence. 
                  <br /> <span className="text-primary font-semibold">Watch how it works →</span>
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDemoModal(true)}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Play className="h-5 w-5" />
                  Quick Demo
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/*                          PAIN IMMERSION                             */}
        {/* ------------------------------------------------------------------ */}
        <section className="py-24 relative">
          <div className="container max-w-3xl mx-auto">
            {painLines.map((line, i) => (
              <motion.p
                key={line}
                initial={{ opacity: 0, x: -60, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.3, duration: 0.8, ease: "easeOut" }}
                className="text-4xl md:text-5xl font-semibold mb-8 text-center drop-shadow-lg"
              >
                {line} 😩
              </motion.p>
            ))}
          </div>
          {/* Subtle call-to-action overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center"
          >
            <p className="text-muted-foreground mb-2">Sound familiar?</p>
            <ChevronRight className="h-6 w-6 mx-auto text-primary animate-bounce" />
          </motion.div>
        </section>

        {/* ------------------------------------------------------------------ */}
{/*            AI TRANSFORMATION (VERTICAL PARALLAX)                    */}
{/* ------------------------------------------------------------------ */}
<section className="relative">
  {transformationSlides.map((slide, index) => (
    <ParallaxStep
      key={slide.title}
      slide={slide}
      index={index}
    />
  ))}
</section>


        {/* ------------------------------------------------------------------ */}
        {/*                           OUTCOMES                                  */}
        {/* ------------------------------------------------------------------ */}
        <section className="py-24 border-t border-border/50 relative">
          <InfiniteScrollMarquee /> {/* Brain-rotting success loop */}
          <div className="container">
            <div className="grid gap-6 md:grid-cols-4"> {/* Expanded grid */}
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateX: 4, 
                    rotateY: -4,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                  className="text-center p-10 rounded-2xl bg-card border border-border/50 shadow-xl group"
                >
                  <motion.div 
                    className="text-4xl md:text-5xl font-bold text-primary mb-3 group-hover:text-secondary"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/*                           TESTIMONIALS                              */}
        {/* ------------------------------------------------------------------ */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Students Are Saying
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Join 10K+ students who've transformed their study game.
              </p>
            </motion.div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {testimonials.map((testimonial, i) => (
                <TestimonialCard key={i} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

{/* ------------------------------------------------------------------ */}
{/*                          TOOLS REVEAL                               */}
{/* ------------------------------------------------------------------ */}
<section className="py-20 relative">
  <div className="container">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center max-w-2xl mx-auto"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Choose Your Tool
      </h2>

      <p className="text-muted-foreground mb-8">
        You’ve seen what’s possible.  
        Now explore the full AI-powered toolkit built to transform how you study.
      </p>

      <motion.a
        href="/tools"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
      >
        Discover Tools
        <span className="inline-block translate-x-0 group-hover:translate-x-1 transition-transform">
          →
        </span>
      </motion.a>
    </motion.div>
  </div>
</section>

        {/* ------------------------------------------------------------------ */}
        {/*                          FAQ ACCORDION (ENGAGEMENT)                 */}
        {/* ------------------------------------------------------------------ */}
        <section className="py-24 border-t border-border/50">
          <div className="container max-w-4xl">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-center mb-12"
            >
              Got Questions? We've Got AI.
            </motion.h2>
            <div className="space-y-4">
              {[
                { q: "Is it free to start?", a: "Yes! Basic tools are free." },
                { q: "What file types?", a: "PDFs, PPTs, docs, images — we handle the mess." },
                { q: "Secure & Private?", a: "Your data stays yours. No sharing, encrypted everything." },
                { q: "Works for any subject?", a: "From quantum physics to marketing — syllabus-aware magic." },
              ].map((faq, i) => (
                <motion.details
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  whileInView={{ opacity: 1, height: "auto" }}
                  className="p-6 bg-card border border-border/50 rounded-xl cursor-pointer"
                >
                  <summary className="font-semibold mb-2 flex items-center gap-2">
                    {faq.q} <ChevronRight className="h-4 w-4 rotate-90 transition-transform" />
                  </summary>
                  <p className="text-muted-foreground ml-6">{faq.a}</p>
                </motion.details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Demo Modal for Retention
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
              <h3 className="text-2xl font-bold mb-4">Live Demo: {features[currentFeature]?.title}</h3>
              <img src={features[currentFeature]?.demoGif} alt="Demo" className="w-full rounded-lg mb-4" />
              <p className="text-muted-foreground mb-6">See the magic in action. Upload your first file now?</p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground"
                >
                  Close
                </button>
                <a href={features[currentFeature]?.path} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-full font-semibold">
                  Try Now <Sparkles className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  );
};

export default Index;
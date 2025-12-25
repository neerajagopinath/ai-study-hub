import { motion } from "framer-motion";
import { BookOpen, Zap, Shield, Users } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const values = [
  {
    icon: Zap,
    title: "Efficiency First",
    description: "Every feature is designed to save you time and maximize your learning outcomes.",
  },
  {
    icon: Shield,
    title: "Privacy Focused",
    description: "Your study materials stay on your device. We don't store or share your files.",
  },
  {
    icon: Users,
    title: "Student-Centric",
    description: "Built by students, for students. We understand the challenges you face.",
  },
  {
    icon: BookOpen,
    title: "Academic Excellence",
    description: "Tools grounded in proven study techniques and learning science.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 border-b border-border/50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                About AI Study Companion
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                AI Study Companion is a comprehensive toolkit designed to help college students 
                study more effectively. We leverage AI to transform your study materials into 
                powerful learning resources, helping you prepare for exams with confidence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We believe that every student deserves access to powerful study tools. 
                  Traditional studying methods can be time-consuming and ineffective. 
                  That's why we created AI Study Companion.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our mission is to democratize academic success by providing intelligent, 
                  AI-powered tools that adapt to your learning style and help you focus 
                  on what matters most.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="grid gap-4 sm:grid-cols-2"
              >
                {values.map((value, index) => (
                  <div
                    key={value.title}
                    className="panel hover:border-primary/30 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                      <value.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-secondary/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Three simple steps to transform your study experience
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Upload Your Materials",
                  description: "Simply upload your PDFs, presentations, or notes to any of our tools.",
                },
                {
                  step: "02",
                  title: "Customize Settings",
                  description: "Choose your preferences - exam type, summary depth, output format, and more.",
                },
                {
                  step: "03",
                  title: "Get AI-Powered Results",
                  description: "Receive comprehensive study materials, questions, and insights instantly.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="panel text-center"
                >
                  <div className="text-4xl font-bold text-primary/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
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

export default About;

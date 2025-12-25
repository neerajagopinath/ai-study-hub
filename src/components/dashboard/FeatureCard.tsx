import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  index: number;
  color: "blue" | "amber" | "green" | "purple" | "rose";
}

const colorClasses = {
  blue: "bg-primary/10 text-primary",
  amber: "bg-accent/10 text-accent",
  green: "bg-success/10 text-success",
  purple: "bg-info/10 text-info",
  rose: "bg-destructive/10 text-destructive",
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  path,
  index,
  color,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={path} className="block group">
        <div className="feature-card h-full flex flex-col">
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${colorClasses[color]}`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>

          <p className="mb-4 flex-1 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>

          <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
            Open Tool
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

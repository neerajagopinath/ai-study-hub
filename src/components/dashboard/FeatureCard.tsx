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
  blue: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
  amber: "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground",
  green: "bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground",
  purple: "bg-info/10 text-info group-hover:bg-info group-hover:text-info-foreground",
  rose: "bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-destructive-foreground",
};

const glowClasses = {
  blue: "group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]",
  amber: "group-hover:shadow-[0_0_30px_hsl(var(--accent)/0.2)]",
  green: "group-hover:shadow-[0_0_30px_hsl(var(--success)/0.2)]",
  purple: "group-hover:shadow-[0_0_30px_hsl(var(--info)/0.2)]",
  rose: "group-hover:shadow-[0_0_30px_hsl(var(--destructive)/0.2)]",
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
      whileHover={{ y: -6 }}
    >
      <Link to={path} className="block group">
        <div className={`feature-card h-full flex flex-col ${glowClasses[color]}`}>
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${colorClasses[color]}`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>

          <p className="mb-4 flex-1 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>

          <motion.div 
            className="flex items-center gap-2 text-sm font-medium text-primary"
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Open Tool
            </span>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

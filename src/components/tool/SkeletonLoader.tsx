import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  lines?: number;
  showHeader?: boolean;
  className?: string;
}

export function SkeletonLoader({ lines = 6, showHeader = true, className }: SkeletonLoaderProps) {
  return (
    <div className={cn("space-y-4 p-4", className)}>
      {showHeader && (
        <div className="space-y-2">
          <div className="h-5 w-3/4 skeleton-shimmer rounded" />
          <div className="h-4 w-1/2 skeleton-shimmer rounded" />
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 skeleton-shimmer rounded"
            style={{ 
              width: `${Math.random() * 30 + 70}%`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
      <div className="space-y-3 pt-2">
        <div className="h-4 w-5/6 skeleton-shimmer rounded" />
        <div className="h-4 w-4/5 skeleton-shimmer rounded" />
        <div className="h-4 w-3/4 skeleton-shimmer rounded" />
      </div>
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border p-5 space-y-3", className)}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg skeleton-shimmer" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-1/3 skeleton-shimmer rounded" />
          <div className="h-3 w-1/2 skeleton-shimmer rounded" />
        </div>
      </div>
      <div className="h-3 w-full skeleton-shimmer rounded" />
      <div className="h-3 w-4/5 skeleton-shimmer rounded" />
    </div>
  );
}

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

type Props = {
  summary?: string
  onMarkRevised?: () => void
  onReadAloud?: () => void
}

export function SummaryCard({ summary, onMarkRevised, onReadAloud }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm text-primary font-semibold tracking-wide uppercase">Quick Summary</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onMarkRevised}>
            Mark as revised
          </Button>
          <Button variant="ghost" size="sm" disabled onClick={onReadAloud}>
            Read aloud (soon)
          </Button>
        </div>
      </div>
      <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">{summary}</p>
    </motion.div>
  )
}

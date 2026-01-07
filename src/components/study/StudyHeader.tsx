import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export function StudyHeader() {
  return (
    <div className="space-y-3">
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
        <span className="h-2 w-2 rounded-full bg-primary" />
        Focus Mode
      </div>
      <div className="flex flex-col gap-2">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-semibold text-foreground"
        >
          AI Study Kit
        </motion.h1>
        <p className="text-muted-foreground">
          Generated from your uploaded material. Flow: Summary → Topics → Flashcards → Definitions.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">Summary</Badge>
          <Badge variant="secondary">Topics</Badge>
          <Badge variant="secondary">Flashcards</Badge>
          <Badge variant="secondary">Definitions</Badge>
        </div>
      </div>
    </div>
  )
}

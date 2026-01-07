import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Flashcard } from "@/hooks/useStudyKit"

type Props = {
  cards?: Flashcard[]
}

export function FlashcardPlayer({ cards }: Props) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  if (!cards || cards.length === 0) return null

  const card = cards[index]
  const progress = ((index + 1) / cards.length) * 100

  const next = () => {
    setFlipped(false)
    setIndex((prev) => (prev + 1 < cards.length ? prev + 1 : prev))
  }

  const retry = () => {
    setFlipped(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-primary font-semibold tracking-wide uppercase">Flashcards</p>
        <span className="text-sm text-muted-foreground">
          {index + 1} / {cards.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${index}-${flipped}`}
          initial={{ opacity: 0, rotateY: -10 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 10 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm min-h-[220px] flex items-center justify-center text-center cursor-pointer"
          onClick={() => setFlipped((f) => !f)}
        >
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-primary/80">
              {flipped ? "Answer" : "Question"}
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              {flipped ? card.answer : card.question}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <Progress value={progress} />

      <div className="flex gap-2">
        <Button className="flex-1" onClick={next} disabled={index === cards.length - 1}>
          I knew this
        </Button>
        <Button variant="outline" className="flex-1" onClick={retry}>
          Revise again
        </Button>
      </div>
    </div>
  )
}

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Definition } from "@/hooks/useStudyKit"

type Props = {
  items?: Definition[]
}

export function DefinitionsAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!items || items.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-sm text-primary font-semibold tracking-wide uppercase">Definitions</p>
      <div className="space-y-2">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx
          return (
            <div
              key={item.term}
              className="rounded-xl border border-border/60 bg-card p-4 shadow-sm"
            >
              <button
                className="w-full text-left flex items-center justify-between gap-2"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <span className="font-medium text-foreground">{item.term}</span>
                <span className="text-sm text-muted-foreground">{isOpen ? "–" : "+"}</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-muted-foreground mt-3"
                  >
                    {item.meaning}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

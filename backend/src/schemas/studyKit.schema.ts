import { z } from "zod"

export const StudyKitSchema = z.object({
  summary: z.string(),
  keyTopics: z.array(z.string()),
  flashcards: z.array(
    z.object({
      question: z.string(),
      answer: z.string()
    })
  ),
  definitions: z.array(
    z.object({
      term: z.string(),
      meaning: z.string()
    })
  )
})

export type StudyKit = z.infer<typeof StudyKitSchema>

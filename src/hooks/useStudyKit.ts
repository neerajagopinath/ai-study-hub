import { useEffect, useState } from "react"

export type Flashcard = { question: string; answer: string }
export type Definition = { term: string; meaning: string }
export type StudyKit = {
  summary: string
  keyTopics: string[]
  flashcards: Flashcard[]
  definitions: Definition[]
}

type McpResponse = {
  status: "executed"
  result: {
    tool: "study_kit_generator"
    studyKit: StudyKit
  }
}

export function useStudyKit(documentId?: string) {
  const [data, setData] = useState<StudyKit | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!documentId) {
      setData(null)
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    const controller = new AbortController()

    async function fetchKit() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch("http://localhost:5000/mcp/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            intent: "study_kit_generator",
            payload: { documentId }
          }),
          signal: controller.signal
        })

        if (!res.ok) {
          throw new Error("Request failed")
        }

        const json: McpResponse = await res.json()
        if (!cancelled) {
          setData(json.result.studyKit)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError("Unable to load your study kit. Please try again.")
          setData(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchKit()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [documentId])

  return { data, loading, error }
}

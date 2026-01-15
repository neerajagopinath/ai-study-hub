import { useEffect, useState } from "react"

export type Flashcard = { question: string; answer: string }
export type Definition = { term: string; meaning: string }
export type StudyKit = {
  summary: string
  keyTopics: string[]
  flashcards: Flashcard[]
  definitions: Definition[]
}

export type StudyKitRequest = {
  documentId: string
  subject: string
  documentText: string
}

export function useStudyKitDirect() {
  const [data, setData] = useState<StudyKit | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateStudyKit = async (request: StudyKitRequest) => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await fetch("http://localhost:4000/api/tools/study-kit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to generate study kit")
      }

      const backendResponse: { source: string; data: StudyKit } = await response.json()
      console.log('Backend response:', backendResponse)
      const studyKit = backendResponse.data
      console.log('Extracted study kit:', studyKit)
      setData(studyKit)
      return studyKit
    } catch (err: any) {
      const errorMessage = err.message || "Failed to generate study kit. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setData(null)
    setError(null)
    setLoading(false)
  }

  return { data, loading, error, generateStudyKit, reset }
}

import { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToolUsage } from "@/hooks/useToolUsage"
import { useStudyKit } from "@/hooks/useStudyKit"
import { StudyHeader } from "@/components/study/StudyHeader"
import { SummaryCard } from "@/components/study/SummaryCard"
import { TopicsPills } from "@/components/study/TopicsPills"
import { FlashcardPlayer } from "@/components/study/FlashcardPlayer"
import { DefinitionsAccordion } from "@/components/study/DefinitionsAccordion"
import { StudySkeleton } from "@/components/study/StudySkeleton"
import { ErrorStateCard } from "@/components/study/ErrorStateCard"

const StudyKitTool = () => {
  const { trackToolUsage } = useToolUsage()
  const [documentId, setDocumentId] = useState("")
  const [submittedId, setSubmittedId] = useState<string | undefined>(undefined)
  const { data, loading, error } = useStudyKit(submittedId)

  useEffect(() => {
    trackToolUsage("/tools/study-kit")
  }, [trackToolUsage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextId = documentId.trim()
    if (!nextId) return
    setSubmittedId(nextId)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
          <StudyHeader />

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-border/60 bg-card p-4 shadow-sm flex flex-col gap-3 md:flex-row md:items-center"
          >
            <div className="flex-1">
              <label className="text-sm text-muted-foreground block mb-1">
                Document ID
              </label>
              <Input
                placeholder="Enter your uploaded document ID"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
              />
            </div>
            <Button type="submit" className="md:w-auto w-full">
              Load Study Kit
            </Button>
          </form>

          {loading && <StudySkeleton />}

          {!loading && error && (
            <ErrorStateCard
              message={error}
              onRetry={() => submittedId && setSubmittedId(submittedId)}
            />
          )}

          {!loading && !error && data && (
            <div className="space-y-8">
              <SummaryCard summary={data.summary} />
              <TopicsPills topics={data.keyTopics} />
              <FlashcardPlayer cards={data.flashcards} />
              <DefinitionsAccordion items={data.definitions} />
            </div>
          )}

          {!loading && !error && !data && (
            <div className="rounded-2xl border border-border/60 bg-card p-6 text-muted-foreground">
              Enter a document ID to generate your study kit via MCP.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default StudyKitTool

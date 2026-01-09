import { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { UploadPanel } from "@/components/tool/UploadPanel"
import { useToolUsage } from "@/hooks/useToolUsage"
import { useStudyKit } from "@/hooks/useStudyKit"
import { StudyHeader } from "@/components/study/StudyHeader"
import { SummaryCard } from "@/components/study/SummaryCard"
import { TopicsPills } from "@/components/study/TopicsPills"
import { FlashcardPlayer } from "@/components/study/FlashcardPlayer"
import { DefinitionsAccordion } from "@/components/study/DefinitionsAccordion"
import { StudySkeleton } from "@/components/study/StudySkeleton"
import { ErrorStateCard } from "@/components/study/ErrorStateCard"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const StudyKitTool = () => {
  const { trackToolUsage } = useToolUsage()

  const [file, setFile] = useState<File | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [documentId, setDocumentId] = useState<string | undefined>(undefined)

  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState("")

  const { data, loading, error } = useStudyKit(documentId)

  useEffect(() => {
    trackToolUsage("/tools/study-kit")
  }, [trackToolUsage])

  /* --------------------------------------------------------
     Progress bar animation (0 → 100%)
     -------------------------------------------------------- */
  useEffect(() => {
    if (uploading || loading) {
      setProgress(0)
      setProgressLabel("Uploading document…")

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 40) {
            setProgressLabel("Uploading document…")
            return prev + 2
          }
          if (prev < 70) {
            setProgressLabel("Analyzing PDF content…")
            return prev + 1.5
          }
          if (prev < 95) {
            setProgressLabel("Generating study kit…")
            return prev + 0.8
          }
          return prev
        })
      }, 120)

      return () => clearInterval(interval)
    }

    if (!uploading && !loading && documentId) {
      setProgress(100)
      setProgressLabel("Completed")
    }
  }, [uploading, loading, documentId])

  /* --------------------------------------------------------
     Upload logic (only after confirmation)
     -------------------------------------------------------- */
  const handleConfirmedUpload = async () => {
    if (!file) return

    setShowConfirm(false)
    setUploading(true)
    setUploadError(null)
    setDocumentId(undefined)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(
        "http://localhost:4000/api/upload/document",
        {
          method: "POST",
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const result = await response.json()
      setDocumentId(result.documentId)
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file.")
      setFile(null)
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (selectedFile: File | null) => {
    setUploadError(null)
    setDocumentId(undefined)

    if (!selectedFile) {
      setFile(null)
      setShowConfirm(false)
      return
    }

    if (selectedFile.type !== "application/pdf") {
      setUploadError("Please upload a PDF file only.")
      return
    }

    setFile(selectedFile)
    setShowConfirm(true)
  }

  const isProcessing = uploading || loading
  const hasError = uploadError || error

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
          <StudyHeader />

          {/* Upload Card */}
          <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
            <UploadPanel
              title="Upload Your PDF Document"
              description="Upload your study material PDF to generate a comprehensive study kit"
              acceptedTypes={["PDF"]}
              onFileSelect={handleFileSelect}
              useGlobalFile={false}
            />

            {/* Confirmation Panel */}
            {showConfirm && file && (
              <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
                <p className="text-sm font-medium">
                  Ready to upload this document?
                </p>
                <p className="text-xs text-muted-foreground">
                  {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFile(null)
                      setShowConfirm(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleConfirmedUpload}>
                    Yes, upload
                  </Button>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-xs text-muted-foreground">
                  {progressLabel} ({Math.round(progress)}%)
                </p>
              </div>
            )}

            {/* Upload Error */}
            {uploadError && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {uploadError}
              </div>
            )}
          </div>

          {/* Loading Skeleton */}
          {isProcessing && <StudySkeleton />}

          {/* Error State */}
          {!isProcessing && hasError && (
            <ErrorStateCard
              message={uploadError || error || "Something went wrong"}
              onRetry={() => {
                if (file) handleConfirmedUpload()
              }}
            />
          )}

          {/* Study Kit Content */}
          {!isProcessing && !hasError && data && (
            <div className="space-y-8">
              <SummaryCard summary={data.summary} />
              <TopicsPills topics={data.keyTopics} />
              <FlashcardPlayer cards={data.flashcards} />
              <DefinitionsAccordion items={data.definitions} />
            </div>
          )}

          {/* Empty State */}
          {!isProcessing && !hasError && !data && !file && (
            <div className="rounded-2xl border border-border/60 bg-card p-6 text-center text-muted-foreground">
              Upload a PDF document to generate your AI-powered study kit.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default StudyKitTool

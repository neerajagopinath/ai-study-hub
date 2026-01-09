import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ToolLayout } from "@/components/tool/ToolLayout"
import { UploadPanel } from "@/components/tool/UploadPanel"
import { OptionsPanel, ToolOption } from "@/components/tool/OptionsPanel"
import { OutputPanel, OutputTab } from "@/components/tool/OutputPanel"
import {
  AIQualityControls,
  QualitySettings,
} from "@/components/tool/AIQualityControls"
import { useToolUsage } from "@/hooks/useToolUsage"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const options: ToolOption[] = [
  {
    id: "mode",
    label: "Presentation Mode",
    type: "select",
    options: [
      { value: "seminar", label: "Seminar Presentation" },
      { value: "viva", label: "Viva Voce" },
      { value: "defense", label: "Project Defense" },
    ],
  },
  {
    id: "noteStyle",
    label: "Notes Style",
    type: "select",
    options: [
      { value: "brief", label: "Brief Bullet Points" },
      { value: "detailed", label: "Detailed Scripts" },
      { value: "conversational", label: "Conversational" },
    ],
  },
  {
    id: "includeViva",
    label: "Generate Viva Questions",
    type: "toggle",
    defaultValue: true,
  },
  {
    id: "timingGuide",
    label: "Include Timing Guide",
    type: "toggle",
    defaultValue: false,
  },
]

const SpeakerNotesTool = () => {
  const { trackToolUsage } = useToolUsage()

  const [file, setFile] = useState<File | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [documentId, setDocumentId] = useState<string | null>(null)

  const [optionValues, setOptionValues] = useState<Record<string, any>>({
    mode: "seminar",
    noteStyle: "detailed",
    includeViva: true,
    timingGuide: false,
  })

  const [qualitySettings, setQualitySettings] = useState<QualitySettings>({
    outputLength: "medium",
    tone: "exam",
    bulletPoints: true,
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState("")

  const [outputs, setOutputs] = useState<OutputTab[]>([
    { id: "notes", label: "Speaker Notes", content: "" },
    { id: "viva", label: "Viva Questions", content: "" },
    { id: "tips", label: "Presentation Tips", content: "" },
  ])

  useEffect(() => {
    trackToolUsage("/tools/speaker-notes")
  }, [trackToolUsage])

  /* --------------------------------------------------------
     Progress animation
     -------------------------------------------------------- */
  useEffect(() => {
    if (!isGenerating) return

    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) {
          setProgressLabel("Uploading presentation…")
          return prev + 2
        }
        if (prev < 70) {
          setProgressLabel("Analyzing slides…")
          return prev + 1.5
        }
        if (prev < 95) {
          setProgressLabel("Generating speaker notes…")
          return prev + 1
        }
        return prev
      })
    }, 120)

    return () => clearInterval(interval)
  }, [isGenerating])

  /* --------------------------------------------------------
     Upload PPT to backend (4000)
     -------------------------------------------------------- */
  const handleConfirmedUpload = async () => {
    if (!file) return

    setShowConfirm(false)
    setIsGenerating(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("http://localhost:4000/api/upload/document", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      setDocumentId(data.documentId)
    } catch (err) {
      console.error(err)
      setIsGenerating(false)
    }
  }

  /* --------------------------------------------------------
     Generate via MCP (5000)
     -------------------------------------------------------- */
  const handleGenerate = async () => {
    if (!documentId) return

    setIsGenerating(true)

    const res = await fetch("http://localhost:5000/mcp/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "speaker_notes_generator",
        payload: {
          documentId,
          options: optionValues,
          qualitySettings,
        },
      }),
    })

    const json = await res.json()
    const result = json.result

    setOutputs([
      { id: "notes", label: "Speaker Notes", content: result.notes },
      { id: "viva", label: "Viva Questions", content: result.viva },
      { id: "tips", label: "Presentation Tips", content: result.tips },
    ])

    setProgress(100)
    setProgressLabel("Completed")
    setIsGenerating(false)
  }

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile)
    setShowConfirm(!!selectedFile)
    setDocumentId(null)
  }

  const handleClear = () => {
    setOutputs([
      { id: "notes", label: "Speaker Notes", content: "" },
      { id: "viva", label: "Viva Questions", content: "" },
      { id: "tips", label: "Presentation Tips", content: "" },
    ])
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <ToolLayout
        title="Speaker Notes & Viva Prep"
        description="Convert your presentations into detailed speaker notes with AI-generated viva questions."
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      >
        <UploadPanel
          title="Upload Presentation"
          description="Upload your PPT or PPTX file"
          acceptedTypes={["PPT", "PPTX"]}
          onFileSelect={handleFileSelect}
        />

        {showConfirm && file && (
          <div className="rounded-lg border p-4 bg-muted/40 space-y-3">
            <p className="text-sm font-medium">
              Upload <b>{file.name}</b>?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleConfirmedUpload}>
                Yes, upload
              </Button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground">
              {progressLabel} ({Math.round(progress)}%)
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <OptionsPanel
            title="Customize Output"
            options={options}
            values={optionValues}
            onChange={(id, value) =>
              setOptionValues((p) => ({ ...p, [id]: value }))
            }
          />
          <AIQualityControls
            settings={qualitySettings}
            onChange={setQualitySettings}
          />
        </div>

        <OutputPanel
          tabs={outputs}
          isLoading={isGenerating}
          onClear={handleClear}
        />
      </ToolLayout>

      <Footer />
    </div>
  )
}

export default SpeakerNotesTool

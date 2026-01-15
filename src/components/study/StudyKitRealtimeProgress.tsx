import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Circle, Loader2 } from "lucide-react"

interface ProgressStage {
  id: string
  name: string
  description: string
  duration: number // estimated duration in seconds
}

interface StudyKitRealtimeProgressProps {
  progress: number
  stage: string
  isActive: boolean
  error?: string
}

// Backend pipeline stages with realistic timing
const PIPELINE_STAGES: ProgressStage[] = [
  {
    id: "parsing",
    name: "Document Parsing",
    description: "Extracting text and metadata from your document",
    duration: 5
  },
  {
    id: "analyzing", 
    name: "Content Analysis",
    description: "Identifying key topics and concepts",
    duration: 15
  },
  {
    id: "generating_answers",
    name: "Answer Generation", 
    description: "Creating structured exam answers (2m, 5m, 10m)",
    duration: 45
  },
  {
    id: "generating_flashcards",
    name: "Flashcard Creation",
    description: "Generating interactive study flashcards",
    duration: 30
  },
  {
    id: "generating_definitions",
    name: "Definition Extraction",
    description: "Extracting key terms and definitions",
    duration: 25
  },
  {
    id: "quality_check",
    name: "Quality Validation",
    description: "Validating content quality and completeness",
    duration: 10
  },
  {
    id: "finalizing",
    name: "Finalizing Study Kit",
    description: "Compiling your complete study kit",
    duration: 5
  }
]

export function StudyKitRealtimeProgress({ 
  progress, 
  stage, 
  isActive, 
  error 
}: StudyKitRealtimeProgressProps) {
  const currentStageIndex = PIPELINE_STAGES.findIndex(s => stage.toLowerCase().includes(s.id))
  const currentStage = currentStageIndex >= 0 ? PIPELINE_STAGES[currentStageIndex] : null

  const getStageStatus = (stageIndex: number) => {
    if (error) return "error"
    if (!isActive) return "pending"
    if (stageIndex < currentStageIndex) return "completed"
    if (stageIndex === currentStageIndex) return "active"
    return "pending"
  }

  const getStageIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "active":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case "error":
        return <Circle className="h-4 w-4 text-red-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-300" />
    }
  }

  const totalDuration = PIPELINE_STAGES.reduce((sum, stage) => sum + stage.duration, 0)
  const estimatedProgress = isActive ? Math.min((currentStageIndex * 100) / PIPELINE_STAGES.length + (progress % 100) / PIPELINE_STAGES.length, 95) : 0

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        {/* Main Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Study Kit Generation</span>
            <span className="text-muted-foreground">
              {isActive ? `${Math.round(Math.max(progress, estimatedProgress))}%` : '0%'}
            </span>
          </div>
          <Progress 
            value={isActive ? Math.max(progress, estimatedProgress) : 0} 
            className="h-2"
          />
          {currentStage && (
            <p className="text-sm text-muted-foreground">
              {currentStage.description}
            </p>
          )}
        </div>

        {/* Stage Timeline */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Pipeline Stages</h3>
          <div className="space-y-2">
            {PIPELINE_STAGES.map((pipelineStage, index) => {
              const status = getStageStatus(index)
              return (
                <div 
                  key={pipelineStage.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    status === 'active' 
                      ? 'border-blue-200 bg-blue-50' 
                      : status === 'completed'
                      ? 'border-green-200 bg-green-50'
                      : status === 'error'
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getStageIcon(status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        status === 'active' 
                          ? 'text-blue-700' 
                          : status === 'completed'
                          ? 'text-green-700'
                          : status === 'error'
                          ? 'text-red-700'
                          : 'text-gray-500'
                      }`}>
                        {pipelineStage.name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        ~{pipelineStage.duration}s
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pipelineStage.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 rounded-lg border border-red-200 bg-red-50">
            <div className="flex items-center gap-2 text-red-700">
              <Circle className="h-4 w-4" />
              <span className="text-sm font-medium">Error occurred</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* Estimated Time */}
        {isActive && !error && currentStage && (
          <div className="text-center text-sm text-muted-foreground">
            Estimated total time: ~{totalDuration} seconds • Current: {currentStage.name}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

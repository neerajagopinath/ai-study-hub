import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

interface StudyKitProgressProps {
  progress: number
  stage: string
  isActive: boolean
}

const PROGRESS_STAGES = [
  { min: 0, max: 15, label: "Parsing document content..." },
  { min: 15, max: 30, label: "Analyzing topics and concepts..." },
  { min: 30, max: 50, label: "Generating exam answers..." },
  { min: 50, max: 75, label: "Creating flashcards..." },
  { min: 75, max: 90, label: "Extracting definitions..." },
  { min: 90, max: 100, label: "Finalizing study kit..." },
]

export function StudyKitProgress({ progress, stage, isActive }: StudyKitProgressProps) {
  const currentStage = PROGRESS_STAGES.find(s => progress >= s.min && progress <= s.max) || PROGRESS_STAGES[0]
  const displayStage = stage || currentStage.label

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Loader2 className={`h-4 w-4 ${isActive ? 'animate-spin' : ''}`} />
        <span className="text-sm font-medium text-foreground">
          {displayStage}
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="relative">
        <Progress 
          value={progress} 
          className="h-2 transition-all duration-300 ease-out"
        />
        <div 
          className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        {PROGRESS_STAGES.map((stage, index) => (
          <div 
            key={index}
            className={`transition-colors duration-300 ${
              progress >= stage.min ? 'text-foreground' : 'text-muted-foreground/50'
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  )
}

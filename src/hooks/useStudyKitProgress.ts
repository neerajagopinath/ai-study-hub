import { useState, useCallback, useEffect } from 'react'

interface ProgressUpdate {
  stage: string
  progress: number
  message?: string
}

interface StudyKitProgressState {
  progress: number
  stage: string
  message: string
  isActive: boolean
  error: string | null
}

const BACKEND_STAGES = [
  { id: 'parsing', name: 'Document Parsing', progress: 10 },
  { id: 'analyzing', name: 'Content Analysis', progress: 25 },
  { id: 'generating_answers', name: 'Answer Generation', progress: 50 },
  { id: 'generating_flashcards', name: 'Flashcard Creation', progress: 70 },
  { id: 'generating_definitions', name: 'Definition Extraction', progress: 85 },
  { id: 'quality_check', name: 'Quality Validation', progress: 95 },
  { id: 'finalizing', name: 'Finalizing Study Kit', progress: 100 }
]

export function useStudyKitProgress() {
  const [progressState, setProgressState] = useState<StudyKitProgressState>({
    progress: 0,
    stage: '',
    message: '',
    isActive: false,
    error: null
  })

  const startProgress = useCallback(() => {
    setProgressState({
      progress: 0,
      stage: 'parsing',
      message: 'Starting document parsing...',
      isActive: true,
      error: null
    })
  }, [])

  const updateProgress = useCallback((update: ProgressUpdate) => {
    setProgressState(prev => ({
      ...prev,
      progress: update.progress,
      stage: update.stage,
      message: update.message || prev.message
    }))
  }, [])

  const simulateProgress = useCallback(async () => {
    startProgress()

    // Simulate backend pipeline progress
    for (let i = 0; i < BACKEND_STAGES.length; i++) {
      const stage = BACKEND_STAGES[i]
      
      // Update to current stage
      updateProgress({
        stage: stage.id,
        progress: stage.progress,
        message: `Processing ${stage.name.toLowerCase()}...`
      })

      // Wait for realistic duration (shortened for demo)
      const duration = i === 2 ? 3000 : i === 3 ? 2000 : 1500 // Longer for answer generation
      await new Promise(resolve => setTimeout(resolve, duration))
    }

    // Complete
    updateProgress({
      stage: 'completed',
      progress: 100,
      message: 'Study kit generation completed!'
    })
  }, [startProgress, updateProgress])

  const completeProgress = useCallback(() => {
    setProgressState(prev => ({
      ...prev,
      progress: 100,
      stage: 'completed',
      message: 'Study kit generation completed!',
      isActive: false
    }))
  }, [])

  const errorProgress = useCallback((error: string) => {
    setProgressState(prev => ({
      ...prev,
      error,
      isActive: false
    }))
  }, [])

  const resetProgress = useCallback(() => {
    setProgressState({
      progress: 0,
      stage: '',
      message: '',
      isActive: false,
      error: null
    })
  }, [])

  return {
    ...progressState,
    startProgress,
    updateProgress,
    simulateProgress,
    completeProgress,
    errorProgress,
    resetProgress
  }
}

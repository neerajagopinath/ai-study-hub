import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  FileText, 
  Layers, 
  CheckCircle, 
  Clock,
  Download,
  Share2,
  Bookmark,
  Settings
} from "lucide-react"
import type { StudyKit } from "@/hooks/useStudyKitDirect"
import { StructuredSummary } from "./StructuredSummary"

interface StudyKitDisplayProps {
  studyKit: StudyKit
  onExport?: () => void
  onShare?: () => void
  onBookmark?: () => void
}

export function StudyKitDisplay({ studyKit, onExport, onShare, onBookmark }: StudyKitDisplayProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Add null checks and safe defaults
  if (!studyKit) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No study kit data available</p>
      </div>
    )
  }

  const safeStudyKit = {
    keyTopics: studyKit.keyTopics || [],
    flashcards: studyKit.flashcards || [],
    definitions: studyKit.definitions || [],
    summary: studyKit.summary || "No summary available"
  }

  const exportToPDF = () => {
    // Create PDF content
    const content = `
STUDY KIT - ${safeStudyKit.keyTopics.join(", ")}

SUMMARY:
${safeStudyKit.summary}

KEY TOPICS:
${safeStudyKit.keyTopics.map((topic, i) => `${i + 1}. ${topic}`).join('\n')}

FLASHCARDS:
${safeStudyKit.flashcards.map((card, i) => `
${i + 1}. Q: ${card.question}
   A: ${card.answer}
`).join('\n')}

DEFINITIONS:
${safeStudyKit.definitions.map((def, i) => `
${i + 1}. ${def.term}: ${def.meaning}
`).join('\n')}
    `
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'study-kit.txt'
    a.click()
    URL.revokeObjectURL(url)
    
    onExport?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Your AI Study Kit
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onBookmark}>
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={exportToPDF}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <p className="text-2xl font-bold text-primary">{safeStudyKit.keyTopics.length}</p>
              <p className="text-sm text-muted-foreground">Topics</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-600">{safeStudyKit.flashcards.length}</p>
              <p className="text-sm text-muted-foreground">Flashcards</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-blue-600">{safeStudyKit.definitions.length}</p>
              <p className="text-sm text-muted-foreground">Definitions</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(safeStudyKit.summary.length / 10)}%
              </p>
              <p className="text-sm text-muted-foreground">Coverage</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Flashcards
          </TabsTrigger>
          <TabsTrigger value="definitions" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Definitions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Topics Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Key Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {safeStudyKit.keyTopics.map((topic, index) => (
                    <Badge key={topic} variant="secondary" className="text-sm">
                      {index + 1}. {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Study Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Content</span>
                  <Badge variant="outline">
                    {safeStudyKit.keyTopics.length + safeStudyKit.flashcards.length + safeStudyKit.definitions.length} items
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Study Time</span>
                  <Badge variant="outline">
                    ~{Math.ceil((safeStudyKit.keyTopics.length * 5) / 60)} min
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Difficulty</span>
                  <Badge variant="outline">
                    Intermediate
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Study Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Study Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-blue-500 mt-1" />
                <div>
                  <p className="font-medium">Start with topics</p>
                  <p className="text-sm text-muted-foreground">
                    Review key topics first to build foundation
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                <div>
                  <p className="font-medium">Practice with flashcards</p>
                  <p className="text-sm text-muted-foreground">
                    Test yourself regularly for better retention
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Settings className="h-4 w-4 text-purple-500 mt-1" />
                <div>
                  <p className="font-medium">Review definitions</p>
                  <p className="text-sm text-muted-foreground">
                    Understand key terminology and concepts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <StructuredSummary summary={safeStudyKit.summary} />
          
          {/* Summary Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Copy Summary
                </Button>
                <Button variant="outline" size="sm">
                  Mark as Revised
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flashcards" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Interactive Flashcards</CardTitle>
                <Badge variant="outline">
                  {safeStudyKit.flashcards.length} cards
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {safeStudyKit.flashcards.map((card, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-3">
                      <div className="text-center">
                        <Badge variant="secondary" className="mb-2">
                          Card {index + 1}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-primary/80 uppercase tracking-wide">Question</p>
                          <p className="text-sm">{card.question}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Answer</p>
                          <p className="text-sm">{card.answer}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="definitions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Key Definitions</CardTitle>
                <Badge variant="outline">
                  {safeStudyKit.definitions.length} terms
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {safeStudyKit.definitions.map((def, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <h3 className="font-semibold text-lg">{def.term}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {def.meaning}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

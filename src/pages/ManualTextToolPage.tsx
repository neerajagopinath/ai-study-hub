import { useState } from "react"
import { ManualTextTool } from "@/components/study/ManualTextTool"
import { StudyKitUploader } from "@/components/study/StudyKitUploader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ManualTextToolPage() {
  const [extractedData, setExtractedData] = useState<{
    text: string
    filename: string
  } | null>(null)
  const navigate = useNavigate()

  const handleTextReady = (text: string, filename: string) => {
    setExtractedData({ text, filename })
  }

  const handleBack = () => {
    setExtractedData(null)
  }

  if (extractedData) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Text Ready for Study Kit
              </CardTitle>
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Try Different Text
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Source:</h3>
                <p className="font-medium">{extractedData.filename}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Text Length:</h3>
                <p className="font-medium">{extractedData.text.length} characters</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Preview:</h3>
                <div className="bg-muted p-4 rounded-lg max-h-60 overflow-y-auto">
                  <p className="text-sm leading-relaxed">{extractedData.text}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Kit Generation */}
        <StudyKitUploader 
          onStudyKitGenerated={(data) => {
            console.log("Study kit generated:", data)
          }}
          preloadedData={{
            documentId: `manual_${Date.now()}`,
            subject: "Manual Upload",
            documentText: extractedData.text
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ManualTextTool onTextReady={handleTextReady} />
    </div>
  )
}

import { useState } from "react"
import { SimpleDocumentParser } from "@/components/study/SimpleDocumentParser"
import { StudyKitUploader } from "@/components/study/StudyKitUploader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function DocumentParserToolPage() {
  const [extractedData, setExtractedData] = useState<{
    text: string
    filename: string
  } | null>(null)
  const navigate = useNavigate()

  const handleTextExtracted = (text: string, filename: string) => {
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
                Text Extracted Successfully
              </CardTitle>
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Extract Another
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">File:</h3>
                <p className="font-medium">{extractedData.filename}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Text Length:</h3>
                <p className="font-medium">{extractedData.text.length} characters</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Preview:</h3>
                <div className="bg-muted p-4 rounded-lg max-h-40 overflow-y-auto font-mono text-sm">
                  <p>{extractedData.text.substring(0, 1000)}...</p>
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
      <SimpleDocumentParser onTextExtracted={handleTextExtracted} />
    </div>
  )
}

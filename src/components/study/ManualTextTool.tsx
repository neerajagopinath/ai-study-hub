import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileText, Check, AlertCircle, Copy, Upload, Edit } from "lucide-react"

interface ManualTextToolProps {
  onTextReady: (text: string, filename: string) => void
}

export function ManualTextTool({ onTextReady }: ManualTextToolProps) {
  const [text, setText] = useState("")
  const [filename, setFilename] = useState("")

  const handleUseText = () => {
    if (text.trim().length > 50) {
      onTextReady(text, filename || "manual-input")
    }
  }

  const handlePasteText = () => {
    navigator.clipboard.readText().then((pastedText) => {
      if (pastedText) {
        setText(pastedText)
      }
    }).catch(err => {
      console.error('Failed to read clipboard:', err)
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const extractedText = await file.text()
      setText(extractedText)
      setFilename(file.name)
    } catch (error) {
      console.error('File read failed:', error)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="h-5 w-5" />
          Manual Text Input Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-2">🔧 Bypass All PDF Parsing Issues!</h4>
          <ul className="list-disc list-inside space-y-2">
            <li>• <strong>Option 1:</strong> Copy text from your PDF viewer (Ctrl+A, Ctrl+C)</li>
            <li>• <strong>Option 2:</strong> Upload file and we'll try simple text extraction</li>
            <li>• <strong>Option 3:</strong> Paste text directly from clipboard</li>
            <li>• <strong>Option 4:</strong> Type or paste your study material manually</li>
            <li>• <strong>Goal:</strong> Get clean text into the study kit generator</li>
          </ul>
        </div>

        {/* File Upload Option */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">📄 Upload File (Simple Extraction)</Label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.pptx,.docx,text/*"
                onChange={handleFileUpload}
                className="flex-1 w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label>📋 Paste from Clipboard</Label>
              <Button
                variant="outline"
                onClick={handlePasteText}
                className="w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                Paste Text
              </Button>
            </div>
          </div>
        </div>

        {/* Manual Text Input */}
        <div className="space-y-4">
          <Label htmlFor="manual-text">✏️ Type or Paste Text Manually</Label>
          <Textarea
            id="manual-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your study material here, or type it manually..."
            className="min-h-[300px]"
          />
          <div className="text-xs text-muted-foreground mt-2">
            Characters: {text.length} | Words: {text.split(/\s+/).filter(w => w.length > 0).length}
          </div>
        </div>

        {/* Filename Input */}
        <div className="space-y-2">
          <Label htmlFor="filename">📝 Filename (Optional)</Label>
          <input
            id="filename"
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="e.g., Database-Notes.pdf"
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          <Button 
            onClick={handleUseText}
            disabled={text.trim().length < 50}
            className="flex-1"
          >
            <Check className="h-4 w-4 mr-2" />
            Use This Text for Study Kit
          </Button>
        </div>

        {/* Success Message */}
        {text.length > 50 && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            ✅ Ready for study kit generation! {text.length} characters extracted.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

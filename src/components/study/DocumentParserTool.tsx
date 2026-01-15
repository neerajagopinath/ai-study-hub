import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Check, AlertCircle } from "lucide-react"

interface DocumentParserToolProps {
  onTextExtracted: (text: string, filename: string) => void
}

export function DocumentParserTool({ onTextExtracted }: DocumentParserToolProps) {
  const [text, setText] = useState("")
  const [filename, setFilename] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setFilename(file.name)

    try {
      let extractedText = ""

      if (file.type === "application/pdf") {
        extractedText = await extractPDFText(file)
      } else if (file.type.includes("presentationml")) {
        extractedText = await extractPPTText(file)
      } else if (file.type.includes("wordprocessingml")) {
        extractedText = await extractDOCXText(file)
      } else if (file.type.startsWith("text/")) {
        extractedText = await file.text()
      } else {
        throw new Error(`Unsupported file type: ${file.type}`)
      }

      setText(extractedText)
    } catch (error) {
      setText(`Error: ${error instanceof Error ? error.message : "Failed to extract text"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const extractPDFText = async (file: File): Promise<string> => {
    try {
      // Import PDF.js with proper worker configuration
      const pdfjsLib = await import('pdfjs-dist')
      
      // Set worker source using CDN for better compatibility
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`

      const arrayBuffer = await file.arrayBuffer()
      
      // Load PDF document
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        disableFontFace: false, // Enable proper font rendering
        disableAutoFetch: false,
        disableStream: false
      })
      const pdf = await loadingTask.promise
      
      let fullText = ''
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        
        // Extract and clean text from each page
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .trim()
        
        if (pageText.length > 0) {
          fullText += pageText + '\n'
        }
      }
      
      // Clean up the PDF document
      await loadingTask.destroy()
      
      if (fullText.trim().length === 0) {
        throw new Error("No text could be extracted from PDF - it may contain scanned images")
      }
      
      return fullText.trim()
      
    } catch (error) {
      console.error('PDF extraction failed:', error)
      throw new Error("PDF text extraction failed - please ensure the PDF contains actual text (not scanned images)")
    }
  }

  const extractPPTText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer()
    const text = new TextDecoder("utf-8").decode(arrayBuffer)
    
    // Extract text from PPTX (it's a ZIP file with XML)
    const textRegex = /<a:t>(.*?)<\/a:t>/gs
    const matches = text.match(textRegex)
    
    if (matches) {
      return matches
        .map(match => match.replace(/<\/?a:t>/g, ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
    }
    
    throw new Error("Could not extract text from PowerPoint file.")
  }

  const extractDOCXText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer()
    const text = new TextDecoder("utf-8").decode(arrayBuffer)
    
    // Extract text from DOCX (it's a ZIP file with XML)
    const textRegex = /<w:t[^>]*>(.*?)<\/w:t>/gs
    const matches = text.match(textRegex)
    
    if (matches) {
      return matches
        .map(match => match.replace(/<\/?w:t[^>]*>/g, ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
    }
    
    throw new Error("Could not extract text from Word document.")
  }

  const handleUseText = () => {
    if (text.trim() && !text.startsWith("Error:")) {
      onTextExtracted(text, filename)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Text Extractor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload Document (PDF, PPTX, DOCX)</Label>
          <Input
            id="file-upload"
            type="file"
            accept=".pdf,.pptx,.docx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </div>

        {/* Extracted Text */}
        <div className="space-y-2">
          <Label>Extracted Text</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Text will appear here after file upload..."
            className="min-h-[300px]"
            disabled={isLoading}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={handleUseText}
            disabled={!text.trim() || text.startsWith("Error:") || isLoading}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Use This Text
          </Button>
          
          {text.startsWith("Error:") && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              Please try a different file
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Instructions:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Upload a PDF, PowerPoint, or Word document</li>
            <li>The tool will extract readable text content</li>
            <li>Review the extracted text for accuracy</li>
            <li>Click "Use This Text" to proceed with study kit generation</li>
            <li>For best results, use documents with actual text content (not scanned images)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

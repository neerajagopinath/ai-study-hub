import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Upload, FileText, X, Check, AlertCircle, Copy } from "lucide-react"
import { StudyKitRealtimeProgress } from "./StudyKitRealtimeProgress"
import { StudyKitDisplay } from "./StudyKitDisplay"
import { useStudyKitDirect, StudyKitRequest } from "@/hooks/useStudyKitDirect"
import { useStudyKitProgress } from "@/hooks/useStudyKitProgress"
import { generateDocumentId } from "@/lib/documentParser"

interface StudyKitUploaderProps {
  onStudyKitGenerated?: (data: any) => void
  preloadedData?: {
    documentId: string
    subject: string
    documentText: string
  }
}

interface ParsedData {
  text: string
  filename: string
  documentId: string
  subject: string
}

export function StudyKitUploader({ onStudyKitGenerated, preloadedData }: StudyKitUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [showStudyKitConfirm, setShowStudyKitConfirm] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  
  const { data, loading, error, generateStudyKit, reset } = useStudyKitDirect()
  const progress = useStudyKitProgress()

  const generateStudyKitFromPreloaded = async (preloaded: typeof preloadedData) => {
    progress.startProgress()
    
    try {
      progress.updateProgress({ stage: 'analyzing', progress: 25, message: 'Analyzing content...' })
      
      const request: StudyKitRequest = {
        documentId: preloaded.documentId,
        subject: preloaded.subject,
        documentText: preloaded.documentText
      }
      
      progress.updateProgress({ stage: 'generating_answers', progress: 50, message: 'Generating exam answers...' })
      const result = await generateStudyKit(request)
      
      progress.completeProgress()
      
      if (result && onStudyKitGenerated) {
        onStudyKitGenerated(result)
      }
    } catch (error) {
      console.error('Failed to generate study kit:', error)
      progress.errorProgress(error instanceof Error ? error.message : 'Failed to generate study kit')
    }
  }

  // Auto-generate study kit if preloaded data is provided
  useEffect(() => {
    if (preloadedData) {
      generateStudyKitFromPreloaded(preloadedData)
    }
  }, [preloadedData])

  // Robust PDF extraction function (same as SimpleDocumentParser)
  const extractPDFSimple = async (file: File): Promise<string> => {
    console.log('=== PDF EXTRACTION START ===')
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    })
    
    try {
      console.log('Starting PDF extraction for:', file.name)
      
      // Import PDF.js
      const pdfjsLib = await import('pdfjs-dist')
      console.log('PDF.js imported, version:', pdfjsLib.version)
      
      // Set worker source using local file to avoid CORS issues
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.js'
      console.log('Using local worker:', pdfjsLib.GlobalWorkerOptions.workerSrc)

      const arrayBuffer = await file.arrayBuffer()
      console.log('ArrayBuffer created, size:', arrayBuffer.byteLength)
      
      // Load PDF document with better error handling
      let pdf
      let loadingTask
      try {
        console.log('Loading PDF document...')
        loadingTask = pdfjsLib.getDocument({ 
          data: arrayBuffer,
          disableFontFace: false, // Enable proper font rendering
          disableAutoFetch: false,
          disableStream: false
        })
        
        pdf = await loadingTask.promise
        console.log('PDF loaded successfully, pages:', pdf.numPages)
      } catch (pdfError) {
        console.error('Failed to load PDF document:', pdfError)
        throw new Error(`PDF loading failed: ${pdfError.message}`)
      }
      
      let fullText = ''
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`Processing page ${pageNum}...`)
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        
        // Extract and clean text from each page
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .trim()
        
        console.log(`Page ${pageNum} extracted ${pageText.length} characters`)
        
        if (pageText.length > 0) {
          fullText += pageText + '\n'
        }
      }
      
      // Clean up the PDF document
      await loadingTask.destroy()
      
      if (fullText.trim().length === 0) {
        throw new Error("No text could be extracted from PDF - it may contain scanned images")
      }
      
      console.log('PDF extraction completed successfully, total text length:', fullText.length)
      return fullText.trim()
      
    } catch (error) {
      console.error('PDF extraction failed:', error)
      
      // Fallback: Try to extract using improved regex method
      try {
        console.log('Trying improved fallback regex method...')
        const text = await file.text()
        
        // Multiple extraction strategies
        let extractedText = ''
        
        // Strategy 1: Look for text between parentheses (most reliable)
        const parenMatches = text.match(/\(([^)]{5,200})\)/g)
        if (parenMatches && parenMatches.length > 3) {
          const parenText = parenMatches
            .map(match => match.slice(1, -1))
            .filter(t => {
              // Filter out binary artifacts and PDF commands
              const cleanText = t.trim()
              
              // Skip if it looks like PDF metadata/commands
              const isPdfCommand = 
                cleanText.includes('Type') ||
                cleanText.includes('Font') ||
                cleanText.includes('Parent') ||
                cleanText.includes('MediaBox') ||
                cleanText.includes('Contents') ||
                cleanText.includes('Resources') ||
                cleanText.includes('ProcSet') ||
                cleanText.includes('ExtGState') ||
                cleanText.includes('FontDescriptor') ||
                cleanText.includes('FontBBox') ||
                cleanText.includes('Flags') ||
                cleanText.includes('Length') ||
                cleanText.includes('Filter') ||
                cleanText.includes('FlateDecode') ||
                cleanText.includes('Producer') ||
                cleanText.includes('Creator') ||
                cleanText.includes('CreationDate') ||
                cleanText.includes('pdfmake') ||
                cleanText.includes('Image') ||
                cleanText.includes('Subtype') ||
                cleanText.includes('BaseFont') ||
                cleanText.includes('CIDSystemInfo') ||
                cleanText.includes('Registry') ||
                cleanText.includes('Ordering') ||
                cleanText.includes('Identity') ||
                cleanText.includes('Supplement') ||
                cleanText.includes('CIDToGIDMap') ||
                cleanText.includes('FontFile') ||
                cleanText.includes('CIDFontType') ||
                cleanText.includes('Ascent') ||
                cleanText.includes('Descent') ||
                cleanText.includes('CapHeight') ||
                cleanText.includes('XHeight') ||
                cleanText.includes('StemV') ||
                cleanText.includes('ItalicAngle')
              
              // Skip if it's just numbers or special characters
              const isJustNumbers = /^[0-9\s\.\-\+]+$/.test(cleanText)
              
              // Skip if it has control characters
              const hasControlChars = /[\x00-\x1F\x7F]/.test(cleanText)
              
              // Skip if it's all caps (likely PDF commands)
              const isAllCaps = /^[A-Z]{4,}$/.test(cleanText)
              
              // Skip if it's very short
              const isTooShort = cleanText.length < 5
              
              // Check if it contains lowercase letters (likely real text)
              const hasLowercase = /[a-z]/.test(cleanText)
              
              // Check if it looks like readable English (mix of letters and spaces)
              const looksLikeText = /[a-zA-Z]{3,}/.test(cleanText) && /\s/.test(cleanText)
              
              return !isPdfCommand && 
                     !isJustNumbers && 
                     !hasControlChars && 
                     !isAllCaps && 
                     !isTooShort && 
                     (hasLowercase || looksLikeText)
            })
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim()
          
          if (parenText.length > 20) {
            extractedText = parenText
          }
        }
        
        // Strategy 2: Look for readable English words
        if (extractedText.length < 50) {
          const words = text.match(/[a-zA-Z]{4,}/g)
          if (words && words.length > 10) {
            const readableWords = words
              .filter(word => {
                return !['obj', 'endobj', 'stream', 'endstream', 'R', 'G', 'BT', 'ET', 'Td', 'TJ', 'Tf', 'Type', 'Font', 'Parent', 'MediaBox', 'Contents', 'Resources', 'ProcSet', 'ExtGState', 'FontDescriptor', 'FontBBox', 'Flags', 'Length', 'Filter', 'FlateDecode', 'Producer', 'Creator', 'CreationDate', 'pdfmake', 'Image', 'Subtype', 'BaseFont', 'CIDSystemInfo', 'Registry', 'Ordering', 'Identity', 'Supplement', 'CIDToGIDMap', 'FontFile', 'CIDFontType', 'Ascent', 'Descent', 'CapHeight', 'XHeight', 'StemV', 'ItalicAngle', 'Robo', 'Regular', 'Italic'].includes(word) &&
                       !/^[A-Z]{1,2}$/.test(word) && // Filter out single letters
                       !/^[A-Z]{4,}$/.test(word) && // Filter out all caps (likely PDF commands)
                       /[a-z]/.test(word) && // Contains lowercase (likely real text)
                       word.length < 20 && // Reasonable word length
                       !/^[A-Z][a-z]+$/.test(word) || // Allow proper nouns but filter out most single words
                       word.length > 6 // Allow longer words that might be real content
              })
              .slice(0, 200) // Get more words
            
            extractedText = readableWords.join(' ')
          }
        }
        
        if (extractedText.length > 30) {
          console.log('Fallback method succeeded, text length:', extractedText.length)
          console.log('Sample fallback text:', extractedText.substring(0, 100))
          return extractedText
        }

        throw new Error("Could not extract readable text from this PDF. The file may be scanned images, password-protected, or severely corrupted.")
        
      } catch (fallbackError) {
        console.error('All extraction methods failed:', fallbackError)
        throw new Error("PDF text extraction failed - please ensure the PDF contains actual text (not scanned images) and try a different file.")
      }
    }
  }

  const extractPPTSimple = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const text = new TextDecoder("utf-8").decode(arrayBuffer)
      
      // Simple regex to extract text between <a:t> tags
      const matches = text.match(/<a:t>(.*?)<\/a:t>/gs)
      if (matches && matches.length > 0) {
        return matches
          .map(match => match.replace(/<\/?a:t>/g, ""))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim()
      }
      
      throw new Error("Could not extract text from PowerPoint file")
    } catch (error) {
      throw new Error("PowerPoint extraction failed")
    }
  }

  const extractDOCXSimple = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const text = new TextDecoder("utf-8").decode(arrayBuffer)
      
      // Simple regex to extract text between <w:t> tags
      const matches = text.match(/<w:t[^>]*>(.*?)<\/w:t>/gs)
      if (matches && matches.length > 0) {
        return matches
          .map(match => match.replace(/<\/?w:t[^>]*>/g, ""))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim()
      }
      
      throw new Error("Could not extract text from Word document")
    } catch (error) {
      throw new Error("Word document extraction failed")
    }
  }

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    console.log('File selected:', selectedFile.name, selectedFile.type, selectedFile.size)
    
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      alert("File size must be less than 10MB")
      return
    }
    
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    if (!validTypes.includes(selectedFile.type)) {
      alert(`Please upload a PDF, PowerPoint, or Word document. Current type: ${selectedFile.type}`)
      return
    }
    
    console.log('File validation passed, setting file and parsing')
    setFile(selectedFile)
    setShowConfirm(true)
    reset()
    
    // Parse the document immediately using the robust extraction logic
    setIsParsing(true)
    try {
      let extractedText = ""

      if (selectedFile.type === "application/pdf") {
        extractedText = await extractPDFSimple(selectedFile)
      } else if (selectedFile.type.includes("presentationml")) {
        extractedText = await extractPPTSimple(selectedFile)
      } else if (selectedFile.type.includes("wordprocessingml")) {
        extractedText = await extractDOCXSimple(selectedFile)
      } else {
        throw new Error(`Unsupported file type: ${selectedFile.type}`)
      }

      const documentId = generateDocumentId(selectedFile)
      
      setParsedData({
        text: extractedText,
        filename: selectedFile.name,
        documentId,
        subject: "General Study"
      })
      
      console.log('Document parsed successfully, text length:', extractedText.length)
    } catch (error) {
      console.error('Failed to parse document:', error)
      alert(`Failed to parse document: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsParsing(false)
    }
  }, [reset])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleProceedToStudyKit = () => {
    if (parsedData) {
      setShowStudyKitConfirm(true)
    }
  }

  const handleGenerateStudyKit = async () => {
    if (!parsedData) return
    
    progress.startProgress()
    setShowStudyKitConfirm(false)
    
    try {
      // Create request from parsed data
      progress.updateProgress({ stage: 'analyzing', progress: 25, message: 'Analyzing content...' })
      const request: StudyKitRequest = {
        documentId: parsedData.documentId,
        subject: parsedData.subject,
        documentText: parsedData.text
      }
      
      // Generate study kit
      progress.updateProgress({ stage: 'generating_answers', progress: 50, message: 'Generating exam answers...' })
      const result = await generateStudyKit(request)
      
      // Complete progress
      progress.completeProgress()
      
      // Notify parent
      if (result && onStudyKitGenerated) {
        onStudyKitGenerated(result)
      }
    } catch (error) {
      console.error('Failed to generate study kit:', error)
      progress.errorProgress(error instanceof Error ? error.message : 'Failed to generate study kit')
    }
  }

  const handleReset = () => {
    setFile(null)
    setShowConfirm(false)
    setParsedData(null)
    setShowStudyKitConfirm(false)
    progress.resetProgress()
    reset()
  }

  if (data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <span className="font-medium">Study Kit Generated Successfully!</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Generate Another
          </Button>
        </div>
        
        <StudyKitDisplay 
          studyKit={data}
          onExport={() => console.log('Export study kit')}
          onShare={() => console.log('Share study kit')}
          onBookmark={() => console.log('Bookmark study kit')}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <Upload className="h-12 w-12 mx-auto text-gray-400" />
              <div>
                <p className="text-lg font-medium">
                  Drop your document here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  PDF, PowerPoint, or Word files (max 10MB)
                </p>
              </div>
              <input
                type="file"
                accept=".pdf,.pptx,.docx"
                onChange={(e) => {
                  console.log('File input change event fired', e.target.files?.length)
                  if (e.target.files?.[0]) {
                    console.log('File selected from input:', e.target.files[0].name)
                    handleFileSelect(e.target.files[0])
                  }
                }}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button 
                  variant="outline" 
                  className="cursor-pointer"
                  onClick={() => {
                    console.log('Button clicked, triggering file input')
                    document.getElementById('file-upload')?.click()
                  }}
                >
                  Select File
                </Button>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Confirmation */}
      {showConfirm && file && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProceedToStudyKit}
                  disabled={!parsedData || isParsing}
                  className="flex-1"
                >
                  {isParsing ? 'Parsing...' : 'Generate Study Kit'}
                </Button>
              </div>
              
              {/* Parsed Text Preview */}
              {parsedData && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Extracted Text Preview:</Label>
                    <div className="text-xs text-muted-foreground">
                      {parsedData.text.length} characters
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg max-h-32 overflow-y-auto">
                    <p className="text-sm font-mono">{parsedData.text.substring(0, 500)}...</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(parsedData.text)}
                      className="flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      Copy Text
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Study Kit Generation Confirmation */}
      {showStudyKitConfirm && parsedData && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">Confirm Study Kit Generation</h3>
              </div>
              
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Document:</strong> {parsedData.filename}</p>
                <p><strong>Extracted Text Length:</strong> {parsedData.text.length} characters</p>
                <p><strong>Subject:</strong> {parsedData.subject}</p>
              </div>
              
              <div className="bg-blue-100 p-3 rounded-lg">
                <p className="text-sm text-blue-900">
                  Do you want to proceed with generating a study kit from the extracted text? 
                  This will analyze the content and create exam-ready materials.
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowStudyKitConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateStudyKit}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Generating...' : 'Generate Study Kit'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress */}
      {progress.isActive && (
        <Card>
          <CardContent className="p-6">
            <StudyKitRealtimeProgress 
              progress={progress.progress}
              stage={progress.stage}
              isActive={progress.isActive}
              error={progress.error}
            />
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {progress.error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="space-y-3">
              <p className="text-red-800 font-medium">Error: {progress.error}</p>
              <Button variant="outline" onClick={handleReset}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

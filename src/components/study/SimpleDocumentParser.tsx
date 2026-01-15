import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Check, AlertCircle, Copy } from "lucide-react"

interface SimpleDocumentParserProps {
  onTextExtracted: (text: string, filename: string) => void
}

export function SimpleDocumentParser({ onTextExtracted }: SimpleDocumentParserProps) {
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

      console.log('Processing file:', file.name, file.type, file.size)

      // Simple, reliable extraction methods
      if (file.type === "application/pdf") {
        extractedText = await extractPDFSimple(file)
      } else if (file.type.includes("presentationml")) {
        extractedText = await extractPPTSimple(file)
      } else if (file.type.includes("wordprocessingml")) {
        extractedText = await extractDOCXSimple(file)
      } else if (file.type.startsWith("text/")) {
        extractedText = await file.text()
      } else {
        throw new Error(`Unsupported file type: ${file.type}`)
      }

      console.log('Extracted text length:', extractedText.length)
      console.log('Sample text:', extractedText.substring(0, 300))

      setText(extractedText)
    } catch (error) {
      console.error('Extraction error:', error)
      setText(`Error: ${error instanceof Error ? error.message : "Failed to extract text"}`)
    } finally {
      setIsLoading(false)
    }
  }

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
      console.error('Error type:', typeof error)
      console.error('Error constructor:', error?.constructor?.name)
      console.error('Error message:', error?.message || 'No message')
      console.error('Error name:', error?.name || 'No name')
      console.error('Error stringified:', JSON.stringify(error, null, 2))
      console.error('Error keys:', error ? Object.keys(error) : 'No error object')
      
      if (error?.stack) {
        console.error('Error stack:', error.stack)
      }
      
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
        
        // Strategy 3: Look for sentences and paragraphs (text between BT/ET operators)
        if (extractedText.length < 50) {
          const textBlocks = text.match(/BT\s*([^]*?)\s*ET/g)
          if (textBlocks && textBlocks.length > 0) {
            const blockText = textBlocks
              .map(block => block.replace(/BT\s*/, '').replace(/\s*ET$/, ''))
              .map(block => {
                // Extract text from parentheses within text blocks
                const matches = block.match(/\(([^)]+)\)/g)
                if (matches) {
                  return matches.map(m => m.slice(1, -1)).join(' ')
                }
                return ''
              })
              .filter(text => text.length > 10)
              .filter(text => !text.includes('Type') && !text.includes('Font'))
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim()
            
            if (blockText.length > 30) {
              extractedText = blockText
            }
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

  const handleUseText = () => {
    if (text.trim() && !text.startsWith("Error:")) {
      onTextExtracted(text, filename)
    }
  }

  const handleCopyText = () => {
    navigator.clipboard.writeText(text)
    alert('Text copied to clipboard!')
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Simple Document Text Extractor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload Document</Label>
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
          <div className="flex items-center justify-between">
            <Label>Extracted Text</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyText}
              disabled={!text.trim() || text.startsWith("Error:")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Text will appear here after file upload..."
            className="min-h-[300px] font-mono text-sm"
            disabled={isLoading}
          />
          <div className="text-xs text-muted-foreground">
            Characters: {text.length} | Words: {text.split(/\s+/).filter(w => w.length > 0).length}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={handleUseText}
            disabled={!text.trim() || text.startsWith("Error:") || isLoading}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Use This Text for Study Kit
          </Button>
          
          {text.startsWith("Error:") && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              Try a different file
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Simple & Reliable Extraction:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>• Upload PDF, PPTX, or DOCX files</li>
            <li>• Uses multiple extraction methods for reliability</li>
            <li>• Filters out PDF binary artifacts automatically</li>
            <li>• Shows character/word count for verification</li>
            <li>• Copy text to clipboard for easy pasting</li>
            <li>• Works with text-based documents (not scanned images)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

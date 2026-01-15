import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker with jsdelivr CDN (better CORS support)
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`
}

export interface ParsedDocument {
  text: string
  metadata: {
    title?: string
    author?: string
    subject?: string
    creator?: string
    producer?: string
    creationDate?: string
    modificationDate?: string
  }
}

export async function parsePDF(file: File): Promise<ParsedDocument> {
  const arrayBuffer = await file.arrayBuffer()
  
  try {
    console.log('Loading PDF with PDF.js...')
    // Load PDF
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
    const numPages = pdf.numPages
    console.log(`PDF loaded successfully with ${numPages} pages`)
    
    let fullText = ''
    const metadata: ParsedDocument['metadata'] = {}
    
    // Extract metadata
    try {
      const pdfMetadata = await pdf.getMetadata()
      const info = pdfMetadata.info as any
      metadata.title = info?.Title
      metadata.author = info?.Author
      metadata.subject = info?.Subject
      metadata.creator = info?.Creator
      metadata.producer = info?.Producer
      metadata.creationDate = info?.CreationDate
      metadata.modificationDate = info?.ModDate
      console.log('PDF metadata extracted:', metadata)
    } catch (error) {
      console.warn('Failed to extract PDF metadata:', error)
    }
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        
        if (pageText.trim().length > 0) {
          fullText += pageText + '\n'
          console.log(`Page ${pageNum}: extracted ${pageText.length} characters`)
        }
      } catch (error) {
        console.warn(`Failed to extract text from page ${pageNum}:`, error)
      }
    }
    
    console.log(`Total extracted text length: ${fullText.length}`)
    
    if (fullText.trim().length === 0) {
      throw new Error('No text could be extracted from PDF - may be scanned images')
    }
    
    return {
      text: fullText.trim(),
      metadata
    }
  } catch (error) {
    console.warn('PDF.js worker failed, trying alternative extraction:', error)
    
    // Fallback 1: Try to read as text and filter out PDF binary artifacts
    try {
      const text = await file.text()
      console.log('Raw text length:', text.length)
      
      // Filter out PDF binary artifacts and extract readable content
      const cleanText = text
        .replace(/\/[A-Za-z]+\s+/g, '') // Remove PDF commands like /MediaBox
        .replace(/\[.*?\]/g, '') // Remove PDF arrays
        .replace(/<.*?>/g, '') // Remove PDF tags
        .replace(/\d+\s+\d+\s+\d+\s+\d+/g, '') // Remove coordinate numbers
        .replace(/[^\w\s\.\,\;\:\!\?\-\n\r]/g, ' ') // Keep only readable characters
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()
      
      console.log('Cleaned text length:', cleanText.length)
      console.log('Sample cleaned text:', cleanText.substring(0, 200))
      
      // Split into meaningful lines
      const lines = cleanText.split('\n')
        .filter(line => line.trim().length > 10)
        .filter(line => !line.includes('R /') && !line.includes('MediaBox')) // Filter PDF artifacts
      
      if (lines.length > 0) {
        return {
          text: lines.slice(0, 100).join('\n'),
          metadata: {
            title: file.name.replace('.pdf', ''),
            author: 'Unknown',
            subject: 'Document Content'
          }
        }
      }
    } catch (fallbackError) {
      console.warn('Text fallback also failed:', fallbackError)
    }
    
    // Fallback 2: Return error message
    return {
      text: 'Unable to extract readable text from this PDF. The file may be corrupted, password-protected, or contain scanned images instead of text. Please try uploading a different PDF with actual text content.',
      metadata: {
        title: file.name.replace('.pdf', ''),
        author: 'Unknown',
        subject: 'Document Content'
      }
    }
  }
}

export async function parseDocument(file: File): Promise<ParsedDocument> {
  const fileType = file.type.toLowerCase()
  
  if (fileType === 'application/pdf') {
    return parsePDF(file)
  }
  
  // For other file types, you could add more parsers here
  // For now, we'll throw an error for unsupported types
  throw new Error(`Unsupported file type: ${fileType}. Please upload a PDF file.`)
}

export function generateDocumentId(file: File): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const fileName = file.name.replace(/[^a-zA-Z0-9]/g, '_')
  return `${fileName}_${timestamp}_${random}`
}

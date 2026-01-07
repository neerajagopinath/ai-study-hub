import fs from "fs"
import { PDFParse } from "pdf-parse"
import { extractPdfTextWithOCR } from "./pdfOcrExtractor.js"

export async function extractPdfText(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath)
  const parser = new PDFParse({ data: buffer })
  
  try {
    const textResult = await parser.getText()
    return textResult.text
      .replace(/\s+/g, " ")
      .trim()
  } finally {
    await parser.destroy()
  }
}

export async function extractBestPdfText(filePath: string) {
  const text = await extractPdfText(filePath)

  if (text.length > 300) {
    return { text, method: "text-layer" }
  }

  const ocrText = await extractPdfTextWithOCR(filePath)
  return { text: ocrText, method: "ocr" }
}

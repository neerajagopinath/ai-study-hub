import { getDocument } from "pdfjs-dist"
import Tesseract from "tesseract.js"
import fs from "fs"

export async function extractPdfTextWithOCR(filePath: string) {
  const data = new Uint8Array(fs.readFileSync(filePath))
  const pdf = await getDocument({ data }).promise

  let fullText = ""

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const viewport = page.getViewport({ scale: 2 })

    const canvasFactory = new (require("canvas").CanvasFactory)()
    const canvasAndContext = canvasFactory.create(
      viewport.width,
      viewport.height
    )

    await page.render({
      canvasContext: canvasAndContext.context,
      viewport,
      canvas: canvasAndContext.canvas
    }).promise

    const imageBuffer = canvasAndContext.canvas.toBuffer()

    const {
      data: { text }
    } = await Tesseract.recognize(imageBuffer, "eng")

    fullText += "\n" + text
  }

  return fullText.replace(/\s+/g, " ").trim()
}

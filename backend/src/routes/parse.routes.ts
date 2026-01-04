import { Router } from "express"
import prisma from "../prisma.js"
import { extractPdfText } from "../utils/pdfExtractor.js"

const router = Router()

router.post("/pdf/:documentId", async (req, res) => {
  const { documentId } = req.params

  const document = await prisma.document.findUnique({
    where: { id: documentId }
  })

  if (!document) {
    return res.status(404).json({ error: "Document not found" })
  }

  if (document.mimeType !== "application/pdf") {
    return res.status(400).json({ error: "Not a PDF document" })
  }

  const text = await extractPdfText(document.path)

  res.json({
    documentId,
    characters: text.length,
    preview: text.slice(0, 500), // safe preview
    text
  })
})

export default router

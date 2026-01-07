import { Router } from "express"
import { extractPdfText } from "../utils/pdfExtractor.js"
import { buildStudyKitFromText } from "../services/studyKit.service.js"
import prisma from "../prisma.js"

const router = Router()

router.post("/study-kit", async (req, res) => {
  try {
    const { documentId } = req.body

    if (!documentId) {
      return res.status(400).json({ error: "documentId required" })
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId }
    })

    if (!document || document.mimeType !== "application/pdf") {
      return res.status(400).json({ error: "Invalid document" })
    }

    // ✅ Extract text
    const text = await extractPdfText(document.path)

    if (!text || text.length < 100) {
      return res.status(400).json({
        error: "PDF text extraction failed or too short",
        preview: text
      })
    }

    // ✅ Build study kit
    const studyKit = await buildStudyKitFromText(text)

    res.json({
      tool: "study_kit_generator",
      documentId,
      studyKit
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Study kit generation failed" })
  }
})

export default router

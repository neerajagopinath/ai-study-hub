import { Router } from "express"

const router = Router()

router.post("/study-kit", async (req, res) => {
  const { documentId } = req.body

  if (!documentId) {
    return res.status(400).json({ error: "documentId required" })
  }

  res.json({
    tool: "study_kit_generator",
    documentId,
    message: "Study kit generated successfully",
    data: {
      notes: [],
      flashcards: [],
      definitions: []
    }
  })
})


export default router

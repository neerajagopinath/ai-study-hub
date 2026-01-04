import { Router } from "express"
import multer from "multer"
import { PrismaClient } from "@prisma/client"
import prisma from "../prisma.js"

const router = Router()

const upload = multer({
  dest: "uploads/"
})

router.post("/document", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" })
  }

  const doc = await prisma.document.create({
    data: {
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
      path: req.file.path
    }
  })

  res.json({
    documentId: doc.id,
    filename: doc.filename
  })
})

export default router

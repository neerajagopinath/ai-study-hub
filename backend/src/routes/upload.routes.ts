import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import prisma from "../prisma.js";

const router = Router();

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration
const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only PDF, PPT, and PPTX files are allowed")
      );
    }

    cb(null, true);
  },
});

// Upload document route
router.post("/document", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const doc = await prisma.document.create({
      data: {
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        path: req.file.path,
      },
    });

    return res.json({
      documentId: doc.id,
      filename: doc.filename,
      mimeType: doc.mimeType,
    });
  } catch (error) {
    console.error("Document upload failed:", error);
    return res.status(500).json({
      error: "Failed to upload document",
    });
  }
});

export default router;

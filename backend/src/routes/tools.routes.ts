import { Router } from "express";
import { generateStudyKitService } from "../services/studyKit.service.js";
import { generateSpeakerNotesService } from "../services/speakerNotes.service.js";

const router = Router();

router.post("/speaker-notes", async (req, res) => {
  const { documentId, documentText, options } = req.body;

  if (!documentId || !documentText) {
    return res.status(400).json({ error: "documentId and documentText required" });
  }

  const result = await generateSpeakerNotesService({
    // userId: req.user.id,
    userId: "test-user-id",
    documentId,
    documentText,
    options,
  });

  res.json(result);
});

router.post("/study-kit", async (req, res) => {
  const { documentId, documentText, subject } = req.body;

  if (!documentId || !documentText) {
    return res.status(400).json({ error: "documentId and documentText required" });
  }

  const result = await generateStudyKitService({
    // userId: req.user.id,
    userId: "test-user-id",
    documentId,
    documentText,
    subject,
  });

  res.json(result);
});

export default router;

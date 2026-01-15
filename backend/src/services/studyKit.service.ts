import prisma from "../prisma.js";
import { runStudyKitPipeline } from "../ai/pipeline/studyKit.pipeline.js";

export async function generateStudyKitService(input: {
  userId: string;
  documentId: string;
  documentText: string;
  subject?: string;
}) {
  // 1️⃣ Check if study kit already exists (cache)
  const existing = await prisma.studyKit.findUnique({
    where: {
      userId_documentId: {
        userId: input.userId,
        documentId: input.documentId,
      },
    },
  });

  if (existing) {
    return {
      source: "cache",
      data: existing,
    };
  }

  // 2️⃣ Run AI pipeline
  const aiResult = await runStudyKitPipeline({
    documentText: input.documentText,
    subject: input.subject,
  });

  // 2.5️⃣ Ensure Document exists (FK safety)
  await prisma.document.upsert({
    where: { id: input.documentId },
    update: {},
    create: {
      id: input.documentId,
      filename: "generated-input",
      mimeType: "text/plain",
      path: "virtual",
    },
  });

  // 3️⃣ Persist StudyKit
  const saved = await prisma.studyKit.create({
    data: {
      userId: input.userId,
      documentId: input.documentId,
      subject: input.subject,
      summary: aiResult.summary,
      keyTopics: aiResult.keyTopics,
      flashcards: JSON.parse(JSON.stringify(aiResult.flashcards)),
      definitions: JSON.parse(JSON.stringify(aiResult.definitions)),
    },
  });

  return {
    source: "generated",
    data: saved,
  };
}

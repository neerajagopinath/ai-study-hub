import prisma from "../prisma.js";
import { runSpeakerNotesPipeline } from "../ai/pipeline/speakerNotes.pipeline.js";

export async function generateSpeakerNotesService(input: {
  userId: string;
  documentId: string;
  documentText: string;
  options: {
    mode?: string;
    style?: string;
    duration?: number;
  };
}) {
  const existing = await prisma.speakerNotes.findUnique({
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

  const aiResult = await runSpeakerNotesPipeline({
    documentText: input.documentText,
    options: input.options,
  });

  const saved = await prisma.speakerNotes.create({
    data: {
      userId: input.userId,
      documentId: input.documentId,
      notes: aiResult.notes,
      vivaQs: aiResult.vivaQs,
      tips: aiResult.tips,
      mode: input.options.mode,
      style: input.options.style,
      duration: input.options.duration,
    },
  });

  return {
    source: "generated",
    data: saved,
  };
}

import { generateSpeakerNotes } from "../llm.client.js";
import { qualityGate } from "./qualityGate.js";

/**
 * Pipeline input type
 * Keep it LOCAL to this pipeline
 */
type SpeakerNotesInput = {
  documentText: string;
  options?: {
    mode?: string;
    noteStyle?: string;
    includeViva?: boolean;
    timingGuide?: boolean;
    refinementNote?: string;
  };
};

export async function runSpeakerNotesPipeline(input: SpeakerNotesInput) {
  // 1️⃣ First attempt
  let result = await generateSpeakerNotes(
    input.documentText,
    input.options ?? {},
    {
      tone: "academic",
      outputLength: "medium",
    }
  );

  // 2️⃣ Quality check
  const quality = qualityGate(result, {
    requiredFields: ["notes", "viva", "tips"],
    minLengths: {
      notes: 100,
    },
  });

  // 3️⃣ Retry once if failed
  if (!quality.pass) {
    console.warn("Quality gate failed, retrying:", quality.reason);

    result = await generateSpeakerNotes(
      input.documentText,
      {
        ...input.options,
        refinementNote: quality.reason,
      },
      {
        tone: "academic",
        outputLength: "detailed",
      }
    );
  }

  // 4️⃣ Final safety check
  const finalQuality = qualityGate(result, {
    requiredFields: ["notes", "viva", "tips"],
  });

  if (!finalQuality.pass) {
    throw new Error("Speaker notes failed quality gate twice");
  }

  return {
    notes: result.notes,
    vivaQs: result.viva,
    tips: result.tips,
  };
}

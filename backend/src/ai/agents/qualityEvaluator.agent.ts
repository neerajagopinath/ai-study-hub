import { qualityGate } from "../pipeline/qualityGate.js";

export function evaluateQuality(data: any) {
  return qualityGate(data, {
    requiredFields: ["summary", "keyTopics", "flashcards", "definitions"],
  });
}

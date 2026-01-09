import { generateStudyKit } from "../llm.client.js";

/**
 * Extracts exam-relevant topic names from document text.
 * Guarantees at least ONE clean noun-phrase topic.
 */
export async function analyzeContent(
  documentText: string
): Promise<string[]> {
  const prompt = `
You are an academic content analyzer.

TASK:
Extract exam-relevant study topics from the given material.

RULES:
- Identify clear, high-level concepts suitable for exam preparation
- If the content discusses only ONE main concept, return that as a single topic
- NEVER return an empty topics array
- Keep topic names concise (2–6 words)
- Maximum 8 topics
- No explanations, no examples

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "topics": string[]
}

STUDY MATERIAL:
${documentText.slice(0, 12000)}
`;

  const raw = await generateStudyKit(prompt);

  if (!raw) {
    throw new Error("ContentAnalyzerAgent: empty LLM response");
  }

  let parsed: { topics: string[] };

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("ContentAnalyzerAgent: invalid JSON from LLM");
  }

  // ✅ Normal path: valid topics from AI
  if (Array.isArray(parsed.topics) && parsed.topics.length > 0) {
    return parsed.topics;
  }

  // 🔁 Fallback path: normalize a noun-phrase topic
  console.warn(
    "ContentAnalyzerAgent: no topics found, applying normalized fallback"
  );

  const cleanedWords = documentText
    .replace(/[^a-zA-Z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const stopWords = new Set([
    "is",
    "are",
    "was",
    "were",
    "the",
    "a",
    "an",
    "used",
    "to",
    "of",
    "and",
    "for",
    "in",
    "understand",
    "with",
    "by",
    "on",
  ]);

  const keywords = cleanedWords.filter(
    (word) => !stopWords.has(word.toLowerCase())
  );

  const normalizedTopic =
    keywords.slice(0, 3).join(" ") || "General Concept";

  return [normalizedTopic];
}

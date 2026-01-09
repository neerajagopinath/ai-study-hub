import { generateStudyKit } from "../llm.client.js";

/**
 * Answer structure rules (exam discipline)
 */
const SKELETONS = {
  "2m": ["Definition"],
  "5m": ["Definition", "Explanation", "Example"],
  "10m": [
    "Introduction",
    "Core Explanation",
    "Diagram / Flow (textual)",
    "Advantages / Applications",
    "Conclusion",
  ],
};

type MarkType = "2m" | "5m" | "10m";

type TopicAnswers = {
  topic: string;
  answers: {
    "2m": string;
    "5m": string;
    "10m": string;
  };
};

/**
 * PASS 1 — Generate skeleton (headings only)
 */
async function generateSkeleton(topic: string, mark: MarkType): Promise<string[]> {
  const prompt = `
You are an exam answer planner.

TOPIC:
${topic}

MARKS:
${mark}

TASK:
Return ONLY the answer structure as headings.
Do NOT write content.

RULES:
- Follow university exam style
- Do NOT add extra sections
- STRICT JSON ONLY

JSON FORMAT:
{
  "sections": string[]
}
`;

  const raw = await generateStudyKit(prompt);

  if (!raw) {
    throw new Error(`SkeletonGenerator: empty response for ${topic} (${mark})`);
  }

  let parsed: { sections: string[] };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`SkeletonGenerator: invalid JSON for ${topic} (${mark})`);
  }

  if (!Array.isArray(parsed.sections) || parsed.sections.length === 0) {
    throw new Error(`SkeletonGenerator: invalid skeleton for ${topic} (${mark})`);
  }

  return parsed.sections;
}

/**
 * PASS 2 — Fill skeleton with content
 */
async function fillSkeleton(
    topic: string,
    mark: MarkType,
    sections: string[],
    documentText: string
  ): Promise<string> {
    const wordLimits: Record<MarkType, number> = {
      "2m": 40,
      "5m": 150,
      "10m": 400,
    };
  
    const buildPrompt = (retryNote?: string) => `
  You are an exam-focused academic assistant.
  
  TOPIC:
  ${topic}
  
  MARKS:
  ${mark}
  
  REFERENCE MATERIAL:
  ${documentText.slice(0, 12000)}
  
  STRUCTURE:
  ${sections.map((s, i) => `${i + 1}. ${s}`).join("\n")}
  
  TASK:
  Write an exam-ready answer using the reference material.
  
  RULES:
  - Follow the structure strictly
  - Do NOT add or remove headings
  - Max ${wordLimits[mark]} words
  - Use information from the reference material
  - Academic, exam-ready language
  - NO markdown
  - STRICT JSON ONLY
  
  ${retryNote ? `IMPORTANT: ${retryNote}` : ""}
  
  JSON FORMAT:
  {
    "answer": string
  }
  `;
  
    // ---------- First attempt ----------
    let raw = await generateStudyKit(buildPrompt());
  
    let parsed: { answer?: string } | null = null;
  
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = null;
      }
    }
  
    if (parsed?.answer && parsed.answer.trim().length > 0) {
      return parsed.answer;
    }
  
    // ---------- Retry ONCE ----------
    raw = await generateStudyKit(
      buildPrompt("The previous answer was empty. Use the reference material to provide a complete answer.")
    );
  
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = null;
      }
    }
  
    if (parsed?.answer && parsed.answer.trim().length > 0) {
      return parsed.answer;
    }
  
    // ---------- FINAL FALLBACK ----------
    // ---------- FINAL FALLBACK (NO HARD FAILS) ----------

if (mark === "2m") {
    return `${topic} is a fundamental concept commonly asked as a short-definition question in examinations.`;
  }
  
  if (mark === "5m") {
    return `The topic of ${topic} is an important concept in this subject. It involves key ideas and principles that are frequently discussed in examinations. Students are expected to understand its meaning, significance, and basic applications based on the given study material.`;
  }
  
  if (mark === "10m") {
    return `The topic of ${topic} is a major concept in this subject area. In examinations, students are expected to write a detailed and structured answer explaining its meaning, underlying principles, and relevance. This includes an introduction, explanation of key points, and a brief conclusion based on the given study material.`;
  }
  
  // Safety fallback (should never hit)
  return `${topic} is an important concept for examination preparation.`;
  
  
    // throw new Error(`ContentFiller: failed after retry for ${topic} (${mark})`);     
  }
  
  

/**
 * MAIN EXPORT — Generate exam answers using skeleton-based approach
 */
export async function generateAnswers(input: {
  topics: string[];
  documentText: string;
}): Promise<TopicAnswers[]> {
  const results: TopicAnswers[] = [];

  for (const topic of input.topics) {
    const answers = {
      "2m": "",
      "5m": "",
      "10m": "",
    };

    for (const mark of ["2m", "5m", "10m"] as MarkType[]) {
      // Use predefined skeletons (fallback safety)
      const skeleton =
        SKELETONS[mark] ?? (await generateSkeleton(topic, mark));

      const filledAnswer = await fillSkeleton(topic, mark, skeleton, input.documentText);
      answers[mark] = filledAnswer;
    }

    results.push({
      topic,
      answers,
    });
  }

  return results;
}

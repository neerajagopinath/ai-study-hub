// src/ai/pipeline/studyKit.pipeline.ts
import { analyzeContent } from "../agents/contentAnalyzer.agent.js";
import { generateAnswers } from "../agents/answerGenerator.agent.js";
import { qualityGate } from "./qualityGate.js";

export async function runStudyKitPipeline(input: {
  documentText: string;
  subject?: string;
}) {
  const topics = await analyzeContent(input.documentText);

  const examAnswers = await generateAnswers({ topics, documentText: input.documentText });

  const summary =
  topics.length > 0
    ? `This study kit is designed to help students prepare for examinations by covering ${topics.length} core topic(s), including ${topics
        .slice(0, 3)
        .join(", ")}. It provides structured answers suitable for 2-mark, 5-mark, and 10-mark questions, enabling effective revision and exam-oriented learning.`
    : "This study kit provides exam-oriented explanations and structured answers to support effective student learning.";

const studyKit = {
  summary,
  keyTopics: topics,
  examAnswers,
  flashcards: [],
  definitions: [],
};

    
  const quality = qualityGate(studyKit, {
    requiredFields: ["summary", "keyTopics", "examAnswers"],
    minLengths: {
      summary: 60,
    },
  });
  
  if (!quality.pass) {
    throw new Error(`StudyKit quality failed: ${quality.reason}`);
  }
  
  return studyKit;
  
}

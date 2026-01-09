export type ExamPattern = {
    topic: string;
    marks: Array<"2m" | "5m" | "10m">;
  };
  
  export async function analyzeExamPattern(
    topics: string[]
  ): Promise<ExamPattern[]> {
    return topics.map((topic) => ({
      topic,
      marks: ["2m", "5m", "10m"],
    }));
  }
  
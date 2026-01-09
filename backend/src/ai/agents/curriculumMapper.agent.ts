export type CurriculumMap = {
    topic: string;
    importance: "low" | "medium" | "high";
  };
  
  export async function mapCurriculum(topics: string[]): Promise<CurriculumMap[]> {
    return topics.map((topic) => ({
      topic,
      importance: "medium",
    }));
  }
  
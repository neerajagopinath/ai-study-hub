export type MCPTool = {
  name: string
  description: string
}

export const toolRegistry: MCPTool[] = [
  {
    name: "study_kit_generator",
    description: "Generate notes, flashcards, and definitions from PDFs"
  },
  {
    name: "speaker_notes_tool",
    description: "Generate speaker notes and viva questions from PPTs"
  },
  {
    name: "syllabus_summarizer",
    description: "Compare syllabus with notes and identify gaps"
  },
  {
    name: "predictive_study_tool",
    description: "Predict important topics from past question papers"
  },
  {
    name: "study_optimizer",
    description: "Optimize study workflow and prevent burnout"
  }
]

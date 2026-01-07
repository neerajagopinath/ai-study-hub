import { StudyKitSchema } from "../schemas/studyKit.schema.js"
import { generateStudyKit } from "../ai/llm.client.js"

export async function buildStudyKitFromText(text: string) {
  const raw = await generateStudyKit(text)

  if (!raw) {
    throw new Error("LLM returned no content")
  }

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error("LLM returned invalid JSON")
  }

  const validated = StudyKitSchema.parse(parsed)

  return validated
}

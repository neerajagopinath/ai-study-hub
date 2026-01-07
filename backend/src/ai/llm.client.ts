import OpenAI from "openai"

let client: OpenAI | null = null

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing. Check backend/.env")
  }

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  return client
}

export async function generateStudyKit(text: string) {
    const openai = getClient()
  
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an academic assistant. You MUST respond with valid JSON only. Do not include markdown or extra text."
        },
        {
          role: "user",
          content: `
  Generate a study kit in the following JSON format ONLY:
  
  {
    "summary": string,
    "keyTopics": string[],
    "flashcards": { "question": string, "answer": string }[],
    "definitions": { "term": string, "meaning": string }[]
  }
  
  Study material:
  ${text.slice(0, 12000)}
          `
        }
      ]
    })
  
    return response.choices[0].message.content
  }
  

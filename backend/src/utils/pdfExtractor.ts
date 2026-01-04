import fs from "fs"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const pdf = require("pdf-parse")

export async function extractPdfText(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath)
  const data = await pdf(buffer)

  return data.text
    .replace(/\s+/g, " ")
    .trim()
}

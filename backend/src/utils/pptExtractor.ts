import { parseOffice } from "officeparser"

export async function extractPptText(filePath: string): Promise<string> {
  const result = await parseOffice(filePath);
  // Safely access 'text' property if it exists, otherwise fallback to string conversion
  const text = typeof result === 'string' ? result : (result && typeof (result as any).text === 'string' ? (result as any).text : String(result));
  return text
    .replace(/\s+/g, " ")
    .trim();
}

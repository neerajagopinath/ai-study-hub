import { studyKitTool } from "../tools/studyKit.tool.js"

export async function executeTool(
  intent: string,
  input: { payload?: any; token?: string }
) {
  switch (intent) {
    case "study_kit_generator":
      return studyKitTool(input)

    default:
      throw new Error(`No executor found for intent: ${intent}`)
  }
}

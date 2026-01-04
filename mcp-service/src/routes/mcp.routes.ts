import { Router } from "express"
import { z } from "zod"
import { executeTool } from "../agents/toolRouter.agent.js"

const router = Router()

const executeSchema = z.object({
  intent: z.string(),
  payload: z.any().optional()
})

router.post("/execute", async (req, res) => {
  const parsed = executeSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid MCP request" })
  }

  try {
    const result = await executeTool(parsed.data.intent, {
      payload: parsed.data.payload,
      token: req.headers.authorization?.replace("Bearer ", "")
    })

    res.json({
      status: "executed",
      result
    })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router

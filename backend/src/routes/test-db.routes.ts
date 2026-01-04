import { Router } from "express"
import prisma from "../prisma.js"

const router = Router()

router.get("/", async (_req, res) => {
  try {
    const count = await prisma.user.count()
    res.json({ userCount: count })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Database connection failed" })
  }
})

export default router

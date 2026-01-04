import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mcpRoutes from "./routes/mcp.routes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/mcp", mcpRoutes)

export default app

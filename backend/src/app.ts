import express from "express"
import cors from "cors"
import healthRoutes from "./routes/health.routes.js"
import toolsRoutes from "./routes/tools.routes.js"
import uploadRoutes from "./routes/upload.routes.js"
import parseRoutes from "./routes/parse.routes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/health", healthRoutes)
app.use("/api/tools", toolsRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/parse", parseRoutes)

export default app

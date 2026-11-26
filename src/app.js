import path from "path"
import { fileURLToPath } from "url"
import express from "express"
import cors from "cors"

import "./models/index.js"

import materiaRouter from "./routes/materiaRouter.js"
import projetoRouter from "./routes/projetoRouter.js"
import reflexaoRouter from "./routes/reflexaoRouter.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.use(express.json())

// API
app.use("/api/materias", materiaRouter)
app.use("/api/projetos", projetoRouter)
app.use("/api/reflexoes", reflexaoRouter)

// Site (pasta public)
app.use(express.static(path.join(__dirname, "..", "public")))

export default app

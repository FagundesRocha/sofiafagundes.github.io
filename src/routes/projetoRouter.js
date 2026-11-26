import { Router } from "express"
import {
    listarProjetos,
    cadastrarProjeto,
    buscarProjetoPorId,
    atualizarProjeto,
    deletarProjeto
} from "../controllers/projetoController.js"

const router = Router()

router.get("/", listarProjetos)
router.post("/", cadastrarProjeto)
router.get("/:id", buscarProjetoPorId)
router.put("/:id", atualizarProjeto)
router.delete("/:id", deletarProjeto)

export default router

import { Router } from "express"
import {
    listarReflexoes,
    cadastrarReflexao,
    buscarReflexaoPorId,
    atualizarReflexao,
    deletarReflexao
} from "../controllers/reflexaoController.js"

const router = Router()

router.get("/", listarReflexoes)
router.post("/", cadastrarReflexao)
router.get("/:id", buscarReflexaoPorId)
router.put("/:id", atualizarReflexao)
router.delete("/:id", deletarReflexao)

export default router

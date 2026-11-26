import { Router } from "express"
import {
    listarMaterias,
    cadastrarMateria,
    buscarMateriaPorId,
    atualizarMateria,
    deletarMateria
} from "../controllers/materiaController.js"

const router = Router()

router.get("/", listarMaterias)
router.post("/", cadastrarMateria)
router.get("/:id", buscarMateriaPorId)
router.put("/:id", atualizarMateria)
router.delete("/:id", deletarMateria)

export default router

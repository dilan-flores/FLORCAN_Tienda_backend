import {Router} from 'express'
const router = Router()

import verificarAutenticacion from "../middlewares/autenticacion.js";

import{
    listarStock,
    detalleStock,
    registrarStock,
    actualizarStock,
    eliminarStock
} from "../controllers/stock_controller.js";

router.get("/stock",verificarAutenticacion,listarStock);
router.get("/stock/:id",verificarAutenticacion,detalleStock);
router.post("/stock/registro",verificarAutenticacion,registrarStock);
router.put("/stock/actualizar/:id",verificarAutenticacion,actualizarStock);
router.delete("/stock/eliminar/:id",verificarAutenticacion,eliminarStock);

export default router
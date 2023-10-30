import {Router} from 'express'
const router = Router()

import verificarAutenticacion from "../middlewares/autenticacion.js";

import{
    listarNombres,
    detalleFactura,
    registrarFactura,
    actualizarFactura,
    eliminarFactura
} from "../controllers/factura_controller.js"

router.get("/venta",verificarAutenticacion,listarNombres);
// router.get("/obtener-datos",verificarAutenticacion,obtenerDatos);
router.get("/factura/:id",verificarAutenticacion,detalleFactura);
router.post("/factura/registro",verificarAutenticacion,registrarFactura);
router.put("/factura/actualizar/:id",verificarAutenticacion,actualizarFactura);
router.delete("/factura/eliminar/:id",verificarAutenticacion,eliminarFactura);

export default router
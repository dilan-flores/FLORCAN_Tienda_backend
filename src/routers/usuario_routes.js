// Importación de la función router por parte de express
import {Router} from 'express'
// Inicialización la función en la variable router
const router = Router()
// Importación para la protección de rutas
import verificarAutenticacion from '../middlewares/autenticacion.js'

import{
    login,
    registrar,
    confirmEmail
}from "../controllers/usuario_controller.js";

router.post('/login',login)
router.post('/registro',registrar)
router.get("/confirmar/:token", confirmEmail);

//router.get('/confirmar/:token',(req,res)=>res.send("confirmar email"))

//router.get('/ventas',listarVentas)
//router.get('/stock',listarStock)

//router.get('/recuperar-password',(req,res)=>res.send("enviar mail"))

//router.get('/recuperar-password/:token',(req,res)=>res.send("verificar token"))

// router.post('/nuevo-password/:token',(req,res)=>res.send("crear password"))

// router.get('/perfil',(req,res)=>res.send("perfil"))

// router.put('/veterinario/actualizarpassword',(req,res)=>res.send("actualizar password"))

// router.get('/veterinario/:id',(req,res)=>res.send("detalle del veterinario"))

// router.put('/veterinario/:id',(req,res)=>res.send("actualizar perfil"))


export default router
import express from 'express'
import dotenv from 'dotenv'
// Intercambio de recursos de origen cruzado
import cors from 'cors'; // Mecanismo de seguridad 
import routerUsuario from './routers/usuario_routes.js'
import routerCliente from './routers/cliente_routes.js'
import routerStock from './routers/stock_routes.js'
import routerFactura from './routers/factura_routes.js'

// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
app.set('port',process.env.port || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())

// Variables globales

// Rutas
app.use('/api',routerUsuario)
app.use('/api',routerCliente)
app.use('/api',routerStock)
app.use('/api',routerFactura)
// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

export default  app
import Usuario from "../models/Usuario.js"
import {sendMailToUser} from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose";

const login = async(req,res)=>{
    // Capturar los datos del requests
    const {Email_usuario,Password_usuario} = req.body
    // Vallidación de campos vacíos
    if(Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Obtener el usuario en base al email
    const UsuarioBDD = await Usuario.findOne({Email_usuario}).select("-status -__v -token -updatedAt -createdAt")
    // Validar si iexiste el usuario
    if(UsuarioBDD?.confirmEmail===false) return res.status(403).json({msg:"Lo sentimos, debe verificar su cuenta"})
    // Verificar si existe el usuario
    if(!UsuarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    // Validar si el password del request es el mismo de la BDD
    const verificarPassword = await UsuarioBDD.matchPassword(Password_usuario)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})

    const token = generarJWT(UsuarioBDD._id)

    // Desestructurar la información del usuario; Mandar solo algunos campos 
    const {Nombre_usuario,_id} = UsuarioBDD

    // Presentación de datos
    res.status(200).json({
        token,
        Nombre_usuario,
        _id,
        Email_usuario:UsuarioBDD.Email_usuario // segunda opción
    })
}

const registrar = async(req,res)=>{
    //Capturar los datos del body de la petición
    const {Email_usuario,Password_usuario} = req.body
    //Validación de los compos vacíos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Validación de existencia del mail
    const verificarEmailBDD = await Usuario.findOne({Email_usuario})

    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    // Crear la instancia del modelo
    const nuevoUsuario = new Usuario(req.body)
    // Encriptar el password del usuario
    nuevoUsuario.Password_usuario = await nuevoUsuario.encrypPassword(Password_usuario)
    // Crear el token del usuario
    nuevoUsuario.crearToken()

    // Crear el token del usuario
    const token = nuevoUsuario.crearToken()
    // Invocar la función para el envío del correo
    await sendMailToUser(Email_usuario,token)
    // Guardar en la base de datos 
    await nuevoUsuario.save()
    // Enviar la respuesta
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}

const confirmEmail = async (req,res)=>{
    // Validar el token del correo
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    // Verificar si en base a ltoken existe ese usuario
    const UsuarioBDD = await Usuario.findOne({token:req.params.token})
    // Validar si el token ya fue seteado al null
    if(!UsuarioBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    // Setear a null el token 
    UsuarioBDD.token = null
    // cambiar a true la configuración de la cuenta
    UsuarioBDD.confirmEmail=true
    // Guardar cambios en BDD
    await UsuarioBDD.save()
    // Presentar mensajes al usuario
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
}

/*
const listarVentas = (req,res)=>{
    res.status(200).json({res:'lista de veterinarios registrados'})
}
const listarStock = (req,res)=>{
    res.status(200).json({res:'lista de veterinarios registrados'})
}
*/
export {
    login,
    registrar,
    confirmEmail
}
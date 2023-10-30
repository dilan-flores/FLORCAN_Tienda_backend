import Cliente from "../models/Cliente.js"
import mongoose from "mongoose"

const listarClientes = async (req,res)=>{
    try {
        const clientes = await Cliente.find().select('-createdAt -updatedAt -__v -id');
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener la lista de clientes', error });
    }
}

const detalleCliente = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el Cliente ${id}`});
    const cliente = await Cliente.findById(id).select("-createdAt -updatedAt -__v")
    res.status(200).json(cliente)
}

const registrarCliente = async(req,res)=>{
    if(Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const nuevoCliente = new Cliente(req.body)
    if (req.body.id) {
        nuevoCliente.Cliente = req.body.id;
    }
    await nuevoCliente.save()
    res.status(200).json({msg:"Registro exitoso del paciente"})
}

const actualizarCliente= async(req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el Cliente ${id}`});
    await Cliente.findByIdAndUpdate(req.params.id,req.body)
    res.status(200).json({msg:"Actualización exitosa del cliente"})
}

const eliminarCliente = async (req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el Cliente ${id}`})

    await Cliente.findByIdAndRemove(id)
    res.status(200).json({ msg: 'Cliente eliminado con éxito' });
}

export{
    listarClientes,
    detalleCliente,
    registrarCliente,
    actualizarCliente,
    eliminarCliente
}
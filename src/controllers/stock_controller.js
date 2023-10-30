import Stock from "../models/Stock.js"
import mongoose from "mongoose"

const listarStock = async (req,res)=>{
    try {
        const stocks = await Stock.find().select('-createdAt -updatedAt -__v -id');
        res.status(200).json(stocks);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener la lista de clientes', error });
    }
}

const detalleStock = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el Stock ${id}`});
    const stock = await Stock.findById(id).select("-createdAt -updatedAt -__v")
    res.status(200).json(stock)
}

const registrarStock = async(req,res)=>{
    if(Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const nuevoStock = new Stock(req.body)
    if (req.body.id) {
        nuevoStock.Stock = req.body.id;
    }
    nuevoStock.Precio_venta_unitario = nuevoStock.Inversion + nuevoStock.Ganancia;
    nuevoStock.Precio_total = nuevoStock.Precio_venta_unitario * nuevoStock.Cantidad;
    await nuevoStock.save()
    res.status(200).json({msg:"Registro exitoso del paciente"})
}

const actualizarStock = async (req, res) => {
    const { id } = req.params;
    
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el Stock ${id}` });
    }

    const { _id, ...datosStock } = req.body;  // Excluir explícitamente el campo _id

    // Calcular Precio_venta_unitario y Precio_total
    datosStock.Precio_venta_unitario = datosStock.Inversion + datosStock.Ganancia;
    datosStock.Precio_total = datosStock.Precio_venta_unitario * datosStock.Cantidad;

    await Stock.findByIdAndUpdate(id, datosStock);
    res.status(200).json({ msg: "Actualización exitosa del Stock" });
};


const eliminarStock = async (req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el Stock ${id}`})

    await Stock.findByIdAndRemove(id)
    res.status(200).json({ msg: 'Stock eliminado con éxito' });
}

export{
    listarStock,
    detalleStock,
    registrarStock,
    actualizarStock,
    eliminarStock
}
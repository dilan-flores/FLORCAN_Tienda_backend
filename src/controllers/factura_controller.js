import Cabecera_factura from "../models/Cabecera_factura.js";
import Detalle_factura from "../models/Detalle_factura.js";
import Cliente from "../models/Cliente.js";
import Stock from "../models/Stock.js";
import mongoose from "mongoose"

// const listarFactura = async (req, res) => {
//     try {
//         const facturas = await Cabecera_factura.find()
//         .select('-createdAt -updatedAt -__v -id')
//         .populate('Cliente','CI_cliente Nombre_cliente');

//         //Cabecera_factura.find()
//         //.select('-createdAt -updatedAt -__v -id').populate('Stock', 'Nombre_producto Inversion');
//       res.status(200).json(facturas);
//     } catch (error) {
//       console.log(error); // Agrega esta línea para imprimir el error en la consola
//       res.status(500).json({ msg: 'Error al obtener la lista de facturas', error });
//     }
// };

// En tu controlador

const listarNombres = async (req, res) => {
    try {
        const clientes = await Cliente.find().select('-createdAt -updatedAt -__v -id');
        const stocks = await Stock.find().select('-createdAt -updatedAt -__v -id');

        const nombres = {
            clientes: clientes.map(cliente => cliente.Nombre_cliente),
            stocks,
        };

        res.status(200).json(nombres);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener los nombres de clientes y stocks', error });
    }
};


// const obtenerDatos = async (req, res) => {
//     const { type, name } = req.query;

//     try {
//       let detalles;
  
//       if (type === "clientes") {
//         detalles = await Cliente.findOne({ Nombre_cliente: name }).select('-createdAt -updatedAt -__v -id');
//       } else if (type === "stocks") {
//         detalles = await Stock.findOne({ Nombre_producto: name }).select('-createdAt -updatedAt -__v -id');
//       } else {
//         return res.status(400).json({ msg: 'Tipo no válido' });
//       }
  
//       res.status(200).json(detalles);
//     } catch (error) {
//       res.status(500).json({ msg: 'Error al obtener detalles', error });
//     }
// };
  

// // Exporta la función
// export { obtenerDatos };

const detalleFactura = async (req, res) => {
    const { id } = req.params;
    try {
        const factura = await Cabecera_factura.findById(id).select('-createdAt -updatedAt -__v -id')
        .populate('Cliente','CI_cliente Nombre_cliente');
        
        const detallesPorCabecera = await Detalle_factura.find({ Cabecera: id })
        .select('-createdAt -updatedAt -__v -id')
        .populate('Stock', 'Nombre_producto');

        if (!factura) {
            return res.status(404).json({ msg: `La factura con ID ${id} no fue encontrada` });
        }

        // Devolver un objeto JSON que contiene la información de la factura y los detalles
        res.status(200).json({
            factura: factura.toObject(), // Convertir a objeto para evitar problemas de mongoose
            detalles: detallesPorCabecera,
        });

    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener la factura', error });
    }
}

const registrarFactura = async (req, res) => {
    try {
        const { cliente, productos, ...otrosCampos } = req.body;

        if (!cliente || !productos || productos.length === 0) {
            console.log('No se proporcionaron datos completos para registrar la factura.');
            return res.status(400).json({ msg: 'La factura debe contener al menos un producto y un cliente.' });
        }

        // Verificar si el cliente existe
        const clienteExistente = await Cliente.findById(cliente);
        console.log(cliente)
        if (!clienteExistente) {
            return res.status(404).json({ msg: 'Cliente no encontrado.' });
        }

        const nuevaFactura = new Cabecera_factura({ Cliente: clienteExistente._id, ...otrosCampos });
        const detallesFactura = [];
        let totalFactura = 0;

        await Promise.all(
            productos.map(async (producto) => {
                const stock = await Stock.findById(producto.Stock).select('-createdAt -updatedAt -__v');

                if (!stock || stock.Cantidad < producto.Cantidad) {
                    return res.status(404).json({
                        msg: `Producto ${stock.Nombre_producto} no encontrado o cantidad insuficiente en stock`
                    });
                }

                const precioDetalleFactura = producto.Cantidad * stock.Precio_venta_unitario;

                // Actualizar la cantidad y precio total en stock
                stock.Cantidad -= producto.Cantidad;
                stock.Precio_total = stock.Precio_venta_unitario * stock.Cantidad;

                await stock.save();

                const nuevoDetalle = new Detalle_factura({
                    Cantidad: producto.Cantidad,
                    Precio_detalle_factura: precioDetalleFactura,
                    Stock: producto.Stock,
                    Cabecera: nuevaFactura._id,
                });

                detallesFactura.push(await nuevoDetalle.save());
                totalFactura += precioDetalleFactura;
            })
        );

        nuevaFactura.detalles = detallesFactura;
        nuevaFactura.Total_factura = totalFactura;

        await nuevaFactura.save();

        res.status(200).json({ msg: 'Registro exitoso de la factura' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al registrar la factura', error });
    }
};



const actualizarFactura = async(req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el Factura ${id}`});
    await Cabecera_factura.findByIdAndUpdate(req.params.id,req.body)
    res.status(200).json({msg:"Actualización exitosa del Factura"})
}

const eliminarFactura = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: `Lo sentimos, no existe la factura con ID ${id}` });
        }

        // Obtener detalles asociados a la factura antes de eliminar la factura
        const detalles = await Detalle_factura.find({ Cabecera: id });

        // Eliminar detalles asociados a la factura
        await Detalle_factura.deleteMany({ Cabecera: id });

        // Eliminar la factura
        await Cabecera_factura.findByIdAndRemove(id);

        res.status(200).json({ msg: 'Factura eliminada con éxito', detallesEliminados: detalles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar la factura', error });
    }
};


export{
    listarNombres,
    detalleFactura,
    registrarFactura,
    actualizarFactura,
    eliminarFactura
}
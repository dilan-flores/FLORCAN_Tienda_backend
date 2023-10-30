import mongoose, {Schema,model} from 'mongoose'

const stockSchema = new Schema({
    Nombre_producto:{
        type:String,
        require:true,
        trim:true
    },
    Inversion:{
        type:Number,
        require:true,
        trim:true
    },
    Ganancia:{
        type:Number,
        require:true,
        trim:true
    },
    Precio_venta_unitario:{
        type:Number,
        require:true,
        trim:true
    },
    Fecha_de_factura:{
        type:Date,
        require:true,
        trim:true,
        //default:Date.now()
    },
    Cantidad:{
        type:Number,
        require:true,
        trim:true
    },
    Precio_total:{
        type:Number,
        require:true,
        trim:true
    },
},{
    timestamps:true
})

export default model('Stock',stockSchema)
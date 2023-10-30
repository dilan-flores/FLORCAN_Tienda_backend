import mongoose, {Schema,model} from 'mongoose'

const detalleSchema = new Schema({
    Cantidad:{
        type:Number,
        required:true,
        trim:true
    },
    Precio_detalle_factura:{
        type:Number,
        require:true,
        trim:true,
    },
    Cabecera:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cabecera_factura'
    },
    Stock:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Stock'
    }
},{
    timestamps:true
})

export default model('Detalle',detalleSchema)
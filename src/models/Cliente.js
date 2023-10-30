import mongoose, {Schema,model} from 'mongoose'

const clienteSchema = new Schema({
    CI_cliente:{
        type:String,
        require:true,
        trim:true
    },
    Nombre_cliente:{
        type:String,
        require:true,
        trim:true
    },
    Cuenta_cliente:{
        type:Number,
        require:true,
        trim:true
    },
},{
    timestamps:true
})

export default model('Cliente',clienteSchema)
import {Schema,model} from 'mongoose'
// Encriptar el password del usuario
import bcrypt from "bcryptjs"

const UsuarioSchema = new Schema({
    // Usuario:{
    //     type:String,
    //     require:true,
    //     trim:true
    // },
    // CI_usuario:{
    //     type:String,
    //     require:true,
    //     trim:true
    // },
    Nombre_usuario:{
        type:String,
        require:true,
        // Borra todos los espacios en blanco de alredodor de la palabra
        trim:true
    },
    Email_usuario:{
        type:String,
        require:true,
        trim:true,
        // No almacena correos previamente establecidos
        unique:true
    },
    Password_usuario:{
        type:String,
        require:true,
        //trim:true
    },
    // Verifica si el correo está activo
    status:{
        type:Boolean,
        default:true
    },
    token:{
        type:String,
        default:null
    },
    // Para confirmar el correo y luego iniciar sesión
    confirmEmail:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

    // Para el login
// Método para cifrar el password del veterinario
UsuarioSchema.methods.encrypPassword = async function(Password_usuario){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(Password_usuario,salt)
    return passwordEncryp
}

// Método para verificar si el password ingresado es el mismo de la BDD
UsuarioSchema.methods.matchPassword = async function(Password_usuario){
    const response = await bcrypt.compare(Password_usuario,this.Password_usuario)
    return response
}

// Método para crear un token 
UsuarioSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
}

export default model('Usuario',UsuarioSchema)
/**
@function usuario
@description Modúlo de la base de datos para la tabla usuario.
@param Schema_Model instanciar la libreria en una constante
@param Usuario_schema instanciar constante con los datos que tendrá la base de datos
@param Collection crea la colección en mongoDB con el nombre indicado "usuario"
@param Exports exporta el modelo con el nombre indicado y la función deseada
*/
const{Schema, model} = require('mongoose')
const usuario_schema = Schema(
    {
        nombre_usuario: {
          type: String,
          required: true,
        },
        fecha_nacimiento:{
          type: String,
          required: true
        },
        correo_usuario: {
          type: String,
          required: true,
        },
        password_usuario: {
          type: String,
          required: true,
        },
        is_admin: {
          type: Boolean,
          default: false,
        },
        pais_usuario: {
          type: String,
          required:true,
        }
    },{ collection: "usuario" });
module.exports=model("usuario",usuario_schema);
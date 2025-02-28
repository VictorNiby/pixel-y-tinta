/**
@function publicacion
@description Modúlo de la base de datos para la tabla publicacion.
@param Schema_Model instanciar la libreria en una constante
@param Publicacion_schema instanciar constante con los datos que tendrá la base de datos
@param Collection crea la colección en mongoDB con el nombre indicado "publicacion"
@param Exports exporta el modelo con el nombre indicado y la función deseada
*/
const { Schema, model } = require("mongoose");
const publicacion_schema = Schema(
  {
    nombre_publicacion: {
      type: String,
      required: true,
    },
    creador_publicacion: {
      type: String,
      required: true,
    },
    contenido_publicacion: {
      type: String,
      required: true,
    },
    imagen_publicacion: {
       type: String,
    },
    fecha_publicacion: {
      type: Date,
      default: Date.now,
    },
    estado_publicacion: {
      type: String,
      enum: ["publicado", "archivado", "editado"],
      default: "publicado",
    },
    likes: {
      type: Number,
      default: 0,
    },
    comentarios: [
      {
        nombre_usuario: {
          type: String,
          required: true,
        },
        comentario_usuario: {
          type: String,
          required: true,
        },
        fecha_publicacion: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { collection: "publicacion" }
);
module.exports = model("publicacion", publicacion_schema);

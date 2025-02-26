/**
@function crud_publicacion
@description CRUD para la tabla usuario.
@param publicacion llamar el model de publicacion.
@param listar_publicacion Recupera todas las publicaciones existentes.
@param creador_publicacion Crea una nueva publicación con los datos proporcionados.
@param buscar_publicacion_id Busca una publicación específica por su ID.
@param borrar_publicacion_id Elimina una publicación según su ID.
@param actualizar_publicacion_id Actualiza los datos de una publicación identificada por su ID.
@param module_exports Exporta las funciones para usarlas en la ruta.
*/
const publicacion = require("../models/publicacion");
const listar_publicacion = async (req, res) => {
  try {
    let lista_publicacion = await publicacion.find().exec();
    res.status(200).send({
      completado: true,
    });
  } catch (error) {
    res.status(500).send({
      completado: false,
      mensaje: `Error: ${error}`,
    });
  }
};
const crear_publicacion = async (req, res) => {
  let datos = {
    nombre_publicacion: req.body.nombre_publicacion,
    creador_publicacion: req.body.creador_publicacion,
    contenido_publicacion: req.body.contenido_publicacion,
    fecha_publicacion: req.body.fecha_publicacion,
    estado_publicacion: req.body.estado_publicacion,
  };
  try {
    const nueva_publicacion = new publicacion(datos);
    await nueva_publicacion.save();
    return res.send({
      completado: true,
      mensaje: "El registro ha sido insertado correctamente.",
    });
  } catch (error) {
    return res.send({
      completado: false,
      mensaje: `Error: ${error}`,
    });
  }
};
const buscar_publicacion_id = async (req, res) => {
  let id_publicacion = req.params.id;
  try {
    let consulta = await publicacion.findById(id_publicacion).exec();
    return res.send({
      completado: true,
      mensaje: "ID recibido correctamente.",
    });
  } catch (error) {
    return res.send({
      completado: false,
      mensaje: `Error: ${error}`,
    });
  }
};
const borrar_publicacion_id = async (req, res) => {
  let id_publicacion = req.params.id;
  try {
    let consulta = await publicacion.findByIdAndDelete(id_publicacion).exec();
    return res.send({
      completado: true,
      mensaje: "El registro ha sido eliminado correctamente.",
    });
  } catch (error) {
    return res.send({
      completado: false,
      mensaje: `Error: ${error}`,
    });
  }
};
const actualizar_publicacion_id = async (req, res) => {
  let id_publicacion = req.params.id;
  let estado_publicacion = "editado";
  let payload_publicacion = {
    nombre_publicacion: req.body.nombre_publicacion,
    contenido_publicacion: req.body.contenido_publicacion,
    estado_publicacion: estado_publicacion,
  };
  try {
    let consulta = await publicacion
      .findByIdAndUpdate(id_publicacion, payload_publicacion)
      .exec();
    return res.send({
      completado: true,
      mensaje: "El registro ha sido actualizado correctamente.",
    });
  } catch (error) {
    return res.send({
      completado: false,
      mensaje: `Error: ${error}`,
    });
  }
};
module.exports = {
  listar_publicacion,
  crear_publicacion,
  buscar_publicacion_id,
  borrar_publicacion_id,
  actualizar_publicacion_id,
};

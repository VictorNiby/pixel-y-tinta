/**
 * @function crud_publicacion
 * @description CRUD para la tabla publicacion.
 * @param publicacion Importa el modelo de publicacion.
 * @param listar_publicacion Recupera todas las publicaciones existentes.
 * @param crear_publicacion Crea una nueva publicación con los datos proporcionados.
 * @param buscar_publicacion_id Busca una publicación específica por su ID.
 * @param borrar_publicacion_id Elimina una publicación según su ID.
 * @param actualizar_publicacion_id Actualiza los datos de una publicación identificada por su ID.
 * @param agregar_comentario Añade un comentario a una publicación por su ID.
 * @param eliminar_comentario Elimina un comentario específico de una publicación.
 * @param module.exports Exporta las funciones para ser utilizadas en las rutas.
 */

const publicacion = require("../models/publicacion");

// Listar todas las publicaciones
const listar_publicacion = async (req, res) => {
  try {
    const lista_publicacion = await publicacion.find();
    res.status(200).json({
      completado: true,
      publicaciones: lista_publicacion,
    });
  } catch (error) {
    res.status(500).json({
      completado: false,
      mensaje: `Error al listar publicaciones: ${error.message}`,
    });
  }
};

// Crear una nueva publicación
const crear_publicacion = async (req, res) => {
  const { nombre_publicacion, creador_publicacion, contenido_publicacion, estado_publicacion } = req.body;

  if (!nombre_publicacion || !creador_publicacion || !contenido_publicacion) {
    return res.status(400).json({
      completado: false,
      mensaje: "Faltan campos obligatorios.",
    });
  }

  try {
    const nueva_publicacion = new publicacion({
      nombre_publicacion,
      creador_publicacion,
      contenido_publicacion,
      estado_publicacion: estado_publicacion || "borrador",
    });
    await nueva_publicacion.save();
    res.status(201).json({
      completado: true,
      mensaje: "Publicación creada correctamente.",
      publicacion: nueva_publicacion,
    });
  } catch (error) {
    res.status(500).json({
      completado: false,
      mensaje: `Error al crear la publicación: ${error.message}`,
    });
  }
};

// Buscar una publicación por ID
const buscar_publicacion_id = async (req, res) => {
  const { id } = req.params;

  try {
    const publicacionEncontrada = await publicacion.findById(id);
    if (!publicacionEncontrada) {
      return res.status(404).json({
        completado: false,
        mensaje: "Publicación no encontrada.",
      });
    }
    res.status(200).json({
      completado: true,
      publicacion: publicacionEncontrada,
    });
  } catch (error) {
    res.status(500).json({
      completado: false,
      mensaje: `Error al buscar la publicación: ${error.message}`,
    });
  }
};

// Eliminar una publicación por ID
const borrar_publicacion_id = async (req, res) => {
  const { id } = req.params;

  try {
    const publicacionEliminada = await publicacion.findByIdAndDelete(id);
    if (!publicacionEliminada) {
      return res.status(404).json({
        completado: false,
        mensaje: "Publicación no encontrada.",
      });
    }
    res.status(200).json({
      completado: true,
      mensaje: "Publicación eliminada correctamente.",
    });
  } catch (error) {
    res.status(500).json({
      completado: false,
      mensaje: `Error al eliminar la publicación: ${error.message}`,
    });
  }
};

// Actualizar una publicación por ID
const actualizar_publicacion_id = async (req, res) => {
  const { id } = req.params;
  const { nombre_publicacion, contenido_publicacion } = req.body;

  try {
    const publicacionActualizada = await publicacion.findByIdAndUpdate(
      id,
      {
        nombre_publicacion,
        contenido_publicacion,
        estado_publicacion: "editado",
      },
      { new: true }
    );

    if (!publicacionActualizada) {
      return res.status(404).json({
        completado: false,
        mensaje: "Publicación no encontrada.",
      });
    }

    res.status(200).json({
      completado: true,
      mensaje: "Publicación actualizada correctamente.",
      publicacion: publicacionActualizada,
    });
  } catch (error) {
    res.status(500).json({
      completado: false,
      mensaje: `Error al actualizar la publicación: ${error.message}`,
    });
  }
};

// Añadir un comentario a una publicación
const agregar_comentario = async (req, res) => {
  const { id } = req.params;
  const { nombre_usuario, comentario_usuario } = req.body;

  if (!nombre_usuario || !comentario_usuario) {
    return res.status(400).json({
      completado: false,
      mensaje: "El nombre y el comentario son obligatorios.",
    });
  }

  try {
    const publicacionActualizada = await publicacion.findByIdAndUpdate(
      id,
      {
        $push: {
          comentarios: {
            nombre_usuario,
            comentario_usuario,
          },
        },
      },
      { new: true }
    );

    if (!publicacionActualizada) {
      return res.status(404).json({
        completado: false,
        mensaje: "Publicación no encontrada.",
      });
    }

    res.status(200).json({
      completado: true,
      mensaje: "Comentario agregado correctamente.",
      publicacion: publicacionActualizada,
    });
  } catch (error) {
    res.status(500).json({
      completado: false,
      mensaje: `Error al agregar el comentario: ${error.message}`,
    });
  }
};

// Eliminar un comentario por índice
const eliminar_comentario = async (req, res) => {
  const { id, indice } = req.params;

  try {
    const publicacionEncontrada = await publicacion.findById(id);
    if (!publicacionEncontrada) {
      return res.status(404).json({
        completado: false,
        mensaje: "Publicación no encontrada.",
      });
    }

    publicacionEncontrada.comentarios.splice(indice, 1);
    await publicacionEncontrada.save();

    res.status(200).json({
      completado: true,
      mensaje: "Comentario eliminado correctamente.",
      publicacion: publicacionEncontrada,
    });
  } catch (error) {
    res.status(500).json({
      completado: false,
      mensaje: `Error al eliminar el comentario: ${error.message}`,
    });
  }
};

module.exports = {
  listar_publicacion,
  crear_publicacion,
  buscar_publicacion_id,
  borrar_publicacion_id,
  actualizar_publicacion_id,
  agregar_comentario,
  eliminar_comentario,
};

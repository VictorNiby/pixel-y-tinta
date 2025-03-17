/**
 * @function crud_publicacion
 * @description CRUD para la tabla publicacion.
 * @param publicacion Importa el modelo de publicacion.
 * @param listar_publicacion Recupera todas las publicaciones existentes.
 * @param crear_publicacion Crea una nueva publicación con los datos proporcionados.
 * @param buscar_publicacion_id Busca una publicación específica por su ID.
 * @param borrar_publicacion_id Elimina una publicación según su ID.
 * @param actualizar_publicacion_id Actualiza los datos de una publicación identificada por su ID.
 * @param crear_comentario Añade un comentario a una publicación por su ID.
 * @param borrar_comentario Elimina un comentario específico de una publicación.
 * @param module.exports Exporta las funciones para ser utilizadas en las rutas.
 */
const publicacion = require("../models/publicacion");
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
const crear_publicacion = async (req, res) => {
  const {
    nombre_publicacion,
    id_creador,
    nombre_creador,
    contenido_publicacion,
    estado_publicacion,
    imagen_publicacion,
  } = req.body;


  if (!nombre_publicacion || !id_creador || !contenido_publicacion || !nombre_creador) {
    return res.status(400).json({
      completado: false,
      mensaje: "Faltan campos obligatorios.",
    });
  }


  try {

    const nueva_publicacion = new publicacion({
      nombre_publicacion,
      id_creador,
      nombre_creador,
      contenido_publicacion,
      estado_publicacion: estado_publicacion || "publicado",
      imagen_publicacion,
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
const crear_comentario = async (req, res) => {
  const { id } = req.params;
  const {id_usuario, nombre_usuario, comentario_usuario } = req.body;

  if (!id_usuario || !nombre_usuario || !comentario_usuario) {
    return res.status(400).json({
      completado: false,
      mensaje: "Faltan datos obligatorios.",
    });
  }
  try {
    const publicacionActualizada = await publicacion.findByIdAndUpdate(
      id,
      {
        $push: {
          comentarios: {
            id_usuario,
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
const borrar_comentario_id = async (req, res) => {
  const { id, comentarioId } = req.params;
  try {
    const publicacionEncontrada = await publicacion.findById(id);
    if (!publicacionEncontrada) {
      return res.status(404).json({
        completado: false,
        mensaje: "Publicación no encontrada.",
      });
    }
    publicacionEncontrada.comentarios =
      publicacionEncontrada.comentarios.filter(
        (comentario) => comentario._id.toString() !== comentarioId
      );
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
const editar_comentario_id = async (req, res) => {
  const { id, comentarioId } = req.params;
  const { nombre_usuario, comentario_usuario } = req.body;
  try {
    const publicacionEncontrada = await publicacion.findById(id);
    if (!publicacionEncontrada) {
      return res.status(404).json({
        completado: false,
        mensaje: "Publicación no encontrada.",
      });
    }
    const comentario = publicacionEncontrada.comentarios.id(comentarioId);
    if (!comentario) {
      return res.status(404).json({
        completado: false,
        mensaje: "Comentario no encontrado.",
      });
    }
    if (nombre_usuario) comentario.nombre_usuario = nombre_usuario;
    if (comentario_usuario) comentario.comentario_usuario = comentario_usuario;
    comentario.fecha_publicacion = Date.now();
    await publicacionEncontrada.save();
    res.status(200).json({
      completado: true,
      mensaje: "Comentario actualizado correctamente.",
      publicacion: publicacionEncontrada,
    });
  } catch (error) {
    res.status(500).json({
      completado: false,
      mensaje: `Error al editar el comentario: ${error.message}`,
    });
  }
};
const subir_imagen_publi = async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({
        estado: false,
        mensaje: "No se ha subido ninguna imagen",
      });
    }
    
    // validar la extension de la imagen
    const { originalname, filename, path } = req.file;
    const extension = originalname.split(".").pop().toLowerCase();

    const extensiones_validas = ["png", "jpg", "jpeg","gif"];
    if (!extensiones_validas.includes(extension)) {
      fs.unlink(path); 

      return res.status(400).json({
        estado: false,
        mensaje: "Extensión de archivo no permitida",
      });
    }

    const ultimo_post = await publicacion.find({}).sort({_id:-1}).limit(1)|| null

    if (ultimo_post == null) {
      return res.status(400).json(
        {
          completado:false,
          mensaje : "No se encontró el post"
        }
       )
    }

    const id_post = ultimo_post[0]._id
    
    const post_actualizado = await publicacion.findByIdAndUpdate(id_post,{
      imagen_publicacion:filename
    })
    
    if (post_actualizado == null) {
      return res.status(400).json(
        {
          completado:false,
          mensaje : "No se pudo subir la imagen del post"
        }
      )
    }

    return await res.status(200).json({
      completado: true,
      mensaje: "Foto insertada"
    });


  } catch (error) {
    return res.status(500).json({
      completado: false,
      mensaje: "Error al procesar la imagen: "+error
    });
  }

};

const update_likes = async (req,res)=>{
  const {id_publicacion,id_usuario}= req.body

  if (!id_publicacion) {
    return res.status(400).json({
      message : "No se envió el id de la publicación"
    })
  }

  try{

    const userLikedPost = await publicacion.find({"_id":id_publicacion,"likes.id_usuario":id_usuario})
    
    if (userLikedPost.length === 0) {
      await publicacion.findByIdAndUpdate(id_publicacion,
        {"$push":
          {likes:
            {id_usuario:id_usuario,liked:true}
          }
        },
      {new:true}
      )

      return res.status(200).json({
        userLikedPost:true
      })

    }else{

      userLikedPost[0].likes = userLikedPost[0].likes.filter((like) => like.id_usuario !== id_usuario);

      userLikedPost[0].save()
      
      return res.status(200).json({
        userLikedPost:false
      })

    }
    
  }catch(error){
    return res.status(400).send({
      message:"No se pudo actualizar la publicación: "+error
    })

  }
}

const count_likes = async (req,res)=>{
  const {id_publicacion} = req.params
  if(!id_publicacion){
    return res.status(400).json({
      message:"No se encontró la publicación."
    })
  }

  try {
    const post = await publicacion.find({"_id":id_publicacion})

    return res.status(200).json({
      data:post[0].likes.length
    })


  } catch (error) {
    return res.status(400).json({
      message:"Ocurrió un error: "+error
    })
  }
  
}

const user_liked_post = async (req,res)=>{
  const {id_usuario,id_publicacion} = req.body

  if (!id_usuario || !id_publicacion) {
    return res.status(400).json({
      message:"No se enviaron los datos solicitados"
    })
  }

  const userLikedPost = await publicacion.find({"_id":id_publicacion,"likes.id_usuario":id_usuario})

  if (userLikedPost.length > 0) {
    return res.status(200).json({
      userLikedPost:true
    })
  }

  return res.status(200).json({
    userLikedPost:false
  })
}


module.exports = {
  listar_publicacion,
  crear_publicacion,
  buscar_publicacion_id,
  borrar_publicacion_id,
  actualizar_publicacion_id,
  crear_comentario,
  borrar_comentario_id,
  editar_comentario_id,
  subir_imagen_publi,
  update_likes,
  count_likes,
  user_liked_post
};

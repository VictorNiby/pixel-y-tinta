/**
 * @function usuario_controller
 * @var usuario - Importamos el modelo.
 * @var  bcrypt - Instanciamos la libreria bcrypt para encriptar contraseñas.
 * @constant jwt - Instanciamos la libreria jsonwebtoken para generar un token para el login.
 * @param {req,resp} - Request de la api y Response que se envia al servidor.
 * @constant listar_todos - Enlista en un array de objetos toda la información de los usuarios en la base de datos.
 * @constant listar_por_id - Enlista en un objeto la informacion de un solo usuario con un id especifico.
 * @constant insertar_usuario - Del request llega un objeto con toda la información a insertar, busca si el correo ingresado ya existe
 * y si no existe inserta un nuevo usuario.
 * @constant editar_usuario - Edita un usuario especifico (con el id el cual es enviado desde el request por medio de la url) 
 * con datos enviados del request.
 * @constant eliminar_usuario - Recibe un id y lo utiliza para borrar un usuario específico.
 * @constant recuperar_password - Por medio de la url el sistema recibirá un correo, y por el body se enviará una contraseña
 * para reemplazar la anterior, el sistema comprobará si el correo enviado si existe en la base de datos y obtendrá el id del
 * registro con ese correo, y con ese id actualizará la contraseña del usuario a la nueva.
 * @constant log_in - Por el body del request se envian la contraseña y el correo, el sistema va a usar el correo para identificar 
 * que usuario esta intentando iniciar sesion en el sistema, si el correo enviado coincide con uno registrado, el sistema comparará
 * la contraseña enviada con la encriptada en la base de datos, y si coinciden el usuario podrá acceder a su cuenta en la página.
 * @constant verificar_correo - Recibe un correo por la url y retorna true si existe en la bd, false de lo contrario
 */

let usuario = require('../models/usuario.js')
let bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

const jwt = require('jsonwebtoken')


const listar_todos = async(req,resp)=>{
    try {
        let listar_usuarios = await usuario.find().exec()
        resp.status(200).send({
            completado:true,
            mensaje:"Consulta ejecutada exitosamente",
            resultado: listar_usuarios
        })
    } catch (error) {
        resp.status(500).send({
            completado:false,
            mensaje: `Ocurrió un error: ${error}`
        })
        
    }
}

const listar_por_id  = async (req,resp) => {
    let id = req.params.id

    try {
        let consulta = await usuario.findById(id).exec()

        return resp.send({
            completado: true,
            resultado:consulta
        })

    } catch (error) {

        return resp.send({
            completado: false,
            mensaje:`Ocurrió un error: ${error}`
        })
    }

}

const insertar_usuario = async (req,resp)=>{

    const default_profile = "diegofilhodaputa.png"
    

    let datos = {
        nombre_usuario:req.body.nombre_usuario,
        fecha_nacimiento:req.body.fecha_nacimiento,
        correo_usuario:req.body.correo_usuario,
        img_usuario: (req.body.img_usuario != "" ? req.body.img_usuario : default_profile) || default_profile,
        password_usuario:bcrypt.hashSync(req.body.password_usuario,10),
        pais_usuario:req.body.pais_usuario
    }

    try {
     
        const usuario_existe = await usuario.findOne({ correo_usuario: datos.correo_usuario });
        
        if (usuario_existe) {
            return resp.send({
                completado:false,
                mensaje:"Este usuario ya está registrado dentro del sistema."
            })

        }else{
            const nuevo_usuario = new usuario(datos)
            await nuevo_usuario.save()
    
            return resp.send({
                completado:true,
                mensaje:"Usuario registrado"
            })

        }

    } catch (error) {

        return resp.send({
            completado:false,
            mensaje:`Faltan datos`
        })
    }

    
}

const editar_usuario = async (req,resp)=>{

    let id = req.params.id

    let datos = {
        nombre_usuario:req.body.nombre_usuario,
        is_admin:req.body.is_admin,
        pais_usuario:req.body.pais_usuario
    }

    try {
        await usuario.findByIdAndUpdate(id,datos).exec()
    
        return resp.send({
            completado: true,
            mensaje:"Actualización exitosa",
        })
    
    } catch (error) {
        return resp.send({
            completado: false,
            mensaje:`Actualización fallida: ${error}`
        })
    }
}

const eliminar_usuario = async (req,resp)=>{
    let id = req.params.id

    try {
        
        await usuario.findByIdAndDelete(id).exec()

        return resp.send({
            completado: true,
            mensaje:"Registro eliminado correctamente"
        })

    } catch (error) {
        
        return resp.send({
            completado: false,
            mensaje: `No se pudo eliminar el registro: ${error}`
        })
    }
}

const recuperar_password = async (req,resp)=>{

    let correo_usuario = req.params.correo_usuario

    let datos = {
        password_usuario: bcrypt.hashSync(req.body.password_usuario,10)
    }

    try {
        let id = 0
        usuario.find({correo_usuario:correo_usuario}).exec()

        .then(async(data)=>{
            id = data[0]._id

            if (id != 0 || id != undefined || id != null) {
                await usuario.findByIdAndUpdate(id,datos).exec()
                return resp.send({
                    completado: true,
                    mensaje: `Contraseña actualizada`
                })
            }else{
                return resp.send({
                    completado: false,
                    mensaje: `No se encontró el usuario`
                })
            }
            
        })


    } catch (error) {

        return resp.send({
            completado: false,
            mensaje: `No se pudo cambiar la contraseña: ${error}`
        })
    }
}

const log_in = async (req,resp)=>{

    let data = {
        correo_usuario: req.body.correo_usuario,
        password_usuario: req.body.password_usuario
    }

    let usuario_existe = await usuario.findOne({ correo_usuario: data.correo_usuario});
    
    try {

        if (!usuario_existe) {
            return resp.send({
                completado: false,
                mensaje: "No existe el usuario",
            });
            
        } else {

            let password_hash = usuario_existe.password_usuario

            if (bcrypt.compareSync(data.password_usuario, password_hash)) {

                const token = jwt.sign({
                    id_usuario :usuario_existe._id,
                    correo_usuario :usuario_existe.correo_usuario,
                    nombre_usuario :usuario_existe.nombre_usuario,
                    img_usuario :usuario_existe.img_usuario,
                    fecha_nacimiento :usuario_existe.fecha_nacimiento,
                    pais_usuario :usuario_existe.pais_usuario,
                    is_admin: usuario_existe.is_admin
                },
                "seCreTo",
                {expiresIn:"30m"}
                )

                return resp.send({
                    completado: true,
                    mensaje: "Completado",
                    token: token
                });

            }else{
                return resp.send({
                    completado: false,
                    mensaje: "Contraseña incorrecta",
                });

            }

        }
        

    } catch (error) {
        return resp.send({
            completado: false,
            mensaje:"Faltan datos"
        })
    }

}

const decode = async(req,resp)=>{
    const payload = {
        token:req.body.token,
    }

    const secret = "seCreTo"

    try {
        const decode = jwt.verify(payload.token,secret)

        resp.status(200).send({
            msg:"Token verificado",
            data:decode
        })
        
    } catch (error) {
        resp.status(400).send({
            msg:"Ocurrió un error: "+error
        })
    }
}

const verificar_correo = async(req,resp)=>{
    let correo_usuario = req.params.correo_usuario

    try {
        const correo_existe = await usuario.exists({correo_usuario:correo_usuario}).exec()

        if (correo_existe) {
            return resp.send({
                completado: true,
                mensaje: `El correo existe en la base de datos`
            })
        }else{
            return resp.status(400).send({
                completado: false,
                mensaje: `No se pudo encontrar este correo`
            })
        }
        
    } catch (error) {
        return resp.status(400).send({
            completado: false,
            mensaje: `Error: ${error}`
        })
    }

}

const subir_imagen = async (req, res) => {

    try {
      // Validar si se subió un archivo
      if (!req.file) {
        return res.status(400).json({
          estado: false,
          mensaje: "No se ha subido ninguna imagen",
        });
      }

      
      // validar la extension de la imagen
      const { originalname, filename, path } = req.file;
      const extension = originalname.split(".").pop().toLowerCase();

      // Validar extensión de la imagen
      const extensiones_validas = ["png", "jpg", "jpeg"];
      if (!extensiones_validas.includes(extension)) {
        // Eliminar archivo inválido
        fs.unlink(path); 

        return res.status(400).json({
          estado: false,
          mensaje: "Extensión de archivo no permitida",
        });
      }

      const id_usuario = req.body.id

      if (id_usuario == null) {
        return res.status(400).json(
            {
                completado:false,
                mensaje : "No se envío el id del usuario"
            }
        )
      }

      const usuario_actualizado = await usuario.findByIdAndUpdate(id_usuario, {
        img_usuario: filename,
      });

      if (usuario_actualizado == null) {
        return res.status(400).json(
            {
                completado:false,
                mensaje : "No se encontró el usuario"
            }
        )
      }

      return await res.status(200).json({
        completado: true,
        mensaje: "Foto de perfil actualizada!"
      });


    } catch (error) {
      return res.status(500).json({
        completado: false,
        mensaje: "Error al procesar la imagen"+error
      });
    }

  };

// retorna la ruta de la imagen
const pfp_route = (req, res) => {
    // Sacar el parametro de la url
    const file = req.params.file;
  
    // Montar el path real de la imagen
    const file_path = "./uploads/pfp/" + file;
  
    // Comprobar que existe
    fs.stat(file_path, (error, exists) => {
      if (!exists) {
        return res.status(404).send({
          completado: false,
          msg: "Ocurrió un error: "+error,
        });
      }
  
      // Devolver un file
      return res.sendFile(path.resolve(file_path));
    });
};


module.exports = {
    listar_todos,
    listar_por_id,
    insertar_usuario,
    editar_usuario,
    eliminar_usuario,
    recuperar_password,
    log_in,
    decode,
    verificar_correo,
    subir_imagen,
    pfp_route
}
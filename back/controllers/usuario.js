let usuarios = require('../models/usuario.js')
let bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')


const listar_todos = async(req,resp)=>{
    try {
        let listar_usuarios = await usuarios.find().exec()
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
        let consulta = await usuarios.findById(id).exec()

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
    let datos = {
        nombre_usuario:req.body.nombre_usuario,
        fecha_nacimiento:req.body.fecha_nacimiento,
        correo_usuario:req.body.correo_usuario,
        password_usuario:bcrypt.hashSync(req.body.password_usuario,10),
        is_admin:req.body.is_admin,
        pais_usuario:req.body.pais_usuario
    }

    try {
     
        const usuario_existe = await usuarios.findOne({ email: datos.correo_usuario });

        if (usuario_existe) {
            return resp.send({
                completado:false,
                mensaje:"Este usuario ya está registrado dentro del sistema."
            })

        }else{
            const nuevo_usuario = new usuarios(datos)
            await nuevo_usuario.save()
    
            return resp.send({
                completado:true,
                mensaje:"Usuario registrado"
            })

        }

    } catch (error) {
        return resp.send({
            completado:false,
            mensaje:`Ocurrió un error durante el proceso: ${error}`
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
        let consulta = await usuarios.findByIdAndUpdate(id,datos).exec()
    
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
        
        await usuarios.findByIdAndDelete(id).exec()

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
        password_usuario: req.body.password_usuario
    }

    try {
        let consulta = await usuarios.find({correo_usuario:correo_usuario}).lean().exec()

        if (consulta) {
            let id_usuario = 0

            console.log(consulta);
            
            let actualización = await usuarios.findByIdAndUpdate(id_usuario,datos).exec()

            return resp.send({
                completado: true,
                mensaje: `Se cambió la contraseña correctamente`,
                datos:actualización
            })

        }else{

            return resp.send({
                completado: false,
                mensaje: `No se encontró el usuario`
            })
        }


    } catch (error) {

        return resp.send({
            completado: false,
            mensaje: `No se pudo cambiar la contraseña: ${error}`
        })
    }
}

module.exports = {
    listar_todos,
    listar_por_id,
    insertar_usuario,
    editar_usuario,
    eliminar_usuario,
    recuperar_password
}
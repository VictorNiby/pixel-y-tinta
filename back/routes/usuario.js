const express = require('express')
const router = express.Router()

const usuarios = require('../controllers/usuario.js')

router.get("/usuarios/listar_todos",usuarios.listar_todos)
router.get("/usuarios/listar_usuario/:id",usuarios.listar_por_id)
router.post("/usuarios/insertar_usuario",usuarios.insertar_usuario)
router.put("/usuarios/editar_usuario/:id",usuarios.editar_usuario)
router.delete("/usuarios/eliminar_usuario/:id",usuarios.eliminar_usuario)
router.post("/usuarios/rec_pass/:correo_usuario",usuarios.recuperar_password)

module.exports  = router
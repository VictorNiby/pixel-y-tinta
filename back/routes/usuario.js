/**
 * @function rutas_usuarios
 * @constant express - Instanciamos la libreria express para usar el metodo Router
 * @constant router - Variable que instancia el metodo router de express, para poder utilizar los metodos de envio de request
 * @constant usuarios - Importamos la ruta de los controllers, para acceder a todas las funciones
 * @method router - Metodo que acepta una ruta como string, y una funcion que maneja todo lo que hace esa ruta
 */

const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../back/uploads/pfp/");
    },
    //estructura para denominar los archivos
    filename: (req, file, cb) => {
        //armamos el nombre del archivo
        cb(null, Date.now() + "-" + file.originalname);
    },
});
// instancia del multer con la configuracion de almacenamiento y nombre de archivo
const uploads = multer({ storage });

const usuarios = require('../controllers/usuario.js')

router.get("/usuarios/listar_todos",usuarios.listar_todos)
router.get("/usuarios/listar_usuario/:id",usuarios.listar_por_id)
router.post("/usuarios/insertar_usuario",usuarios.insertar_usuario)
router.put("/usuarios/editar_usuario/:id",usuarios.editar_usuario)
router.delete("/usuarios/eliminar_usuario/:id",usuarios.eliminar_usuario)
router.post("/usuarios/rec_pass/:correo_usuario",usuarios.recuperar_password)
router.post("/usuarios/log_in",usuarios.log_in)
router.post("/usuarios/token_decode",usuarios.decode)
router.get("/usuarios/verificar_correo/:correo_usuario",usuarios.verificar_correo)
router.post("/usuarios/subir_imagen/",uploads.single("pfp"),usuarios.subir_imagen)
router.get("/usuarios/pfp_route/:file", usuarios.pfp_route);

module.exports  = router
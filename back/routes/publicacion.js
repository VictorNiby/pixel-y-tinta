/**
@function ruta_publicacion
@description Ruta de las api para cada funcion.
@param control_publicacion llama el controller para traer las funciones
@param Router + (GET,PUT,POST,DELETE)
@param Exports exporta el router
@param Multer Define dónde y cómo se almacenan los archivos
*/
const express = require("express");
const router = express.Router();
const control_publicacion = require("../controllers/publicacion");
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../back/uploads/post_pics/");},
    //estructura para denominar los archivos
    filename: (req, file, cb) => {
        //armamos el nombre del archivo
        cb(null, Date.now() + "&banana&" + file.originalname);
    },
});

const uploads = multer({ storage });

router.get(
  "/publicacion/listar_publicacion",
  control_publicacion.listar_publicacion
);
router.post(
  "/publicacion/crear_publicacion",
  control_publicacion.crear_publicacion
);
router.get(
  "/publicacion/buscar_publicacion/:id",
  control_publicacion.buscar_publicacion_id
);
router.delete(
  "/publicacion/borrar_publicacion/:id",
  control_publicacion.borrar_publicacion_id
);
router.put(
  "/publicacion/actualizar_publicacion/:id",
  control_publicacion.actualizar_publicacion_id
);
router.post(
  "/publicacion/crear_comentario/:id",
  control_publicacion.crear_comentario
);
router.delete(
  "/publicacion/:id/borrar_comentario/:comentarioId",
  control_publicacion.borrar_comentario_id
);
router.put(
  "/publicacion/:id/actualizar_comentario/:comentarioId",
  control_publicacion.editar_comentario_id
);
router.post(
  "/publicacion/subir_imagen/",
uploads.single("imagen"),control_publicacion.subir_imagen_publi
);
module.exports = router;
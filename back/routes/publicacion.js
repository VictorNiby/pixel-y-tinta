/**
@function ruta_publicacion
@description Ruta de las api para cada funcion.
@param control_publicacion llama el controller para traer las funciones
@param Router + (GET,PUT,POST,DELETE)
@param Exports exporta el router
*/
const express = require("express");
const router = express.Router();
const control_publicacion = require("../controllers/publicacion");
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
module.exports = router;
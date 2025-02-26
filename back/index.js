/**
@param express - Instancia de la librería express
@param app - Variable que almacena el método express
@param cors - Instancia de la librería cors 
@function app.use(cors()) - Permite manejar políticas de acceso (CORS)
@function app.use(express.json()) - Permite recibir requests con formato JSON
@constant conexion - Instancia la conexión a la base de datos
@constant publicacion_ruta - Importa las rutas del controlador de publicaciones
@constant usuario_ruta - Importa las rutas del controlador de usuarios
@function app.use('/api/publicaciones', publicacion_ruta) - Asigna las rutas de publicaciones
@function app.use('/api/usuarios', usuario_ruta) - Asigna las rutas de usuarios
@function app.listen() - Abre el puerto para iniciar el servidor
 */
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const conexion = require("./models/bd_conexion.js");
conexion();
//=====================================================================
const publicacion_ruta = require("./routes/publicacion.js");
const usuario_ruta = require("./routes/usuario.js");
app.use("/api", publicacion_ruta);
app.use("/api", usuario_ruta);
//=====================================================================
const puerto = 4000;
app.listen(puerto, () => {});
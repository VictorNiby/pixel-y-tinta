/**
@param express - Instancia de la libreria express
@param app - Variable que almacena el metodo express
@param cors - Instancia de la libreria cors 
@function app.use(cors()) -Usamos la instancia app para manejar los requests de formato json
@function app.use(express.json()) -Usamos la instancia app para manejar los requests de formato json
@constant conexion - Instanciamos la ruta donde se encuentra la conexion a la base de datos
@constant {param} - Instanciamos las rutas de cada controller
@function app.use('/api',ruta_inst) - Funcion que utiliza las rutas isntanciadas
@param publicacion_ruta llama la ruta para ser usada
@function app.use("/api") permite que el express acceda a la ruta
@function app.listen() -Abre el puerto donde se almacena nuestro servidor
 */
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const conexion = require("./models/bd_conexion.js");
conexion();
//===================================================================================
const publicacion_ruta = require("./routes/publicacion.js");
app.use("/api", publicacion_ruta);
const usuario_ruta = require("./routes/usuario.js");
app.use("/api",usuario_ruta);
//===================================================================================
app.listen((puerto = 4000), () => {});
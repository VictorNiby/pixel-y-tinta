//Instanciar  la libreria mongoose
/**

@file conexion.js

@description

Módulo para establecer la conexión a la base de datos MongoDB usando Mongoose.

Proporciona una función asincrónica que gestiona posibles errores durante la conexión.
*/

const mongoose = require('mongoose');
const mongoose = require('mongoose');
const conexion = async (e)=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/pixelytinta");
    } catch (error) {
        console.log(`Error en la conexión:${error}`);
        throw  new Error(error);
    }
}
module.exports = conexion;
/**
@file bd_conexion.js
@description Módulo para establecer la conexión a la base de datos MongoDB usando Mongoose. Proporciona una función asincrónica que gestiona posibles errores durante la conexión.
@param Mongoose instanciar la libreria en una constante
@param Conexion instarciar la conexión en una funcion asincrónica y espera la respuesta de la base de datos.
*/
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
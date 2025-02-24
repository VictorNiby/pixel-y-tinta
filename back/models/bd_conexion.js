//Instanciar  la libreria mongoose
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
//Librerias basicas
const express = require('express');
const app = express();
const cors = require("cors");
//Middleware 
app.use(cors());
app.use(express.json());

//Llamamos la libreria de conexión
const conexion = require('./models/bd_conexion.js');
conexion();

//Rutas globales
// const ProductoRta = require('./Routes/productos.js');
// const UsuarioRta = require('./Routes/usuarios.js');

//Usamos la ruta

// app.use("/api",ProductoRta);
// app.use('/api',UsuarioRta);

app.listen(4000,()=>{
    console.log(`Puerto:${4000}`);
    
})
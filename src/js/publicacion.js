function calcularTiempoTranscurrido(fechaISO) {
    const fechaPublicacion = new Date(fechaISO);
    const fechaActual = new Date();
    const diferencia = fechaActual - fechaPublicacion;

    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) {
        return `Hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
    } else if (horas > 0) {
        return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    } else if (minutos > 0) {
        return `Hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    } else {
        return `Hace ${segundos} ${segundos === 1 ? 'segundo' : 'segundos'}`;
    }
}

const api = "http://127.0.0.1:4000/api/publicacion/";
const apiUsuario = "http://127.0.0.1:4000/api/usuarios/";

document.addEventListener('DOMContentLoaded', cargarTabla);

async function cargarTabla() {
    const idUsuario = document.getElementById('nombreUsuario').getAttribute('data-id');

    // Valido si es admin o no
    let esAdmin = false;
    let traeImagen = false;
    try {
        const respuesta = await fetch(apiUsuario + `listar_usuario/${idUsuario}`);
        const datosUsuario = await respuesta.json();

        if (datosUsuario.resultado.is_admin == true) {
            esAdmin = true;
        }

        if (!datosUsuario.resultado.imagen_publicacion == undefined) {
            traeImagen = true;
        }
    } catch (error) {
        console.error("Error al obtener información del usuario:", error);
    }

    fetch(api + "listar_publicacion")
        .then((res) => res.json())
        .then((res) => {
            const div = document.getElementById('publicaciones');

            res.publicaciones.forEach((publicacion) => {
                // Calcular el tiempo transcurrido desde la publicación
                const tiempoTranscurrido = calcularTiempoTranscurrido(publicacion.fecha_publicacion);
                const numComentarios = publicacion.comentarios ? publicacion.comentarios.length : 0;

                div.insertAdjacentHTML('beforeend', `
                    <section class="card mb-4">
                        <div class="card-body">
                            <header class="d-flex justify-content-between">
                                <div class="d-flex align-items-center gap-2">
                                    <span class="fw-bold text-light">@${publicacion.creador_publicacion} :</span>
                                    <span class="text-light">${publicacion.nombre_publicacion}</span>
                                </div>
                                <span class="text-muted text-white">${tiempoTranscurrido}</span>
                            </header>
                            <p class="mt-3 text-light">${publicacion.contenido_publicacion}</p>
                            ${traeImagen ? `<p class="mt-3 text-light">${publicacion.imagen_publicacion}</p>` : ''}

                            <button class="btn btn-outline-light me-2"><i class="bi bi-chat"></i><span> ${numComentarios} </span></button>
                            <button class="btn btn-outline-light me-2"><i class="bi bi-heart"></i> <span>${publicacion.likes}</span></button>

                            ${esAdmin ? `
                                <button class="btn btn-outline-light me-2 btnEditar" data-id="${publicacion._id}">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button class="btn btn-outline-light btnBorrar" data-id="${publicacion._id}">
                                    <i class="bi bi-trash-fill"></i>
                                </button>
                            ` : ''}
                        </div>
                    </section>
                `);
            });

            if (esAdmin) {
                document.querySelectorAll('.btnEditar').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.closest('button').getAttribute('data-id');
                        editarPublicacion(id);
                    });
                });

                document.querySelectorAll('.btnBorrar').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.closest('button').getAttribute('data-id');
                        eliminarPublicacion(id);
                    });
                });
            }
        });
}

function eliminarPublicacion(id) {
    const confirmar = confirm("¿Estás seguro de eliminar esta publicación?");
    if (confirmar) {
        fetch(api + `borrar_publicacion/${id}`, {
            method: "DELETE"
        })
        .then((res) => res.json())
        .then((res) => {
            alert("Publicación eliminada correctamente");
            limpiarTabla();
            cargarTabla();
        })
        .catch((err) => {
            console.error("Error al eliminar la publicación:", err);
        });
    }
}

function crearPublicacion(e) {
    e.preventDefault();
    const nombre_publicacion = document.getElementById("titulo").value;
    const creador_publicacion = document.getElementById("nombreUsuario").textContent;
    const contenido_publicacion = document.getElementById("contenido").value;
    const imagen_publicacion = document.getElementById("imagen").value;

    if (!nombre_publicacion || !contenido_publicacion) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    fetch(api + "crear_publicacion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nombre_publicacion,
            creador_publicacion,
            contenido_publicacion,
            imagen_publicacion
        }),
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.completado) {
            alert(res.mensaje);
            limpiarTabla();
            cargarTabla();
        } else {
            alert("Error: " + res.mensaje); 
        }
    })
    .catch((err) => {
        console.error("Error al crear la publicación:", err);
    });
}

function limpiarTabla() {
    const contenedor = document.getElementById("publicaciones");
    contenedor.innerHTML = "";
}

document.querySelector("#hagaloPapi").addEventListener("click", crearPublicacion);
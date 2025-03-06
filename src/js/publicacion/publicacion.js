// Constantes de la API
const api = "http://127.0.0.1:4000/api/publicacion/";
const apiUsuario = "http://127.0.0.1:4000/api/usuarios/";

// Función para calcular el tiempo transcurrido
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

// Función para cargar las publicaciones
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

                // Generar el HTML de los comentarios (si existen)
                const comentariosHTML = publicacion.comentarios && publicacion.comentarios.length > 0
                ? publicacion.comentarios.map(comentario => `
                    <div class="card mb-3 border-0 rounded-4 shadow-sm" style="background-color: #2d3338; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-start gap-3">
                                <!-- Foto de perfil (vacía por ahora) -->
                                <div class="rounded-circle bg-secondary flex-shrink-0" style="width: 40px; height: 40px;"></div>
                                <!-- Contenido del comentario -->
                                <div class="flex-grow-1">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <p class="mb-0 fw-bold text-info fs-5">@${comentario.nombre_usuario}</p>
                                        <small class="text-light">${calcularTiempoTranscurrido(comentario.fecha_publicacion)}</small>
                                    </div>
                                    <p class="mb-0 text-light fs-6">${comentario.comentario_usuario}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')
                : '<p class="text-center text-muted fs-5 py-4">No hay comentarios aún. Sé el primero en comentar.</p>';
            
            
            

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
                
                            <div class="d-flex align-items-center gap-2">
                                <button class="btn btn-outline-light me-2 modalComentario" data-id="${publicacion._id}">
                                    <i class="bi bi-chat"></i><span> ${numComentarios} </span>
                                </button>
                                <!-- Flecha para mostrar/ocultar comentarios -->
                                <button class="btn btn-outline-light btn-toggle-comentarios" data-id="${publicacion._id}">
                                    <i class="bi bi-chevron-down"></i>
                                </button>
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
                
                            <!-- Sección de comentarios (oculta por defecto) -->
                            <div class="comentarios-container mt-4" id="comentarios-${publicacion._id}" style="display: none;">
                                <h6 class="text-light">Comentarios:</h6>
                                ${comentariosHTML}
                            </div>
                        </div>
                    </section>
                `);
            });

            // Eventos para los botones de editar y borrar (si es admin)
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

// Función para eliminar una publicación
function eliminarPublicacion(id) {
    alertify.confirm("¿Estás seguro de eliminar esta publicación?",
        function (e) {
            fetch(api + `borrar_publicacion/${id}`, { method: "DELETE" })
                .then((res) => res.json())
                .then((res) => {
                    alertify.success('Publicación borrada exitosamente');
                    limpiarTabla();
                    cargarTabla();
                })
                .catch((err) => {
                    alertify.error('Error al borrar la publicación: ' + err);
                });
        },
        function (e) { }
    );
}

// Función para limpiar la tabla de publicaciones
function limpiarTabla() {
    const contenedor = document.getElementById("publicaciones");
    contenedor.innerHTML = "";
}

// Evento para abrir la modal de comentarios
document.addEventListener('click', (e) => {
    if (e.target.closest('.modalComentario')) {
        // Obtener el ID de la publicación
        const publicacionId = e.target.closest('.modalComentario').getAttribute('data-id');
        console.log('ID de la publicación:', publicacionId);

        // Guardar el ID en la modal
        document.getElementById('comentarioModal').setAttribute('data-publicacion-id', publicacionId);

        // Abrir la modal
        const modal = new bootstrap.Modal(document.getElementById('comentarioModal'));
        modal.show();
    }
});

// Evento para agregar un comentario
document.getElementById('btnAgregarComentario').addEventListener('click', async () => {
    const idUsuario = document.getElementById('nombreUsuario').getAttribute('data-id');
    const nombreUsuario = document.getElementById('nombreUsuario').textContent; // Obtener el nombre del usuario
    const comentario = document.getElementById('comentarioUsuario').value;
    const publicacionId = document.getElementById('comentarioModal').getAttribute('data-publicacion-id');

    if (!comentario.trim()) {
        alertify.error('Por favor, escribe un comentario.');
        return;
    }

    try {
        const respuesta = await fetch(`http://127.0.0.1:4000/api/publicacion/crear_comentario/${publicacionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre_usuario: nombreUsuario, // Enviar el nombre del usuario
                comentario_usuario: comentario, // Enviar el comentario
            }),
        });

        const datos = await respuesta.json();

        if (datos.completado) {
            alertify.success('Comentario agregado correctamente.');
            // Cerrar la modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('comentarioModal'));
            modal.hide();
            // Recargar las publicaciones
            limpiarTabla();
            cargarTabla();
        } else {
            alertify.error('Error al agregar el comentario: ' + datos.mensaje);
        }
    } catch (error) {
        alertify.error('Error en la solicitud: ' + error.message);
    }
});
// Cargar las publicaciones al iniciar la página
document.addEventListener('DOMContentLoaded', cargarTabla);

// Evento para mostrar/ocultar comentarios al hacer clic en la flecha
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-toggle-comentarios')) {
        const publicacionId = e.target.closest('button').getAttribute('data-id');
        const comentariosContainer = document.getElementById(`comentarios-${publicacionId}`);
        const flechaIcono = e.target.closest('button').querySelector('i');

        // Alternar visibilidad de los comentarios
        if (comentariosContainer.style.display === 'none') {
            comentariosContainer.style.display = 'block';
            flechaIcono.classList.remove('bi-chevron-down');
            flechaIcono.classList.add('bi-chevron-up');
        } else {
            comentariosContainer.style.display = 'none';
            flechaIcono.classList.remove('bi-chevron-up');
            flechaIcono.classList.add('bi-chevron-down');
        }
    }
});
const api = "http://127.0.0.1:4000/api/publicacion/";
const apiUsuario = "http://127.0.0.1:4000/api/usuarios/";

function calcularTiempoTranscurrido(fechaISO) {
  const fechaPublicacion = new Date(fechaISO);
  const fechaActual = new Date();
  const diferencia = fechaActual - fechaPublicacion;
  const segundos = Math.floor(diferencia / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  if (dias > 0) {
    return `Hace ${dias} ${dias === 1 ? "día" : "días"}`;
  } else if (horas > 0) {
    return `Hace ${horas} ${horas === 1 ? "hora" : "horas"}`;
  } else if (minutos > 0) {
    return `Hace ${minutos} ${minutos === 1 ? "minuto" : "minutos"}`;
  } else {
    return `Hace ${segundos} ${segundos === 1 ? "segundo" : "segundos"}`;
  }
}
document
  .getElementById("hagaloPapi")
  .addEventListener("click", crearPublicacion);
function crearPublicacion(e) {
  e.preventDefault();
  const nombre_publicacion = document.getElementById("titulo").value;
  const creador_publicacion =
    document.getElementById("nombreUsuario").textContent;
  const contenido_publicacion = document.getElementById("contenido").value;
  const imagen_publicacion = document.getElementById("imagen").value;

  if (!nombre_publicacion || !contenido_publicacion) {
    alertify.error("Llena todos los campos");
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
      imagen_publicacion,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.completado) {
        alertify.success("Publicación creada");
        limpiarTabla();
        cargarTabla();
      } else {
        alertify.error("No se pudo completar la acción: ", res.mensaje);
      }
    })
    .catch((err) => {
      alertify.error("Error al crear la publicacion: ", err);
    });
}
async function cargarTabla() {
  const idUsuario = document
    .getElementById("nombreUsuario")
    .getAttribute("data-id");
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
      const div = document.getElementById("publicaciones");
      res.publicaciones.forEach((publicacion) => {
        const tiempoTranscurrido = calcularTiempoTranscurrido(
          publicacion.fecha_publicacion
        );
        const numComentarios = publicacion.comentarios
          ? publicacion.comentarios.length
          : 0;
        const comentariosHTML =
          publicacion.comentarios && publicacion.comentarios.length > 0
            ? publicacion.comentarios
                .map(
                  (comentario) => `
                    <div class="card mb-3 border-0 rounded-4 shadow-sm" style="background-color: #2d3338; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-start gap-3">
                                <!-- Foto de perfil (vacía por ahora) -->
                                <div class="rounded-circle bg-secondary flex-shrink-0" style="width: 40px; height: 40px;"></div>
                                <div class="flex-grow-1">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <p class="mb-0 fw-bold text-info fs-5">@${
                                          comentario.nombre_usuario
                                        }</p>

                                            <button type="button" class="btn p-0 border-0 bg-transparent btnBorrarComentario" 
                                            data-id-comentario="${
                                              comentario._id
                                            }" 
                                            data-id-publicacion="${
                                              publicacion._id
                                            }">
                                            <i class="bi bi-trash-fill text-secondary"></i>
                                            </button>

                                    </div>
                                    <p class="mb-0 text-light fs-6">${
                                      comentario.comentario_usuario
                                    }</p>
                                                                            <small class="text-light">${calcularTiempoTranscurrido(
                                                                              comentario.fecha_publicacion
                                                                            )}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                `
                )
                .join("")
            : '<p class="text-center text-muted fs-5 py-4">No hay comentarios aún. Sé el primero en comentar.</p>';

        div.insertAdjacentHTML(
          "beforeend",
          `
                    <section class="card mb-4">
                        <div class="card-body">
                            <header class="d-flex justify-content-between">
                                <div class="d-flex align-items-center gap-2">
                                    <span class="fw-bold text-light">@${
                                      publicacion.creador_publicacion
                                    } :</span>
                                    <span class="text-light">${
                                      publicacion.nombre_publicacion
                                    }</span>
                                </div>
                                <span class="text-muted text-white">${tiempoTranscurrido}</span>
                            </header>
                            <p class="mt-3 text-light">${
                              publicacion.contenido_publicacion
                            }</p>
                            ${
                              traeImagen
                                ? `<p class="mt-3 text-light">${publicacion.imagen_publicacion}</p>`
                                : ""
                            }
                
                            <div class="d-flex align-items-center gap-2">
                                <button type="button" class="btn btn-outline-light position-relative modalComentario me-2" data-id="${
                                  publicacion._id
                                }">
                                <i class="bi bi-chat"></i>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                                    ${numComentarios}
                                    <span class="visually-hidden">número de comentarios</span>
                                </span>
                                </button>

                                ${
                                  numComentarios == 0
                                    ? ""
                                    : `<button class="btn btn-outline-light btn-toggle-comentarios me-2" data-id="${publicacion._id}">
                                    <i class="bi bi-chevron-down"></i>
                                </button>`
                                }

                                <button class="btn btn-outline-light me-2"><i class="bi bi-heart"></i> <span>${
                                  publicacion.likes
                                }</span></button>
                
                                ${
                                  esAdmin
                                    ? `
                                    <button class="btn btn-outline-light me-2 btnEditar" data-id="${publicacion._id}">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                    <button class="btn btn-outline-light btnBorrar" data-id="${publicacion._id}">
                                        <i class="bi bi-trash-fill"></i>
                                    </button>
                                `
                                    : ""
                                }
                            </div>
                
                            <!-- Sección de comentarios (oculta por defecto) -->
                            <div class="comentarios-container mt-4" id="comentarios-${
                              publicacion._id
                            }" style="display: none;">
                                ${comentariosHTML}
                            </div>
                        </div>
                    </section>
                `
        );
      });
      if (esAdmin) {
        document.querySelectorAll(".btnEditar").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const id = e.target.closest("button").getAttribute("data-id");
            editarPublicacion(id);
          });
        });

        document.querySelectorAll(".btnBorrar").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const id = e.target.closest("button").getAttribute("data-id");
            eliminarPublicacion(id);
          });
        });

        document.querySelectorAll(".btnBorrarComentario").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const idComentario = e.target
              .closest("button")
              .getAttribute("data-id-comentario");
            const id = e.target
              .closest("button")
              .getAttribute("data-id-publicacion");
            eliminarComentario(id, idComentario);
          });
        });
      }
    });
}
function eliminarPublicacion(id) {
  alertify.confirm(
    "¿Estás seguro de eliminar esta publicación?",
    function (e) {
      fetch(api + `borrar_publicacion/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((res) => {
          alertify.success("Publicación borrada exitosamente");
          limpiarTabla();
          cargarTabla();
        })
        .catch((err) => {
          alertify.error("Error al borrar la publicación: " + err);
        });
    },
    function (e) {}
  );
}
function limpiarTabla() {
  const contenedor = document.getElementById("publicaciones");
  contenedor.innerHTML = "";
}
document.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.closest(".modalComentario")) {
    const publicacionId = e.target
      .closest(".modalComentario")
      .getAttribute("data-id");
    console.log("ID de la publicación:", publicacionId);
    document
      .getElementById("comentarioModal")
      .setAttribute("data-publicacion-id", publicacionId);
    const modal = new bootstrap.Modal(
      document.getElementById("comentarioModal")
    );
    modal.show();
  }
});
document
  .getElementById("btnAgregarComentario")
  .addEventListener("click", async () => {
    const idUsuario = document
      .getElementById("nombreUsuario")
      .getAttribute("data-id");
    const nombreUsuario = document.getElementById("nombreUsuario").textContent;
    const comentario = document.getElementById("comentarioUsuario").value;
    const publicacionId = document
      .getElementById("comentarioModal")
      .getAttribute("data-publicacion-id");

    if (!comentario.trim()) {
      alertify.error("Por favor, escribe un comentario.");
      return;
    }
    try {
      const respuesta = await fetch(
        `http://127.0.0.1:4000/api/publicacion/crear_comentario/${publicacionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre_usuario: nombreUsuario,
            comentario_usuario: comentario,
          }),
        }
      );
      const datos = await respuesta.json();
      if (datos.completado) {
        alertify.success("Comentario agregado correctamente.");
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("comentarioModal")
        );
        modal.hide();
        limpiarTabla();
        cargarTabla();
      } else {
        alertify.error("Error al agregar el comentario: " + datos.mensaje);
      }
    } catch (error) {
      alertify.error("Error en la solicitud: " + error.message);
    }
  });
document.addEventListener("DOMContentLoaded", cargarTabla);
document.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.closest(".btn-toggle-comentarios")) {
    const publicacionId = e.target.closest("button").getAttribute("data-id");
    const comentariosContainer = document.getElementById(
      `comentarios-${publicacionId}`
    );
    const flechaIcono = e.target.closest("button").querySelector("i");
    if (comentariosContainer.style.display === "none") {
      comentariosContainer.style.display = "block";
      flechaIcono.classList.remove("bi-chevron-down");
      flechaIcono.classList.add("bi-chevron-up");
    } else {
      comentariosContainer.style.display = "none";
      flechaIcono.classList.remove("bi-chevron-up");
      flechaIcono.classList.add("bi-chevron-down");
    }
  }
});
function eliminarComentario(id, parametro) {
  alertify.confirm(
    "¿Estás seguro de eliminar este comentario?",
    function (e) {
      fetch(
        `http://127.0.0.1:4000/api/publicacion/${id}/borrar_comentario/${parametro}`,
        { method: "DELETE" }
      )
        .then((res) => res.json())
        .then((res) => {
          alertify.success("Comentario borrado exitosamente");
          limpiarTabla();
          cargarTabla();
        })
        .catch((err) => {
          alertify.error("Error al borrar el comentario: " + err);
        });
    },
    function (e) {}
  );
}

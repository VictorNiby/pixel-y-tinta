const api = "http://127.0.0.1:4000/api/publicacion/";
const apiUsuario = "http://127.0.0.1:4000/api/usuarios/";
const paises = [
  "Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Antigua y Barbuda", "Arabia Saudita", "Argelia", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaiyán", "Bahamas", "Bangladés", "Barbados", "Baréin", "Bélgica", "Belice", "Benín",
  "Bielorrusia", "Birmania", "Bolivia", "Bosnia y Herzegovina", "Botsuana", "Brasil", "Brunéi", "Bulgaria", "Burkina Faso", "Burundi",
  "Bután", "Cabo Verde", "Camboya", "Camerún", "Canadá", "Catar", "Chad", "Chile", "China", "Chipre",
  "Colombia", "Comoras", "Corea del Norte", "Corea del Sur", "Costa de Marfil", "Costa Rica", "Croacia", "Cuba", "Dinamarca", "Dominica",
  "Ecuador", "Egipto", "El Salvador", "Emiratos Árabes Unidos", "Eritrea", "Eslovaquia", "Eslovenia", "España", "Estados Unidos", "Estonia",
  "Esuatini", "Etiopía", "Filipinas", "Finlandia", "Fiyi", "Francia", "Gabón", "Gambia", "Georgia", "Ghana",
  "Granada", "Grecia", "Guatemala", "Guyana", "Guinea", "Guinea ecuatorial", "Guinea-Bisáu", "Haití", "Honduras", "Hungría",
  "India", "Indonesia", "Irak", "Irán", "Irlanda", "Islandia", "Islas Marshall", "Islas Salomón", "Israel", "Italia",
  "Jamaica", "Japón", "Jordania", "Kazajistán", "Kenia", "Kirguistán", "Kiribati", "Kuwait", "Laos", "Lesoto",
  "Letonia", "Líbano", "Liberia", "Libia", "Liechtenstein", "Lituania", "Luxemburgo", "Madagascar", "Malasia", "Malaui",
  "Maldivas", "Malí", "Malta", "Marruecos", "Mauricio", "Mauritania", "México", "Micronesia", "Moldavia", "Mónaco",
  "Mongolia", "Montenegro", "Mozambique", "Namibia", "Nauru", "Nepal", "Nicaragua", "Níger", "Nigeria", "Noruega",
  "Nueva Zelanda", "Omán", "Países Bajos", "Pakistán", "Palaos", "Panamá", "Papúa Nueva Guinea", "Paraguay", "Perú", "Polonia",
  "Portugal", "Reino Unido", "República Centroafricana", "República Checa", "República del Congo", "República Democrática del Congo", "República Dominicana", "Ruanda", "Rumania", "Rusia",
  "Samoa", "San Cristóbal y Nieves", "San Marino", "San Vicente y las Granadinas", "Santa Lucía", "Santo Tomé y Príncipe", "Senegal", "Serbia", "Seychelles", "Sierra Leona",
  "Singapur", "Siria", "Somalia", "Sri Lanka", "Sudáfrica", "Sudán", "Sudán del Sur", "Suecia", "Suiza", "Surinam",
  "Tailandia", "Tanzania", "Tayikistán", "Timor Oriental", "Togo", "Tonga", "Trinidad y Tobago", "Túnez", "Turkmenistán", "Turquía",
  "Tuvalu", "Ucrania", "Uganda", "Uruguay", "Uzbekistán", "Vanuatu", "Vaticano", "Venezuela", "Vietnam", "Yemen",
  "Yibuti", "Zambia", "Zimbabue"
];

function FillModalPerfil(data_usuario) {
  
  document.querySelector('#input_nombre').value = data_usuario.nombre_usuario

  document.querySelector('#img_pfp').setAttribute('src',`/back/uploads/pfp/${data_usuario.img_usuario}`)
  paises.forEach((data)=>{
      const option = document.createElement('option')
      option.value = data
      option.innerHTML = data
      if (data_usuario.pais_usuario == data) {
        option.setAttribute("selected","true")
      }
      document.querySelector('#select_paises').appendChild(option)
  })
}

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

function LoadNavBar(data_user) {

  if (data_user != null) {
    document.querySelector('#perfil').innerHTML = ''
    document.querySelector('#perfil').innerHTML = `
      <div class="dropdown">
            <button class="btn dropdown-toggle w-100" data-bs-toggle="dropdown" >
              <img src="/back/uploads/pfp/${data_user.img_usuario}" alt="Foto de perfil del usuario."
              width="30px"
              class="me-1"
              style="clip-path: circle();">
              <span class="text-light">${data_user.nombre_usuario}</span>
            </button>
          
            <ul class="dropdown-menu w-100">
              <li>
                <button class="dropdown-item text-white"
                id="btn_editar_perfil"
                data-bs-target="#modal_perfil"
                data-bs-toggle = "modal">
                  Editar perfil
                </button>
              </li>

              <li>
                <a class="dropdown-item text-white"
                href="/front/login/login.html"
                id="log_out">
                  Cerrar Sesión
                </a>
              </li>
            </ul>

      </div>
    `
  }
}

async function FillComments(array,data_usuario) {
  let comentarios = await Promise.all(array.comentarios.map(async (comentario) => {
    const img_usuario = await fetch(apiUsuario + `listar_usuario/${comentario.id_usuario}`).then(res => res.json())
    return `
      <div class="card mb-3 border-0 rounded-4 shadow-sm" style="background-color: #2d3338; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <div class="card-body p-4">
              <div class="d-flex align-items-start gap-3">
                  <img src="/back/uploads/pfp/${img_usuario.resultado.img_usuario}" class="img-fluid" width=51px alt="Imagen de cada usuario"
                  style="clip-path:circle()"></img>
                  <div class="flex-grow-1">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                          <p class="mb-0 fw-bold text-info fs-5">@${
                            comentario.nombre_usuario
                          }</p>

                          ${data_usuario != null && data_usuario.id_usuario == comentario.id_usuario ? `
                            
                            <button type="button" class="btn p-0 border-0 bg-transparent btnBorrarComentario" 
                              data-id-comentario="${
                                comentario._id
                              }" 
                              data-id-publicacion="${
                                array._id
                              }">
                              <i class="bi bi-trash-fill text-secondary"></i>
                            </button>


                            

                            ` : ''
                          }
                          
                      </div>
                      <p class="mb-0 text-light fs-6">${
                        comentario.comentario_usuario
                      }</p>
                      <small class="text-light">${calcularTiempoTranscurrido(comentario.fecha_publicacion)}</small>
                  </div>
              </div>
          </div>
      </div>
    `
  }))
  
  return comentarios.join('')
}

async function cargarTabla(data_usuario) {
  await fetch(api + "listar_publicacion")
    .then((res) => res.json())
    .then((res) => {
        const div = document.getElementById("publicaciones");
        res.publicaciones.forEach(async(publicacion) => {
        const nombre_creador = publicacion.nombre_creador
        const tiempoTranscurrido = calcularTiempoTranscurrido(publicacion.fecha_publicacion);
        const numComentarios = publicacion.comentarios.length;
        let comentariosHTML = ""

        if (numComentarios > 0) {

          comentariosHTML = await FillComments(publicacion,data_usuario)
         
        }else{
          comentariosHTML =
          ` 
            <p class="text-center text-muted fs-5 py-4">No hay comentarios aún. Sé el primero en comentar.</p>
          `
        }

        div.innerHTML += `
                    <section class="card mb-4">
                        <div class="card-body">
                            <header class="d-flex justify-content-between">
                                <div class="d-flex align-items-center gap-2">
                                    <span class="fw-bold text-light">@${
                                      nombre_creador
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
                              publicacion.imagen_publicacion != '' ? 
                              `
                                <img src="/back/uploads/post_pics/${publicacion.imagen_publicacion}" alt="Foto del post creado."
                                  class="img-fluid"
                                  
                                >
                              `
                              : ''

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
                                    : `
                                    <button class="btn btn-outline-light btn-toggle-comentarios me-2" data-id="${publicacion._id}">
                                    <i class="bi bi-chevron-down"></i>
                                    </button>`
                                }

                                    <button type="button" class="btn btn-outline-light position-relative me-2" data-id="">
                                    <i class="bi bi-heart"></i>
                                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                                        ${publicacion.likes}
                                        <span class="visually-hidden">número de likes</span>
                                    </span>
                                    </button>
                
                                ${
                                  data_usuario != null && data_usuario.is_admin
                                    ? 
                                    `
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
                
                            <div class="comentarios-container mt-4" id="comentarios-${publicacion._id}" style="display: none;">
                                ${comentariosHTML}
                            </div>
                        </div>
                    </section>
          `
        
      })

      if (data_usuario != null && data_usuario.is_admin) {
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
            const idComentario = e.target.closest("button").getAttribute("data-id-comentario");
            const id = e.target.closest("button").getAttribute("data-id-publicacion");
            eliminarComentario(id, idComentario);
          });

        });
      }

    });
}

function eliminarComentario(id, parametro) {
  alertify.confirm(
    "¿Estás seguro de eliminar este comentario?",
    function (e) {
      fetch(
        api + `${id}/borrar_comentario/${parametro}`,
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
  );
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

async function ActualizarSesion() {
  const data_session = JSON.parse(sessionStorage.getItem("sesion_usuario"))
  const datos_usuario = await fetch(apiUsuario+`listar_usuario/${data_session.id_usuario}`).then(res => res.json())

  data_session.nombre_usuario = datos_usuario.resultado.nombre_usuario
  data_session.pais_usuario = datos_usuario.resultado.pais_usuario
  data_session.img_usuario = datos_usuario.resultado.img_usuario

  sessionStorage.removeItem('sesion_usuario')
  sessionStorage.setItem('sesion_usuario',JSON.stringify(data_session))

  setTimeout(()=>{
    location.reload()
  },700)

}

async function ActualizarPFP(form) {
  const data_session = JSON.parse(sessionStorage.getItem("sesion_usuario"))
  
  const form_data = new FormData(form)
  form_data.append("id",data_session.id_usuario)

  await fetch(apiUsuario + 'subir_imagen',{
      method:"POST",
      body:form_data
  }).then(res => res.json())

}

document.addEventListener('DOMContentLoaded',()=>{
  const session_usuario = JSON.parse(sessionStorage.getItem("sesion_usuario")) || null
  LoadNavBar(session_usuario)
  cargarTabla(session_usuario)

  if (session_usuario != null) {
    FillModalPerfil(session_usuario)
  }
  
  document.getElementById("hagaloPapi").addEventListener("click", crearPublicacion);

  function crearPublicacion(e) {
    e.preventDefault();
    const nombre_publicacion = document.getElementById("titulo").value;
    const id_creador = session_usuario != null ? session_usuario.id_usuario : null;
    const nombre_creador = session_usuario != null ? session_usuario.nombre_usuario : null;
    const contenido_publicacion = document.getElementById("contenido").value;
    const imagen_publicacion = document.getElementById("imagen").value;
    const form = document.getElementById("formPu");

    if (id_creador == null || nombre_creador == null) {
      alertify.error("Aun no has iniciado sesión");
      return
    }

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
        id_creador,
        nombre_creador,
        contenido_publicacion,
        imagen_publicacion,
      }),
    })
    .then((res) => res.json())
    .then(async(res) => {
        if (res.completado) {
          alertify.success("Publicación creada");

          const form_data = new FormData(form)

          await fetch(api+'subir_imagen',{
            method:"POST",
            body:form_data
          })

          limpiarTabla();
          cargarTabla(session_usuario);
          form.reset()
          
        } else {
          alertify.error("No se pudo completar la acción: "+ res.mensaje);
        }
      })
    .catch((err) => {
      alertify.error("Error al crear la publicacion: "+ err);
    })
  
  }

  document.querySelector('#input_pfp').addEventListener('change',()=>{
    const img_url = URL.createObjectURL(document.querySelector('#input_pfp').files[0])

    const extensiones_validas = ["png", "jpg", "jpeg","gif"];

    const file_extension = document.querySelector('#input_pfp').files[0].name.split('.').pop().toLowerCase()

    if (extensiones_validas.includes(file_extension)) {
      document.querySelector('#img_pfp').setAttribute('src',img_url)
    }else{
      alertify.error("No se permiten ese tipo de archivos")
    }

  })

  document.querySelector('#modal_perfil').addEventListener('hidden.bs.modal', () => {
    FillModalPerfil(session_usuario)
  })

  document.querySelector('#form_perfil').addEventListener('submit',async(e)=>{
    e.preventDefault()
    console.log(document.querySelector('#input_pfp').value);
    
    const body_request = {
      nombre_usuario:document.querySelector('#input_nombre').value,
      pais_usuario:document.querySelector('#select_paises').value
    }

    if (!body_request.nombre_usuario.trim().length > 0 || !body_request.pais_usuario.trim().length > 0) {
      alertify.error("Debe ingresar los datos solicitados");
      return
    }

    const request = await fetch(apiUsuario+`editar_usuario/${session_usuario.id_usuario}`,{
      method:"PUT",
      headers:{
        "Content-Type": "application/json",
      },
      body:JSON.stringify(body_request)

    }).then(res => res.json())

    if (request.completado) {

      alertify.success("Datos actualizados!")

      if (document.querySelector('#input_pfp').value != '') {
        const form = document.querySelector('#form_perfil')
        await ActualizarPFP(form)
      }

      await ActualizarSesion()

    }else{
      alertify.error("Ocurrió un error, por favor intentelo más tarde");
    }

  })

  document.getElementById("btnAgregarComentario").addEventListener("click", async () => {
    const idUsuario = session_usuario != null ? session_usuario.id_usuario : null
    const nombreUsuario = session_usuario != null ? session_usuario.nombre_usuario : null
    const comentario = document.getElementById("comentarioUsuario").value;
    const publicacionId = document.getElementById("comentarioModal").getAttribute("data-publicacion-id");

    if (idUsuario == null || nombreUsuario == null) {
      alertify.error("No has iniciado sesion");
      return;
    }
    if (!comentario.trim()) {
      alertify.error("Por favor, escribe un comentario.");
      return;
    }

    try {
      const respuesta = await fetch(
        api + `crear_comentario/${publicacionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_usuario:idUsuario,
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
        cargarTabla(session_usuario);
      } else {
        alertify.error("Error al agregar el comentario: " + datos.mensaje);
      }
    } catch (error) {
      alertify.error("Error en la solicitud: " + error.message);
    }
  });

  document.addEventListener("click", (e) => {
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

    if (e.target.closest(".modalComentario")) {
      const publicacionId = e.target.closest(".modalComentario").getAttribute("data-id");
      document.getElementById("comentarioModal").setAttribute("data-publicacion-id", publicacionId);
      const modal = new bootstrap.Modal(
        document.getElementById("comentarioModal")
      );
      modal.show();
    }

    if (e.target.closest(".btnBorrarComentario")) {
      const id_publicacion = e.target.closest("button").getAttribute("data-id-publicacion");
      const id_comentario = e.target.closest("button").getAttribute("data-id-comentario");
      eliminarComentario(id_publicacion, id_comentario);
    }

    if (e.target.closest("#log_out")) {
      sessionStorage.clear("sesion_usuario")
    }

  });

})









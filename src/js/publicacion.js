const api = "http://127.0.0.1:4000/api/publicacion/";
document.addEventListener('DOMContentLoaded', cargarTabla);
function cargarTabla() {
fetch(api + "listar_publicacion")
.then((res) => res.json())
.then((res) => { 
console.log(res);
res.publicaciones.forEach((publicacion) => {
let div = document.getElementById('publicaciones')
div.insertAdjacentHTML('beforeend', `
            <section class="card mb-4">
<div class="card-body">
<header class="d-flex justify-content-between">
    <div class="d-flex align-items-center gap-2">
        <span class="fw-bold text-light">@${publicacion.creador_publicacion} :</span>
        <span class="text-light">${publicacion.nombre_publicacion}</span>
    </div>
    <span class="text-muted">Hace 2 horas</span>
</header>
<p class="mt-3 text-light">${publicacion.contenido_publicacion}</p>
<p class="mt-3 text-light">${publicacion.imagen_publicacion}</p>

    <button class="btn btn-outline-light me-2"><i class="bi bi-chat"></i><span> 5 </span></button>
    <button class="btn btn-outline-light"><i class="bi bi-heart"></i> <span>${publicacion.likes}</span></button>

</div>
        </section>
`);
div.lastElementChild.offsetHeight;
});
});
}
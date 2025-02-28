const api = "http://127.0.0.1:4000/api/publicacion/";
document.addEventListener('DOMContentLoaded', cargarTabla);
function cargarTabla() {
fetch(api + "listar_publicacion")
.then((res) => res.json())
.then((res) => { 
console.log(res);
res.publicaciones.forEach((publicacion) => {
let div = document.getElementById('algo')
div.insertAdjacentHTML('beforeend', `
    <div class="post">
        <div class="post-header">
            <div class="d-flex align-items-center">
                <div class="username">@${publicacion.creador_publicacion} :</div>
                <div class="post-title">${publicacion.nombre_publicacion}</div>
            </div>
        </div>
        <p>${publicacion.contenido_publicacion}</p>
        <div class="post-footer">
            <div>
                <button class="icon-btn"><i class="bi bi-chat"></i></button>
                <button class="icon-btn"><i class="bi bi-heart"></i><span>${publicacion.likes}</span></button>
            </div>
            <div class="timestamp">Hace 2 horas</div>
        </div>
    </div>
`);
div.lastElementChild.offsetHeight;
});
});
}
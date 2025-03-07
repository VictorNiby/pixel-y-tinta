const form_registro = document.querySelector('#form_registro')
const select_pais_usuario = document.querySelector('#pais_usuario')
const reveal_password = document.querySelector('#reveal_password')
const api_url = "http://localhost:4000/api/usuarios/"
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

//PARA EL CALENDARIO, USTED LO BORRA Y YO LE BORRO LA VIDA
flatpickr("#fecha_usuario", {
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "F j, Y",
    locale: "es",
    theme: "material_green"
});

function Fill_Select_Country() {
    paises.forEach((data)=>{
        const option = document.createElement('option')
        option.value = data
        option.innerHTML = data
        select_pais_usuario.appendChild(option)
    })
}

window.addEventListener('load',()=>{
    

    Fill_Select_Country()
    select_pais_usuario.addEventListener('click',()=>{
        let first_option = document.querySelector('#fist_option')
        select_pais_usuario.removeChild(first_option)
    })

    reveal_password.addEventListener('click',()=>{
        if (document.querySelector('#password_usuario').type == "password") {
            document.querySelector('#password_usuario').type = "text"

            document.querySelector('.icon_password').classList.remove("bi-eye")
            document.querySelector('.icon_password').classList.add("bi-eye-slash")
        }else{
            document.querySelector('#password_usuario').type = "password"

            document.querySelector('.icon_password').classList.remove("bi-eye-slash")
            document.querySelector('.icon_password').classList.add("bi-eye")
        }
    })

    form_registro.addEventListener('submit',async(e)=>{
        e.preventDefault()

        const nombre_usuario = document.querySelector('#nombre_usuario').value
        const fecha_usuario = document.querySelector('#fecha_usuario').value
        const correo_usuario = document.querySelector('#correo_usuario').value
        const password_usuario = document.querySelector('#password_usuario').value
        let pais_usuario

        if (paises.some(data => data.includes(document.querySelector('#pais_usuario').value))) {
            pais_usuario = document.querySelector('#pais_usuario').value
        }else{
            pais_usuario = ""
        }
        
        const object_data = {
                nombre_usuario:nombre_usuario,
                fecha_nacimiento:fecha_usuario,
                correo_usuario:correo_usuario,
                password_usuario:password_usuario,
                pais_usuario:pais_usuario
        }
        
        const request = await fetch(api_url+"insertar_usuario",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify(object_data)
        }).then(res => res.json())

        request.completado ?  alertify.success(`${request.mensaje}`) : alertify.error(`${request.mensaje}`)

        if (request.completado) {
            setTimeout(() => {
                window.location.replace("http://127.0.0.1:5500/front/login/login.html")
            }, 500);
        }

    })
})
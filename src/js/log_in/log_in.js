const form_login = document.querySelector('#form_login')
const api_url = "http://localhost:4000/api/usuarios/"
document.addEventListener('DOMContentLoaded',()=>{

    reveal_password.addEventListener('click',()=>{
        if (document.querySelector('#password_usuario').type == "password") {
            document.querySelector('#password_usuario').type = "text"

            document.querySelector('#icon_password').classList.remove("bi-eye")
            document.querySelector('#icon_password').classList.add("bi-eye-slash")
        }else{
            document.querySelector('#password_usuario').type = "password"

            document.querySelector('#icon_password').classList.remove("bi-eye-slash")
            document.querySelector('#icon_password').classList.add("bi-eye")
        }
    })

    form_login.addEventListener('submit',async(e)=>{
        e.preventDefault()
        const correo_usuario = document.querySelector('#correo_usuario').value
        const password_usuario = document.querySelector('#password_usuario').value
        const response_body = {
            correo_usuario:correo_usuario,
            password_usuario:password_usuario
        }

        const request = await fetch(api_url+'log_in',{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify(response_body)
        }).then(res => res.json())
        
        request.completado ?  alertify.success(`${request.mensaje}`) : alertify.error(`${request.mensaje}`)

        if (request.completado) {
            setTimeout(() => {
                window.location.replace("http://127.0.0.1:5500/front/index.html")
            }, 500);
        }

    })
})

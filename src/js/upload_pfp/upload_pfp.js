const input_imagen = document.querySelector('#input_imagen')
const pfp_usuario = document.querySelector('#pfp_usuario')
const api_url = "http://localhost:4000/api/usuarios/"
const form_pfp  = document.querySelector('#form_pfp')

window.addEventListener('load',()=>{

    async function Subir_PFP(form) {
        const data_session = JSON.parse(sessionStorage.getItem("sesion_usuario"))
        
        const form_data = new FormData(form)
        form_data.append("id",data_session.id_usuario)

        const request = await fetch(api_url + 'subir_imagen',{
            method:"POST",
            body:form_data
        }).then(res => res.json())

        request.completado ? alertify.success(`${request.mensaje}`) : alertify.error(`${request.mensaje}`)

        if (request.completado) {

            const img_usuario = await fetch(api_url+`listar_usuario/${data_session.id_usuario}`).then(res => res.json())
            
            data_session.img_usuario = img_usuario.resultado.img_usuario

            sessionStorage.removeItem('sesion_usuario')
            sessionStorage.setItem('sesion_usuario',JSON.stringify(data_session))

            setTimeout(()=>{
                window.location.replace("../index.html")
            },1000)
        }
    }

    input_imagen.addEventListener('change',()=>{
        let img_url = URL.createObjectURL(input_imagen.files[0])
        
        pfp_usuario.setAttribute('src',img_url)
    
        pfp_usuario.style.clipPath = "circle()"
    })

    form_pfp.addEventListener('submit',async(e)=>{
        e.preventDefault()

        if (input_imagen.value != "") {
            await Subir_PFP(form_pfp)

        }else{
            alertify.error("No seleccionó ninguna imagen.")
        }
    })
})


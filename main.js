const textArea = document.getElementById("respuesta")
const contador = document.getElementById("palabras-escritas")
const contadorWrapper = document.getElementById("contador")
const maxWords = 230
const minWords = 120
const submitBtn = document.getElementById("submit")

const modal = document.getElementById("modalExito");
const cerrarModal = document.getElementById("cerrarModal");

const contadorHandler = () => {
    const texto = textArea.value.trim()
    
    textArea.style.height = "auto"
    textArea.style.height = textArea.scrollHeight + "px"

    if (texto === "") {
        contador.innerText = 0
        return
    }

    const numPalabras = texto.split(" ").filter(Boolean).length 
    contador.innerText = numPalabras

    switch (true) {           
        case (numPalabras > maxWords):
            console.log("Has excedido el número máximo de palabras permitido.")
            contadorWrapper.className = 'wordcount-exceeded'
            submitBtn.disabled = true
            break
            
        case (numPalabras >= minWords && numPalabras <= maxWords):
            console.log("ok")
            contadorWrapper.className = 'wordcount-fulfilled'
            submitBtn.disabled = false
            break
            
        case (numPalabras < minWords):
            console.log("Faltan palabras")
            contadorWrapper.className = 'wordcount-default'
            submitBtn.disabled = true
            break
            
        default:
            console.log("Nada que observar")
    }
}

textArea.addEventListener("input", contadorHandler)

document.addEventListener("DOMContentLoaded", contadorHandler)


const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbySzwKFoyu65pvBcbNJZQKossUnKUJHk1aFoyhjZSCLjPnbbrgJLiOWv-PNySUALjQgLw/exec"

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault()
    
    const contenido = textArea.value
    const wordcount = contenido.split(/\s+/).filter(Boolean).length
    
    // 1. Feedback visual inmediato: cambiamos el icono a uno de carga o lo deshabilitamos
    submitBtn.innerHTML = `<span class="material-symbols-outlined">sync</span>` // Icono de sincronización/carga
    submitBtn.disabled = true

    try {
        await fetch(URL_SCRIPT, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                texto: contenido, 
                conteo: wordcount 
            })
        })
        
        // 2. Éxito: Mostramos el círculo de verificado
        submitBtn.innerHTML = `<span class="material-symbols-outlined">check_circle</span>`
        submitBtn.style.backgroundColor = "#28a745" // Cambia a verde éxito
        
        setTimeout(() => {
            // Limpiamos todo tras 2 segundos de éxito
            textArea.value = ""     
            contadorHandler()
             modal.showModal(); // Abre el modal nativo
       
            // Restauramos el botón original
            submitBtn.innerHTML = `<span class="material-symbols-outlined">send</span>`
            submitBtn.style.backgroundColor = "#3085d6"
        }, 2000)

        contadorWrapper.className = 'wordcount-default'

    } catch (error) {
        console.error("Error:", error)
        alert("Hubo un problema.")
        // Restauramos el icono de enviar si falla
        submitBtn.innerHTML = `<span class="material-symbols-outlined">send</span>`
        submitBtn.disabled = false
    }
})

cerrarModal.addEventListener("click", () => {
    modal.close();
});
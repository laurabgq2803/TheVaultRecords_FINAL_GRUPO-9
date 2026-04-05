// obtengo el formulario usando su id
const form = document.getElementById("contactForm");

// obtengo el elemento donde voy a mostrar mensajes
const formMessage = document.getElementById("formMessage");

// escucho cuando se envía el formulario
form.addEventListener("submit", function(e){

  // evito que la página se recargue al enviar
  e.preventDefault();

  // obtengo los valores de los inputs
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  // verifico si algún campo está vacío
  if(nombre === "" || correo === "" || telefono === "" || mensaje === ""){
    
    // muestro mensaje de error
    formMessage.textContent = "Por favor completa todos los campos.";
    formMessage.style.color = "#b22222";

    return; // detengo la ejecución
  }

  // si todo está bien, muestro mensaje de éxito
  formMessage.textContent = "¡Mensaje enviado con éxito!";
  formMessage.style.color = "#2e6f35";

  // limpio el formulario
  form.reset();
});
// selecciono el botón que tiene la clase "home-btn"
const homeBtn = document.querySelector(".home-btn");

// escucho cuando se hace click en el botón
homeBtn.addEventListener("click", function(e){

  // evito el comportamiento por defecto (por si es un link)
  e.preventDefault();

  // hago que la página suba hasta arriba suavemente
  window.scrollTo({
    top: 0, // posición arriba del todo
    behavior: "smooth" // animación suave
  });
});
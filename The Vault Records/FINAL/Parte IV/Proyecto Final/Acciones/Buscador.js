//MENU LATERAL
function toggleMenu(){
    const menu = document.getElementById("menu-lateral");
    const boton = document.querySelector(".menu-button");

    menu.classList.toggle("activo");
}
// Al ejecutarse:
// 1. Selecciona el elemento con id "menu-lateral" (el menú).
// 2. Selecciona el elemento con clase ".menu-button" (el botón que lo activa).
// 3. Alterna (agrega o quita) la clase "activo" en el menú usando classList.toggle().
// Esto permite mostrar u ocultar el menú dinámicamente cada vez que se llama la función.

// BUSCADOR DE ARTISTAS
let buscador = document.getElementById("inputBuscador");

buscador.addEventListener("keyup", buscarArtista);

function buscarArtista(){

    let texto = buscador.value.toLowerCase();

    let grupos = document.querySelectorAll(".grupo-artista");

    grupos.forEach(function(grupo){

        let nombre = grupo.dataset.artista;

        if(nombre.includes(texto)){

            grupo.style.display = "block";

        }else{

            grupo.style.display = "none";

        }

    });

}
// Primero obtiene el input con id "inputBuscador" 
// Luego ejecuta la función buscarArtista, que:
// 1. Captura el texto ingresado y lo convierte a minúsculas.
// 2. Selecciona todos los elementos con la clase ".grupo-artista".
// 3. Recorre cada elemento y obtiene el nombre del artista desde su atributo data-artista.
// 4. Compara si el nombre del artista incluye el texto ingresado.
// 5. Si coincide, muestra el elemento (display: "block"); si no, lo oculta (display: "none").
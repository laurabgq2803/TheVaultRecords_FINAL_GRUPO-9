/**
 * THE VAULT RECORDS - Lógica de Galería e Interactividad
 * Este script gestiona el slider principal y el carrusel de productos.
 */

// --- 1. CONFIGURACIÓN SLIDER PRINCIPAL (HERO) ---

// Gestión de Estado: Define 7 diapositivas y rastrea la actual.
let currentSlide = 0;
const slider = document.querySelector('.slider');
const dots = document.querySelectorAll('.dot');
const totalSlides = 7;

/**
 * Sincronización de Indicadores: Actualiza la posición visual del slider
 * y resalta el punto (.dot) correspondiente a la imagen actual.
 */
function updateSlider() {
    if (!slider) return; // Seguridad por si el elemento no existe
    slider.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

/**
 * Movimiento Matemático: Utiliza el operador de módulo (%) para que 
 * el slider sea infinito (vuelva al inicio al terminar).
 */
function moveSlide(direction) {
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateSlider();
}

function currentSlidePos(pos) {
    currentSlide = pos;
    updateSlider();
}

// Auto-play: Desplazamiento automático cada 6 segundos.
setInterval(() => moveSlide(1), 6000);


// --- 2. LÓGICA DE "NEW ARRIVALS" (PRODUCTOS) ---

let currentArrivalPos = 0;

/**
 * Detección de Dispositivo: Verifica el ancho de la ventana para 
 * determinar cuántos items mostrar simultáneamente.
 */
function getVisibleArrivalItems() {
    if (window.innerWidth <= 767) return 1;  // Celular
    if (window.innerWidth <= 1023) return 2; // Tablet
    return 3;                                // Escritorio
}

/**
 * Control de Carrusel de Productos: Gestiona el desplazamiento 
 * y aplica el cálculo de límites para evitar espacios vacíos.
 */
function moveArrivals(direction) {
    const arrivalsSlider = document.getElementById('arrivals-slider');
    if (!arrivalsSlider) return;

    const totalItems = 5;
    const visibleItems = getVisibleArrivalItems();
    
    // Cálculo de Límites: Evita que el carrusel se desplace más allá del contenido.
    const maxPos = Math.max(totalItems - visibleItems, 0);

    currentArrivalPos += direction;

    if (currentArrivalPos < 0) currentArrivalPos = 0;
    if (currentArrivalPos > maxPos) currentArrivalPos = maxPos;

    arrivalsSlider.style.transform = `translateX(-${currentArrivalPos * (100 / visibleItems)}%)`;
}

/**
 * Ajuste Dinámico: El "escuchador" recalcula la posición al 
 * cambiar el tamaño de la ventana o girar el celular.
 */
window.addEventListener('resize', () => moveArrivals(0));

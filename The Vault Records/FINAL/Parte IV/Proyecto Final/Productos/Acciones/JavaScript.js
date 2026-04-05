/* =========================
   CONFIGURACIÓN GENERAL
========================= */
// Define constantes clave del sistema del carrito:
// - Clave para guardar en localStorage.
// - Ruta de la página del carrito.
// - Selectores e identificadores de los íconos del carrito.
// - Clases CSS para estilos visuales (estado con items y animaciones).

const CART_STORAGE_KEY = "theVaultCart";
const CART_PAGE_PATH = "../../../Parte V/Venta de Vinilos/carrito.html";
const CART_ICON_SELECTOR = "#barra > span:last-child, .cart-link, .simbolo-superior";
const CART_ICON_CLASS = "icono-carrito";
const CART_NOTICE_CLASS = "carrito-con-items";
const CART_ANIMATION_CLASS = "carrito-alerta-animada";


/* =========================
   GESTIÓN DEL CARRITO (LOCALSTORAGE)
========================= */
// Obtiene el carrito desde localStorage.
// Si hay error o datos inválidos, devuelve un arreglo vacío.
function getCart() {
    try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        const parsedCart = storedCart ? JSON.parse(storedCart) : [];
        return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
        return [];
    }
}

// Guarda el carrito en localStorage y sincroniza los indicadores visuales.
function saveCart(cart) {
    const safeCart = Array.isArray(cart) ? cart : [];

    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(safeCart));
    } catch (error) {
        // Si el navegador bloquea storage, evitamos romper la página.
    }

    syncCartIndicators({ cart: safeCart });
}

/* =========================
   UTILIDADES
========================= */
// Formatea números como moneda.
function formatCurrency(value) {
    return `$${(Number(value) || 0).toFixed(2)}`;
}

// Calcula el total del carrito (precio * cantidad).
function getCartTotal(cart = getCart()) {
    return cart.reduce(function(sum, item) {
        return sum + (Number(item.price) || 0) * (Number(item.quantity) || 0);
    }, 0);
}

// Verifica si el carrito tiene al menos un producto válido.
function cartHasItems(cart = getCart()) {
    return cart.some(function(item) {
        const quantity = Number(item && item.quantity);
        return Number.isFinite(quantity) ? quantity > 0 : Boolean(item);
    });
}

// Convierte un texto de precio a número.
function normalizePrice(priceText) {
    const numericValue = String(priceText || "").replace(/[^0-9.]+/g, "");
    return Number.parseFloat(numericValue) || 0;
}

// Genera un ID limpio (slug) a partir de texto.
function slugify(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/* =========================
   CONTROL DE CANTIDAD
========================= */
// Actualiza la cantidad del producto en pantalla (mínimo 1).
function updateQuantity(nextQuantity) {
    const numero = document.getElementById("numero");

    if (!numero) {
        return 1;
    }

    const quantity = Math.max(1, Number.parseInt(nextQuantity, 10) || 1);
    numero.textContent = String(quantity);
    return quantity;
}

// Incrementa la cantidad.
function aumentar() {
    const numero = document.getElementById("numero");
    const cantidad = Number.parseInt(numero && numero.textContent, 10) || 1;

    updateQuantity(cantidad + 1);
}

// Disminuye la cantidad.
function disminuir() {
    const numero = document.getElementById("numero");
    const cantidad = Number.parseInt(numero && numero.textContent, 10) || 1;

    updateQuantity(cantidad - 1);
}

/* =========================
   EFECTOS VISUALES
========================= */
// Cambia temporalmente el color de un botón.
function cambiarColor(boton) {
    if (!boton) {
        return;
    }

    boton.style.backgroundColor = "#555";

    setTimeout(function() {
        boton.style.backgroundColor = "black";
    }, 200);
}

/* =========================
   CONSTRUCCIÓN DEL PRODUCTO
========================= */
// Extrae la información del producto desde el DOM actual.
function buildProductData() {
    const titleNode = document.querySelector("#derecha h2") || document.querySelector("#izquierda h2");
    const priceNode = document.querySelector(".precio");
    const imageNode = document.querySelector(".imagen");
    const fileName = decodeURIComponent((window.location.pathname.split("/").pop() || "").replace(/\.html$/i, ""));

    return {
        id: slugify(fileName || (titleNode && titleNode.textContent) || "producto"),
        name: titleNode ? titleNode.textContent.trim() : fileName,
        price: normalizePrice(priceNode ? priceNode.textContent : ""),
        image: imageNode ? new URL(imageNode.getAttribute("src"), window.location.href).href : "",
        quantity: updateQuantity(document.getElementById("numero") ? document.getElementById("numero").textContent : 1),
        productPath: window.location.href.split("#")[0]
    };
}

/* =========================
   LÓGICA DEL CARRITO
========================= */
// Agrega un producto al carrito o actualiza su cantidad si ya existe.
function addItemToCart(product) {
    if (!product || !product.id) {
        return getCart();
    }

    const cart = getCart();
    const existingItem = cart.find(function(item) {
        return item.id === product.id;
    });

    if (existingItem) {
        existingItem.quantity = (Number(existingItem.quantity) || 0) + (Number(product.quantity) || 1);
        existingItem.name = product.name;
        existingItem.price = product.price;
        existingItem.image = product.image;
        existingItem.productPath = product.productPath;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: Number(product.quantity) || 1,
            productPath: product.productPath
        });
    }

    saveCart(cart);
    return cart;
}

// Redirige a la página del carrito.
function goToCart() {
    window.location.href = CART_PAGE_PATH;
}

/* =========================
   INDICADORES VISUALES DEL CARRITO
========================= */
// Obtiene todos los íconos del carrito en la página.
function getCartIcons() {
    return Array.from(document.querySelectorAll(CART_ICON_SELECTOR));
}

// Sincroniza el estado visual del carrito (íconos, animaciones, etc.).
function syncCartIndicators(options) {
    const config = options || {};
    const cart = Array.isArray(config.cart) ? config.cart : getCart();
    const hasItems = cartHasItems(cart);
    const shouldAnimate = Boolean(config.animate) && hasItems;

    getCartIcons().forEach(function(cartIcon) {
        cartIcon.classList.add(CART_ICON_CLASS);
        cartIcon.classList.remove(CART_ANIMATION_CLASS);

        if (hasItems) {
            cartIcon.classList.add(CART_NOTICE_CLASS);

            if (shouldAnimate) {
                void cartIcon.offsetWidth;
                cartIcon.classList.add(CART_ANIMATION_CLASS);
            }
        } else {
            cartIcon.classList.remove(CART_NOTICE_CLASS);
        }
    });

    return hasItems;
}

// Muestra animación cuando se agrega un producto.
function showCartNotice(cart) {
    syncCartIndicators({
        cart: cart,
        animate: true
    });
}

/* =========================
   EVENTOS EN LA PÁGINA DE PRODUCTO
========================= */
// Asigna eventos a botones (agregar/comprar) y al ícono del carrito.
function attachProductPageActions() {
    const actionButtons = Array.from(document.querySelectorAll(".botones .boton"));
    const cartIcon = document.querySelector("#barra > span:last-child");

    // Configura el ícono del carrito como botón accesible.
    if (cartIcon) {
        cartIcon.classList.add(CART_ICON_CLASS);
        cartIcon.style.cursor = "pointer";
        cartIcon.setAttribute("role", "link");
        cartIcon.setAttribute("tabindex", "0");
        cartIcon.setAttribute("aria-label", "Abrir carrito");
        cartIcon.addEventListener("click", goToCart);
        cartIcon.addEventListener("keydown", function(event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                goToCart();
            }
        });
    }

    syncCartIndicators();

    if (!actionButtons.length) {
        return;
    }

    // Botón "Agregar al carrito"
    const addButton = actionButtons.find(function(button) {
        return button.textContent.toUpperCase().includes("AGREGAR");
    });

    // Botón "Comprar ahora"
    const buyButton = actionButtons.find(function(button) {
        return button.textContent.toUpperCase().includes("COMPRAR");
    });

    if (addButton) {
        addButton.addEventListener("click", function(event) {
            event.preventDefault();
            const cart = addItemToCart(buildProductData());
            showCartNotice(cart);
        });
    }

    if (buyButton) {
        buyButton.addEventListener("click", function(event) {
            event.preventDefault();
            const cart = addItemToCart(buildProductData());
            showCartNotice(cart);
            goToCart();
        });
    }
}

/* =========================
   INICIALIZACIÓN Y EVENTOS GLOBALES
========================= */
// Ejecuta la configuración al cargar la página.
attachProductPageActions();

window.addEventListener("storage", function(event) {
    if (event.key === CART_STORAGE_KEY || event.key === null) {
        syncCartIndicators();
    }
});

// Expone funciones del carrito globalmente 
window.TheVaultCart = {
    key: CART_STORAGE_KEY,
    getCart: getCart,
    saveCart: saveCart,
    addItemToCart: addItemToCart,
    formatCurrency: formatCurrency,
    getCartTotal: getCartTotal,
    cartHasItems: cartHasItems,
    syncCartIndicators: syncCartIndicators
};

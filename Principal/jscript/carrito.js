"use strict";

// Se obtiene la API global del carrito para reutilizar la lógica compartida
// de almacenamiento, formateo y sincronización visual.
const cartApi = window.TheVaultCart;
const cartForm = document.getElementById("cartForm");
const cartItemsContainer = document.getElementById("cartItems");
const totalNode = document.getElementById("cartTotal");
const payTotalInput = document.getElementById("payTotalInput");
const checkoutButton = document.getElementById("checkoutButton");

function escapeHtml(value) {
  // Convierte caracteres especiales para evitar que el contenido dinámico
  // insertado en innerHTML rompa la estructura visual del documento.
  return String(value || "").replace(/[&<>"']/g, function(character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    }[character];
  });
}

function renderCart() {
  // Lee el carrito actual, calcula el total y repinta toda la interfaz
  // cada vez que cambia una cantidad o se elimina un producto.
  const cart = cartApi ? cartApi.getCart() : [];
  const total = cartApi ? cartApi.getCartTotal(cart) : 0;
  const formattedTotal = cartApi ? cartApi.formatCurrency(total) : "$0.00";

  if (cartApi && cartApi.syncCartIndicators) {
    // Mantiene sincronizado el estado visual del icono del carrito
    // con el contenido real almacenado.
    cartApi.syncCartIndicators({ cart: cart });
  }

  totalNode.textContent = formattedTotal;
  payTotalInput.value = formattedTotal;

  if (!cart.length) {
    // Si no hay productos, muestra un mensaje vacío y bloquea la continuidad al pago.
    cartItemsContainer.classList.add("vacia");
    cartItemsContainer.innerHTML = '<p class="carrito-vacio">Tu carrito est&aacute; vac&iacute;o.</p>';
    checkoutButton.disabled = true;
    return;
  }

  cartItemsContainer.classList.remove("vacia");
  checkoutButton.disabled = false;
  cartItemsContainer.innerHTML = cart.map(function(item, index) {
    // Se prepara cada dato del producto antes de construir la plantilla HTML.
    const itemId = escapeHtml(item.id);
    const itemName = escapeHtml(item.name);
    const itemImage = escapeHtml(item.image);
    const unitPrice = cartApi.formatCurrency(item.price);
    const subtotal = cartApi.formatCurrency((Number(item.price) || 0) * (Number(item.quantity) || 0));

    return `
      <article class="articulo-carrito">
        <div class="marco-imagen">
          <img src="${itemImage}" alt="Portada de ${itemName}">
        </div>

        <div class="info-articulo">
          <h2 class="titulo-articulo">${itemName}</h2>
          <p class="precio-articulo">Precio unitario: ${unitPrice}</p>
          <p class="subtotal-articulo">Subtotal: ${subtotal}</p>
        </div>

        <div class="panel-cantidad">
          <p class="etiqueta-cantidad">Cantidad</p>
          <div class="caja-cantidad" role="group" aria-label="Cantidad de ${itemName}">
            <button class="boton-cantidad" type="button" aria-label="Disminuir cantidad de ${itemName}" data-action="decrease" data-id="${itemId}">-</button>
            <span class="valor-cantidad" aria-live="polite" aria-atomic="true">${item.quantity}</span>
            <button class="boton-cantidad" type="button" aria-label="Aumentar cantidad de ${itemName}" data-action="increase" data-id="${itemId}">+</button>
          </div>
          <button class="boton-eliminar" type="button" data-action="remove" data-id="${itemId}">Eliminar</button>
        </div>
      </article>
      ${index < cart.length - 1 ? '<div class="divisor-articulo" aria-hidden="true"></div>' : ''}
    `;
  }).join("");
}

cartItemsContainer.addEventListener("click", function(event) {
  // Este listener delegado detecta qué botón de acción se pulsó dentro
  // del listado dinámico: aumentar, disminuir o eliminar.
  const actionButton = event.target.closest("[data-action]");

  if (!actionButton || !cartApi) {
    return;
  }

  const action = actionButton.dataset.action;
  const productId = actionButton.dataset.id;
  const cart = cartApi.getCart();
  const itemIndex = cart.findIndex(function(item) {
    return item.id === productId;
  });

  if (itemIndex === -1) {
    return;
  }

  if (action === "increase") {
    // Incrementa en una unidad la cantidad del producto seleccionado.
    cart[itemIndex].quantity = (Number(cart[itemIndex].quantity) || 0) + 1;
  }

  if (action === "decrease") {
    // Solo disminuye la cantidad si el producto tiene más de una unidad.
    const currentQuantity = Number(cart[itemIndex].quantity) || 1;

    if (currentQuantity > 1) {
      cart[itemIndex].quantity = currentQuantity - 1;
    }
  }

  if (action === "remove") {
    // Elimina por completo el producto del arreglo del carrito.
    cart.splice(itemIndex, 1);
  }

  // Guarda el nuevo estado y vuelve a renderizar la vista actualizada.
  cartApi.saveCart(cart);
  renderCart();
});

cartForm.addEventListener("submit", function(event) {
  // Antes de enviar al pago, se valida que todavía existan productos
  // y se actualiza el campo oculto con el total visible.
  if (!cartApi || !cartApi.getCart().length) {
    event.preventDefault();
    return;
  }

  payTotalInput.value = totalNode.textContent;
});

// Primera renderización al cargar la página.
renderCart();

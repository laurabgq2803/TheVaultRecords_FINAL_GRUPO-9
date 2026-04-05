"use strict";

// Se obtienen referencias al carrito global, al total mostrado y a las
// acciones que marcan el cierre del flujo de compra.
const cartApi = window.TheVaultCart;
const totalFromCart = new URLSearchParams(window.location.search).get("payTotal");
const payTotalDisplay = document.getElementById("payTotalDisplay");
const finishPurchase = document.getElementById("finishPurchase");
const exitToGallery = document.getElementById("exitToGallery");

if (totalFromCart) {
  // Si el total fue enviado desde el carrito, se usa ese valor directamente.
  payTotalDisplay.textContent = totalFromCart;
} else if (cartApi) {
  // Como respaldo, se recalcula el total con los datos persistidos en el carrito.
  payTotalDisplay.textContent = cartApi.formatCurrency(cartApi.getCartTotal());
}

function clearCart() {
  // Vacía completamente el carrito una vez que el usuario finaliza
  // la compra o sale desde el modal de confirmación.
  if (cartApi) {
    cartApi.saveCart([]);
  }
}

// Ambos eventos reutilizan la misma función para limpiar el carrito
// al cerrar el proceso de compra desde cualquiera de las dos acciones.
finishPurchase.addEventListener("click", clearCart);
exitToGallery.addEventListener("click", clearCart);

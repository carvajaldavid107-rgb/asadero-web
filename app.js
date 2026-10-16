// CONFIGURACIÓN: cambia estos datos antes de publicar la página.
const BUSINESS = {
  name: "Asadero El Pollo Feliz",
  // Escribe el número con indicativo de país, solo dígitos. Colombia: 57 + número.
  // Ejemplo de formato: "573001234567". Reemplázalo por el número real del negocio.
  whatsapp: "573003980400",
  address: "Agrega aquí la dirección real del negocio"
};

// Productos de ejemplo. Cambia nombres, descripciones, precios e imágenes.
const products = [
  { id: 1, name: "Pollo asado entero", description: "Pollo asado para compartir.", price: 35000, emoji: "🍗", image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=700&q=80" },
  { id: 2, name: "1/4 de pollo", description: "Porción individual con acompañamiento.", price: 13000, emoji: "🍗", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=700&q=80" },
  { id: 3, name: "Pechuga a la parrilla", description: "Pechuga dorada y jugosa.", price: 15000, emoji: "🍽️", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80" },
  { id: 4, name: "Combo familiar", description: "Opción para compartir en familia.", price: 70000, emoji: "👨‍👩‍👧‍👦", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80" },
  { id: 5, name: "Papas a la francesa", description: "Porción de papas crocantes.", price: 8000, emoji: "🍟", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80" },
  { id: 6, name: "Gaseosa personal", description: "Bebida fría para acompañar.", price: 4000, emoji: "🥤", image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=700&q=80" },
  { id: 7, name: "Arepa rellena", description: "Arepa con pollo y queso.", price: 8000, emoji: "🫓", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80" },
  { id: 8, name: "Ensalada de la casa", description: "Acompañamiento fresco.", price: 6000, emoji: "🥗", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80" }
];

const cart = {};
const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const menuCount = document.getElementById("menuCount");
const orderForm = document.getElementById("orderForm");
const orderType = document.getElementById("orderType");
const addressWrap = document.getElementById("addressWrap");
const customerAddress = document.getElementById("customerAddress");
const formMessage = document.getElementById("formMessage");

function formatMoney(amount) {
  return amount.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

function renderProducts() {
  productGrid.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const photo = document.createElement("div");
    photo.className = "product-photo";
    photo.style.backgroundImage = `url("${product.image}")`;
    photo.textContent = product.emoji;
    photo.setAttribute("aria-label", product.name);
    photo.style.backgroundBlendMode = "multiply";

    const info = document.createElement("div");
    info.className = "product-info";

    const title = document.createElement("h3");
    title.textContent = product.name;
    const description = document.createElement("p");
    description.textContent = product.description;

    const bottom = document.createElement("div");
    bottom.className = "product-bottom";
    const price = document.createElement("span");
    price.className = "price";
    price.textContent = formatMoney(product.price);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "add-button";
    button.textContent = "＋ Agregar al pedido";
    button.addEventListener("click", () => addToCart(product.id));

    bottom.append(price, button);
    info.append(title, description, bottom);
    card.append(photo, info);
    productGrid.appendChild(card);
  });
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  formMessage.textContent = "";
}

function changeQuantity(id, amount) {
  cart[id] = (cart[id] || 0) + amount;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

function removeItem(id) {
  delete cart[id];
  renderCart();
}

function getCartSummary() {
  const items = products
    .filter(product => cart[product.id])
    .map(product => ({
      ...product,
      quantity: cart[product.id],
      subtotal: product.price * cart[product.id]
    }));
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return { items, total, count };
}

function renderCart() {
  const summary = getCartSummary();
  cartItems.innerHTML = "";

  if (summary.items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-cart";
    empty.textContent = "Todavía no has agregado productos.";
    cartItems.appendChild(empty);
  } else {
    summary.items.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-row";

      const details = document.createElement("div");
      const name = document.createElement("div");
      name.className = "cart-name";
      name.textContent = item.name;
      const unit = document.createElement("div");
      unit.className = "cart-unit";
      unit.textContent = `${formatMoney(item.price)} c/u · Subtotal: ${formatMoney(item.subtotal)}`;
      const remove = document.createElement("button");
      remove.className = "remove-button";
      remove.type = "button";
      remove.textContent = "Eliminar";
      remove.addEventListener("click", () => removeItem(item.id));
      details.append(name, unit, remove);

      const controls = document.createElement("div");
      controls.className = "cart-controls";
      const minus = document.createElement("button");
      minus.className = "qty-button";
      minus.type = "button";
      minus.textContent = "−";
      minus.setAttribute("aria-label", `Quitar una unidad de ${item.name}`);
      minus.addEventListener("click", () => changeQuantity(item.id, -1));
      const quantity = document.createElement("span");
      quantity.className = "qty-number";
      quantity.textContent = item.quantity;
      const plus = document.createElement("button");
      plus.className = "qty-button";
      plus.type = "button";
      plus.textContent = "+";
      plus.setAttribute("aria-label", `Agregar una unidad de ${item.name}`);
      plus.addEventListener("click", () => changeQuantity(item.id, 1));
      controls.append(minus, quantity, plus);
      row.append(details, controls);
      cartItems.appendChild(row);
    });
  }

  cartTotal.textContent = formatMoney(summary.total);
  menuCount.textContent = `${summary.count} ${summary.count === 1 ? "producto" : "productos"} en tu pedido`;
}

function updateAddressRequirement() {
  const isDelivery = orderType.value === "Domicilio";
  addressWrap.hidden = !isDelivery;
  customerAddress.required = isDelivery;
}
orderType.addEventListener("change", updateAddressRequirement);

document.getElementById("clearCart").addEventListener("click", () => {
  Object.keys(cart).forEach(id => delete cart[id]);
  renderCart();
  formMessage.textContent = "";
});

orderForm.addEventListener("submit", event => {
  event.preventDefault();
  formMessage.textContent = "";

  const summary = getCartSummary();
  if (summary.items.length === 0) {
    formMessage.textContent = "Agrega por lo menos un producto antes de enviar el pedido.";
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const type = orderType.value;
  const address = customerAddress.value.trim();
  const notes = document.getElementById("customerNotes").value.trim();

  if (!name) {
    formMessage.textContent = "Escribe tu nombre para continuar.";
    return;
  }
  if (type === "Domicilio" && !address) {
    formMessage.textContent = "Escribe la dirección del domicilio.";
    customerAddress.focus();
    return;
  }

  // Cambia BUSINESS.whatsapp por el número real antes de publicar.
  const phone = BUSINESS.whatsapp.replace(/\D/g, "");
  if (!phone || phone === "573234385279" || phone.length < 10) {
    formMessage.textContent = "La página todavía no tiene el WhatsApp real del negocio. Configúralo en app.js antes de publicar.";
    return;
  }

  const lines = [
    `Hola, quiero hacer un pedido en ${BUSINESS.name}.`,
    "",
    "MI PEDIDO:"
  ];
  summary.items.forEach(item => {
    lines.push(`• ${item.quantity} x ${item.name} — ${formatMoney(item.subtotal)}`);
  });
  lines.push("", `TOTAL DE PRODUCTOS: ${formatMoney(summary.total)}`, `Nombre: ${name}`, `Tipo: ${type}`);
  if (type === "Domicilio") lines.push(`Dirección: ${address}`);
  if (notes) lines.push(`Notas: ${notes}`);
  lines.push("", "Por favor, confirmen disponibilidad, costo del domicilio y total final.");

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

document.getElementById("menuToggle").addEventListener("click", () => {
  const nav = document.getElementById("mainNav");
  const isOpen = nav.classList.toggle("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll("#mainNav a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("mainNav").classList.remove("open");
    document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
  });
});

document.getElementById("businessAddress").textContent = BUSINESS.address;
document.getElementById("businessPhone").textContent = BUSINESS.whatsapp === "573234385279" ? "Configura el número en app.js" : `+${BUSINESS.whatsapp}`;
document.getElementById("year").textContent = new Date().getFullYear();
updateAddressRequirement();
renderProducts();
renderCart();

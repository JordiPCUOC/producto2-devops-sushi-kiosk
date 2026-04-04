const cart = {};

const cartCount = document.getElementById("cart-count");
const itemsTotal = document.getElementById("items-total");
const cartTotal = document.getElementById("cart-total");
const cartItemsContainer = document.getElementById("cart-items");
const checkoutBtn = document.getElementById("checkout-btn");

const modal = document.getElementById("checkout-modal");
const orderSummary = document.getElementById("order-summary");
const modalTotalPrice = document.getElementById("modal-total-price");
const closeModalBtn = document.getElementById("close-modal-btn");
const confirmOrderBtn = document.getElementById("confirm-order-btn");
const scrollCartBtn = document.getElementById("scroll-cart-btn");

const addButtons = document.querySelectorAll(".add-btn");
const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const cartPanel = document.getElementById("cart-panel");

function addToCart(id, name, price) {
  if (!cart[id]) {
    cart[id] = {
      id,
      name,
      price: Number(price),
      quantity: 1,
    };
  } else {
    cart[id].quantity += 1;
  }

  renderCart();
}

function increaseItem(id) {
  if (cart[id]) {
    cart[id].quantity += 1;
    renderCart();
  }
}

function decreaseItem(id) {
  if (cart[id]) {
    cart[id].quantity -= 1;

    if (cart[id].quantity <= 0) {
      delete cart[id];
    }

    renderCart();
  }
}

function removeItem(id) {
  delete cart[id];
  renderCart();
}

function getCartArray() {
  return Object.values(cart);
}

function renderCart() {
  const cartArray = getCartArray();

  if (cartArray.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-icon">🧾</div>
        <p>Tu carrito está vacío.</p>
        <span>Añade productos para empezar tu pedido.</span>
      </div>
    `;
    cartCount.textContent = "0";
    itemsTotal.textContent = "0";
    cartTotal.textContent = "0.00 €";
    return;
  }

  let totalItems = 0;
  let totalPrice = 0;

  cartItemsContainer.innerHTML = cartArray
    .map((item) => {
      totalItems += item.quantity;
      totalPrice += item.quantity * item.price;

      return `
        <div class="cart-item">
          <div class="cart-item-top">
            <div>
              <h4>${item.name}</h4>
              <div class="cart-item-price">${item.price.toFixed(2)} € / unidad</div>
            </div>
            <button class="remove-btn" data-remove="${item.id}">Eliminar</button>
          </div>

          <div class="cart-controls">
            <div class="qty-controls">
              <button class="qty-btn" data-decrease="${item.id}">-</button>
              <strong>${item.quantity}</strong>
              <button class="qty-btn" data-increase="${item.id}">+</button>
            </div>
            <strong>${(item.quantity * item.price).toFixed(2)} €</strong>
          </div>
        </div>
      `;
    })
    .join("");

  cartCount.textContent = totalItems;
  itemsTotal.textContent = totalItems;
  cartTotal.textContent = `${totalPrice.toFixed(2)} €`;
}

function renderOrderSummary() {
  const cartArray = getCartArray();

  if (cartArray.length === 0) {
    orderSummary.innerHTML = `<p>No hay productos en el pedido.</p>`;
    modalTotalPrice.textContent = "0.00 €";
    return;
  }

  let total = 0;

  orderSummary.innerHTML = cartArray
    .map((item) => {
      const subtotal = item.quantity * item.price;
      total += subtotal;

      return `
        <div class="order-line">
          <span>${item.name} x${item.quantity}</span>
          <strong>${subtotal.toFixed(2)} €</strong>
        </div>
      `;
    })
    .join("");

  modalTotalPrice.textContent = `${total.toFixed(2)} €`;
}

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.id;
    const name = button.dataset.name;
    const price = button.dataset.price;
    addToCart(id, name, price);
  });
});

cartItemsContainer.addEventListener("click", (e) => {
  const increaseId = e.target.dataset.increase;
  const decreaseId = e.target.dataset.decrease;
  const removeId = e.target.dataset.remove;

  if (increaseId) increaseItem(increaseId);
  if (decreaseId) decreaseItem(decreaseId);
  if (removeId) removeItem(removeId);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    productCards.forEach((card) => {
      const category = card.dataset.category;

      if (filter === "all" || category === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

checkoutBtn.addEventListener("click", () => {
  if (getCartArray().length === 0) {
    alert("Añade al menos un producto antes de finalizar el pedido.");
    return;
  }

  renderOrderSummary();
  modal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

confirmOrderBtn.addEventListener("click", () => {
  alert("Pedido confirmado. ¡Gracias por tu compra!");
  Object.keys(cart).forEach((key) => delete cart[key]);
  renderCart();
  modal.classList.add("hidden");
});

scrollCartBtn.addEventListener("click", () => {
  cartPanel.scrollIntoView({ behavior: "smooth" });
});

renderCart();
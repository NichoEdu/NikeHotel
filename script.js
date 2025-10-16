let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = calculateTotal();

// DOM elements
const cartCount = document.querySelector(".cart-count");
const cartContainer = document.getElementById("results");
const checkoutButton = document.querySelector(".checkout");
const cartHeader = document.querySelector("h3");

// Load cart from storage on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
  updateCartDisplay();

  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
  const productElement = button.closest(".product");
  const name = productElement.querySelector("h2").textContent;
  const price = parseFloat(productElement.querySelector(".price").textContent);
  const imageSrc = productElement.querySelector("img").src;

  addItemToCart(name, price, imageSrc);
});
  });
});
document.querySelector(".clear-cart").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear the cart?")) {
    cart = [];
    saveCart();
    updateCartUI();
    updateCartDisplay();
    showToast("Cart cleared");
  }
});


function addItemToCart(name, price, imageSrc) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1, imageSrc });
  }
  saveCart();
  showToast(`${name} added to cart`);
  updateCartUI();
  updateCartDisplay();
}


function removeItemFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
  updateCartUI();
  updateCartDisplay();
}

function changeQuantity(name, delta) {
  const item = cart.find(item => item.name === name);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeItemFromCart(name);
  } else {
    saveCart();
    updateCartUI();
    updateCartDisplay();
  }
}

function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  total = calculateTotal();
}

function updateCartUI() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your added items will appear here</p>";
    return;
  }

  const ul = document.createElement("ul");

  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.name}</strong> - $${item.price.toFixed(2)} × ${item.quantity}
      <button class="qty-btn" onclick="changeQuantity('${item.name}', 1)">+</button>
      <button class="qty-btn" onclick="changeQuantity('${item.name}', -1)">-</button>
      <button class="remove-btn" onclick="removeItemFromCart('${item.name}')">Remove</button>
    `;
    ul.appendChild(li);
  });

  cartContainer.appendChild(ul);
  updateCartPreview();

}

function updateCartDisplay() {
  cartCount.textContent = cart.length;
  cartHeader.textContent = `Your Cart (${cart.length})`;
  checkoutButton.textContent = `Checkout - $${total.toFixed(2)}`;
  updateCartPreview();

}

function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("visible");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 2500);
}


function updateCartPreview() {
  const preview = document.getElementById("cartPreview");
  preview.innerHTML = "";

  if (cart.length === 0) {
    preview.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  const list = document.createElement("ul");
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} × ${item.quantity}`;
    list.appendChild(li);
  });
  preview.appendChild(list);

  const totalDisplay = document.createElement("p");
  totalDisplay.style.fontWeight = "bold";
  totalDisplay.textContent = `Total: ${total.toFixed(2)}`;
  preview.appendChild(totalDisplay);
}

const toggleBtn = document.querySelector('.menu-toggle');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

// Toggle menu
toggleBtn.addEventListener('click', () => {
  sideMenu.classList.toggle('open');
  overlay.classList.toggle('active');
});

// Close when clicking outside the menu
overlay.addEventListener('click', () => {
  sideMenu.classList.remove('open');
  overlay.classList.remove('active');
});

// Close when clicking a link
document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    sideMenu.classList.remove('open');
    overlay.classList.remove('active');
  });
});


const toast = document.getElementById('cart-toast');
const toastMsg = document.getElementById('cart-toast-message');
const toastClose = document.getElementById('cart-toast-close');
let toastTimeout;

function showMessage(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.classList.add('toast', type);

  toast.innerHTML = `
    <span>${message}</span>
    <button aria-label="Dismiss toast">&times;</button>
  `;

  // Close manually
  toast.querySelector('button').addEventListener('click', () => {
    toast.remove();
  });

  // Add to page
  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    toast.remove();
  }, duration);
}

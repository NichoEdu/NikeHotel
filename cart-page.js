

document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cartPageContent");
  const cartCount = document.querySelector(".cart-count");
  const clearBtn = document.getElementById("clearCartBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function formatCurrency(amount) {
    return new Intl.NumberFormat(navigator.language, {
      style: "currency",
      currency: "USD"
    }).format(amount);
  }

  function renderCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    checkoutBtn.disabled = true;
    return;
  }

  const list = document.createElement("ul");
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

li.innerHTML = `
  <img src="${item.imageSrc}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; vertical-align: middle; margin-right: 10px;">
  <strong>${item.name}</strong><br>
  Quantity: 
  <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input" style="width: 50px;">
  <br>
  Price: ${formatCurrency(item.price)}<br>
  Subtotal: ${formatCurrency(itemTotal)}
  <hr>
`;

    list.appendChild(li);
  });

  const totalEl = document.createElement("p");
  totalEl.innerHTML = `<strong>Total: ${formatCurrency(total)}</strong>`;
  cartContainer.appendChild(list);
  cartContainer.appendChild(totalEl);
  cartCount.textContent = cart.length;


  document.querySelectorAll(".quantity-input").forEach(input => {
    input.addEventListener("change", e => {
      const idx = e.target.getAttribute("data-index");
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) {
        val = 1;
        e.target.value = 1;
      }
      cart[idx].quantity = val;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });
}


  clearBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the cart?")) {
      localStorage.removeItem("cart");
      cart = [];
      renderCart();
    }
  });

  checkoutBtn.addEventListener("click", () => {
    alert("This would go to a real checkout page.");
  });

  renderCart();
});
const backToShopBtn = document.getElementById("backToShopBtn");

backToShopBtn.addEventListener("click", () => {
  window.location.href = "/products"; 
});
const stripe = Stripe("pk_test_XXXXXXXXXXXXXXXXXXXX"); 

checkoutBtn.addEventListener("click", async () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

 
  const line_items = cart.map(item => ({
    price_data: {
      currency: "usd",
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100), 
    },
    quantity: item.quantity,
  }));


  alert("This is a demo. Implement backend to create Stripe session.");

});


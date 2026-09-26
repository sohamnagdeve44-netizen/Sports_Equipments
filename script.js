/* ========================================================
   SportZone Script
   Handles: product rendering, search, cart, nav, contact form
   ======================================================== */

// ---------- Product Data ----------
// Each product has an id, name, price (in rupees) and an emoji icon
const products = [
  { id: 1, name: "Cricket Bat",       price: 2499, icon: "🏏" },
  { id: 2, name: "Football",          price: 899,  icon: "⚽" },
  { id: 3, name: "Basketball",        price: 1199, icon: "🏀" },
  { id: 4, name: "Badminton Racket",  price: 1499, icon: "🏸" },
  { id: 5, name: "Tennis Racket",     price: 3299, icon: "🎾" },
  { id: 6, name: "Sports Shoes",      price: 2799, icon: "👟" },
  { id: 7, name: "Gym Equipment Set", price: 4999, icon: "🏋️" },
  { id: 8, name: "Sports Bag",        price: 1299, icon: "🎒" },
];

// Cart is stored as an object: { productId: quantity }
let cart = {};

// ---------- DOM References ----------
const productsGrid = document.getElementById("productsGrid");
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("searchInput");

const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

// ---------- Render Products ----------
// Builds a product card for each item in the given list and inserts it into the grid
function renderProducts(list) {
  productsGrid.innerHTML = "";

  if (list.length === 0) {
    noResults.hidden = false;
    return;
  }
  noResults.hidden = true;

  list.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-icon">${product.icon}</div>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price">₹${product.price.toLocaleString("en-IN")}</p>
      <button class="add-cart-btn" data-id="${product.id}">Add to Cart</button>
    `;
    productsGrid.appendChild(card);
  });

  // Attach click listeners to every "Add to Cart" button just created
  document.querySelectorAll(".add-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      addToCart(id);

      // Small visual confirmation on the button itself
      const originalText = btn.textContent;
      btn.textContent = "Added ✓";
      btn.classList.add("added");
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove("added");
      }, 900);
    });
  });
}

// Show every product on first load
renderProducts(products);

// ---------- Search Functionality ----------
searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = products.filter((p) => p.name.toLowerCase().includes(term));
  renderProducts(filtered);
});

// ---------- Cart Functionality ----------
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCartUI();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  updateCartUI();
}

function removeFromCart(id) {
  delete cart[id];
  updateCartUI();
}

// Rebuilds the cart sidebar content, badge count, and total price
function updateCartUI() {
  const ids = Object.keys(cart);

  // Badge count in the navbar (total number of items, not just unique products)
  const totalItems = ids.reduce((sum, id) => sum + cart[id], 0);
  cartCount.textContent = totalItems;

  cartItemsEl.innerHTML = "";

  if (ids.length === 0) {
    cartItemsEl.appendChild(cartEmpty);
    cartTotal.textContent = "₹0";
    return;
  }

  let total = 0;

  ids.forEach((id) => {
    const product = products.find((p) => p.id === Number(id));
    const qty = cart[id];
    const lineTotal = product.price * qty;
    total += lineTotal;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <div class="cart-item-icon">${product.icon}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${product.name}</div>
        <div class="cart-item-price">₹${product.price.toLocaleString("en-IN")} x ${qty}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" data-action="dec" data-id="${id}">−</button>
        <span>${qty}</span>
        <button class="qty-btn" data-action="inc" data-id="${id}">+</button>
      </div>
      <button class="remove-item" data-id="${id}" title="Remove">🗑</button>
    `;
    cartItemsEl.appendChild(itemEl);
  });

  cartTotal.textContent = `₹${total.toLocaleString("en-IN")}`;

  // Attach listeners for quantity buttons and remove buttons
  cartItemsEl.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const delta = btn.dataset.action === "inc" ? 1 : -1;
      changeQty(id, delta);
    });
  });

  cartItemsEl.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(Number(btn.dataset.id));
    });
  });
}

// ---------- Cart Sidebar Open/Close ----------
function openCart() {
  cartSidebar.classList.add("active");
  cartOverlay.classList.add("active");
}

function closeCartSidebar() {
  cartSidebar.classList.remove("active");
  cartOverlay.classList.remove("active");
}

cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartSidebar);
cartOverlay.addEventListener("click", closeCartSidebar);

checkoutBtn.addEventListener("click", () => {
  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty. Add some equipment first!");
    return;
  }
  alert(`Thank you for your order! Total amount: ${cartTotal.textContent}\n(This is a demo checkout for a college project.)`);
  cart = {};
  updateCartUI();
  closeCartSidebar();
});

// ---------- Mobile Navigation Toggle ----------
hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// Close mobile menu after clicking a nav link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

// ---------- Contact Form Handling ----------
contactForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Stop the page from reloading

  // Basic check that fields aren't just whitespace
  const name = document.getElementById("nameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  const message = document.getElementById("messageInput").value.trim();

  if (!name || !email || !message) {
    alert("Please fill in all required fields.");
    return;
  }

  // In a real project this would send data to a server.
  // For this college project, we just show a success message.
  formSuccess.hidden = false;
  contactForm.reset();

  setTimeout(() => {
    formSuccess.hidden = true;
  }, 4000);
});

// ---------- Initialize Cart UI on Load ----------
updateCartUI();

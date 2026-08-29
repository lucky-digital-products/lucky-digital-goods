const PRODUCTS = window.PRODUCTS || [];

function money(value, currency = "PHP") {
  try {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency,
      maximumFractionDigits: 0
    }).format(value);
  } catch {
    return `₱${value}`;
  }
}

function getCart() {
  return JSON.parse(localStorage.getItem("luckyCart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("luckyCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().length;
  document.querySelectorAll("#cart-count").forEach(el => {
    el.textContent = count;
  });
}

function addToCart(id) {
  const cart = getCart();
  if (!cart.includes(id)) cart.push(id);
  saveCart(cart);
}

function removeFromCart(id) {
  saveCart(getCart().filter(x => x !== id));
}

function renderStore() {
  const grid = document.querySelector("#product-grid");
  if (!grid) return;

  const total = document.querySelector("#product-total");
  if (total) {
    total.textContent = `${PRODUCTS.length} product${PRODUCTS.length === 1 ? "" : "s"}`;
  }

  grid.innerHTML = PRODUCTS.map(p => `
    <article class="product-card">
      <a href="product.html?id=${encodeURIComponent(p.id)}">
        <img src="${p.images[0]}" alt="${p.name}">
        <div class="product-card-body">
          <h3>${p.name}</h3>
          <div class="product-meta">
            <span class="price-tag">${money(p.price, p.currency)}</span>
            <span class="view-link">View →</span>
          </div>
        </div>
      </a>
    </article>
  `).join("");
}

function renderProduct() {
  const detail = document.querySelector("#product-detail");
  if (!detail) return;

  const params = new URLSearchParams(location.search);
  const id = params.get("id") || PRODUCTS[0]?.id;
  const p = PRODUCTS.find(x => x.id === id);

  if (!p) {
    detail.innerHTML = `
      <div class="empty-state">
        <h2>Product not found</h2>
        <a href="index.html">Return to store</a>
      </div>`;
    return;
  }

  document.title = `${p.name} | Lucky Digital Goods`;

  document.querySelector("#product-name").textContent = p.name;
  document.querySelector("#product-price").textContent = money(p.price, p.currency);
  document.querySelector("#product-short").textContent = p.short;
  document.querySelector("#feature-list").innerHTML =
    p.features.map(x => `<li>${x}</li>`).join("");
  document.querySelector("#long-description").innerHTML =
    p.description.map(x => `<p>${x}</p>`).join("");

  const main = document.querySelector("#main-product-image");
  const thumbs = document.querySelector("#thumbnail-row");
  let active = 0;

  function showImage(index) {
    active = (index + p.images.length) % p.images.length;
    main.src = p.images[active];
    main.alt = `${p.name} preview ${active + 1}`;

    thumbs.querySelectorAll(".thumb").forEach((thumb, i) => {
      thumb.classList.toggle("active", i === active);
    });
  }

  thumbs.innerHTML = p.images.map((src, i) => `
    <img
      class="thumb ${i === 0 ? "active" : ""}"
      src="${src}"
      alt="Preview ${i + 1}"
      data-index="${i}">
  `).join("");

  thumbs.addEventListener("click", event => {
    const thumb = event.target.closest(".thumb");
    if (!thumb) return;
    showImage(Number(thumb.dataset.index));
  });

  document.querySelector("#prev-image").onclick = () => showImage(active - 1);
  document.querySelector("#next-image").onclick = () => showImage(active + 1);

  document.querySelector("#add-cart").onclick = () => {
    addToCart(p.id);
    const button = document.querySelector("#add-cart");
    button.textContent = "Added ✓";
    setTimeout(() => button.textContent = "Add to cart", 1200);
  };

  document.querySelector("#buy-now").onclick = () => {
    addToCart(p.id);
    location.href = "checkout.html";
  };

  showImage(0);
}

function renderCheckout() {
  const itemsEl = document.querySelector("#checkout-items");
  if (!itemsEl) return;

  function draw() {
    const ids = getCart();
    const items = ids
      .map(id => PRODUCTS.find(p => p.id === id))
      .filter(Boolean);

    const subtotal = document.querySelector("#checkout-subtotal");
    const totalEl = document.querySelector("#checkout-total");
    const payButton = document.querySelector("#pay-button");

    if (!items.length) {
      itemsEl.innerHTML = `
        <div class="empty-state">
          <h2>Your cart is empty</h2>
          <p>Add a product before checking out.</p>
          <a class="btn btn-primary" href="index.html">Browse products</a>
        </div>`;
      subtotal.textContent = money(0);
      totalEl.textContent = money(0);
      payButton.disabled = true;
      return;
    }

    itemsEl.innerHTML = items.map(p => `
      <article class="checkout-item">
        <img src="${p.images[0]}" alt="${p.name}">
        <div>
          <h3>${p.name}</h3>
          <div>Digital download</div>
          <button class="remove-link" data-remove="${p.id}">Remove</button>
        </div>
        <strong>${money(p.price, p.currency)}</strong>
      </article>
    `).join("");

    const total = items.reduce((sum, p) => sum + p.price, 0);
    const currency = items[0]?.currency || "PHP";
    subtotal.textContent = money(total, currency);
    totalEl.textContent = money(total, currency);
    payButton.disabled = false;

    itemsEl.querySelectorAll("[data-remove]").forEach(btn => {
      btn.onclick = () => {
        removeFromCart(btn.dataset.remove);
        draw();
      };
    });

    payButton.onclick = () => {
      const email = document.querySelector("#buyer-email").value.trim();
      const name = document.querySelector("#buyer-name").value.trim();
      const msg = document.querySelector("#checkout-message");

      if (!email || !email.includes("@")) {
        msg.textContent = "Please enter a valid email address.";
        return;
      }

      if (!name) {
        msg.textContent = "Please enter the buyer's full name.";
        return;
      }

      const paymentUrl = items[0].paymentUrl;
      if (!paymentUrl) {
        msg.textContent =
          "Payment is not connected yet. Add your secure payment/backend URL in products.js.";
        return;
      }

      location.href = paymentUrl;
    };
  }

  draw();
}

document.addEventListener("DOMContentLoaded", () => {
  renderStore();
  renderProduct();
  renderCheckout();
  updateCartCount();

  document.querySelectorAll("#year").forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});

const PRODUCTS = window.PRODUCTS || [];


/* =========================================================
   MONEY FORMAT
   ========================================================= */

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


/* =========================================================
   CART
   ========================================================= */

function getCart() {
  return JSON.parse(
    localStorage.getItem("luckyCart") || "[]"
  );
}


function saveCart(cart) {
  localStorage.setItem(
    "luckyCart",
    JSON.stringify(cart)
  );

  updateCartCount();
}


function updateCartCount() {
  const count = getCart().length;

  document
    .querySelectorAll("#cart-count")
    .forEach(el => {
      el.textContent = count;
    });
}


function addToCart(id) {
  const cart = getCart();

  if (!cart.includes(id)) {
    cart.push(id);
  }

  saveCart(cart);
}


function removeFromCart(id) {
  saveCart(
    getCart().filter(x => x !== id)
  );
}


/* =========================================================
   HOMEPAGE PRODUCT CARD
   ========================================================= */

function productCardHTML(p) {
  return `
    <article class="product-card">

      <a href="product.html?id=${encodeURIComponent(p.id)}">

        <img
          src="${p.images[0]}"
          alt="${p.name}"
        >

        <div class="product-card-body">

          <h3>
            ${p.name}
          </h3>

          <div class="product-meta">

            <span class="price-tag">
              ${money(p.price, p.currency)}
            </span>

            <span class="view-link">
              View →
            </span>

          </div>

        </div>

      </a>

    </article>
  `;
}


/* =========================================================
   CATEGORY PRODUCTS
   ========================================================= */

function renderCategory(category, gridId) {

  const grid =
    document.getElementById(gridId);

  if (!grid) {
    return;
  }


  const categoryProducts =
    PRODUCTS.filter(
      product =>
        product.category === category
    );


  if (!categoryProducts.length) {

    grid.innerHTML = `
      <div class="empty-category">
        More products coming soon.
      </div>
    `;

    return;
  }


  grid.innerHTML =
    categoryProducts
      .map(productCardHTML)
      .join("");
}


/* =========================================================
   STORE HOMEPAGE
   ========================================================= */

function renderStore() {

  renderCategory(
    "language",
    "language-product-grid"
  );


  renderCategory(
    "kids",
    "kids-product-grid"
  );
}


function renderReviews(product) {

  const reviewsGrid =
    document.querySelector("#reviews-grid");

  const reviewCount =
    document.querySelector("#review-count");


  if (!reviewsGrid) {
    return;
  }


  let reviews = [];


  /* =========================
     LANGUAGE LEARNING REVIEWS
     ========================= */

  if (product.category === "language") {

    reviews = [
      {
        avatar: "R",
        user: "r****jk",
        text: "Very useful!"
      },

      {
        avatar: "A",
        user: "a****23",
        text: "Easy to understand and very helpful for beginners."
      },

      {
        avatar: "M",
        user: "m****rv",
        text: "The categories make the words much easier to study."
      },

      {
        avatar: "K",
        user: "k****08",
        text: "I didn't realize I already knew so many Spanish words."
      },

      {
        avatar: "J",
        user: "j****ly",
        text: "Simple format and useful for quick review."
      },

      {
        avatar: "P",
        user: "p****qt",
        text: "Good reference material for Filipino Spanish learners."
      }
    ];
  }


  /* =========================
     KIDS LEARNING REVIEWS
     ========================= */

  if (product.category === "kids") {

    reviews = [
      {
        avatar: "M",
        user: "m****la",
        text: "My child really enjoyed the tracing and coloring activities."
      },

      {
        avatar: "J",
        user: "j****ne",
        text: "Easy to print and very helpful for alphabet practice."
      },

      {
        avatar: "C",
        user: "c****08",
        text: "Simple activities and very easy for young kids to follow."
      },

      {
        avatar: "A",
        user: "a****my",
        text: "My daughter enjoyed coloring while practicing her letters."
      },

      {
        avatar: "L",
        user: "l****23",
        text: "Good printable worksheet for preschool learning."
      },

      {
        avatar: "S",
        user: "s****ra",
        text: "The A to Z tracing pages are clear and kid-friendly."
      }
    ];
  }


  reviewsGrid.innerHTML =
    reviews.map(review => `
      <article class="review-card">

        <div class="review-top">

          <div class="review-avatar">
            ${review.avatar}
          </div>

          <div>

            <strong class="review-user">
              ${review.user}
            </strong>

            <div class="review-stars">
              ★★★★★
            </div>

          </div>

        </div>

        <p>
          ${review.text}
        </p>

      </article>
    `).join("");


  if (reviewCount) {

    reviewCount.textContent =
      `${reviews.length} Reviews`;

  }
}

/* =========================================================
   PRODUCT PAGE
   ========================================================= */

function renderProduct() {

  const detail =
    document.querySelector(
      "#product-detail"
    );

  if (!detail) {
    return;
  }


  const params =
    new URLSearchParams(
      location.search
    );


  const id =
    params.get("id") ||
    PRODUCTS[0]?.id;


  const p =
    PRODUCTS.find(
      x => x.id === id
    );


  if (!p) {

    detail.innerHTML = `
      <div class="empty-state">

        <h2>
          Product not found
        </h2>

        <a href="index.html">
          Return to store
        </a>

      </div>
    `;

    return;
  }


  document.title =
    `${p.name} | Lucky Digital Goods`;


  document
    .querySelector("#product-name")
    .textContent =
    p.name;


  document
    .querySelector("#product-price")
    .textContent =
    money(
      p.price,
      p.currency
    );


  document
    .querySelector("#product-short")
    .textContent =
    p.short;


  document
    .querySelector("#feature-list")
    .innerHTML =
    p.features
      .map(
        x => `<li>${x}</li>`
      )
      .join("");


  document
    .querySelector("#long-description")
    .innerHTML =
    p.description
      .map(
        x => `<p>${x}</p>`
      )
      .join("");


  const main =
    document.querySelector(
      "#main-product-image"
    );


  const thumbs =
    document.querySelector(
      "#thumbnail-row"
    );


  let active = 0;


  function showImage(index) {

    active =
      (
        index +
        p.images.length
      ) %
      p.images.length;


    main.src =
      p.images[active];


    main.alt =
      `${p.name} preview ${active + 1}`;


    thumbs
      .querySelectorAll(".thumb")
      .forEach(
        (thumb, i) => {

          thumb.classList.toggle(
            "active",
            i === active
          );

        }
      );
  }


  thumbs.innerHTML =
    p.images
      .map(
        (src, i) => `
          <img
            class="thumb ${i === 0 ? "active" : ""}"
            src="${src}"
            alt="Preview ${i + 1}"
            data-index="${i}"
          >
        `
      )
      .join("");


  thumbs.addEventListener(
    "click",
    event => {

      const thumb =
        event.target.closest(
          ".thumb"
        );


      if (!thumb) {
        return;
      }


      showImage(
        Number(
          thumb.dataset.index
        )
      );
    }
  );


  document
    .querySelector("#prev-image")
    .onclick =
    () =>
      showImage(
        active - 1
      );


  document
    .querySelector("#next-image")
    .onclick =
    () =>
      showImage(
        active + 1
      );


  document
    .querySelector("#add-cart")
    .onclick =
    () => {

      addToCart(p.id);


      const button =
        document.querySelector(
          "#add-cart"
        );


      button.textContent =
        "Added ✓";


      setTimeout(
        () =>
          button.textContent =
            "Add to cart",
        1200
      );
    };


  document
    .querySelector("#buy-now")
    .onclick =
    () => {

      addToCart(p.id);

      location.href =
        "checkout.html";
    };

renderReviews(p);
  showImage(0);
}


/* =========================================================
   CHECKOUT
   ========================================================= */

function renderCheckout() {

  const itemsEl =
    document.querySelector(
      "#checkout-items"
    );


  if (!itemsEl) {
    return;
  }


  function draw() {

    const ids =
      getCart();


    const items =
      ids
        .map(
          id =>
            PRODUCTS.find(
              p => p.id === id
            )
        )
        .filter(Boolean);


    const subtotal =
      document.querySelector(
        "#checkout-subtotal"
      );


    const totalEl =
      document.querySelector(
        "#checkout-total"
      );


    const payButton =
      document.querySelector(
        "#pay-button"
      );


    if (!items.length) {

      itemsEl.innerHTML = `
        <div class="empty-state">

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add a product before checking out.
          </p>

          <a
            class="btn btn-primary"
            href="index.html"
          >
            Browse products
          </a>

        </div>
      `;


      subtotal.textContent =
        money(0);


      totalEl.textContent =
        money(0);


      payButton.disabled =
        true;


      return;
    }


    itemsEl.innerHTML =
      items
        .map(
          p => `
            <article class="checkout-item">

              <img
                src="${p.images[0]}"
                alt="${p.name}"
              >

              <div>

                <h3>
                  ${p.name}
                </h3>

                <div>
                  Digital download
                </div>

                <button
                  class="remove-link"
                  data-remove="${p.id}"
                >
                  Remove
                </button>

              </div>

              <strong>
                ${money(
                  p.price,
                  p.currency
                )}
              </strong>

            </article>
          `
        )
        .join("");


    const total =
      items.reduce(
        (sum, p) =>
          sum + p.price,
        0
      );


    const currency =
      items[0]?.currency ||
      "PHP";


    subtotal.textContent =
      money(
        total,
        currency
      );


    totalEl.textContent =
      money(
        total,
        currency
      );


    payButton.disabled =
      false;


    itemsEl
      .querySelectorAll(
        "[data-remove]"
      )
      .forEach(
        btn => {

          btn.onclick =
            () => {

              removeFromCart(
                btn.dataset.remove
              );

              draw();
            };
        }
      );


    /* =====================================================
       PAYMONGO CHECKOUT
       ===================================================== */

    payButton.onclick =
      async () => {


        const email =
          document
            .querySelector(
              "#buyer-email"
            )
            .value
            .trim();


        const name =
          document
            .querySelector(
              "#buyer-name"
            )
            .value
            .trim();


        const msg =
          document.querySelector(
            "#checkout-message"
          );


        if (
          !email ||
          !email.includes("@")
        ) {

          msg.textContent =
            "Please enter a valid email address.";

          return;
        }


        if (!name) {

          msg.textContent =
            "Please enter the buyer's full name.";

          return;
        }


        /*
          IMPORTANT:
          Your current Worker supports
          one product per PayMongo checkout.
        */

        const product =
          items[0];


        if (!product) {

          msg.textContent =
            "No product found in your cart.";

          return;
        }


        try {

          payButton.disabled =
            true;


          payButton.textContent =
            "Connecting to payment...";


          msg.textContent =
            "";


          const response =
            await fetch(
              "https://lucky-store-api.philippines-sma.workers.dev/create-checkout",
              {

                method:
                  "POST",

                headers: {
                  "Content-Type":
                    "application/json"
                },

                body:
                  JSON.stringify({

                    productId:
                      product.id,

                    email:
                      email,

                    name:
                      name
                  })
              }
            );


          const result =
            await response.json();


          console.log(
            "Checkout response:",
            result
          );


          if (!response.ok) {

            console.error(
              result
            );


            msg.textContent =
              result.error ||
              "Unable to create checkout. Please try again.";


            payButton.disabled =
              false;


            payButton.textContent =
              "Pay";


            return;
          }


          if (!result.checkoutUrl) {

            msg.textContent =
              "Payment checkout URL was not received.";


            payButton.disabled =
              false;


            payButton.textContent =
              "Pay";


            return;
          }


          /*
            Send customer
            to PayMongo
          */

          window.location.href =
            result.checkoutUrl;

        } catch (error) {

          console.error(
            error
          );


          msg.textContent =
            "Could not connect to the payment server. Please try again.";


          payButton.disabled =
            false;


          payButton.textContent =
            "Pay";
        }
      };
  }


  draw();
}


/* =========================================================
   START WEBSITE
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderStore();

    renderProduct();

    renderCheckout();

    updateCartCount();


    document
      .querySelectorAll("#year")
      .forEach(
        el => {

          el.textContent =
            new Date()
              .getFullYear();

        }
      );
  }
);

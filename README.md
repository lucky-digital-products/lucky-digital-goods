# Lucky Digital Goods — GitHub Pages Store

A simple, mobile-friendly static storefront for digital products.

## Included

- Store homepage with product cards
- Product detail page
- Image carousel / thumbnails
- Buy Now button
- Add to Cart button
- Cart saved in the browser with `localStorage`
- Checkout-style page
- Buyer name / email / country fields
- Responsive design
- No backend required for the storefront
- Secure redirect to your real payment provider

## IMPORTANT: payments

GitHub Pages is a **static website host**. It cannot safely process card numbers or keep secret API keys.

Do not build your own card form on GitHub Pages.

Use a secure hosted checkout such as:
- Gumroad
- Payhip
- Stripe Payment Links
- Lemon Squeezy

Then paste the real checkout URL into `products.js`.

Example:

```js
paymentUrl: "https://your-real-checkout-link"
```

The demo currently uses:

```js
paymentUrl: "https://gumroad.com/"
```

Replace it before publishing.

## Add or edit products

Open `products.js`.

Duplicate the product object and change:

- `id`
- `name`
- `price`
- `currency`
- `short`
- `images`
- `features`
- `description`
- `paymentUrl`

Add your image files to the `/assets` folder.

## Publish free on GitHub Pages

1. Create a new GitHub repository, for example `lucky-digital-goods`.
2. Upload all files in this ZIP to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select **main** and `/root`.
6. Save.
7. GitHub will give you a free URL similar to:
   `https://YOUR-USERNAME.github.io/lucky-digital-goods/`

## For multiple products in one payment

The included cart UI can hold multiple products, but the sample Pay button redirects to one hosted product checkout.

For a true multi-item payment in one transaction, use:
- a payment provider with cart checkout support, or
- a small backend/serverless function.

For the easiest launch, use one-product checkout links and let each Buy button go to the matching secure provider page.


## This version includes
- Green minimal styling
- Sharp corners
- Product preview images fitted with object-fit: contain
- Six anonymous sample review cards
- Sample reviews are labeled as demo content; replace them with verified reviews before publishing.


## Required JavaScript files

- `products.js` — product names, prices, preview images, descriptions, payment URLs
- `app.js` — store rendering, carousel, cart, checkout behavior

## Assets

Put your real preview images in `/assets` and update the paths in `products.js`.

Do not upload the paid/full PDF into a public GitHub Pages repository.

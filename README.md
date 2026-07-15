# LUXE — Next.js Ecommerce Starter

Full storefront: Home, Collection pages, Product Detail (PDP), Cart, MiniCart
drawer, Checkout with **Razorpay** (Cards/UPI/Netbanking) + **Cash on
Delivery**. Built with Next.js 14 (App Router) + Tailwind CSS.

## 1. Local Setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` and add your real Razorpay keys (get test keys free at
https://dashboard.razorpay.com/app/keys — no business verification needed
for test mode):

```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Run locally:

```bash
npm run dev
```

Open http://localhost:3000

## 2. Where the "dynamic" data lives

All products/collections are in `data/products.js`. Every page reads through
functions like `getAllProducts()`, `getProductBySlug()` etc — NOT the raw
array. This means later you can swap this file's internals for a real
database (Postgres/MySQL/MongoDB) or headless CMS (Sanity/Shopify/Strapi)
without touching any page code.

Orders are currently saved to a local `orders.json` file via
`app/api/orders/route.js` — this is fine for testing, but **replace it with
a real database before going live** (see note below on Hostinger).

## 3. Important before going live

- Switch Razorpay keys from `rzp_test_...` to `rzp_live_...` (requires
  completing KYC on Razorpay dashboard).
- Replace the file-based `orders.json` storage with a real database.
- Update `NEXT_PUBLIC_SITE_URL` to your real domain.
- Test both payment methods end-to-end at least once with a real (small)
  transaction before launch.

---

## 4. Deploying on Hostinger

Hostinger has a few different hosting products, and **which one you have
matters a lot** for a Next.js app like this one:

### Option A — Hostinger VPS (recommended for this project)

Next.js needs a Node.js server running (for API routes, checkout, order
saving) — **shared/basic Hostinger web hosting does NOT support this**
properly. VPS is the reliable option.

1. **Buy a Hostinger VPS plan** and choose the "Node.js" or plain Ubuntu
   template during setup.
2. **SSH into your VPS:**
   ```bash
   ssh root@your-server-ip
   ```
3. **Install Node.js (v18+) and PM2:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt install -y nodejs
   npm install -g pm2
   ```
4. **Upload your project.** Easiest way: push your code to a GitHub repo,
   then on the VPS:
   ```bash
   git clone https://github.com/yourusername/luxe-store.git
   cd luxe-store
   npm install
   ```
   (Or upload the zip via Hostinger's File Manager / SCP and unzip on the
   server.)
5. **Add your production `.env`** file on the server (same variables as
   `.env.example`, with live Razorpay keys and your real domain).
6. **Build and start:**
   ```bash
   npm run build
   pm2 start npm --name "luxe-store" -- start
   pm2 save
   pm2 startup
   ```
7. **Point your domain to the VPS:** In Hostinger's DNS settings, add an
   `A` record for your domain pointing to your VPS's IP address.
8. **Set up Nginx as a reverse proxy + free SSL** (so visitors hit port 443,
   not 3000):
   ```bash
   apt install -y nginx certbot python3-certbot-nginx
   ```
   Create `/etc/nginx/sites-available/luxe-store`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   Then:
   ```bash
   ln -s /etc/nginx/sites-available/luxe-store /etc/nginx/sites-enabled/
   nginx -t && systemctl restart nginx
   certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```
9. Visit `https://yourdomain.com` — your store should be live with SSL.

### Option B — Hostinger's "Node.js Hosting" (hPanel)

Newer Hostinger business plans include an hPanel "Node.js App" feature that
handles steps 2–6 above through a UI (you upload code, pick Node version,
set start command `npm run start`, set env variables in their panel). If
your plan has this, it's simpler than a raw VPS — check hPanel → Websites →
your domain → "Node.js" section.

### Option C — Don't use Hostinger for hosting, keep Hostinger for the domain

Many people building Next.js apps instead deploy the app on **Vercel**
(made by the Next.js team, free tier, zero server config, automatic SSL)
and just point their **Hostinger-purchased domain** at Vercel via DNS. This
is the least error-prone route if VPS management feels heavy:

1. Push code to GitHub.
2. Import the repo on vercel.com.
3. Add the same environment variables in Vercel's dashboard.
4. In Hostinger's DNS settings, add the records Vercel gives you (usually a
   `CNAME` for `www` and an `A` record for the root domain).

Note: if you go this route, also replace the `orders.json` file-storage
with a real hosted database (e.g. Vercel Postgres, Supabase, MongoDB Atlas),
since Vercel's filesystem is not persistent between requests.

---

## 5. File structure overview

```
app/
  page.js                     → Home
  collection/[slug]/page.js   → Collection listing
  product/[slug]/page.js      → Product detail (PDP)
  cart/page.js                → Full cart page
  checkout/page.js            → Checkout (Razorpay + COD)
  order-success/page.js       → Post-order confirmation
  api/razorpay/order/route.js → creates Razorpay order (server-side)
  api/razorpay/verify/route.js→ verifies payment signature (server-side)
  api/orders/route.js         → saves order (demo file storage)
components/
  Navbar.js, Footer.js, MiniCart.js, ProductCard.js, ProductDetail.js
context/
  CartContext.js              → cart state + localStorage persistence
data/
  products.js                 → product/collection "database" layer
```
# meziva-store

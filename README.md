# ShopSphere — React Microfrontend Architecture

A production-grade Microfrontend (MFE) architecture built with:

- **Webpack 5 Module Federation** — runtime code sharing across three independent React apps
- **Zustand** — shared singleton cart store exposed on `window.__CART_STORE__`
- **GSAP + ScrollTrigger** — scroll-driven entrance animations and micro-interactions
- **React Router v6** — client-side routing in the host

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│          HOST APP  :3000                     │
│  ┌──────────────────────────────────────┐   │
│  │  Navbar  (GSAP scroll shrink)        │   │
│  │  /         → Home page              │   │
│  │  /products → <ProductsList />  ─────┼───┼──▶ productsMfe @ :3001
│  │  /cart     → <CartList />      ─────┼───┼──▶ cartMfe     @ :3002
│  └──────────────────────────────────────┘   │
│  window.__CART_STORE__ (Zustand singleton)  │
└─────────────────────────────────────────────┘
```

### State Flow
```
[Products MFE]  →  store.addItem()    →  [Zustand Store on window]
[Cart MFE]      ←  store.subscribe()  ←  [Zustand Store on window]
                 +  window 'cart:updated' CustomEvent (fallback)
```

---

## Project Structure

```
microfrontend/
├── host-app/          # Container app — port 3000
│   ├── src/
│   │   ├── App.jsx
│   │   ├── bootstrap.js
│   │   ├── index.js
│   │   ├── components/Navbar.jsx      # GSAP scroll + badge animations
│   │   ├── pages/Home.jsx             # GSAP scroll reveal + parallax
│   │   ├── pages/ProductsPage.jsx     # Lazy loads productsMfe/ProductsList
│   │   ├── pages/CartPage.jsx         # Lazy loads cartMfe/CartList
│   │   └── store/cartStore.js         # Zustand store (exposed on window)
│   ├── public/index.html
│   ├── webpack.config.js              # ModuleFederationPlugin (remotes)
│   ├── babel.config.js
│   └── package.json
│
├── products-mfe/      # Remote app — port 3001
│   ├── src/
│   │   ├── ProductsList.jsx           # Exposed component + GSAP scroll cards
│   │   ├── bootstrap.js
│   │   └── index.js
│   ├── public/index.html
│   ├── webpack.config.js              # ModuleFederationPlugin (exposes)
│   ├── babel.config.js
│   └── package.json
│
├── cart-mfe/          # Remote app — port 3002
│   ├── src/
│   │   ├── CartList.jsx               # Exposed component + GSAP slide-out
│   │   ├── bootstrap.js
│   │   └── index.js
│   ├── public/index.html
│   ├── webpack.config.js              # ModuleFederationPlugin (exposes)
│   ├── babel.config.js
│   └── package.json
│
└── README.md
```

---

## Setup & Run Instructions

### Prerequisites

- Node.js **v18+**
- npm **v9+**

### 1 — Install dependencies (all three apps)

```bash
# Terminal 1
cd host-app && npm install

# Terminal 2
cd products-mfe && npm install

# Terminal 3
cd cart-mfe && npm install
```

Or run all at once from the root:

```bash
cd host-app && npm install & cd ../products-mfe && npm install & cd ../cart-mfe && npm install
```

### 2 — Start all three dev servers

Each app **must** run on its assigned port for Module Federation to work.

```bash
# Terminal 1 — Remote must start first
cd cart-mfe && npm start        # → http://localhost:3002

# Terminal 2 — Remote
cd products-mfe && npm start    # → http://localhost:3001

# Terminal 3 — Host (start last)
cd host-app && npm start        # → http://localhost:3000
```

### 3 — Open the app

Navigate to **http://localhost:3000**

---

## Module Federation Configuration

### Host App (`webpack.config.js`)
```js
new ModuleFederationPlugin({
  name: "host",
  remotes: {
    productsMfe: "productsMfe@http://localhost:3001/remoteEntry.js",
    cartMfe:     "cartMfe@http://localhost:3002/remoteEntry.js",
  },
  shared: { react, "react-dom", "react-router-dom", zustand }
})
```

### Products MFE (`webpack.config.js`)
```js
new ModuleFederationPlugin({
  name: "productsMfe",
  filename: "remoteEntry.js",
  exposes: { "./ProductsList": "./src/ProductsList" },
  shared: { react, "react-dom", "react-router-dom", zustand }
})
```

### Cart MFE (`webpack.config.js`)
```js
new ModuleFederationPlugin({
  name: "cartMfe",
  filename: "remoteEntry.js",
  exposes: { "./CartList": "./src/CartList" },
  shared: { react, "react-dom", "react-router-dom", zustand }
})
```

---

## GSAP Animations

| Location | Animation |
|---|---|
| Navbar | Slide-down entrance on mount, shrinks on scroll, badge elastic bounce |
| Home hero | Staggered headline/sub/CTA entrance, parallax blob on scroll |
| Home features | ScrollTrigger fade-up per card |
| Products grid | ScrollTrigger scale+fade per card, button pop on Add |
| Cart items | Slide-in from left per item, slide-out-right on remove |
| Cart empty state | Scale bounce-in via `back.out` ease |

---

## Shared State Strategy

The Host App creates a Zustand store and attaches it to `window.__CART_STORE__`. Remote MFEs access this via:

```js
const store = window.__CART_STORE__;
store.getState().addItem(product);   // write
store.subscribe(fn);                  // reactive updates
```

A `cart:updated` CustomEvent is also fired on every mutation as a fallback for non-Zustand consumers.

---

## Standalone Dev Mode

Each remote can be run **independently** without the host:

```bash
cd products-mfe && npm start   # http://localhost:3001
cd cart-mfe && npm start        # http://localhost:3002
```

Both have a `bootstrap.js` that mounts a dev shell and mocks `window.__CART_STORE__`.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Bundler / MFE | Webpack 5 + ModuleFederationPlugin |
| UI | React 18 |
| Routing | React Router v6 |
| State | Zustand 4 |
| Animations | GSAP 3 + ScrollTrigger |
| Fonts | Inter + Syne (Google Fonts) |

---

*Built for Version Next Technologies — React Developer Technical Assignment*

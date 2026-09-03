import { create } from "zustand";

// Load persisted cart from localStorage (survives page refresh)
function loadCart() {
  try {
    const raw = localStorage.getItem("shopsphere_cart");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem("shopsphere_cart", JSON.stringify(items));
  } catch (e) {
    /* storage unavailable — non-fatal */
  }
}

function broadcast(items) {
  saveCart(items);
  window.dispatchEvent(
    new CustomEvent("cart:updated", { detail: items })
  );
}

export const useCartStore = create((set, get) => ({
  items: loadCart(),

  addItem: (product) => {
    const existing = get().items.find((i) => i.id === product.id);
    let items;
    if (existing) {
      items = get().items.map((i) =>
        i.id === product.id ? { ...i, qty: i.qty + 1 } : i
      );
    } else {
      items = [...get().items, { ...product, qty: 1 }];
    }
    set({ items });
    broadcast(items);
  },

  increaseQty: (id) => {
    const items = get().items.map((i) =>
      i.id === id ? { ...i, qty: i.qty + 1 } : i
    );
    set({ items });
    broadcast(items);
  },

  decreaseQty: (id) => {
    // Reduce by one; remove entirely if it would drop below 1
    const target = get().items.find((i) => i.id === id);
    let items;
    if (target && target.qty <= 1) {
      items = get().items.filter((i) => i.id !== id);
    } else {
      items = get().items.map((i) =>
        i.id === id ? { ...i, qty: i.qty - 1 } : i
      );
    }
    set({ items });
    broadcast(items);
  },

  // Explicit setter used by the numeric input (0 removes the item)
  setQty: (id, qty) => {
    const n = parseInt(qty, 10);
    let items;
    if (isNaN(n) || n <= 0) {
      items = get().items.filter((i) => i.id !== id);
    } else {
      items = get().items.map((i) =>
        i.id === id ? { ...i, qty: n } : i
      );
    }
    set({ items });
    broadcast(items);
  },

  removeItem: (id) => {
    const items = get().items.filter((i) => i.id !== id);
    set({ items });
    broadcast(items);
  },

  clearCart: () => {
    set({ items: [] });
    broadcast([]);
  },

  totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
  totalPrice: () =>
    get().items.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2),
}));

// Expose store on window so remote MFEs can access it without re-sharing
window.__CART_STORE__ = useCartStore;
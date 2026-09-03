import React from "react";
import { createRoot } from "react-dom/client";
import CartList from "./CartList";

// Dev shell — mock store
window.__CART_STORE__ = {
  getState: () => ({
    items: [
      { id: 1, name: "Wireless Headphones", price: 89.99, qty: 1, emoji: "🎧" },
      { id: 2, name: "Mechanical Keyboard", price: 129.00, qty: 2, emoji: "⌨️" },
    ],
    removeItem: (id) => console.log("[Dev] removeItem", id),
    clearCart: () => console.log("[Dev] clearCart"),
    totalItems: () => 3,
    totalPrice: () => "348.99",
  }),
  subscribe: (fn) => {
    window.addEventListener("cart:updated", (e) =>
      fn({ items: e.detail || [] })
    );
    return () => {};
  },
};

const root = createRoot(document.getElementById("root"));
root.render(<CartList />);

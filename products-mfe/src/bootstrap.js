import React from "react";
import { createRoot } from "react-dom/client";
import ProductsList from "./ProductsList";

// Standalone dev shell — simulates host's cart store on window
window.__CART_STORE__ = {
  getState: () => ({
    items: [],
    addItem: (p) => console.log("[Dev] addItem", p),
    removeItem: (id) => console.log("[Dev] removeItem", id),
    totalItems: () => 0,
    totalPrice: () => "0.00",
  }),
  subscribe: () => () => {},
};

const root = createRoot(document.getElementById("root"));
root.render(<ProductsList />);

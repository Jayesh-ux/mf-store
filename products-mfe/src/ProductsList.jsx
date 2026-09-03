import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  { id: 1, name: "Wireless Noise-Cancelling Headphones", price: 7499, category: "Audio", rating: 4.8, reviews: 2341, emoji: "🎧", tag: "Bestseller" },
  { id: 2, name: "Mechanical Keyboard Pro", price: 10999, category: "Peripherals", rating: 4.7, reviews: 987, emoji: "⌨️", tag: "Popular" },
  { id: 3, name: "4K Webcam Ultra", price: 6199, category: "Video", rating: 4.5, reviews: 653, emoji: "📷", tag: null },
  { id: 4, name: "USB-C Hub 12-in-1", price: 4199, category: "Accessories", rating: 4.6, reviews: 1204, emoji: "🔌", tag: "Sale" },
  { id: 5, name: "Ergonomic Mouse Wireless", price: 4599, category: "Peripherals", rating: 4.4, reviews: 879, emoji: "🖱️", tag: null },
  { id: 6, name: "Portable SSD 1TB", price: 7899, category: "Storage", rating: 4.9, reviews: 3100, emoji: "💾", tag: "Top Rated" },
  { id: 7, name: "LED Desk Lamp Smart", price: 3199, category: "Lighting", rating: 4.3, reviews: 420, emoji: "💡", tag: null },
  { id: 8, name: "Laptop Stand Aluminium", price: 3499, category: "Accessories", rating: 4.6, reviews: 1567, emoji: "💻", tag: "Popular" },
  { id: 9, name: "Blue Light Glasses", price: 1999, category: "Eyewear", rating: 4.2, reviews: 310, emoji: "👓", tag: null },
];

const CATEGORIES = ["All", ...new Set(PRODUCTS.map((p) => p.category))];

// Access host's shared Zustand store
function getCartStore() {
  return window.__CART_STORE__;
}

function useCartActions() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const store = getCartStore();
    if (!store) return;
    setCartItems(store.getState().items);
    const unsub = store.subscribe((state) => setCartItems(state.items));
    return unsub;
  }, []);

  const addItem = useCallback((product) => {
    const store = getCartStore();
    if (store) {
      store.getState().addItem(product);
    } else {
      // Fallback: window event
      window.dispatchEvent(new CustomEvent("cart:add", { detail: product }));
    }
  }, []);

  return { cartItems, addItem };
}

function Stars({ rating }) {
  return (
    <span style={{ color: "#f4a724", fontSize: "0.78rem", letterSpacing: "1px" }}>
      {"★".repeat(Math.round(rating))}
      {"☆".repeat(5 - Math.round(rating))}
    </span>
  );
}

function ProductCard({ product, onAdd, inCart, index }) {
  const cardRef = useRef(null);
  const btnRef = useRef(null);
  const [adding, setAdding] = useState(false);

  // Scroll-triggered entrance
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { y: 48, opacity: 0, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        delay: (index % 3) * 0.07,
      }
    );
  }, [index]);

  const handleAdd = () => {
    setAdding(true);
    onAdd(product);
    // Button pop animation
    gsap.timeline()
      .to(btnRef.current, { scale: 0.88, duration: 0.1, ease: "power2.in" })
      .to(btnRef.current, { scale: 1.08, duration: 0.18, ease: "power2.out" })
      .to(btnRef.current, { scale: 1, duration: 0.12, ease: "power2.inOut" });

    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div
      ref={cardRef}
      style={{
        background: "var(--white)",
        border: "1.5px solid var(--border)",
        borderRadius: "18px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
        transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 10px 40px rgba(108,99,255,0.13)";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      {product.tag && (
        <span
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: product.tag === "Sale" ? "#fff0f1" : "var(--accent-soft)",
            color: product.tag === "Sale" ? "var(--danger)" : "var(--accent)",
            fontSize: "0.7rem",
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: "999px",
          }}
        >
          {product.tag}
        </span>
      )}

      <span style={{ fontSize: "2.4rem" }}>{product.emoji}</span>

      <div>
        <p style={{ fontSize: "0.72rem", color: "var(--ink-soft)", fontWeight: 500, marginBottom: "4px" }}>
          {product.category}
        </p>
        <h3
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: "0.98rem",
            color: "var(--ink)",
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h3>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Stars rating={product.rating} />
        <span style={{ fontSize: "0.75rem", color: "var(--ink-soft)" }}>
          {product.rating} ({product.reviews.toLocaleString()})
        </span>
      </div>

      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "1.2rem",
            color: "var(--ink)",
          }}
        >
          ₹{product.price.toLocaleString("en-IN")}
        </span>
        <button
          ref={btnRef}
          onClick={handleAdd}
          style={{
            background: inCart ? "var(--success)" : "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "9px 18px",
            fontWeight: 600,
            fontSize: "0.82rem",
            cursor: "pointer",
            transition: "background 0.25s",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            whiteSpace: "nowrap",
          }}
        >
          {inCart ? "✓ Added" : adding ? "Adding…" : "+ Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default function ProductsList() {
  const { cartItems, addItem } = useCartActions();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const headerRef = useRef(null);
  const filterRef = useRef(null);

  // Header scroll animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.1 }
      );
      gsap.fromTo(
        filterRef.current,
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.25 }
      );
    });
    return () => ctx.revert();
  }, []);

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const isInCart = (id) => cartItems.some((i) => i.id === id);

  return (
    <div style={{ padding: "clamp(80px, 10vw, 100px) clamp(14px, 4vw, 32px) 80px", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div ref={headerRef} style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            color: "var(--ink)",
            letterSpacing: "-1px",
            marginBottom: "8px",
          }}
        >
          Products
        </h1>
        <p style={{ color: "var(--ink-soft)", fontSize: "0.95rem" }}>
          {PRODUCTS.length} items — loaded from{" "}
          <span
            style={{
              background: "var(--accent-soft)",
              color: "var(--accent)",
              padding: "1px 8px",
              borderRadius: "5px",
              fontWeight: 600,
              fontSize: "0.82rem",
            }}
          >
            productsMfe@3001
          </span>
        </p>
      </div>

      {/* Filters + Search */}
      <div
        ref={filterRef}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "36px",
          alignItems: "center",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          style={{
            border: "1.5px solid var(--border)",
            borderRadius: "10px",
            padding: "9px 14px",
            fontSize: "0.88rem",
            color: "var(--ink)",
            background: "var(--white)",
            outline: "none",
            width: "min(220px, 100%)",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                border: "1.5px solid",
                borderColor: activeCategory === cat ? "var(--accent)" : "var(--border)",
                background: activeCategory === cat ? "var(--accent-soft)" : "var(--white)",
                color: activeCategory === cat ? "var(--accent)" : "var(--ink-soft)",
                fontWeight: 500,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.18s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-soft)" }}>
          <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "12px" }}>🔍</span>
          No products match your filter.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))",
            gap: "clamp(14px, 3vw, 20px)",
          }}
        >
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onAdd={addItem}
              inCart={isInCart(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

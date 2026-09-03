import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function getCartStore() {
  return window.__CART_STORE__;
}

function useCart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const store = getCartStore();
    if (!store) return;
    setItems(store.getState().items || []);
    const unsub = store.subscribe((state) => setItems(state.items || []));
    return unsub;
  }, []);

  // Also listen to window event updates from products MFE
  useEffect(() => {
    const handler = (e) => {
      const store = getCartStore();
      if (store) setItems(store.getState().items || []);
    };
    window.addEventListener("cart:updated", handler);
    return () => window.removeEventListener("cart:updated", handler);
  }, []);

  const removeItem = useCallback((id) => {
    const store = getCartStore();
    if (store) store.getState().removeItem(id);
  }, []);

  const increaseQty = useCallback((id) => {
    const store = getCartStore();
    if (store) store.getState().increaseQty(id);
  }, []);

  const decreaseQty = useCallback((id) => {
    const store = getCartStore();
    if (store) store.getState().decreaseQty(id);
  }, []);

  const setQty = useCallback((id, qty) => {
    const store = getCartStore();
    if (store) store.getState().setQty(id, qty);
  }, []);

  const clearCart = useCallback(() => {
    const store = getCartStore();
    if (store) store.getState().clearCart();
  }, []);

  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  return { items, removeItem, increaseQty, decreaseQty, setQty, clearCart, totalPrice, totalItems };
}

function CartItem({ item, onRemove, onIncrease, onDecrease, onSetQty, index }) {
  const rowRef = useRef(null);
  const [removing, setRemoving] = useState(false);

  // Scroll-triggered entrance
  useEffect(() => {
    if (!rowRef.current) return;
    gsap.fromTo(
      rowRef.current,
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        delay: index * 0.06,
      }
    );
  }, [index]);

  const handleRemove = () => {
    setRemoving(true);
    // Animate out before removing from store
    gsap.to(rowRef.current, {
      x: 60,
      opacity: 0,
      height: 0,
      padding: 0,
      margin: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => onRemove(item.id),
    });
  };

  return (
    <div
      ref={rowRef}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "clamp(10px, 3vw, 16px)",
        padding: "clamp(14px, 3.5vw, 20px)",
        background: "var(--white)",
        border: "1.5px solid var(--border)",
        borderRadius: "14px",
        marginBottom: "12px",
        transition: "border-color 0.2s, box-shadow 0.2s",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(108,99,255,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Emoji icon */}
      <span
        style={{
          fontSize: "1.9rem",
          width: "48px",
          height: "48px",
          background: "var(--accent-soft)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {item.emoji || "📦"}
      </span>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "var(--ink)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.name}
        </p>
        <p style={{ fontSize: "0.8rem", color: "var(--ink-soft)", marginTop: "3px" }}>
          ₹{item.price.toLocaleString("en-IN")} / unit
        </p>

        {/* Quantity stepper */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "2px",
            marginTop: "10px",
            border: "1.5px solid var(--border)",
            borderRadius: "9px",
            padding: "2px",
            background: "var(--surface)",
          }}
        >
          <button
            onClick={() => onDecrease(item.id)}
            aria-label="Decrease quantity"
            style={{
              width: "28px",
              height: "28px",
              border: "none",
              borderRadius: "7px",
              background: "transparent",
              color: "var(--ink)",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              lineHeight: 1,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-soft)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            −
          </button>
          <input
            type="number"
            min="1"
            value={item.qty}
            onChange={(e) => onSetQty(item.id, e.target.value)}
            aria-label="Quantity"
            style={{
              width: "40px",
              height: "28px",
              border: "none",
              background: "transparent",
              textAlign: "center",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--ink)",
              outline: "none",
              appearance: "textfield",
            }}
          />
          <button
            onClick={() => onIncrease(item.id)}
            aria-label="Increase quantity"
            style={{
              width: "28px",
              height: "28px",
              border: "none",
              borderRadius: "7px",
              background: "transparent",
              color: "var(--ink)",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              lineHeight: 1,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-soft)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            +
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <span
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: "1rem",
          color: "var(--ink)",
          flexShrink: 0,
        }}
      >
        ₹{(item.price * item.qty).toLocaleString("en-IN")}
      </span>

      {/* Remove */}
      <button
        onClick={handleRemove}
        disabled={removing}
        style={{
          background: "transparent",
          border: "1.5px solid var(--border)",
          borderRadius: "8px",
          width: "34px",
          height: "34px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          color: "var(--danger)",
          fontSize: "1rem",
          transition: "background 0.18s, border-color 0.18s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#fff0f1";
          e.currentTarget.style.borderColor = "var(--danger)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "var(--border)";
        }}
        title="Remove item"
      >
        ×
      </button>
    </div>
  );
}

function EmptyCart() {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }
    );
  }, []);

  return (
    <div
      ref={ref}
      style={{
        textAlign: "center",
        padding: "80px 24px",
        background: "var(--white)",
        border: "1.5px dashed var(--border)",
        borderRadius: "20px",
      }}
    >
      <span style={{ fontSize: "3.5rem", display: "block", marginBottom: "16px" }}>🛒</span>
      <h3
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: "1.2rem",
          color: "var(--ink)",
          marginBottom: "8px",
        }}
      >
        Your cart is empty
      </h3>
      <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem" }}>
        Head over to Products and add some items.
      </p>
    </div>
  );
}

export default function CartList() {
  const { items, removeItem, increaseQty, decreaseQty, setQty, clearCart, totalPrice, totalItems } = useCart();
  const headerRef = useRef(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: "power2.out", delay: 0.1 }
      );
    });
    return () => ctx.revert();
  }, []);

  // Animate summary panel in when items appear
  useEffect(() => {
    if (!summaryRef.current || items.length === 0) return;
    gsap.fromTo(
      summaryRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
    );
  }, [items.length > 0]);

  return (
    <div style={{ padding: "clamp(80px, 10vw, 100px) clamp(14px, 4vw, 32px) 80px", maxWidth: "780px", margin: "0 auto" }}>
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
          Your Cart
        </h1>
        <p style={{ color: "var(--ink-soft)", fontSize: "0.95rem" }}>
          {totalItems > 0 ? `${totalItems} item${totalItems > 1 ? "s" : ""} — loaded from ` : "Loaded from "}
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
            cartMfe@3002
          </span>
        </p>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <div>
            {items.map((item, i) => (
              <CartItem
                key={item.id}
                item={item}
                index={i}
                onRemove={removeItem}
                onIncrease={increaseQty}
                onDecrease={decreaseQty}
                onSetQty={setQty}
              />
            ))}
          </div>

          {/* Summary */}
          <div
            ref={summaryRef}
            style={{
              marginTop: "28px",
              background: "var(--white)",
              border: "1.5px solid var(--border)",
              borderRadius: "18px",
              padding: "24px 28px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <span style={{ color: "var(--ink-soft)", fontSize: "0.9rem" }}>
                Subtotal ({totalItems} items)
              </span>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.4rem",
                  color: "var(--ink)",
                }}
              >
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                style={{
                  flex: 1,
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "14px 24px",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  boxShadow: "0 4px 18px rgba(108,99,255,0.3)",
                  minWidth: "140px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 26px rgba(108,99,255,0.42)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 18px rgba(108,99,255,0.3)";
                }}
                onClick={() => alert("Checkout flow — extend as needed!")}
              >
                Checkout
              </button>
              <button
                onClick={clearCart}
                style={{
                  background: "transparent",
                  border: "1.5px solid var(--border)",
                  borderRadius: "12px",
                  padding: "14px 20px",
                  fontWeight: 500,
                  fontSize: "0.88rem",
                  color: "var(--ink-soft)",
                  cursor: "pointer",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--danger)";
                  e.currentTarget.style.color = "var(--danger)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--ink-soft)";
                }}
              >
                Clear cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

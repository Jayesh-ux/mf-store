import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const location = useLocation();
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef(null);
  const badgeRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.totalItems)();

  // Entrance animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
      );
      gsap.fromTo(
        logoRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "power2.out" }
      );
      gsap.fromTo(
        linksRef.current.children,
        { y: -10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          delay: 0.3,
          ease: "power2.out",
        }
      );
    });
    return () => ctx.revert();
  }, []);

  // Shrink navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bounce badge when cart count changes
  useEffect(() => {
    if (badgeRef.current && totalItems > 0) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 1.6 },
        { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" }
      );
    }
  }, [totalItems]);

  return (
    <nav
      ref={navRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(247,247,251,0.92)" : "var(--white)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid var(--border)",
        transition: "background 0.3s, box-shadow 0.3s, padding 0.3s",
        boxShadow: scrolled ? "0 2px 20px rgba(108,99,255,0.08)" : "none",
        padding: scrolled ? "10px clamp(12px, 4vw, 32px)" : "18px clamp(12px, 4vw, 32px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <Link
        ref={logoRef}
        to="/"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(1rem, 3.5vw, 1.4rem)",
          color: "var(--ink)",
          textDecoration: "none",
          letterSpacing: "-0.5px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            background: "var(--accent)",
            borderRadius: "8px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.85rem",
          }}
        >
          🛍
        </span>
        ShopSphere
      </Link>

      {/* Links */}
      <div
        ref={linksRef}
        style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}
      >
        <NavLink to="/products" active={location.pathname === "/products"}>
          Products
        </NavLink>

        <NavLink to="/cart" active={location.pathname === "/cart"}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            Cart
            {totalItems > 0 && (
              <span
                ref={badgeRef}
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  borderRadius: "999px",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  padding: "1px 7px",
                  minWidth: "20px",
                  textAlign: "center",
                  display: "inline-block",
                }}
              >
                {totalItems}
              </span>
            )}
          </span>
        </NavLink>
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  const ref = useRef(null);

  const handleEnter = () => {
    if (!active)
      gsap.to(ref.current, { y: -2, duration: 0.15, ease: "power2.out" });
  };
  const handleLeave = () => {
    if (!active)
      gsap.to(ref.current, { y: 0, duration: 0.15, ease: "power2.in" });
  };

  return (
    <Link
      ref={ref}
      to={to}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        padding: "8px clamp(10px, 2.5vw, 18px)",
        borderRadius: "10px",
        fontWeight: 500,
        fontSize: "clamp(0.85rem, 2.8vw, 0.95rem)",
        textDecoration: "none",
        color: active ? "var(--accent)" : "var(--ink-soft)",
        background: active ? "var(--accent-soft)" : "transparent",
        transition: "background 0.2s, color 0.2s",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Link>
  );
}

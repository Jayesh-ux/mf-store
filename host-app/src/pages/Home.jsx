import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { icon: "⚡", title: "Module Federation", desc: "Three independent React apps sharing state seamlessly via Webpack 5 Module Federation." },
  { icon: "🔄", title: "Zustand Store", desc: "Shared cart state flows across microfrontends through a singleton Zustand store on window." },
  { icon: "📡", title: "Window Events", desc: "Custom DOM events keep remotes in sync without tight coupling between app boundaries." },
  { icon: "🎞", title: "GSAP Animations", desc: "ScrollTrigger-powered entrance animations and micro-interactions across every view." },
];

export default function Home() {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const featuresRef = useRef(null);
  const featureCardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(headlineRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 })
        .fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
        .fromTo(ctaRef.current.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.5 }, "-=0.4");

      // Feature cards scroll reveal
      featureCardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            delay: i * 0.08,
          }
        );
      });

      // Parallax on hero background shape
      gsap.to(".hero-blob", {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Hero */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px 24px",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="hero-blob"
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #ede9ff 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="hero-blob"
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #e8f4ff 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "720px", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-block",
              background: "var(--accent-soft)",
              color: "var(--accent)",
              borderRadius: "999px",
              padding: "6px 16px",
              fontSize: "0.82rem",
              fontWeight: 600,
              marginBottom: "24px",
              letterSpacing: "0.3px",
            }}
          >
            React · Webpack 5 · Module Federation
          </div>

          <h1
            ref={headlineRef}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              lineHeight: 1.1,
              color: "var(--ink)",
              marginBottom: "20px",
              letterSpacing: "-1.5px",
            }}
          >
            Three apps.
            <br />
            One experience.
          </h1>

          <p
            ref={subRef}
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.7,
              color: "var(--ink-soft)",
              marginBottom: "40px",
              maxWidth: "520px",
              margin: "0 auto 40px",
            }}
          >
            A production-grade microfrontend architecture — Host, Products, and Cart — communicating via shared Zustand state and window events.
          </p>

          <div
            ref={ctaRef}
            style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              to="/products"
              style={{
                background: "var(--accent)",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
                transition: "transform 0.15s, box-shadow 0.15s",
                boxShadow: "0 4px 20px rgba(108,99,255,0.35)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(108,99,255,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(108,99,255,0.35)";
              }}
            >
              Browse Products
            </Link>
            <Link
              to="/cart"
              style={{
                background: "var(--white)",
                color: "var(--ink)",
                padding: "14px 32px",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
                border: "1.5px solid var(--border)",
                transition: "border-color 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              View Cart
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        ref={featuresRef}
        style={{
          padding: "clamp(60px, 10vw, 100px) clamp(14px, 4vw, 24px)",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            color: "var(--ink)",
            marginBottom: "48px",
            letterSpacing: "-0.8px",
          }}
        >
          What's under the hood
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
            gap: "clamp(14px, 3vw, 20px)",
          }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              ref={(el) => (featureCardsRef.current[i] = el)}
              style={{
                background: "var(--white)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "28px 24px",
                transition: "box-shadow 0.2s, transform 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(108,99,255,0.12)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span style={{ fontSize: "1.8rem", display: "block", marginBottom: "14px" }}>
                {f.icon}
              </span>
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--ink)",
                  marginBottom: "8px",
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--ink-soft)", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import React, { Suspense, useEffect, useRef } from "react";
import { gsap } from "gsap";

const CartList = React.lazy(() => import("cartMfe/CartList"));

function CartSkeleton() {
  return (
    <div style={{ padding: "clamp(80px, 10vw, 120px) clamp(14px, 4vw, 32px) 60px", maxWidth: "780px", margin: "0 auto" }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: "88px",
            background: "var(--border)",
            borderRadius: "14px",
            marginBottom: "14px",
            animation: `pulse 1.4s ease-in-out ${i * 0.12}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

export default function CartPage() {
  const wrapRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      wrapRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  return (
    <div ref={wrapRef}>
      <Suspense fallback={<CartSkeleton />}>
        <CartList />
      </Suspense>
    </div>
  );
}

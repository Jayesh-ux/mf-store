import React, { Suspense, useEffect, useRef } from "react";
import { gsap } from "gsap";

const ProductsList = React.lazy(() => import("productsMfe/ProductsList"));

function PageSkeleton() {
  return (
    <div style={{ padding: "clamp(80px, 10vw, 120px) clamp(14px, 4vw, 32px) 60px", maxWidth: "1100px", margin: "0 auto" }}>
      <div
        style={{
          width: "clamp(160px, 40vw, 220px)",
          height: "36px",
          background: "var(--border)",
          borderRadius: "10px",
          marginBottom: "32px",
          animation: "pulse 1.4s ease-in-out infinite",
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))",
          gap: "clamp(14px, 3vw, 20px)",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "280px",
              background: "var(--border)",
              borderRadius: "16px",
              animation: `pulse 1.4s ease-in-out ${i * 0.1}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

export default function ProductsPage() {
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
      <Suspense fallback={<PageSkeleton />}>
        <ProductsList />
      </Suspense>
    </div>
  );
}

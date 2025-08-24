"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

export default function ApiDocsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = () => {
      if (window.Redoc && containerRef.current) {
        window.Redoc.init("/api/openapi.json", {}, containerRef.current);
      }
    };
    if (window.Redoc) init();
  }, []);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">API Docs</h1>
      <Script
        src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.Redoc && containerRef.current) {
            window.Redoc.init("/api/openapi.json", {}, containerRef.current);
          }
        }}
      />
      <div ref={containerRef} />
    </main>
  );
}

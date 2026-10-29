import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { SiteHeader } from "./CabeceraSitio";
import { SiteFooter } from "./PieSitio";

export function SiteLayout({ children: contenido }: { children: ReactNode }) {
  const { pathname: rutaActual, hash, key: claveUbicacion } = useLocation();
  const esPortada =
    rutaActual === "/" ||
    rutaActual === "/home.html" ||
    rutaActual === "/index.html";

  useEffect(() => {
    if (!hash) return;

    const identificador = decodeURIComponent(hash.slice(1));
    const cuadroAnimacion = window.requestAnimationFrame(() => {
      document.getElementById(identificador)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(cuadroAnimacion);
  }, [hash, claveUbicacion, rutaActual]);

  return (
    <div className={`site-shell${esPortada ? " site-shell--portada" : ""}`}>
      <SiteHeader />
      {contenido}
      <SiteFooter />
    </div>
  );
}

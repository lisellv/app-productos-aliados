import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { SiteHeader } from "./CabeceraSitio";
import { SiteFooter } from "./PieSitio";

export function SiteLayout({ children: contenido }: { children: ReactNode }) {
  const { pathname: rutaActual } = useLocation();
  const esPortada =
    rutaActual === "/" ||
    rutaActual === "/home.html" ||
    rutaActual === "/index.html";

  return (
    <div className={`site-shell${esPortada ? " site-shell--portada" : ""}`}>
      <SiteHeader />
      {contenido}
      <SiteFooter />
    </div>
  );
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./Aplicacion";
import "./estilos.css";

const elementoRaiz = document.getElementById("root");
if (!elementoRaiz) throw new Error("No se encontró el elemento raíz de React.");

createRoot(elementoRaiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

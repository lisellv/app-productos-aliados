import react from "@vitejs/plugin-react";
import { cp } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const frontendDirectory = fileURLToPath(new URL(".", import.meta.url));
const htmlPages = [
  "index.html",
  "home.html",
  "categories.html",
  "cart.html",
  "login.html",
  "mantenimientos.html",
  "solicitudes.html",
  "registro-solicitud.html",
  "resultado_evaluacion.html",
  "signout.html",
];

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-classic-scripts",
      apply: "build",
      async closeBundle() {
        await cp(
          resolve(frontendDirectory, "scripts"),
          resolve(frontendDirectory, "dist/scripts"),
          { recursive: true },
        );
        await cp(
          resolve(frontendDirectory, "img"),
          resolve(frontendDirectory, "dist/img"),
          { recursive: true },
        );
      },
    },
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: htmlPages,
    },
  },
});

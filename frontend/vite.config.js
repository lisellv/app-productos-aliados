import { cp } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const frontendDirectory = fileURLToPath(new URL(".", import.meta.url));
const htmlPages = [
  "home.html",
  "categories.html",
  "cart.html",
  "login.html",
  "mantenimientos.html",
  "signout.html",
  "thanks.html",
];

export default defineConfig({
  plugins: [
    {
      name: "copy-classic-scripts",
      apply: "build",
      async closeBundle() {
        await cp(
          resolve(frontendDirectory, "scripts"),
          resolve(frontendDirectory, "dist/scripts"),
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

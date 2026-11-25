import { defineConfig } from "vite";
import { resolve } from "node:path";

// Base relativa: la compilación funciona en cualquier ruta (por ejemplo GitHub Pages en /<repositorio>/).
// Dos páginas: la presentación (index.html) y el guion del presentador (guion.html).
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        guion: resolve(import.meta.dirname, "guion.html"),
      },
    },
  },
});

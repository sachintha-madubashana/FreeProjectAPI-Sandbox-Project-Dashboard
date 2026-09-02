import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  build: { outDir: ".." },
  base: "/FreeProjectAPI-Sandbox-Project-Dashboard",
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@lucide": path.resolve(import.meta.dirname, "./node_modules/lucide"),
    },
  },
});

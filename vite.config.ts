import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: ["**/.taste-skill/**", "**/.impeccable/**", "**/artifacts/**"],
    },
  },
  build: { target: "es2022", sourcemap: false },
});

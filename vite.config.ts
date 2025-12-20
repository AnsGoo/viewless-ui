import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Jsx from "@vitejs/plugin-vue-jsx";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), Jsx(), tailwindcss()],
  resolve: {
    extensions: ["ts", "vue", "tsx"],
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});

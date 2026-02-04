import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base: "/my-genie/", // TODO: Uncomment and update this line for GitHub Pages deployment
  server: {
    proxy: {
      "/cdn-proxy": {
        target: "https://cdn.marble.worldlabs.ai",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn-proxy/, ""),
      },
    },
  },
});

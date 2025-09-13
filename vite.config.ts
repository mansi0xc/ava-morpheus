import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const proxyTarget = process.env.VITE_PROXY_TARGET || "http://localhost:8081";

  return {
    server: {
      host: "::",
      port: 8080,
      // 🔁 Proxy /api -> Spring Boot on 8081 (dev only)
      proxy: isDev
        ? {
            "/api": {
              target: proxyTarget,
              changeOrigin: true,
              // If your backend were under a different base path, uncomment:
              // rewrite: (p) => p.replace(/^\/api/, "/api"),
            },
          }
        : undefined,
    },
    plugins: [react(), isDev && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

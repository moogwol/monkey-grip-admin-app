import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
  ssr: {
    noExternal: ["styled-components"],
  },
  server: {
    host: '0.0.0.0', 
    port: 5173,
    proxy: {
      '/api': {
        // In Docker dev the backend service is reachable as `mg-api:3000`.
        // Proxy API requests to the mg-api service so the dev server forwards them.
        target: 'http://mg-api:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
  
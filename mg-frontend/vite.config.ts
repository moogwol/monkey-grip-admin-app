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
  }
});
  
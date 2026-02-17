// import { reactRouter } from "@react-router/dev/vite";
// import { defineConfig } from "vite";

// export default defineConfig({
//   plugins: [reactRouter()],
//   ssr: {
//     noExternal: ["styled-components"],
//   },
//   server: {
//     host: '0.0.0.0', 
//     port: 5173,
//     proxy: {
//       '/api': {
//         // In Docker dev the backend service is reachable as `mg-api:3000`.
//         // Proxy API requests to the mg-api service so the dev server forwards them.
//         target: 'http://mg-api:3000',
//         changeOrigin: true,
//         secure: false
//       }
//     }
//   }
// });

// import { defineConfig, loadEnv } from "vite";
// import { reactRouter } from "@react-router/dev/vite";

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), "");

//   return {
//     plugins: [reactRouter()],
//     ssr: {
//       noExternal: ["styled-components"],
//     },
//     server: {
//       host: "0.0.0.0",
//       port: 5173,
//       proxy: {
//         "/api": {
//           target: "http://mg-api:3000",
//           changeOrigin: true,
//           secure: false,
//         },
//       },
//     },
//     define: {
//       __API_URL__: JSON.stringify(env.VITE_API_URL),
//     },
//   };
// });

import { defineConfig, loadEnv } from "vite";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = env.VITE_API_URL || "http://mg-api:3000/api";

  let proxyTarget = "http://mg-api:3000";
  if (apiUrl.startsWith("http://") || apiUrl.startsWith("https://")) {
    proxyTarget = new URL(apiUrl).origin;
  }

  return {
    plugins: [reactRouter()],
    ssr: {
      noExternal: ["styled-components"],
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
    },
  };
});


  
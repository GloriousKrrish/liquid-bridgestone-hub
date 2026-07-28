import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
    compressPublicAssets: true,
  },
  vite: {
    build: {
      minify: "esbuild",
      cssMinify: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/three") || id.includes("node_modules/@react-three")) {
              return "vendor-three";
            }
            if (id.includes("node_modules/recharts") || id.includes("node_modules/d3")) {
              return "vendor-charts";
            }
            if (id.includes("node_modules/lucide-react")) {
              return "vendor-icons";
            }
            if (id.includes("node_modules/@radix-ui")) {
              return "vendor-radix";
            }
          },
        },
      },
    },
  },
});

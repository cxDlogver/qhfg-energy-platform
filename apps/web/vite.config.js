import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  css: { preprocessorOptions: { scss: { api: "modern-compiler" } } },
  plugins: [
    vue(),
    AutoImport({ resolvers: [ElementPlusResolver()], dts: false }),
    Components({ dirs: [], resolvers: [ElementPlusResolver()], dts: false }),
  ],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:18080",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              /node_modules\/(vue|@vue|vue-router|vue-i18n|@intlify)\//.test(id)
            )
              return "vue-core";
            if (id.includes("node_modules/ol/")) return "map-2d";
            if (
              id.includes("node_modules/echarts/") ||
              id.includes("node_modules/zrender/")
            )
              return "charts";
          }
        },
      },
    },
  },
});

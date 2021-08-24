import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import Pages from "vite-plugin-pages";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    Pages({
      react: true,
      importMode: 'async'
    }),
    solidPlugin(),
    VitePWA()
  ],
  server: {
    host: '0.0.0.0'
  },
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
});

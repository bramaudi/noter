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
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
});

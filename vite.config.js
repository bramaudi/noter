import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import Pages from "vite-plugin-pages";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    Pages({
      react: true,
      importMode: 'async'
    }),
    tsconfigPaths(),
    solidPlugin(),
    VitePWA({
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,svg,png,jpg}',
        ]
      },
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Noter',
        short_name: 'Noter',
        description: 'PWA Notes',
        icons: [
          {
            "src": "/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ],
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
      }
    }),
  ],
  server: {
    host: '0.0.0.0'
  },
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      workbox: {
        importScripts: ["/imagemagick_sw.js"],
        // Resolves in the `dist` folder. So the globs here should be related to the build, not the `src` folder
        globPatterns: [
          "**/*.{js,css,html,png,svg,ico}",
        ]
      },
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Doblar',
        short_name: 'Doblar',
        description: 'Doblar is a fully local image converter. No files are sent anywhere as the conversion is completely local.',
        theme_color: '#5bbad5',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ]
      }
    }),
  ],
  define: {
    "process.env.NODE_DEBUG": undefined
  },
  resolve: {
    alias: {
      $: path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: ["module-workers-polyfill"]
    }
  }
}))

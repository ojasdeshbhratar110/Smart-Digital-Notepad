import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        name: 'NoteX - Smart Digital Notepad',
        short_name: 'NoteX',

        description:
          'Smart digital notepad with study tools, analytics, exam practice and personalized themes.',

        theme_color: '#111827',
        background_color: '#111827',

        display: 'standalone',

        start_url: '/',
        scope: '/',

        orientation: 'portrait-primary',

        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },

      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,webp}'
        ]
      }
    })
  ]
})
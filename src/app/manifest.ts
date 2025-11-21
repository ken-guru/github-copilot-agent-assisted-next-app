import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mr. Timely - Progressive Web App',
    short_name: 'Mr. Timely',
    description: 'Track your time and activities with Mr. Timely - a Progressive Web Application built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#007bff',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en-US',
    categories: ['productivity', 'utilities', 'lifestyle'],
    icons: [
      {
        src: '/icons/app-icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/app-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon',
        sizes: 'any',
        type: 'image/png'
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png'
      }
    ]
  }
}

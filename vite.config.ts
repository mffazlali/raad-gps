import {defineConfig} from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import {VitePWA} from 'vite-plugin-pwa'
import dotenv from 'dotenv'
import mkcert from 'vite-plugin-mkcert'


// 127.0.0.1:8082 || 185.153.185.222 || 172.16.21.11 || 172.16.21.11:80 || 185.153.185.221:8082 || dev.raadgps.ir || process.env.VITE_APP_API_URL

export default defineConfig(({mode}) => {
  dotenv.config()
  const apiBaseUrl = process.env.VITE_APP_API_URL
  const apiProtocol = process.env.VITE_APP_API_PROTOCOL
  const socketProtocol = (process.env.VITE_APP_API_PROTOCOL).toLowerCase?.() === 'http' ? 'ws' : 'wss'
  const enablePWADevelop = process.env.VITE_ENABLE_PWA_DEVELOPMENT
  const isApnEnabled = process.env.VITE_APP_APN_ENABLE?.toLowerCase?.() === 'true'
  // const allowedHosts = process.env.VITE_APP_ALLOW_HOSTS?.toLowerCase?.() === 'true' || process.env.VITE_APP_ALLOW_HOSTS?.toLowerCase?.() === 'false' ? Boolean(process.env.VITE_APP_ALLOW_HOSTS?.toLowerCase?.()) : process.env.VITE_APP_ALLOW_HOSTS.split(',');
  return {
    resolve: {
      alias: [
        ...(isApnEnabled
          ? [{
            find: '@maptiler/sdk',
            replacement: path.resolve('src/common/map/maptiler-shim.ts'),
          }]
          : []),
      ],
    },
    server: {
      hmr: {
        overlay: false,
      },
      port: 3100,
      allowedHosts: true,
      proxy: {
        '/api': `${apiProtocol}://${apiBaseUrl}`,
        '/api/socket': `${socketProtocol}://${apiBaseUrl}`,
      },
    },
    preview: {
      port: 3200,
      allowedHosts: true,
    },
    build: {
      outDir: 'build',
      commonjsOptions: {transformMixedEsModules: true},
    },
    plugins: [
      // mkcert(),
      svgr(),
      react(),
      VitePWA({
        includeAssets: ['src/resources/images/medias/**/*'],
        devOptions: {
          enabled: enablePWADevelop?.toLowerCase?.() === 'true',
          type: 'module',
          // navigateFallback: 'index.html',
          suppressWarnings: false,
        },
        // workbox: {
        //   disableDevLogs: true,
        //   clientsClaim: true,
        // },
        strategies: 'injectManifest',
        srcDir: 'public',
        filename: 'sw.js',
        registerType: 'prompt',
        manifest: {
          short_name: 'راد',
          name: 'راد جی پی اس',
          description: 'راد دارای یک رابط کاربری وب است که به کاربران اجازه می‌دهد تا به‌راحتی دستگاه‌های خود را ردیابی کرده و اطلاعات را مشاهده کنند.',
          theme_color: '#22c55e',
          background_color: '#F8F9FA',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png',
            },
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
            // { src: 'src/resources/images/medias/altArrowRightOutline.svg',
            //   sizes: '16x18',
            //   type: 'image/svg+xml',
            //   purpose: 'any',
            // }
          ],
          screenshots: [
            {
              'src': 'pwa-512x512.png',
              'sizes': '512x512',
              'type': 'image/png',
              'form_factor': 'wide',
              'label': 'Application',
            },
          ],
        },
      }),
    ],
  }
})

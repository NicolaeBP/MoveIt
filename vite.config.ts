import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';
import { version } from './package.json';

export default defineConfig({
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(version),
    'import.meta.env.VITE_BUILD_DATE': JSON.stringify(new Date().toISOString())
  },
  plugins: [
    react(),
    process.env.ANALYZE ? visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    }) : null
  ].filter(Boolean),
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        manualChunks(id) {
          // Optimize chunking based on a module type
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }

            if (id.includes('zustand') || id.includes('immer')) {
              return 'state';
            }

            if (id.includes('intl') || id.includes('locale')) {
              return 'i18n';
            }

            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.error', 'console.warn', 'console.debug'] : []
      }
    },
    reportCompressedSize: false,
    sourcemap: false
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/store': resolve(__dirname, 'src/store'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@shared': resolve(__dirname, 'shared')
    }
  },
  server: {
    port: 5173,
    strictPort: true
  },
  optimizeDeps: {
    force: true
  }
});

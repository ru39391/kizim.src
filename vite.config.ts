import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        entryFileNames: 'dist/[name].js',
        chunkFileNames: 'dist/[name].js',
        assetFileNames: 'dist/[name].[ext]'
      }
    },
  }
})

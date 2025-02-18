import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Aumentar el límite de tamaño de los headers
            res.setHeader('Connection', 'keep-alive');
            res.setHeader('Keep-Alive', 'timeout=5');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Comprimir respuestas grandes
            proxyRes.headers['transfer-encoding'] = 'chunked';
          });
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@angular/common', '@angular/core']
  }
});

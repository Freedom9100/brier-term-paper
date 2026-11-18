import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// react — понимает JSX, tailwindcss — собирает классы Tailwind из файлов проекта.
// Django проверяет, что Origin совпадает с адресом, открытым в браузере.
const djangoPort = process.env.BRIER_DJANGO_PORT || '8000';
const djangoProxy = { target: `http://127.0.0.1:${djangoPort}`, changeOrigin: false };

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // В браузере API и админка открываются с того же адреса, что и React.
  server: {
    proxy: {
      '/api/': djangoProxy,
      '/admin/': djangoProxy,
      '/static/admin/': djangoProxy,
    },
  },
});

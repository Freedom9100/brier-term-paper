import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// react — понимает JSX, tailwindcss — собирает классы Tailwind из файлов проекта.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});

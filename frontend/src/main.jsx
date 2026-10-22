import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Точка входа: находим <div id="root"> в index.html и рисуем в нём приложение.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <main className="p-6">
      <h1 className="text-[34px] font-semibold tracking-[-0.035em]">Брайер</h1>
      <p className="mt-2 text-ink-2">Шрифт Onest и цвета из макета.</p>
      <p className="mt-4 text-[72px] leading-none font-semibold text-accent tabular-nums">65%</p>
    </main>
  </StrictMode>
);

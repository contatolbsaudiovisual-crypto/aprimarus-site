import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE_URL = 'https://aprimarus.com.br';

export default defineConfig({
  site: SITE_URL,
  integrations: [
    sitemap({
      // /tiktok/callback/ é rota interna de OAuth (noindex) — fora do sitemap
      filter: (page) => !page.includes('/tiktok/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // O CSS compilado do site inteiro fica em ~31KB, pequeno o bastante para
    // inlinear direto no HTML em vez de um <link> separado, o que elimina uma
    // requisição bloqueante de render por página (era o maior item isolado do
    // relatório de "render-blocking requests" do Lighthouse).
    inlineStylesheets: 'always',
  },
});

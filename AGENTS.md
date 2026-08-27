# aprimarus-site

Site institucional + blog da Aprimarus. Astro estático, deploy na Netlify a cada
push na `main` (aprimarus.com.br). Sem CMS, sem backend, sem auth.

## Publicar um post no blog

1. `node scripts/novo-post.mjs "Título do post"` → cria `src/content/blog/<slug>.md`
   com o frontmatter e a data de hoje.
2. Preencher `description`, `resumo`, `tags`, `faq` e o corpo (markdown).
   - `resumo`: 40-60 palavras, resposta direta à pergunta principal (é o que
     Google/IAs citam).
   - `description`: ~155 caracteres com a palavra-chave.
3. Imagem de capa (opcional): pôr o arquivo em `public/images/uploads/` e apontar
   `heroImage: "/images/uploads/nome.jpg"`.
4. `git add . && git commit -m "post: <slug>" && git push`
5. Netlify publica em ~1 min. A página entra no `sitemap-index.xml` e no RSS
   automaticamente.

## Schema do frontmatter

Definido em `src/content.config.ts`. Obrigatórios: `title`, `description`,
`resumo`, `pubDate`. Opcionais: `updatedDate`, `author` (default Leonardo),
`heroImage`, `tags[]`, `faq[]` (`{pergunta, resposta}`).

## Segurança

- Cabeçalhos (CSP, HSTS, X-Frame-Options, etc) em `netlify.toml`. Se adicionar um
  script/CDN externo novo, liberar o host no CSP.
- Não existe `/admin` nem Netlify Identity (removidos em 2026-08-27 — auditoria).
- `public/tiktok...txt` é verificação de domínio do TikTok, não mexer.
- `src/pages/tiktok/callback.astro` é bounce interno do OAuth do TikTok (noindex).

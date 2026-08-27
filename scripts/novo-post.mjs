#!/usr/bin/env node
// Cria um rascunho de post do blog com o frontmatter certo e a data de hoje.
//
// Uso:
//   node scripts/novo-post.mjs "Título do post aqui"
//   node scripts/novo-post.mjs "Título" meu-slug-customizado
//
// Gera src/content/blog/<slug>.md . Depois é só preencher e:
//   git add . && git commit -m "post: <slug>" && git push
// A Netlify publica em ~1 min.

import { writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const [, , titulo, slugArg] = process.argv
if (!titulo) {
  console.error('Uso: node scripts/novo-post.mjs "Título do post" [slug]')
  process.exit(1)
}

const slug = (slugArg || titulo)
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')

const dir = join(process.cwd(), 'src/content/blog')
if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
const file = join(dir, `${slug}.md`)
if (existsSync(file)) {
  console.error(`Já existe: ${file}`)
  process.exit(1)
}

const hoje = new Date().toISOString().slice(0, 10)

const conteudo = `---
title: ${titulo}
description: (SEO, ~155 caracteres — a promessa do post, com a palavra-chave)
resumo: (40-60 palavras respondendo direto a pergunta principal do post — é o
  trecho que o Google e as IAs costumam citar)
pubDate: ${hoje}
author: Leonardo Di Bartolomeo
heroImage: ""
tags:
  - tag1
  - tag2
faq:
  - pergunta: (pergunta que as pessoas realmente buscam)
    resposta: (resposta direta em 2-4 frases)
---

## (Primeiro H2 — a resposta direta à dúvida principal)

(corpo do post)
`

writeFileSync(file, conteudo)
console.log(`✓ ${file}`)
console.log(`  Preencher, depois: git add . && git commit -m "post: ${slug}" && git push`)

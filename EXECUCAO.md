# Plano de execução — auditoria de 02/09/2026

Documento para execução assistida (modelo de baixo esforço). Cada passo tem
comando exato e verificação com saída esperada.

**Se uma verificação não bater com a saída esperada, PARE e reporte. Não improvise.**

## STATUS — atualizado 02/09/2026, fim do dia

**FASE 1, FASE 2 e FASE 9.4 concluídas.** Site 100% migrado e no ar em
`aprimarus.com.br` pela Cloudflare Pages. Netlify desconectada do GitHub (não
builda mais, não gasta crédito) mas ainda publicada — apagar só depois de ~30
dias estáveis. Detalhes de cada uma nas seções correspondentes abaixo, marcadas
`[CONCLUÍDO]`.

Próximas fases pendentes, na ordem do "Resumo da ordem" no fim do documento:
FASE 8.2/8.3 (imagens), 10.2 (plano no CTA), 10.3 (prazo no hero), 10.1 (FAQ
visível), 6.1 (conta que importa), 7 (disclaimer), 5 (desqualificação), depois
as que esperam dado do Leonardo (3, 4).

---

## 0. Regras — ler antes de qualquer passo

1. **Nunca inventar dado.** Número de resultado, nome de cliente, depoimento,
   data, salário de mercado, quantidade de vagas. Se um campo está vazio neste
   documento ou num `.json`, ele fica vazio até o Leonardo preencher. Um passo
   marcado `[BLOQUEIO]` não pode ser executado sem resposta dele.
2. **Antes de todo build, limpar os arquivos do exFAT.** O HD é exFAT e cria
   arquivos `._*` que quebram o Astro:
   ```bash
   find src public -name "._*" -delete
   ```
3. **Todo build tem que passar antes de commit:**
   ```bash
   npx astro build
   ```
   Esperado na última linha: `[build] Complete!`
4. **Um commit por fase, nunca um por arquivo.** Enquanto o site estiver na
   Netlify, cada deploy de produção custa 15 dos 300 créditos mensais. Depois da
   FASE 2 essa restrição some.
5. **Não fazer `git push` sem a verificação da fase ter passado.**
6. **Ordem das fases é obrigatória.** FASE 1 → FASE 2 → resto. As fases 3 a 7 são
   independentes entre si e podem ser feitas em qualquer ordem depois da 2.
7. Diretório de trabalho em todos os comandos:
   `/Volumes/hd projetos/Claude/Aprimarus/aprimarus-site`

---

## 1. Contexto e prazo

O site está na Netlify, num plano de **créditos** (300/mês). Cada deploy de
produção custa 15 créditos, independente de o build durar 13 segundos.

Leitura do painel em 02/09/2026, ciclo 25/ago–24/set:

| Item | Consumo | Créditos |
|---|---|---|
| Deploys | 12 builds | 180,0 |
| Banda | 35,8 MB | 0,7 |
| Web requests | 3.500 | 0,7 |
| **Restante** | | **118,6** |

**99,2% do consumo é deploy.** O teto real do plano grátis é 20 deploys/mês.
Restam ~7 deploys. Quando o saldo zera, a Netlify **pausa o site** — visitante vê
"Site not available" até virar o ciclo.

Por isso a FASE 2 (migração para Cloudflare Pages: 500 builds/mês, banda e
requests estáticos ilimitados, tudo gratuito) tem prioridade sobre qualquer
trabalho de conteúdo.

---

## 2. O que já foi aplicado em 02/09 — NÃO refazer

Alterações já no working tree, build validado (`9 page(s) built`, sem erro).

| # | Arquivo | Mudança |
|---|---|---|
| 1 | `src/content.config.ts` | Glob `**/[^_]*.md` → `**/[^_.]*.md`. Ignora os `._*` do exFAT, que quebravam o build local. |
| 2 | `src/pages/index.astro` | Removido `<span class="sr-only">Agência de SEO para YouTube: </span>` do `<h1>`. Era texto oculto com palavra-chave — padrão que o Google trata como spam. |
| 3 | `src/pages/index.astro` | Seção "Quem somos" movida para **antes** dos Planos. Comentários renumerados 01–14. |
| 4 | `src/pages/index.astro` | `id="planos"` na seção de planos. |
| 5 | `src/components/Nav.astro` | Link "Planos" (`/#planos`) no menu desktop e mobile. |
| 6 | `src/components/Reveal.astro` | Passa a repassar props extras (`...rest`). Sem isso o `id="planos"` era descartado silenciosamente. |
| 7 | `src/styles/global.css` | `#planos { scroll-margin-top: 5.5rem; }` — o nav é fixo com 5rem. |
| 8 | `netlify.toml` | Removido `cdn.jsdelivr.net` da CSP (3 diretivas). Era resto do CDN do Phosphor, que não é mais usado. |
| 9 | `netlify.toml` | `Cache-Control` para `/assets/*` (7 dias) e `/_astro/*` (1 ano, immutable). Antes tudo era `max-age=0, must-revalidate`. |
| 10 | `public/_headers` | **Novo.** Espelha os cabeçalhos do `netlify.toml` no formato da Cloudflare. |
| 11 | `public/_redirects` | **Novo.** Redirects de `/admin/*` e `/aceitar-convite` no formato da Cloudflare. |
| 12 | `src/data/monetizacao.json` | **Novo.** Estrutura vazia para a FASE 3. Nada renderiza enquanto `publicar` for `false`. |

### Verificar o estado atual

```bash
cd "/Volumes/hd projetos/Claude/Aprimarus/aprimarus-site"
git status --short
```

Esperado exatamente:
```
 M netlify.toml
 M src/components/Nav.astro
 M src/components/Reveal.astro
 M src/content.config.ts
 M src/pages/index.astro
 M src/styles/global.css
?? EXECUCAO.md
?? public/_headers
?? public/_redirects
?? src/data/monetizacao.json
```

Se aparecer arquivo a mais ou a menos, PARE.

---

## 3. Bloqueios — dados que só o Leonardo tem

Nenhuma destas fases pode ser executada antes da resposta dele.

| ID | Fase | O que falta |
|---|---|---|
| **B1** | 3 | Qual canal monetizou com 2 mil inscritos, em quantos meses, e print do YouTube Studio salvo em `public/assets/monetizacao-1.webp`. Pode ser sem nome de cliente (ele optou por manter os números anônimos). |
| **B2** | 3 | Canal do Dr. Pedro Nunes: **só publicar depois de aprovado**. Hoje está "em processo". Publicar antes seria afirmar um resultado que não aconteceu. |
| **B3** | 4 | Definição do diagnóstico: o que o cliente manda, o que recebe de volta, e em quantas horas. Proposta no corpo da FASE 4 para ele aprovar ou corrigir. |
| **B4** | 6.2 | *(opcional)* Números de custo de equipe interna, **com fonte citável**. Não bloqueia mais nada: a FASE 6.1 faz a ancoragem enumerando papéis, sem citar salário. |
| ~~**B5**~~ | 8 | **RESOLVIDO 02/09.** Clarity removido ("nem vejo ele na verdade") **e Bing Ads também** (não roda anúncio no Bing). Passo executável em 8.1. |
| ~~**B6**~~ | 9 | **RESOLVIDO 02/09** pela mesma decisão: sem Clarity, some a gravação de sessão não declarada. |
| ~~**B7**~~ | 10 | **RESOLVIDO 02/09.** Mínimo de 3 meses; contrato anual com renovação automática; após os 3 meses, saída com aviso prévio de 30 dias. Resposta redigida em 10.1. |

---

## Antes de acionar o Sonnet — quem faz o quê

O documento tem passos que **um agente não consegue executar**: exigem login em
painel, cartão, ou decisão de conta. Estão marcados `[manual, Leonardo]`. Se o
executor esbarrar num deles, ele **para e avisa** — não tenta contornar.

**Atualização 02/09:** a FASE 2 e a 9.4 inteiras acabaram sendo feitas por
Claude via Claude-in-Chrome, no navegador do Leonardo já logado — não pelo
Leonardo direto nem por um agente de código sem navegador. Login, cartão e
credencial continuam sendo linha vermelha (nenhuma senha foi digitada, nenhum
pagamento feito — tudo já estava autenticado na sessão do Chrome dele); o que
mudou é que "manual" nesta tabela quer dizer **precisa de navegador com sessão
logada**, não necessariamente as mãos do Leonardo no teclado. Ver
[[feedback-prospeccao-chrome-pessoal]] — mesmo padrão já estabelecido pra
prospecção.

| Passo | Quem | Por quê |
|---|---|---|
| 2.1 Criar o projeto na Cloudflare Pages | ~~Leonardo~~ **feito via Chrome dele** | painel, login |
| 2.4 Trocar nameservers no Registro.br | ~~Leonardo~~ **feito via Chrome dele** | painel do registrador |
| 2.6 Desligar auto-deploy na Netlify | ~~Leonardo~~ **feito via Chrome dele** | painel |
| 8.1 Pausar Clarity e Bing no GTM | **Leonardo, ou via Chrome dele** | painel do GTM — ainda não feito |
| 9.4 TLS, Always HTTPS, Bot Fight | ~~Leonardo~~ **feito via Chrome dele** | painel Cloudflare (WAF pago ficou de fora, ver 9.4) |
| Todo o resto (código, build, verificação, commit) | **Sonnet** | — |

### Não é preciso criar API token da Cloudflare

Com a integração via GitHub (que o Leonardo já conectou), **o deploy não usa token
nenhum**. A Cloudflare instala um GitHub App no repositório e escuta os pushes
sozinha. Não há segredo para guardar, nada para pôr em `.env`, nada para o Sonnet
configurar.

Token de API só faria falta em dois cenários que **não** são o desta migração:
deploy por Wrangler CLI / GitHub Actions em vez da integração git, ou gestão de DNS
por script.

**Não criar token.** Um token da Cloudflare dá controle sobre DNS e hospedagem; é
superfície de ataque nova para resolver um problema que não existe aqui.

### Ao conectar o repositório, limitar o escopo

Quando a Cloudflare pedir acesso ao GitHub, escolher **"Only select repositories"** e
marcar **apenas `aprimarus-site`**. O padrão sugerido costuma ser "All repositories",
o que daria acesso também a `proleo` (CRM com dado de cliente) e `finleo`.

Conferir depois em `github.com/settings/installations`.

### `[CRÍTICO]` 2FA do GitHub está desligado

Verificado em 02/09/2026 via `gh api user`: `two_factor: false` na conta
`contatolbsaudiovisual-crypto`.

Isso já era pendência da auditoria de agosto, mas **acabou de ficar mais grave**: ao
conectar a Cloudflare ao GitHub, a conta do GitHub passou a controlar também a
hospedagem do site. Hoje, quem entrar nessa conta com só a senha consegue publicar
o que quiser em aprimarus.com.br.

A mesma conta é dona de `proleo` (CRM com dado de cliente) e `finleo`.

**Ligar antes de seguir:** `github.com/settings/security` → Two-factor authentication
→ app autenticador. Leva dois minutos e é o item de maior retorno de segurança do
documento inteiro — maior que qualquer cabeçalho HTTP.

```bash
# conferir depois de ligar (esperado: true)
gh api user --jq .two_factor_authentication
```

---

## FASE 1 — Commit das correções já aplicadas `[CONCLUÍDO 02/09]`

Gasta 1 deploy da Netlify (sobram ~103 créditos ≈ 6 deploys).

**Feito.** Commits `d5c2be6` (as 9 correções da FASE 1) e `7ec5f81` (bônus: subiu
o `nanoid` de 3.3.17 para 3.3.18 — o push acusou 1 alerta do Dependabot,
gravidade alta, `nanoid` custom generators loop infinito com size=0; era
dependência só de build via postcss/vite, não chegava no site publicado, mas
sem motivo pra deixar aberto). Verificação da 1.2 rodada e bateu 6/6 antes do
push. Os dois já estão na Netlify **e** replicados automaticamente na Cloudflare
Pages (mesmo repo, mesmo branch `main`).

### 1.1 — Limpar exFAT e buildar

```bash
cd "/Volumes/hd projetos/Claude/Aprimarus/aprimarus-site"
find src public -name "._*" -delete
npx astro build
```
Esperado na última linha: `[build] Complete!`

### 1.2 — Verificar as 6 mudanças no HTML gerado

> **Atenção:** usar sempre `grep -o ... | wc -l`, nunca `grep -c`. O HTML sai
> minificado numa linha só, e `grep -c` conta linhas, não ocorrências — daria `1`
> onde o certo é `2`.

```bash
echo -n "1. sr-only removido (esperado 0): "; grep -o 'Agência de SEO para YouTube: ' dist/index.html | wc -l
echo -n "2. id=planos presente (esperado 1): "; grep -o 'id="planos"' dist/index.html | wc -l
echo -n "3. link Planos no nav (esperado 2): "; grep -o 'href="/#planos"' dist/index.html | wc -l
echo -n "4. jsdelivr na CSP (esperado 0): "; grep -o jsdelivr dist/_headers | wc -l
echo -n "5. _headers e _redirects no dist (esperado 2): "; ls dist/_headers dist/_redirects | wc -l
echo "6. ordem das seções (esperado: WhatsApp, depois Modelos):"; grep -o 'Quem responde no WhatsApp\|Modelos de <' dist/index.html
```

Todas as seis têm que bater. Se qualquer uma falhar, PARE.

Saída validada em 02/09/2026 com as mudanças já aplicadas:
```
1. sr-only removido (esperado 0): 0
2. id=planos presente (esperado 1): 1
3. link Planos no nav (esperado 2): 2
4. jsdelivr na CSP (esperado 0): 0
5. _headers e _redirects no dist (esperado 2): 2
6. ordem das seções (esperado: WhatsApp, depois Modelos):
Quem responde no WhatsApp
Modelos de <
```

### 1.3 — Commit e push

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix: auditoria 02/09 — CSP, cache, H1, estrutura e build local

- CSP: remove cdn.jsdelivr.net (resto do Phosphor, não é mais usado)
- cache: /assets/* 7 dias, /_astro/* 1 ano immutable (era max-age=0)
- H1: remove span sr-only com palavra-chave (texto oculto)
- home: sobe "Quem somos" para antes dos Planos + âncora /#planos no menu
- Reveal: repassa props extras, senão o id era descartado
- content.config: ignora os ._* do exFAT que quebravam o build local
- prepara _headers e _redirects para a Cloudflare Pages

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01BrxvPszrhSUdYwBPADf3i7
EOF
)"
git push
```

### 1.4 — Confirmar no ar (esperar ~1 min)

```bash
curl -sI https://aprimarus.com.br/assets/casal.webp | grep -i cache-control
```
Esperado: `cache-control: public, max-age=604800`

```bash
curl -sI https://aprimarus.com.br/ | grep -io jsdelivr | wc -l
```
Esperado: `0`

---

## FASE 2 — Migração para Cloudflare Pages `[CONCLUÍDO 02/09]`

**É a fase com prazo.** Depois dela, deploy deixa de ser recurso escasso.

**Feito, verificado por fora (não é cache local).** Ordem real de execução —
ficou diferente do roteiro original porque o site precisou ir ao ar primeiro
pra depois trocar o DNS, não o contrário:

1. Projeto Pages criado (`aprimarus-site`, preset Astro, `npm run build` →
   `dist`, `NODE_VERSION=22`), conectado ao GitHub com acesso restrito a
   **só** `contatolbsaudiovisual-crypto/aprimarus-site` (não pegou `proleo`
   nem `finleo`). No ar em `aprimarus-site.pages.dev`, 7/7 cabeçalhos batendo
   com a Netlify.
2. Domínio adicionado à Cloudflare (`Connect a domain`), os 4 registros A
   antigos apontando pra Netlify apagados, mantido só o TXT do Google.
3. Nameservers trocados no Registro.br: saiu `dns1..4.p06.nsone.net`
   (Netlify), entrou `hugh.ns.cloudflare.com` + `sue.ns.cloudflare.com`.
4. Custom domain `aprimarus.com.br` **e** `www.aprimarus.com.br` conectados
   ao projeto Pages — Cloudflare criou os CNAMEs sozinha.
5. Netlify desconectada do GitHub (`Manage repository → Unlink`). Build
   automático parado, projeto continua publicado como rota de volta.

**Verificado com `curl --resolve` pra não depender do cache DNS local:** 7
cabeçalhos de segurança, cache de assets em 604800s, `www` funcionando,
HTTP→HTTPS em 301, `server: cloudflare`.

**Pendência de baixo risco, não bloqueante:** `/admin/*` no `.pages.dev`
respondeu 200 (serve a home) em vez do 301 esperado do `_redirects` — não
expõe nada, o `/admin` real não existe. Não foi reinvestigado no domínio
final; se aparecer de novo, conferir se é fallback padrão da Cloudflare
Pages competindo com o `_redirects`.

**Cache negativo:** o resolvedor DNS local do Leonardo ficou mostrando "sem
resolução" por um tempo depois da troca — resolvia normal via 1.1.1.1 e
8.8.8.8 o tempo todo. Era cache do resolvedor dele, não da Cloudflare.
Resolveu sozinho.

### Fatos já verificados (não precisa reconferir)

- Registrador: **Registro.br**. Titular: `49.201.714 LEONARDO DI BARTOLOMEO DE SOUZA - ME`.
- Nameservers hoje: **Netlify DNS** (`dns1..4.p06.nsone.net`).
- **Não existe registro MX no domínio.** Ninguém recebe e-mail em `@aprimarus.com.br`,
  então mover o DNS não derruba e-mail. Este era o único risco sério.
- Registros a recriar na Cloudflare: apenas o apex, o `www`, e **um** TXT:
  `google-site-verification=LlPISyZXpz7qSrfispXIzwuS19nHERyZ3pGKN33_9pk`
- Node local: v26. Astro 7 exige ≥18.20.8.

### 2.1 — Criar o projeto na Cloudflare Pages `[manual, Leonardo]`

Painel: **dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git**

| Campo | Valor |
|---|---|
| Repositório | `aprimarus-site` |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Variável de ambiente | `NODE_VERSION` = `22` |

Não configurar domínio customizado ainda.

### 2.2 — Validar no domínio de teste ANTES de mexer em DNS

O deploy sai em `https://<projeto>.pages.dev`. Substituir a URL abaixo e rodar:

```bash
PAGES_URL="https://SUBSTITUIR.pages.dev"

echo "=== cabeçalhos de segurança ==="
curl -sI "$PAGES_URL/" | grep -iE "content-security-policy|strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy|cross-origin-opener"

echo "=== cache de asset (esperado max-age=604800) ==="
curl -sI "$PAGES_URL/assets/casal.webp" | grep -i cache-control

echo "=== redirect do /admin (esperado 301 para /) ==="
curl -sI "$PAGES_URL/admin/qualquercoisa" | grep -iE "^HTTP|^location"

echo "=== páginas respondendo 200 ==="
for p in / /portfolio /blog /privacidade /termos /blog/rss.xml /sitemap-index.xml; do
  printf "%-24s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' "$PAGES_URL$p")"
done

echo "=== verificação do TikTok ==="
curl -s -o /dev/null -w "%{http_code}\n" "$PAGES_URL/tiktokwiJ76NaJRrp0mUuNTdXgngk5dmHiwgxi.txt"
```

Esperado: os 7 cabeçalhos presentes, cache `max-age=604800`, `/admin/*` devolvendo
301, todas as páginas `200`, arquivo do TikTok `200`.

**Se qualquer item falhar, PARE. Não mexer em DNS.**

### 2.3 — Comparar com a Netlify

```bash
diff <(curl -sI https://aprimarus.com.br/ | grep -i "content-security-policy" | tr -d '\r') \
     <(curl -sI "$PAGES_URL/" | grep -i "content-security-policy" | tr -d '\r')
```
Esperado: nenhuma saída (CSPs idênticas).

### 2.4 — Mover o DNS `[manual, Leonardo]`

1. Cloudflare → **Add a site** → `aprimarus.com.br` → plano **Free**.
2. Na varredura, conferir que o TXT `google-site-verification=...` foi importado.
   Se não, criar manualmente. **Não criar MX** (não existe nenhum hoje).
3. Cloudflare mostra dois nameservers (`*.ns.cloudflare.com`). Anotar.
4. **Registro.br** → login → `aprimarus.com.br` → alterar servidores DNS para os
   dois da Cloudflare. Remover os `nsone.net`.
5. Voltar na Cloudflare, aguardar o domínio virar **Active** (minutos a algumas horas).
6. Pages → projeto → **Custom domains** → adicionar `aprimarus.com.br` e `www.aprimarus.com.br`.

### 2.5 — Verificar depois da propagação

```bash
dig +short NS aprimarus.com.br          # esperado: *.ns.cloudflare.com
curl -sI https://aprimarus.com.br/ | grep -iE "^server|^HTTP"   # esperado: cloudflare
curl -sI https://aprimarus.com.br/ | grep -i content-security-policy
curl -s -o /dev/null -w "%{http_code}\n" https://www.aprimarus.com.br/   # esperado 200
```

### 2.6 — Encerrar a Netlify

**Não apagar nada por 30 dias.** Sem deploy novo, o projeto parado não consome
crédito. Apenas **desligar o auto-deploy** no painel da Netlify
(Project → Build & deploy → Stop builds) para não gastar crédito à toa.

Depois de 30 dias estáveis na Cloudflare, aí sim excluir o projeto.

### 2.7 — Limpeza pós-migração (só depois do 2.6 confirmado)

Quando a Netlify sair de vez, `netlify.toml` vira arquivo morto — os cabeçalhos
passam a vir de `public/_headers`. Apagar:

```bash
git rm netlify.toml
```

**Não fazer isso antes do site estar 100% na Cloudflare.**

---

## FASE 3 — Seção de monetização `[BLOQUEIO B1, B2]`

Objetivo: mostrar que o canal monetiza sem precisar de audiência grande. É o
argumento mais forte para o ICP (médico, dentista, advogado), porque desmonta a
objeção "meu nicho é pequeno demais".

### 3.1 — Preencher os dados `[Leonardo]`

Arquivo `src/data/monetizacao.json`, já criado. Para cada caso:

- `publicar`: só vira `true` quando o caso estiver **fechado** e a imagem existir.
- `cliente` e `nicho`: podem ficar vazios (ele optou por manter números sem nome).
- `mesesAteMonetizar`: número inteiro, ou `null` se não souber.
- `imagem`: print do YouTube Studio em `public/assets/`, `.webp`, 400×300.

**O caso `dr-pedro` fica com `publicar: false` até a aprovação sair.** O texto do
site não pode dizer que o canal está monetizado enquanto estiver "em processo".

### 3.2 — Criar o componente

Criar `src/components/Monetizacao.astro`:

```astro
---
import dados from '../data/monetizacao.json';
import Icon from './Icon.astro';

const casos = dados.casos.filter((c) => c.publicar && c.imagem);
---
{casos.length > 0 && (
  <section class="py-16 md:py-24 bg-background border-t border-border">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-12">
        <h2 class="font-display text-3xl sm:text-4xl md:text-5xl uppercase mb-4">
          Canal monetizado sem <span class="text-primary">audiência de massa</span>
        </h2>
        <p class="text-gray-700 max-w-3xl mx-auto text-lg">
          O YouTube libera monetização com 1.000 inscritos e 4.000 horas de exibição
          nos últimos 12 meses. O inscrito é o número fácil. A hora de exibição é o que
          trava — e ela depende de retenção e de o vídeo ser encontrado na busca, não
          de tamanho de canal.
        </p>
      </div>

      <div class:list={["grid gap-8 justify-center", casos.length === 1 ? "max-w-md mx-auto" : "md:grid-cols-2 max-w-4xl mx-auto"]}>
        {casos.map((c) => (
          <figure class="flex flex-col items-center m-0">
            <img src={c.imagem} alt={c.alt} width="400" height="300" loading="lazy" decoding="async"
                 class="rounded-xl shadow-card border border-border w-full object-cover" />
            <figcaption class="mt-4 text-center">
              <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-growth-bg text-growth font-bold text-sm">
                <Icon name="currency-circle-dollar" weight="bold" />
                Monetizado com {new Intl.NumberFormat('pt-BR').format(c.inscritosNaMonetizacao)} inscritos
              </span>
              {c.mesesAteMonetizar && (
                <p class="text-sm text-gray-600 mt-3">{c.mesesAteMonetizar} meses de gestão até a aprovação.</p>
              )}
              {c.cliente && <p class="text-sm font-semibold text-foreground mt-1">{c.cliente}{c.nicho ? ` · ${c.nicho}` : ''}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
)}
```

### 3.3 — Inserir na home

Em `src/pages/index.astro`, adicionar o import junto dos outros (topo do arquivo):

```astro
import Monetizacao from '../components/Monetizacao.astro';
```

E inserir logo **depois** do `</Reveal>` que fecha a seção `<!-- 07 · CASES COM NOME -->`
(que também contém a 08 · DEPOIMENTOS), antes de `<!-- 09 · PROCESSO EM 6 PASSOS -->`:

```astro
    <!-- 08b · MONETIZAÇÃO -->
    <Reveal><Monetizacao /></Reveal>
```

### 3.4 — Verificar

```bash
find src public -name "._*" -delete && npx astro build
```

Com todos os casos em `publicar: false`, a seção **não pode** aparecer:
```bash
grep -o "Canal monetizado sem" dist/index.html | wc -l
```
Esperado: `0`

Depois de o Leonardo virar um caso para `true` e pôr a imagem, rodar de novo.
Esperado: `1`. E conferir que a imagem existe:
```bash
ls -la public/assets/monetizacao-*.webp
```

---

## FASE 4 — Diagnóstico como produto entregável `[BLOQUEIO B3]`

### O problema

A home tem **12 CTAs** prometendo diagnóstico ("Quero o diagnóstico do meu canal",
"Quero meu diagnóstico"). O modal que abre diz outra coisa:

> "Vamos crescer seu canal? — Preencha os dados abaixo para analisarmos seu projeto
> antes da nossa conversa."

Quem clicou esperando um entregável recebe um formulário que despeja no WhatsApp.
É o maior ponto de perda da página, porque acontece no momento da decisão.

### A referência

`koibee.tech/reels` resolve isso especificando entrada, saída e prazo:
manda 3 Reels publicados + print do Insights → recebe um vídeo de 4 minutos de
análise em 48 horas → **"Grátis, e é seu de qualquer jeito"**.

### Proposta para o Leonardo aprovar `[B3]`

> **Você manda:** o link do canal.
> **Você recebe:** um vídeo de até 5 minutos analisando os 3 vídeos mais recentes —
> o que trava a retenção, o que a capa está deixando na mesa, e quais buscas o
> canal poderia estar ganhando e não ganha.
> **Prazo:** 48 horas úteis.
> **É seu de qualquer jeito, contratando ou não.**

Ele precisa confirmar: entregável, prazo, e se topa a promessa "de qualquer jeito".
**Não executar 4.1 e 4.2 sem essa confirmação.**

### 4.1 — Ajustar o modal

Em `src/components/LeadModal.astro`, trocar o `<h3>` e o parágrafo seguinte:

```astro
<h3 id="lead-modal-title" class="font-display text-2xl uppercase mb-2 text-foreground">Seu diagnóstico começa aqui</h3>
<p class="text-gray-600 text-sm mb-6">Manda o link do canal. Em até 48h úteis você recebe um vídeo de 5 minutos com o que está travando a retenção, a capa e as buscas. É seu contratando ou não.</p>
```

Ajustar o texto conforme a resposta do B3. **Não mexer nos campos do formulário** —
o Leonardo revisou e aprovou como está.

### 4.2 — Seção dedicada (opcional, decisão do Leonardo)

O Koibee dá ao diagnóstico uma seção inteira ("Grátis, e é seu de qualquer jeito").
Vale replicar entre `<!-- 10 · PRIMEIROS 30 DIAS -->` e `<!-- 11 · QUEM SOMOS -->`.
Só executar se ele pedir.

### 4.3 — Verificar

```bash
find src public -name "._*" -delete && npx astro build
grep -o "Seu diagnóstico começa aqui" dist/index.html | wc -l   # esperado 1
```

---

## FASE 5 — Seção de desqualificação

Não tem bloqueio: o conteúdo sai do que já está no site.

### Por que

A home tem qualificação positiva ("se você se reconhece em duas dessas") e nenhuma
desqualificação. O Koibee tem uma seção "Isso não é pra todo mundo" e ela faz dois
trabalhos: aumenta a autoridade percebida e corta lead ruim antes da call. O
Leonardo já usa preço para filtrar ("a partir de R$ 3.000/mês"); isto é o mesmo
filtro em forma de texto.

### 5.1 — Inserir na home

Em `src/pages/index.astro`, logo **depois** do `</Reveal>` da seção
`<!-- 12 · PLANOS -->` e antes de `<!-- 13 · PORTUGUÊS E ESPANHOL -->`:

```astro
    <!-- 12b · NÃO É PARA TODO MUNDO -->
    <Reveal as="section" class="py-16 md:py-24 bg-background border-t border-border">
      <div class="max-w-4xl mx-auto px-6">
        <div class="text-center mb-10">
          <h2 class="font-display text-3xl sm:text-4xl md:text-5xl uppercase mb-4">Isso <span class="text-primary">não</span> é para todo mundo</h2>
          <p class="text-gray-700 text-lg">Preferimos dizer agora do que na terceira reunião.</p>
        </div>
        <ul class="space-y-4 list-none p-0">
          <li class="flex gap-4 items-start p-5 rounded-xl border border-border shadow-card"><Icon name="x" weight="bold" class="text-primary mt-1 flex-shrink-0" /><span class="text-gray-800">Se você não consegue reservar algumas horas por mês para gravar. A gente faz todo o resto, mas ninguém grava no seu lugar.</span></li>
          <li class="flex gap-4 items-start p-5 rounded-xl border border-border shadow-card"><Icon name="x" weight="bold" class="text-primary mt-1 flex-shrink-0" /><span class="text-gray-800">Se você precisa de retorno em 30 dias. O YouTube leva de dois a três meses para entender sobre o que é o canal. Quem promete antes disso está vendendo outra coisa.</span></li>
          <li class="flex gap-4 items-start p-5 rounded-xl border border-border shadow-card"><Icon name="x" weight="bold" class="text-primary mt-1 flex-shrink-0" /><span class="text-gray-800">Se o que você quer é viralizar. A gente trabalha para o vídeo ser encontrado por anos na busca, não para render um pico de views numa semana.</span></li>
          <li class="flex gap-4 items-start p-5 rounded-xl border border-border shadow-card"><Icon name="x" weight="bold" class="text-primary mt-1 flex-shrink-0" /><span class="text-gray-800">Se você quer aprovar cada corte. A gente manda o vídeo pronto e ajusta o que você pedir, mas não trabalha com edição supervisionada quadro a quadro.</span></li>
          <li class="flex gap-4 items-start p-5 rounded-xl border border-border shadow-card"><Icon name="x" weight="bold" class="text-primary mt-1 flex-shrink-0" /><span class="text-gray-800">Se R$ 3.000 por mês é um valor que aperta o caixa. Esse investimento faz sentido para quem já fatura com o que sabe e quer ser encontrado por mais gente.</span></li>
        </ul>
      </div>
    </Reveal>
```

`Icon` já está importado no `index.astro`. Não precisa import novo.

### 5.1b — O último item da lista é o único motivo real de cancelamento

O Leonardo informou em 02/09 que, hoje, **o único motivo de cancelamento é o cliente
não ter caixa** — não é falha de entrega nem atraso. (Historicamente o churn vinha de
ele próprio ser o gargalo da operação, o que já foi resolvido.)

Isso muda o peso do último bullet da seção — *"Se R$ 3.000 por mês é um valor que
aperta o caixa"*. Ele não é filtro genérico de copy: é a única causa conhecida de
churn da empresa, dita na página antes da venda. Manter e não suavizar.

**Oportunidade de prova, se ele tiver o dado:** se o motivo de saída é só caixa, então
tempo médio de contrato e taxa de retenção são números favoráveis e publicáveis — e
mais fortes que qualquer depoimento, porque o público entende retenção. **Não estimar:**
só entra se ele levantar o número real da carteira.

### 5.2 — Leonardo revisa antes do push

Os cinco itens saem de fatos que já estão no site (o FAQ diz "entre o segundo e o
terceiro mês"; o posicionamento de SEO vs. viral está na seção 05). Mesmo assim,
**ele lê e aprova o texto antes do commit** — é copy de venda, não é correção técnica.

### 5.3 — Verificar

```bash
find src public -name "._*" -delete && npx astro build
grep -o 'Isso <span class="text-primary">não</span> é para todo mundo' dist/index.html | wc -l   # esperado 1
```

---

## FASE 6 — "A conta que importa"

### Por que

Nenhum plano mostra preço, e o "a partir de R$ 3.000/mês" aparece uma vez sem
comparação. O Leonardo já removeu uma seção de custo confusa em agosto (commit
`18c3800`) — a intuição de remover estava certa, mas a lacuna continua.

O Koibee resolve isso ancorando em **dado externo verificável**: salário mediano de
editor no CAGED, número de processos trabalhistas no TST. Não em conta inventada.

### 6.1 — Caminho A: enumerar os papéis, sem citar salário (sem bloqueio)

O **O Novo Mercado** resolve essa ancoragem sem publicar um único número de
salário: ele apenas **lista o time que você teria que montar** e deixa o leitor
fazer a conta sozinho ("um copywriter, um gestor de tráfego, alguém pro suporte,
um social media...").

Isso serve à Aprimarus e **não depende do B4**. A home já tem a matéria-prima: a
tabela "sem/com" traz a linha *"3 profissionais para coordenar"*, que hoje está
solta e não é desenvolvida em lugar nenhum.

Inserir em `src/pages/index.astro`, logo depois do `</Reveal>` da seção
`<!-- 12 · PLANOS -->` (antes da seção 12b da FASE 5, se ela já existir):

```astro
    <!-- 12c · A CONTA QUE IMPORTA -->
    <Reveal as="section" class="py-16 md:py-24 bg-soft border-t border-border">
      <div class="max-w-4xl mx-auto px-6">
        <div class="text-center mb-10">
          <h2 class="font-display text-3xl sm:text-4xl md:text-5xl uppercase mb-4">A conta que <span class="text-primary">importa</span></h2>
          <p class="text-gray-700 text-lg max-w-2xl mx-auto">Para o canal rodar toda semana, alguém precisa fazer cada uma destas coisas. A pergunta não é se elas custam — é quem paga e quem coordena.</p>
        </div>
        <ul class="grid sm:grid-cols-2 gap-4 list-none p-0 mb-10">
          <li class="p-5 rounded-xl border border-border shadow-card"><p class="font-bold text-foreground mb-1">Quem decide o tema</p><p class="text-sm text-gray-700">Pesquisa de busca, análise de concorrente, gancho e promessa. Sem isso, o vídeo bom morre com 200 views.</p></li>
          <li class="p-5 rounded-xl border border-border shadow-card"><p class="font-bold text-foreground mb-1">Quem edita</p><p class="text-sm text-gray-700">Corte, ritmo e retenção. Editor bom não é barato, e editor barato custa em retenção.</p></li>
          <li class="p-5 rounded-xl border border-border shadow-card"><p class="font-bold text-foreground mb-1">Quem faz a capa</p><p class="text-sm text-gray-700">Thumbnail é o que decide o clique. É trabalho de design, não de quem edita.</p></li>
          <li class="p-5 rounded-xl border border-border shadow-card"><p class="font-bold text-foreground mb-1">Quem publica com SEO</p><p class="text-sm text-gray-700">Título, descrição, tags e cards. É o que faz o vídeo ser encontrado depois da primeira semana.</p></li>
          <li class="p-5 rounded-xl border border-border shadow-card"><p class="font-bold text-foreground mb-1">Quem lê os números</p><p class="text-sm text-gray-700">Relatório mensal e ajuste de rota. Sem isso o canal repete o erro por seis meses.</p></li>
          <li class="p-5 rounded-xl border border-border shadow-card bg-card"><p class="font-bold text-primary mb-1">E quem coordena os quatro</p><p class="text-sm text-gray-700">Na prática, esse é você — toda semana, no meio da agenda de atendimento.</p></li>
        </ul>
        <p class="text-center text-gray-800 text-lg">Com a Aprimarus, os cinco primeiros são nossos e o sexto deixa de existir. Você grava e aprova.</p>
      </div>
    </Reveal>
```

**Verificar:**
```bash
find src public -name "._*" -delete && npx astro build
grep -o "A conta que" dist/index.html | wc -l   # esperado 1
```

### 6.2 — Caminho B: números reais `[BLOQUEIO B4]` — opcional

Se um dia o Leonardo quiser publicar valores, vale a regra do V4 e do Koibee: cada
número precisa de **fonte externa citável** (CAGED, TST, pesquisa salarial). **Não
pesquisar, não estimar, não reaproveitar os números do Koibee.** Enquanto ele não
fornecer com fonte, fica só o Caminho A — que já resolve a ancoragem.

---

## FASE 7 — Disclaimer de resultados

Rápido, sem bloqueio.

### Por que

A home afirma +1.907% de visualizações, +1.527% de receita e +4.480% de inscritos,
sem nenhuma ressalva. O Leonardo optou por manter esses números **sem nome de
cliente** — o que torna a ressalva mais importante, não menos. O Koibee tem a dele
logo abaixo dos depoimentos.

### 7.1 — Inserir

Em `src/pages/index.astro`, dentro da seção `<!-- 07 · CASES COM NOME -->`, logo
depois do `</div>` que fecha o grid dos três cases (antes do bloco
`<!-- 08 · DEPOIMENTOS -->`):

```astro
          <p class="text-xs text-gray-500 text-center mt-8 max-w-3xl mx-auto">
            Resultados individuais, medidos no YouTube Studio dos próprios canais. Variam conforme
            nicho, frequência de gravação e ponto de partida do canal. Não são promessa de resultado.
          </p>
```

### 7.2 — Verificar

```bash
find src public -name "._*" -delete && npx astro build
grep -o "Não são promessa de resultado" dist/index.html | wc -l   # esperado 1
```


---

## FASE 8 — Velocidade

Medido com Lighthouse 12 local em 02/09/2026, contra o site **no ar** (ou seja,
antes das correções da FASE 1).

### Linha de base

| | Mobile | Desktop |
|---|---|---|
| **Performance** | **91** | **94** |
| Acessibilidade | 100 | 100 |
| Boas práticas | 79 | 78 |
| SEO | 100 | 100 |
| First Contentful Paint | 1,8 s | 0,7 s |
| Largest Contentful Paint | 1,8 s | 1,5 s |
| Total Blocking Time | 320 ms | 0 ms |
| Cumulative Layout Shift | 0,06 | 0,069 |

O elemento de LCP é a imagem do hero (`/assets/depois.webp`), que já tem
`fetchpriority="high"`. A base do site está boa. Os dois problemas reais estão
identificados abaixo.

### 8.1 — O gargalo é a stack de medição, não o site

Os 320 ms de Total Blocking Time no mobile vêm quase todos de terceiros:

| Terceiro | Bloqueio da main thread | Peso |
|---|---|---|
| Microsoft Clarity | **184 ms** | 25 KB |
| Google Tag Manager | 88 ms | 123 KB |
| Google Analytics (gtag) | 0 ms | 170 KB |
| Bing Ads | 0 ms | — |
| Google Fonts | 0 ms | — |
| **Terceiros somados** | **270 ms de 320 ms** | 293 KB de JS, **138 KB nunca executados** |

O código próprio do site não bloqueia praticamente nada. São quatro ferramentas de
medição num site institucional de 9 páginas.

Os mesmos terceiros são a causa da nota 79/78 em Boas Práticas: **8 cookies de
terceiro**. Não existe outra falha nessa categoria.

**Decisão tomada em 02/09: remover o Clarity.** ("nem vejo ele na verdade")

O Clarity não está no código do site — entra pelo GTM. Remover pelo painel:

1. `tagmanager.google.com` → contêiner **GTM-KK5V6447**
2. Tags → localizar a tag do Microsoft Clarity → **Pausar** (não excluir ainda)
3. **Enviar** / Publicar a versão
4. Verificar que sumiu:
   ```bash
   curl -s https://aprimarus.com.br/ | grep -c clarity   # esperado 0 (já era 0: entra via GTM)
   ```
   A verificação real é no navegador: abrir aprimarus.com.br com o DevTools na aba
   Network, filtrar por `clarity` e confirmar que nenhuma requisição sai.
5. Depois de uma semana sem problema, excluir a tag de vez.

**Ganho esperado:** TBT mobile de 320 ms → ~136 ms, Performance de 91 → faixa de
96–97, e um cookie de terceiro a menos em Boas Práticas.

**O Bing Ads UET sai junto.** Confirmado em 02/09: o Leonardo não roda anúncio no
Bing. A tag não tem função nenhuma e é rastreamento ativo à toa. Mesmo caminho:
pausar no GTM, publicar, verificar, excluir depois de uma semana.

Depois de remover, refazer a medição do passo 8.4.

**A CSP encolhe junto.** Com Clarity e Bing fora, estes hosts saem de
`public/_headers` **e** do `netlify.toml` (enquanto ele existir):

| Host | Sai de |
|---|---|
| `https://www.clarity.ms` | `script-src` |
| `https://*.clarity.ms` | `script-src`, `img-src`, `connect-src` |
| `https://c.bing.com` | `img-src`, `connect-src` |

Fazer **só depois** de confirmar no DevTools que as duas tags pararam de disparar.
Comando depois da edição:
```bash
grep -c "clarity\|bing" public/_headers netlify.toml   # esperado 0 nos dois
```

### 8.2 — Imagens: o que reduzir e o que NÃO tocar

> **Aviso: o Lighthouse marca como "properly size images" várias imagens que já
> estão corretas.** Ele mede contra DPR 1; telas retina precisam de 2×. Reduzir as
> imagens da coluna "NÃO TOCAR" deixaria o site borrado em celular e MacBook.
> Seguir a tabela, não o Lighthouse.

Auditoria de todas as 31 imagens (`sips` para dimensão real × `width`/`height`
declarados no código):

**REDUZIR — desperdício real:**

| Arquivo(s) | Real hoje | Exibido | Alvo (2×) | Peso hoje |
|---|---|---|---|---|
| `depoimento-1..6.webp` | 1242 px larg. | **400×400** (portfólio) e **44×44** (home) | 800 larg. | 612 KB |
| `thumb-1..5.webp` | 1192 px larg. | 480×270 (portfólio) | 960 larg. | 879 KB |
| `case-1..3.webp` | ~1300 px larg. | 400×300 (home) | 800 larg. | 187 KB |

**NÃO TOCAR — já estão em 2× e o Lighthouse erra:**

| Arquivo(s) | Real | Exibido | Motivo |
|---|---|---|---|
| `videos/*.webp` | 960×540 | 480×270 | exatamente 2× |
| `clientes/*.webp` | 240×240 | 96×96 | 2,5×, correto |
| `depois.webp` | 900×503 | 900×503 | é o elemento de LCP, só 24 KB |
| `casal.webp` | 768×1376 | 500×400 | recorte `object-cover`, precisa da altura |

**Comando** (`cwebp` já instalado em `/opt/homebrew/bin/cwebp`). Testado: um
arquivo de 189 KB virou 33 KB, sem perda visível.

```bash
cd "/Volumes/hd projetos/Claude/Aprimarus/aprimarus-site/public/assets"
cp -R . /tmp/assets-backup-$(date +%Y%m%d)   # backup antes de qualquer coisa

for n in 1 2 3 4 5 6; do
  cwebp -q 82 -resize 800 0 "depoimento-$n.webp" -o "tmp.webp" && mv tmp.webp "depoimento-$n.webp"
done
for n in 1 2 3 4 5; do
  cwebp -q 82 -resize 960 0 "thumb-$n.webp" -o "tmp.webp" && mv tmp.webp "thumb-$n.webp"
done
for n in 1 2 3; do
  cwebp -q 82 -resize 800 0 "case-$n.webp" -o "tmp.webp" && mv tmp.webp "case-$n.webp"
done
```

**Verificar** (dimensões corretas e queda de peso):
```bash
cd "/Volumes/hd projetos/Claude/Aprimarus/aprimarus-site/public/assets"
for f in depoimento-*.webp thumb-*.webp case-*.webp; do
  printf "%-22s %-12s %s\n" "$f" "$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}')px" "$(du -h "$f" | cut -f1)"
done
du -sh /tmp/assets-backup-* . 
```
Esperado: `depoimento-*` e `case-*` com 800 px, `thumb-*` com 960 px, e a pasta
bem menor que o backup.

**Depois, conferir visualmente antes do commit**: abrir `/` e `/portfolio` com
`npx astro dev` e olhar os prints de depoimento e as thumbnails. Se algum ficou
borrado, restaurar do backup e refazer com `-q 90`.

### 8.3 — Miniatura dedicada para os depoimentos da home

Na home os prints aparecem a **44×44 px**, e mesmo depois do 8.2 cada arquivo tem
800 px de largura. Criar variantes pequenas:

```bash
cd "/Volumes/hd projetos/Claude/Aprimarus/aprimarus-site/public/assets"
for n in 4 5 6; do
  cwebp -q 82 -resize 88 0 "depoimento-$n.webp" -o "depoimento-$n-mini.webp"
done
ls -la depoimento-*-mini.webp
```

(Só 4, 5 e 6 — são os três que a home usa. Conferir no array `depoimentos` no
topo de `src/pages/index.astro` antes de rodar.)

Depois, em `src/pages/index.astro`, apontar o array para as variantes:
```astro
const depoimentos = [
  { img: '/assets/depoimento-5-mini.webp', frase: 'Você simplesmente arrasou. Edição impecável.' },
  { img: '/assets/depoimento-4-mini.webp', frase: 'Gostei demais dessa edição, ficou show.', nome: 'Marina Moretz' },
  { img: '/assets/depoimento-6-mini.webp', frase: 'Gostei da sua postura, do seu trabalho e, principalmente, da sua garra.' },
];
```

O portfólio continua usando os arquivos de 800 px — não mexer nele.

### 8.4 — Re-medir e comparar

```bash
cd /tmp
npx --yes lighthouse@12 https://aprimarus.com.br/ \
  --only-categories=performance,accessibility,best-practices,seo \
  --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate \
  --output=json --output-path=/tmp/lh-mobile-depois.json \
  --chrome-flags="--headless=new --no-sandbox" --quiet

npx --yes lighthouse@12 https://aprimarus.com.br/ \
  --only-categories=performance,accessibility,best-practices,seo \
  --preset=desktop --output=json --output-path=/tmp/lh-desktop-depois.json \
  --chrome-flags="--headless=new --no-sandbox" --quiet

node -e '
for (const f of ["mobile","desktop"]) {
  const r = JSON.parse(require("fs").readFileSync(`/tmp/lh-${f}-depois.json`,"utf8"));
  console.log("\n=== " + f.toUpperCase() + " ===");
  for (const [k,c] of Object.entries(r.categories)) console.log(`  ${c.title.padEnd(16)} ${Math.round(c.score*100)}`);
  for (const id of ["largest-contentful-paint","total-blocking-time","cumulative-layout-shift"])
    if(r.audits[id]) console.log(`  ${r.audits[id].title.padEnd(28)} ${r.audits[id].displayValue}`);
}'
```

**Meta:** Performance ≥ 95 nos dois, Boas Práticas ≥ 90 (só sobe se o B5 for
executado), Acessibilidade e SEO em 100. Se Performance cair abaixo da linha de
base, PARE e reporte.

---

## FASE 9 — Segurança e privacidade

### 9.1 — O que já está correto (verificado no ar em 02/09)

Sete cabeçalhos ativos e corretos: `Content-Security-Policy`,
`Strict-Transport-Security` (2 anos, `includeSubDomains`, `preload`),
`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
`Permissions-Policy`, `Cross-Origin-Opener-Policy`. Sem `/admin`, sem Netlify
Identity, sem backend, sem auth, sem input de usuário armazenado.

Depois da FASE 1 a CSP fica mais estreita ainda (sai o `cdn.jsdelivr.net`).

### 9.2 — Lacuna de privacidade — resolvida removendo a ferramenta

Verificado em `src/pages/privacidade.astro`:

| Termo | Aparece? |
|---|---|
| LGPD | sim (3×) |
| Google Analytics | sim (3×) |
| cookie | sim (1×) |
| **Microsoft Clarity** | **não** |
| **gravação de sessão** | **não** |
| **Bing** | **não** |

O Clarity faz *session replay*: grava movimento de mouse, cliques e rolagem do
visitante. O site roda 8 cookies de terceiro e **não tem banner de consentimento**
(a única ocorrência de "consentimento" no repo é o texto da própria política).

Para uma empresa brasileira, com público de médicos e advogados, gravar sessão sem
declarar era a lacuna mais séria do site — mais que qualquer cabeçalho.

**Decisão tomada em 02/09: remover o Clarity e o Bing.** Executado na FASE 8.1.

Com as duas tags fora, a lacuna fecha sozinha: **não há mais gravação de sessão a
declarar**, e os 8 cookies de terceiro caem para os do GA4/GTM, que a política já
cobre. Nada a escrever na política de privacidade.

**O que ainda vale conferir depois da 8.1** — contar os cookies que sobraram e ver
se a política cobre todos:
```bash
# no navegador, com o DevTools aberto em aprimarus.com.br:
# Application → Cookies → conferir a lista contra o texto de src/pages/privacidade.astro
```
Se sobrar algum cookie de domínio que a política não menciona, aí sim é caso de
atualizar o texto — **e isso passa pelo Leonardo, é documento legal**.

### 9.3 — CSP: o `'unsafe-inline'` fica, e por quê

A `script-src` tem `'unsafe-inline'`, que é a parte mais fraca da CSP. **Não tentar
remover enquanto o GTM estiver no site**: o GTM injeta scripts inline em tempo de
execução e quebra com CSP baseada em hash. Trocar por `nonce` exigiria HTML
dinâmico, que um site estático não tem.

Ou seja: só dá para endurecer isso removendo o GTM. Não é uma correção pendente, é
uma consequência aceita da escolha de usar GTM. Registrar e seguir.

### 9.4 — Ganhos de segurança grátis depois da migração (FASE 2) `[CONCLUÍDO 02/09]`

**Feito, verificado por fora (TLS 1.1 recusado, TLS 1.2 aceito, site em 200):**

- **SSL/TLS → Overview**: modo trocado de `Full` para **Full (strict)** — agora
  valida o certificado de origem, não só criptografa.
- **SSL/TLS → Edge Certificates**: **Always Use HTTPS** ligado. **Minimum TLS
  Version** subiu de 1.0 para **1.2**.
- **Security → Settings → Bot traffic**: **Bot fight mode** ligado (estava
  desligado por padrão).

**Correção de algo que eu disse errado antes:** "WAF Managed Rules grátis" —
**não existe no Free**. Testado no painel: as *Managed Rules* completas
(OWASP etc.) só entram a partir do plano **Pro, US$20/mês**. O que já vem
ativo de graça no Free, e não precisou de ação, é o **"Cloudflare managed
ruleset"** básico (Security → Settings, sempre ativo) — mais fraco que o
completo, mas cobre exploit comum. Não assinar Pro sem o Leonardo decidir
gastar.

Não conferido: **Automatic HTTPS Rewrites** e **Brotli** — o item original do
documento citava os dois, mas não foram verificados nesta rodada. Baixo risco
(Brotli já estava confirmado ligado na auditoria original de agosto, antes da
migração). Conferir num passe futuro se sobrar tempo.

### 9.5 — Verificação de segurança (rodar depois da FASE 2)

```bash
echo "=== cabeçalhos (esperado: os 7 presentes) ==="
curl -sI https://aprimarus.com.br/ | grep -icE "content-security-policy|strict-transport-security|x-frame-options|x-content-type-options|referrer-policy|permissions-policy|cross-origin-opener-policy"

echo "=== HTTP redireciona para HTTPS (esperado 301/308) ==="
curl -sI -o /dev/null -w "%{http_code}\n" http://aprimarus.com.br/

echo "=== /admin bloqueado (esperado 301) ==="
curl -sI -o /dev/null -w "%{http_code}\n" https://aprimarus.com.br/admin/

echo "=== não expõe versão do servidor ==="
curl -sI https://aprimarus.com.br/ | grep -iE "^server|x-powered-by"

echo "=== TLS mínimo 1.2 (esperado: handshake falhar em 1.1) ==="
curl -sI --tlsv1.1 --tls-max 1.1 https://aprimarus.com.br/ >/dev/null 2>&1 && echo "FALHA: aceita TLS 1.1" || echo "OK: recusa TLS 1.1"
```

Esperado: primeira linha `7`, HTTP redirecionando, `/admin` em 301, `server:
cloudflare` sem versão, e TLS 1.1 recusado.

### 9.6 — Rotina

Rodar 9.5 e 8.4 **uma vez por mês** e sempre que adicionar script externo novo.
Ao adicionar qualquer CDN/script, liberar o host em `public/_headers` — se
esquecer, a CSP bloqueia silenciosamente e o recurso não carrega.


---

## FASE 10 — Copy: o que vem das quatro referências

Analisados em 02/09: `koibee.tech/reels`, `v4company.com`, `g4business.com` e
`onovomercado.com`. O anexo no fim do documento tem a comparação completa. Aqui
estão só os itens que valem aplicar, em ordem de valor.

### 10.1 — O FAQ existe, mas só o Google enxerga `[BLOQUEIO B7 parcial]`

**Verificado no HTML publicado:**

| Pergunta | No JSON-LD | Visível na página |
|---|---|---|
| Quanto custa a gestão da Aprimarus? | sim | **não** |
| Preciso já ter canal no YouTube? | sim | **não** |
| Em quanto tempo aparece resultado? | sim | **não** |
| A Aprimarus atende em espanhol? | sim | **não** |

As quatro respostas que derrubam objeção de compra estão no `extraSchema` da home e
**não aparecem em lugar nenhum para o visitante**. Os quatro sites de referência
têm FAQ visível — o do O Novo Mercado tem 21 perguntas.

Além da conversão perdida, isso contraria a diretriz de dados estruturados do
Google, que exige que o conteúdo marcado esteja visível na página. É a mesma classe
do `sr-only` já corrigido na FASE 1.

**Correção — fonte única, para schema e página nunca divergirem.**

Em `src/pages/index.astro`, no bloco de frontmatter (topo, junto do array
`depoimentos`), criar:

```astro
const faq = [
  { pergunta: 'Quanto custa a gestão de canal da Aprimarus?',
    resposta: 'Os planos começam em R$ 3.000 por mês e variam pela frequência de publicação. Não cobramos taxa de setup e não cobramos diagnóstico.' },
  { pergunta: 'Preciso já ter canal no YouTube para contratar?',
    resposta: 'Não. Tem canal na nossa carteira que começou sem nenhum vídeo publicado, e tem canal que estava parado há anos e voltou a crescer.' },
  { pergunta: 'Em quanto tempo aparece resultado?',
    resposta: 'Os primeiros vídeos vão ao ar na terceira semana. Movimento de busca costuma aparecer entre o segundo e o terceiro mês, porque o YouTube leva tempo para entender sobre o que é o canal.' },
  { pergunta: 'Já tentei com editor ou freelancer e não andou. Por que com vocês seria diferente?',
    resposta: 'Porque o problema quase nunca é a edição. É não ter ninguém decidindo o tema, o gancho e a capa antes da gravação, e ninguém olhando o número depois da publicação. Freelancer executa o que você pedir. A gente decide o que pedir.' },
  { pergunta: 'Não consigo gravar toda semana. Ainda funciona?',
    resposta: 'Funciona. O plano é escolhido pela frequência que você consegue sustentar, não pela que seria ideal. Gravar quatro vídeos num dia e publicar ao longo do mês é o formato mais comum entre os nossos clientes.' },
  { pergunta: 'E se eu não gostar do vídeo editado?',
    resposta: 'A gente ajusta. O vídeo só vai ao ar depois da sua aprovação, e o que você pedir para mudar entra na mesma leva, sem custo extra.' },
  { pergunta: 'A Aprimarus atende em espanhol?',
    resposta: 'Sim. A operação é bilíngue e tem base na Argentina.' },
];
```

Trocar o `mainEntity` do `extraSchema` para gerar a partir desse array:

```astro
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.pergunta,
        acceptedAnswer: { '@type': 'Answer', text: f.resposta },
      })),
```

E inserir a seção visível, logo antes de `<!-- 14 · CTA FINAL -->`:

```astro
  <!-- 13b · PERGUNTAS FREQUENTES -->
  <Reveal as="section" class="py-16 md:py-24 bg-background border-t border-border">
    <div class="max-w-3xl mx-auto px-6">
      <h2 class="font-display text-3xl sm:text-4xl md:text-5xl uppercase text-center mb-4">Perguntas frequentes</h2>
      <div class="w-16 h-1 bg-primary mx-auto mb-12"></div>
      <div class="space-y-3">
        {faq.map((f) => (
          <details class="group rounded-xl border border-border shadow-card overflow-hidden">
            <summary class="cursor-pointer list-none p-5 font-bold text-foreground flex justify-between items-center gap-4">
              {f.pergunta}
              <span class="text-primary text-2xl leading-none shrink-0 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p class="px-5 pb-5 text-gray-700 leading-relaxed">{f.resposta}</p>
          </details>
        ))}
      </div>
    </div>
  </Reveal>
```

**Atenção:** a seção 13b fica **fora** do `</main>`, junto com a 14 · CTA FINAL —
conferir onde o `</main>` fecha antes de colar.

**A oitava pergunta — termos confirmados em 02/09.** Acrescentar ao array `faq`,
como penúltimo item (antes da pergunta sobre espanhol):

```astro
  { pergunta: 'Tem fidelidade? E se eu quiser sair?',
    resposta: 'O compromisso mínimo é de três meses. Não é carência comercial: é o tempo mínimo em que dá para saber se o canal está reagindo, porque o YouTube leva de dois a três meses para entender sobre o que é o canal. Passados os três meses, você encerra quando quiser avisando com 30 dias de antecedência. O contrato é anual e se renova sozinho para você não precisar reassinar todo ano, mas a saída continua sendo por aviso de 30 dias a qualquer momento depois do terceiro mês.' },
```

**Por que responder isso de frente:** é a objeção nº 1 de serviço recorrente de
R$ 3.000/mês, e o público é médico e advogado — gente que vai ler o contrato antes
de assinar. Descobrir "anual com renovação automática" na hora da assinatura custa
mais caro que ler no site.

E o mínimo de 3 meses **tem justificativa que já está no próprio site**: o FAQ diz
que o movimento de busca aparece entre o segundo e o terceiro mês. O mínimo casa com
o mecanismo, não é trava comercial arbitrária. Dito assim, a cláusula vira prova de
honestidade em vez de bandeira vermelha.

> **Aprovado pelo Leonardo em 02/09/2026.** A resposta afirma que, depois do
> terceiro mês, sair custa só o aviso de 30 dias — ou seja, a aprovação dele confirma
> que **não há multa rescisória** por sair antes de completar os 12 meses. Se essa
> premissa mudar, o texto tem que mudar junto.

**Verificar:**
```bash
find src public -name "._*" -delete && npx astro build
python3 -c "
import re
h=open('dist/index.html',encoding='utf-8').read()
vis=re.sub(r'<script type=\"application/ld\+json\">.*?</script>','',h,flags=re.S)
for t in ['Quanto custa a gestão','Já tentei com editor','Tem fidelidade']:
    print(f'{t}: visível={t in vis}')
print('esperado: True nos três')
"
grep -o '<details' dist/index.html | wc -l   # esperado 8
```

### 10.2 — Os botões de plano jogam fora a escolha do visitante

**Verificado:** os 11 CTAs da home chamam `openModal()` sem argumento. "Falar sobre
o Essencial", "Quero o plano Pro" e "Falar sobre o Scale" geram **a mesma mensagem
de WhatsApp**. O visitante diz qual plano quer e a informação é descartada entre o
clique e a conversa.

O V4 faz o oposto: a etapa seguinte é explicada e o contexto viaja junto.

**Correção.** Em `src/components/LeadModal.astro`, no `<script is:inline>`:

```js
  let planoEscolhido = '';

  function openModal(plano) {
    planoEscolhido = plano || '';
    lastFocused = document.activeElement;
    modal.classList.remove('hidden');
    const focusable = getFocusable();
    (focusable[0] || modal).focus();
    document.addEventListener('keydown', onKeydown);
  }
```

(substitui a `openModal()` atual — o resto do corpo dela não muda)

E na montagem da mensagem, dentro do `submit`:

```js
    const linhaPlano = planoEscolhido ? `\n*Plano de interesse:* ${planoEscolhido}` : '';
    const mensagem = `Olá Leonardo e Veronica! Vim pelo site e gostaria de falar sobre meu projeto.\n\n*Nome:* ${nome}\n*WhatsApp:* ${fone}\n*YouTube:* ${youtube}\n*Instagram:* ${insta}${linhaPlano}`;
```

Acrescentar o plano também ao evento do dataLayer:

```js
    window.dataLayer.push({ event: 'lead_whatsapp_click', form_id: 'lead-form', plano: planoEscolhido || 'nao_informado' });
```

Em `src/pages/index.astro`, nos **três botões dos cards de plano** (e só neles):

| Botão | Trocar por |
|---|---|
| `onclick="openModal()"` em "Falar sobre o Essencial &rarr;" | `onclick="openModal('Essencial')"` |
| `onclick="openModal()"` em "Quero o plano Pro &rarr;" | `onclick="openModal('Pro')"` |
| `onclick="openModal()"` em "Falar sobre o Scale &rarr;" | `onclick="openModal('Scale')"` |

Os outros 8 CTAs continuam `openModal()` sem argumento — está correto, eles não
carregam escolha de plano.

**Verificar:**
**Antes da correção** (conferir para saber de onde está partindo):
```bash
grep -o "openModal()" dist/index.html | wc -l   # 12 = 11 botões + a própria function openModal()
```

**Depois da correção:**
```bash
find src public -name "._*" -delete && npx astro build
grep -o "openModal('[A-Za-z]*')" dist/index.html | sort -u   # esperado: openModal('Essencial'), openModal('Pro'), openModal('Scale')
grep -o "openModal()" dist/index.html | wc -l                # esperado 8
```

A conta do 8: dos 12 de antes, 3 botões viram nomeados e a declaração
`function openModal()` vira `function openModal(plano)`. Sobram os 8 CTAs que
legitimamente não carregam plano.

Depois, teste manual: abrir a home, clicar em "Quero o plano Pro", preencher e
enviar. A mensagem do WhatsApp tem que conter `*Plano de interesse:* Pro`.

### 10.3 — O hero não tem prazo

Três das quatro referências prometem entregável **com data** logo no hero:

| Site | Hero |
|---|---|
| G4 | "Sua empresa parou de crescer e você não sabe exatamente por quê / **Em 4 dias**, você sai com um plano de gestão e estratégia validado por quem já escalou negócios como o seu." |
| Koibee | "Seus vídeos parados **no ar em 3 dias úteis**" |
| Aprimarus | "Você só grava. O resto é com a gente." |

O hero da Aprimarus descreve o **mecanismo** e nunca diz quando algo acontece. E o
prazo já existe no site — está na resposta do FAQ e na seção 10: *"os primeiros
vídeos vão ao ar na terceira semana"*. Está enterrado.

**Correção** — em `src/pages/index.astro`, no parágrafo abaixo do `<h1>`, trocar a
última frase. De:

> "Você entra na frente da câmera, fala o que já sabe, e sai. O canal continua trabalhando depois que você desliga."

Para:

> "Você entra na frente da câmera, fala o que já sabe, e sai. **Os primeiros vídeos vão ao ar na terceira semana**, e o canal continua trabalhando depois que você desliga."

Não é promessa nova: é a mesma que já está no FAQ e na seção de primeiros 30 dias,
promovida para onde é lida.

### 10.4 — Auto-qualificação de plano (opcional, decisão do Leonardo)

O G4 abre com *"Existe um G4 para cada fase da sua empresa — responda 3 perguntas
rápidas e a gente te mostra o caminho certo."* Substitui "fale conosco" por
"descubra sozinho".

A Aprimarus já diz, na seção de planos: *"Qual plano serve para você depende da
frequência que você consegue gravar, e a gente descobre isso em quinze minutos de
conversa."* Mas isso é **uma pergunta só**, e o visitante consegue responder
sozinho: 4, 8 ou 12 vídeos por mês → Essencial, Pro ou Scale.

Vale trocar os quinze minutos de conversa por um seletor de uma pergunta acima dos
cards, que destaca o plano correspondente e já leva o nome dele para o WhatsApp
(usando o `openModal('<plano>')` da 10.2).

**Não executar sem o Leonardo pedir** — muda a lógica de qualificação dele, que
hoje é deliberadamente por conversa.

### 10.5 — Credencial de terceiro: não tem, e não se inventa

**Resolvido em 02/09: o Leonardo não tem nenhuma certificação.** Item encerrado —
**nada a fazer, e nada a criar**. Selo inventado ou inflado é o tipo de coisa que
destrói autoridade justamente com o público que ele atende.

Registrado para o futuro, sem urgência: a única credencial real e gratuita ao
alcance é a trilha do **Google Skillshop** (certificação de Vídeo do Google Ads).
É individual, não é selo de agência, e vale bem menos que o "Google Partner Premier"
do V4 — que exige volume de mídia gerenciada. Não muda nada hoje.

A prova de terceiro que a Aprimarus **já tem** é melhor que selo: print do YouTube
Studio do canal do cliente. É verificável e específica. É o que a FASE 3 amplia.

---

## Verificação final (rodar depois de todas as fases)

```bash
cd "/Volumes/hd projetos/Claude/Aprimarus/aprimarus-site"
find src public -name "._*" -delete
npx astro build

echo "=== estrutura ==="
grep -o 'Quem responde no WhatsApp\|Modelos de <\|Isso <span' dist/index.html

echo "=== páginas no ar ==="
for p in / /portfolio /blog /privacidade /termos; do
  printf "%-16s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' "https://aprimarus.com.br$p")"
done

echo "=== host (esperado cloudflare) ==="
curl -sI https://aprimarus.com.br/ | grep -i "^server"

echo "=== cache (esperado max-age=604800) ==="
curl -sI https://aprimarus.com.br/assets/casal.webp | grep -i cache-control

echo "=== CSP sem jsdelivr (esperado 0) ==="
curl -sI https://aprimarus.com.br/ | grep -io jsdelivr | wc -l
```

---

## Anexo — as quatro referências

Sites que o Leonardo mandou como referência, analisados em 02/09/2026.

| Site | O que é | Ticket | Modelo de venda |
|---|---|---|---|
| `koibee.tech/reels` | Edição de Reels (Gabriel) | R$ 1.497–2.597 | transacional, link de compra |
| `v4company.com` | Assessoria de marketing, franquia | alto, sob consulta | consultiva, formulário → ligação |
| `g4business.com` | Educação executiva | alto | consultiva, quiz → programa |
| `onovomercado.com` | Assinatura de escola digital | R$ 139/mês | autosserviço, checkout |

O V4 é o comparável mais próximo da Aprimarus: ticket alto, venda consultiva,
serviço recorrente, público de dono de negócio.

### Aproveitado

| Mecanismo | De onde | Onde entra |
|---|---|---|
| FAQ visível (o da Aprimarus só existe no JSON-LD) | os 4 | 10.1 |
| Objeções de falha e de contrato no FAQ, não só logística | ONM (21 perguntas), V4 | 10.1 |
| Multa e cancelamento respondidos de frente | V4 | 10.1 / B7 |
| Contexto da escolha viaja com o clique | V4 | 10.2 |
| Hero com entregável **datado** | G4, Koibee | 10.3 |
| Diagnóstico grátis com entrada, saída e prazo definidos | Koibee | FASE 4 |
| "O que acontece depois que você envia" | V4 ("ligação em até 12h") | FASE 4 |
| Ancoragem de custo enumerando papéis, sem citar salário | ONM | 6.1 |
| Números com fonte externa citável, quando houver número | V4, Koibee | 6.2 |
| Seção de desqualificação | Koibee | FASE 5 |
| Disclaimer de resultados | Koibee | FASE 7 |
| Fundador antes do preço | Koibee, G4 | já aplicado |
| Selo de terceiro com estatística de escassez | V4 | 10.5 (se existir) |
| Auto-qualificação em vez de "fale conosco" | G4 | 10.4 (se ele quiser) |

### Deliberadamente **não** aproveitado

| Mecanismo | Por quê |
|---|---|
| Link de compra direta (Koibee, ONM) | R$ 3.000+/mês para médico e advogado é venda consultiva. Checkout direto queima a qualificação. |
| Contador de vagas (Koibee), "ÚLTIMAS VAGAS" (G4) | Escassez explícita em ticket alto e público de autoridade lê como pressão e derruba posicionamento. |
| Garantia com multa por atraso (Koibee) | Funciona para lote de vídeo com prazo fixo. Gestão de canal não tem entregável único assim. O equivalente honesto é o prazo da terceira semana, que a 10.3 promove. |
| Garantia de 7 dias com devolução (ONM) | Faz sentido em assinatura de R$ 139. Em serviço com equipe alocada, não. |
| Conselho de notáveis, podcast, escritórios (V4) | Prova de escala que a Aprimarus não tem e não deve simular. A prova dela é o oposto: são duas pessoas e quem atende é quem executa. |
| Tom e nomes dos planos ("DESENTOPE") | Conflita com o padrão de linguagem da Aprimarus: termo técnico e número, sem analogia. |
| Depoimento em vídeo com CEO e cargo (G4) | Só quando existir. Hoje não há depoimento de resultado — ver decisões do Leonardo. |

### A observação que atravessa os quatro

Todos abrem dizendo **o problema do leitor**, não o que a empresa faz:

- G4: "Sua empresa parou de crescer e você não sabe exatamente por quê"
- Koibee: "Você fez a parte difícil e travou na parte fácil"
- ONM: enumera o time que você teria que montar

A Aprimarus faz isso bem — *"Você só grava"* e os quatro bullets do hero são
diagnóstico do leitor, não descrição de serviço. **A copy da home não precisa de
reescrita.** O que falta é prazo no hero (10.3), FAQ visível (10.1) e não jogar
fora o contexto do clique (10.2).

## Resumo da ordem

**Com prazo:**
1. **FASE 1** — commit do que já está aplicado (1 deploy Netlify, sobram ~6)
2. **FASE 2** — migração Cloudflare Pages ← **o site pausa se os créditos zerarem**
3. **FASE 9.4** — WAF, Bot Fight, TLS 1.2 e Always HTTPS na Cloudflare (5 min, grátis)

**Sem bloqueio, fazer em seguida:**
4. **FASE 8.1** — pausar o Clarity no GTM (autorizado) e encolher a CSP
5. **FASE 8.2 + 8.3** — reduzir imagens (~1 MB)
6. **FASE 10.2** — plano escolhido viaja até o WhatsApp
7. **FASE 10.3** — prazo da terceira semana no hero
8. **FASE 10.1** — FAQ visível (7 das 8 perguntas já estão escritas)
9. **FASE 6.1** — "A conta que importa" pela enumeração de papéis
10. **FASE 7** — disclaimer de resultados
11. **FASE 5** — seção de desqualificação (precisa aprovação de copy)

**Esperando o Leonardo:**
12. **FASE 3** — monetização (B1: qual canal, quantos meses, print; B2: Dr. Pedro só depois de aprovado)
13. **FASE 4** — diagnóstico como produto (B3: o que entrega, em quanto tempo)
14. **FASE 6.2** e **10.4** — só se ele pedir

Depois de tudo: rodar 8.4 e 9.5, e repetir mensalmente.

**Encerrados, nada a fazer:** B5 e B6 (Clarity e Bing saem), B7 (termos de contrato
confirmados), 10.5 (não há certificação — e não se inventa).

**Único ponto a conferir antes de publicar o FAQ:** se o contrato anual tem multa
rescisória para saída antes dos 12 meses. Se tiver, o texto da oitava pergunta em
10.1 está errado. Ver o aviso `[VERIFICAR ANTES DE PUBLICAR]` naquela seção.

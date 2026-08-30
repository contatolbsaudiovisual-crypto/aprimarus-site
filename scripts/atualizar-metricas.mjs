import { readFileSync, writeFileSync } from 'node:fs';

const KEY = process.env.YOUTUBE_API_KEY;
if (!KEY) { console.error('Falta YOUTUBE_API_KEY no ambiente.'); process.exit(1); }

const path = new URL('../src/data/videos-destaque.json', import.meta.url);
const data = JSON.parse(readFileSync(path, 'utf8'));
const ids = data.videos.map((v) => v.id).join(',');

const res = await fetch(
  `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${KEY}`
);
if (!res.ok) { console.error('API respondeu', res.status, await res.text()); process.exit(1); }
const { items } = await res.json();

for (const item of items) {
  const v = data.videos.find((x) => x.id === item.id);
  if (!v) continue;
  v.views = Number(item.statistics.viewCount);
  v.comentarios = Number(item.statistics.commentCount ?? v.comentarios);
  v.curtidas = Number(item.statistics.likeCount ?? v.curtidas);
}
data.atualizadoEm = new Date().toISOString().slice(0, 10);
writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Atualizado em', data.atualizadoEm);
for (const v of data.videos) console.log(` ${v.views} views · ${v.comentarios} comentários · ${v.titulo}`);

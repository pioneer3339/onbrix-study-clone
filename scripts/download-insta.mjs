import fs from 'node:fs';

const urls = JSON.parse(fs.readFileSync(new URL('./insta-urls.json', import.meta.url), 'utf8'));
const dir = new URL('../public/assets/insta/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });

for (let i = 0; i < urls.length; i++) {
  const res = await fetch(urls[i], { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) { console.error(`fail ${i + 1}: ${res.status}`); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(new URL(`${i + 1}.jpg`, dir), buf);
  console.log(`saved ${i + 1}.jpg (${buf.length}b)`);
}

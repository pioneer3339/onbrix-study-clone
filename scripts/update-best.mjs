import fs from 'node:fs';
import path from 'node:path';

// CDP dump: { result: { value: "<json string>" } }
const dumpPath = 'C:/Users/lejje/.cursor/browser-logs/cdp-response-Runtime.evaluate-2026-08-19T14-43-14-012Z.json';
const dump = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));
const items = JSON.parse(dump.result.value);

const outPath = new URL('../src/best-list.json', import.meta.url);
const assetDir = new URL('../public/assets/best/', import.meta.url);
fs.mkdirSync(assetDir, { recursive: true });

const list = [];
for (const it of items) {
  const { _src, ...rest } = it;
  list.push(rest);
  const dest = new URL(rest.image.split('/').pop(), assetDir);
  if (!fs.existsSync(dest)) {
    const res = await fetch(_src, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) { console.error('fail', rest.rank, res.status, _src); continue; }
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    console.log('saved', rest.image.split('/').pop());
  }
}
fs.writeFileSync(outPath, JSON.stringify(list, null, 2) + '\n');
console.log('best-list updated:', list.length);

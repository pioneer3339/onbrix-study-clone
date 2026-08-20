import fs from 'node:fs';
import path from 'node:path';

const products = {
  melon: 'P23163000874',
  grapes: 'P24305001345',
  peach: 'P24241001310',
  apple: 'P23095000782',
  blueberry: 'P23493001166',
};
const outDir = 'public/assets/detail/story';
fs.mkdirSync(outDir, { recursive: true });
const result = {};
for (const [id, cd] of Object.entries(products)) {
  const t = await (await fetch(`https://www.onbrix.co.kr/shop/product/product_view?product_cd=${cd}`)).text();
  const hasCoupon = /쿠폰 받기/.test(t);
  const storySec = t.split('birx-story__list')[1]?.split('</article>')[0] || '';
  const itemRe = /src="(https:\/\/cdn\.onbrix\.co\.kr\/content\/[^"]+)"[\s\S]*?<p class="category"[^>]*>([\s\S]*?)<\/p>\s*<p class="title"[^>]*>([\s\S]*?)<\/p>\s*<p class="text"[^>]*>([\s\S]*?)<\/p>/g;
  const strip = s => s.replace(/<[^>]+>/g, '').trim();
  const items = [];
  for (const m of storySec.matchAll(itemRe)) {
    items.push({ img: m[1], category: strip(m[2]), title: strip(m[3]), text: strip(m[4]) });
  }
  // some items have two category <p>; handle via fallback regex if needed
  const btn = (storySec.length && t.match(/comm-top-area__title story[^>]*>연관 스토리<\/h3>\s*<a[^>]*class="comm-top-area__btn more-btn"[^>]*><span>([^<]+)<\/span>/) || [])[1] || '';
  const saved = [];
  for (let i = 0; i < items.length; i++) {
    const s = items[i];
    const file = `story-${id}-${i + 1}.webp`;
    const buf = Buffer.from(await (await fetch(s.img)).arrayBuffer());
    fs.writeFileSync(path.join(outDir, file), buf);
    saved.push({ image: `/assets/detail/story/${file}`, category: s.category, title: s.title, text: s.text });
  }
  result[id] = { hasCoupon, btn, items: saved };
}
fs.writeFileSync('scripts/detail-extra.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));

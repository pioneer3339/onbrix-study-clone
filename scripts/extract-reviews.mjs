import fs from 'node:fs';
import path from 'node:path';

const products = {
  grapes: 'P24305001345',
  peach: 'P24241001310',
  apple: 'P23095000782',
  blueberry: 'P23493001166',
};
const outDir = 'public/assets/detail';
const result = {};
for (const [id, cd] of Object.entries(products)) {
  const t = await (await fetch(`https://www.onbrix.co.kr/shop/product/product_view?product_cd=${cd}`)).text();
  const percent = (t.match(/고객들이\s*<span class="point">([\d]+%)<\/span>/) || [])[1] || '';
  const reviewSection = t.split('birx-review__list')[1]?.split('birx-delivery')[0] || t;
  const slides = [];
  const slideRe = /<li class="swiper-slide"[\s\S]*?src="(https:\/\/cdn\.onbrix\.co\.kr\/review\/[^"]+)"[\s\S]*?<p class="data">([\d-]+)<\/p>[\s\S]*?<div class="info__text__main">([\s\S]*?)<\/div>/g;
  for (const m of reviewSection.matchAll(slideRe)) {
    slides.push({ img: m[1], date: m[2], text: m[3].replace(/<br\s*\/?>/g, '\n').replace(/\s+$/,'').replace(/^\s+/,'') });
    if (slides.length >= 3) break;
  }
  const delivery = (t.match(/<p class="title"[^>]*><span style="color:#591B8B">([\s\S]*?)<\/span>/) || [])[1]?.replace(/<em>/g,'|EM|').replace(/<\/em>/g,'').replace(/&nbsp;/g,' ').trim() || '';
  const items = [];
  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const ext = s.img.match(/\.(jpe?g|png|webp)$/i)?.[1] || 'jpg';
    const file = `review-${id}-${i + 1}.${ext.toLowerCase() === 'jpeg' ? 'jpg' : ext.toLowerCase()}`;
    const buf = Buffer.from(await (await fetch(s.img)).arrayBuffer());
    fs.writeFileSync(path.join(outDir, file), buf);
    items.push({ image: `/assets/detail/${file}`, date: s.date, text: s.text });
  }
  result[id] = { percent, delivery, items };
}
fs.writeFileSync('scripts/reviews-out.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));

const products = { melon:'P23163000874', grapes:'P24305001345', peach:'P24241001310', apple:'P23095000782', blueberry:'P23493001166' };
for (const [id, cd] of Object.entries(products)) {
  const t = await (await fetch(`https://www.onbrix.co.kr/shop/product/product_view?product_cd=${cd}`)).text();
  const sec = t.split('birx-story__list')[1].split('</article>')[0];
  const lis = sec.split('<li>').slice(1);
  const out = lis.map(li => [...li.matchAll(/<p class="category"[^>]*>([\s\S]*?)<\/p>/g)].map(m => m[1].trim()));
  console.log(id, JSON.stringify(out));
}

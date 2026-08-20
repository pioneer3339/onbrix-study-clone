const t = await (await fetch('https://www.onbrix.co.kr/shop/main')).text();
const targets = ['샤인머스켓 (17brix)', '수출용 상주 샤인머스켓', '딱딱이 복숭아 1.5kg', '홍로사과 2kg', '생 블루베리 500g'];
const re = /<a[^>]+product_cd=(P\d+)[^>]*>([\s\S]{0,2000}?)<\/a>/g;
const found = {};
for (const m of t.matchAll(re)) {
  const [, cd, body] = m;
  for (const kw of targets) {
    if (body.includes(kw) && !found[kw]) found[kw] = cd;
  }
}
console.log(found);

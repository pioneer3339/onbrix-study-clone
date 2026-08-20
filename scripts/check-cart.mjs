const t = await (await fetch('https://www.onbrix.co.kr/shop/cart/cart_lists', { headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)' } })).text();
const sec = t.split('지금 가장 인기 있는 상품')[1] || '';
console.log(sec.slice(0, 6000));

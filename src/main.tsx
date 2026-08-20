import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Autoplay, FreeMode, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import './styles.css';
import './source-modules.css';
import sourceCatalog from './source-catalog.json';
import instagramImages from './instagram.json';
import detailImages from './detail-images.json';
import storyList from './story-list.json';
import eventList from './events.json';
import legalCopy from './legal.json';
import bestList from './best-list.json';

type Option = { id: string; label: string; price: number };
type Product = { id: string; image: string; title: string; original?: number; discount?: number; price: number; reviews: string; delivery: string; options: Option[] };
type CartLine = { productId: string; optionId: string; quantity: number };
type View = 'home' | 'products' | 'dawn' | 'sale' | 'product' | 'sugar' | 'story' | 'events' | 'cart' | 'login' | 'my' | 'service' | 'legal' | 'delivery';

function productPath(title:string){
  if(/멜론|허니듀|칸탈로프/.test(title)) return 'product/melon';
  if(/샤인|포도|거봉|캠벨/.test(title)) return 'product/grapes';
  if(/수박/.test(title)) return 'product/watermelon';
  if(/복숭아|딱딱이|말랑이|천도|황도|백도/.test(title)) return 'product/peach';
  if(/사과|홍로|아오리|골든볼/.test(title)) return 'product/apple';
  if(/블루베리/.test(title)) return 'product/blueberry';
  return 'products';
}
const won = (value: number) => `${value.toLocaleString('ko-KR')}원`;
const detailBenefit: Record<string,number> = { melon:9646, grapes:10394, peach:13385, apple:24825 };
const detailReviews: Record<string,{percent:string;items:{image:string;date:string;text:string}[]}> = {
  melon:{percent:'97%',items:[
    {image:'/assets/detail/review-melon-1.jpg', date:'2026-07-03', text:'멜론 먹고 싶어서 주문했어요 후숙 잘 해서 맛있게 먹을거예용 ㅎ 상자안에 에어백으로 잘 도착했어요'},
    {image:'/assets/detail/review-melon-2.jpg', date:'2026-07-02', text:'아주 달고 맛있어요\n또 주문하려고요'},
    {image:'/assets/detail/review-melon-3.jpg', date:'2026-07-03', text:'후숙 필요 없었어요 아이들이 보채서 다음날 바로 먹었는데 달고 맛있었어용!'},
  ]},
  grapes:{percent:'96%',items:[
    {image:'/assets/detail/review-grapes-1.webp', date:'2026-08-18', text:'무른거 없이 야무진 방울방울 !\n맛도 좋아요 도시락에 쏙!'},
    {image:'/assets/detail/review-grapes-2.webp', date:'2026-08-17', text:'싱싱하고 단맛이 죄고입니다'},
    {image:'/assets/detail/review-grapes-3.webp', date:'2026-08-17', text:'배송도 빠르고 맛있어요'},
  ]},
  peach:{percent:'96%',items:[
    {image:'/assets/detail/review-peach-1.webp', date:'2026-08-12', text:'너무너무 맛있네요'},
    {image:'/assets/detail/review-peach-2.webp', date:'2026-08-11', text:'너무 맛있어요! 또 주문해야겠어요'},
    {image:'/assets/detail/review-peach-3.webp', date:'2026-08-11', text:'아삭아삭 달고 맛있어요\n후숙해서 먹으니 더 맛있어요'},
  ]},
  apple:{percent:'97%',items:[
    {image:'/assets/detail/review-apple-1.webp', date:'2026-08-18', text:'아삭아삭하고 너무 맛있어서 재구매하러 왔습니다~'},
    {image:'/assets/detail/review-apple-2.webp', date:'2026-08-18', text:'홍로에서만 느낄 수 있는 달콤함과 아삭함이 정말 좋습니다. 단단하고 과즙풍부해요.'},
    {image:'/assets/detail/review-apple-3.webp', date:'2026-08-18', text:'신선하고 맛있어요 새콤달콤'},
  ]},
  blueberry:{percent:'96%',items:[
    {image:'/assets/detail/review-blueberry-1.webp', date:'2026-07-25', text:'신선하고 달고 맛있어요'},
    {image:'/assets/detail/review-blueberry-2.webp', date:'2026-07-24', text:'넘 맛나요오오'},
    {image:'/assets/detail/review-blueberry-3.webp', date:'2026-07-25', text:'빠른배송 감사합니다'},
  ]},
};
const detailStories: Record<string,{image:string;category:string;title:string;text:string;emptyCat?:boolean}[]> = {
  melon:[
    {image:'/assets/detail/story/story-melon-1.webp', category:'과일생활', title:'피크닉 디저트로 가볍게 만드는 멜론 케이크', text:'멜론 생크림 케이크'},
    {image:'/assets/detail/story/story-melon-2.webp', category:'과일생활', title:'집에서 즐기는 후르츠 파인다이닝', text:'복숭아&멜론 카르파치오'},
    {image:'/assets/detail/story/story-melon-3.webp', category:'과일생활', title:'올여름 달콤하게 혹은 우아하게', text:'시원한 수박케이크'},
  ],
  grapes:[
    {image:'/assets/detail/story/story-grapes-1.webp', category:'과일생활', title:'포도 세척·보관법', text:'포도 씻을 때 알맹이 떼면 안 되는 이유'},
    {image:'/assets/detail/story/story-grapes-2.webp', category:'월간 과일', title:'큐레이터와 함께하는 Fruits Check!', text:'국산 포도의 명성 샤인머스켓'},
    {image:'/assets/detail/story/story-grapes-3.webp', category:'과일생활', title:'고소 달콤 짭짤 세가지 맛', text:'샤인머스켓 치즈볼'},
  ],
  peach:[
    {image:'/assets/detail/story/story-peach-1.webp', category:'월간 과일', title:'산지에서 식탁까지 복숭아 맛을 지키는 세 가지', text:'온도 · 시간 · 배송'},
    {image:'/assets/detail/story/story-peach-2.webp', category:'월간 과일', title:'기대만큼 기준이 높은 프리미엄 복숭아', text:'복숭아 큐레이션', emptyCat:true},
    {image:'/assets/detail/story/story-peach-3.webp', category:'과일생활', title:'복숭아 세척·보관법', text:'물복 vs 딱복! 취향 100% 지키는 복숭아 가이드', emptyCat:true},
  ],
  apple:[
    {image:'/assets/detail/story/story-apple-1.webp', category:'과일생활', title:'사과 세척·보관법', text:'냉장고에 넣었는데 푸석해졌다면?', emptyCat:true},
    {image:'/assets/detail/story/story-apple-2.webp', category:'후르츠 로드', title:'일상의 당도를 높이는 과일', text:'달콤한 과일 루틴 실천하기'},
    {image:'/assets/detail/story/story-apple-3.webp', category:'월간 과일', title:'사과의 비밀을 낱낱이 파헤치는 ｢그것이 알고 사과｣', text:'아침이 상쾌해지는 작은 습관\n사과 한 알이면 충분해요.', emptyCat:true},
  ],
  blueberry:[
    {image:'/assets/detail/story/story-blueberry-1.webp', category:'후르츠 로드', title:'동계 후르츠 리그', text:'나의 겨울 스포츠 타입은?'},
    {image:'/assets/detail/story/story-blueberry-2.webp', category:'온스토리', title:'과일이 좋아하는 콜드체인 보관&배송', text:'겨울은 얼지 않게, 여름은 무르지 않게'},
    {image:'/assets/detail/story/story-blueberry-3.webp', category:'과일생활', title:'올겨울 가장 예쁜 크리스마스 트리', text:'Merry onbrix-mas🎄'},
  ],
};
const products: Product[] = [
  { id:'melon', image:'/assets/melon.webp', title:'[농할 25%쿠폰] 입 안 가득 퍼지는 달콤함, 국내산 고당도 머스크 멜론 1입 / 2입 (14brix)', original:16200, discount:20, price:12900, reviews:'3653+', delivery:'새벽배송', options:[{id:'one',label:'2kg(1입/특대과)',price:12900},{id:'two',label:'4kg(2입/특대과)',price:21900}] },
  { id:'grapes', image:'/assets/grapes.webp', title:'[농할 25%쿠폰] 연간 50만 송이 판매, 국내산 고당도 수출용 상주 샤인머스켓 (17brix)', original:17400, discount:20, price:13900, reviews:'6863+', delivery:'새벽배송', options:[{id:'one',label:'1송이',price:13900},{id:'two',label:'2송이',price:26900}] },
  { id:'watermelon', image:'/assets/watermelon.webp', title:'[농할 25%쿠폰] 천천히 익어 더욱 아삭한, 국내산 고당도 수박 8kg / 9kg', original:52400, discount:20, price:41900, reviews:'13172+', delivery:'새벽배송', options:[{id:'8kg',label:'8kg',price:41900},{id:'9kg',label:'9kg',price:46900}] },
  { id:'peach', image:'/assets/peach.webp', title:'[농할 25%쿠폰] 당도선별, 국내산 우수산지 딱딱이 복숭아 1.5kg / 3kg (중과/대과)', original:22400, discount:20, price:17900, reviews:'5124+', delivery:'일반배송', options:[{id:'1-5kg',label:'1.5kg',price:17900},{id:'3kg',label:'3kg',price:32900}] },
  { id:'apple', image:'/assets/apple.webp', title:'[새벽에On] 아삭하게 퍼지는 달콤함, 고당도 햇 홍로사과 2kg / 4kg (14brix/특품)', original:54000, discount:46, price:28900, reviews:'15848+', delivery:'새벽배송', options:[{id:'2kg',label:'2kg',price:28900},{id:'4kg',label:'4kg',price:51900}] },
  { id:'blueberry', image:'/assets/blueberry.webp', title:'[새벽에On] 항공직송 캐나다산 생 블루베리 500g / 1kg / 1.5kg (14-16mm)', price:20900, reviews:'5275+', delivery:'일반배송', options:[{id:'500g',label:'500g',price:20900},{id:'1kg',label:'1kg',price:38900},{id:'1-5kg',label:'1.5kg',price:54900}] },
];
const brix = [
  ['말랑이 복숭아','12','12','/assets/brix-2.webp'],
  ['홍로 사과','16','14','/assets/brix-apple.webp'],
  ['딱딱이 복숭아','13','11','/assets/brix-4.webp'],
  ['샤인머스켓','17','17','/assets/brix-5.webp'],
  ['블루베리','14','13','/assets/brix-6.webp'],
  ['멜론','14','14','/assets/brix-3.webp'],
];
const dealItems = [
  {image:'/assets/deal/flat-peach.webp', title:'[새벽에On] 도넛 모양의 쫀득 거반도 납작 복숭아 600g / 1.2kg (13brix)', original:'55,000원', sale:'47%', price:'28,900원', review:'393'},
  {image:'/assets/deal/hongro.webp', title:'[새벽에On] 아삭하게 퍼지는 달콤함, 고당도 햇 홍로사과 2kg / 4kg (14brix/특품)', original:'46,000원', sale:'46%', price:'24,900원', review:'1000+'},
];
const cakeItems = [
  {image:'/assets/deal/cake-shine.webp', title:'요거트 생크림이 듬뿍, 크라운 샤인머스켓 케이크', original:'52,000원', sale:'16%', price:'43,900원', review:'67'},
  {image:'/assets/deal/cake-blueberry.webp', title:'생 블루베리 300g을 아낌없이 올린, 프리미엄 블루베리 케이크', original:'59,000원', sale:'17%', price:'49,000원', review:'25'},
];
const dawnItems = sourceCatalog.dawn;
const rankOrder=["[농할 25%쿠폰] 고당도, 국내산 햇사레 말랑이 복숭아 3kg (특품/대과)","[새벽에On] 아삭하게 퍼지는 달콤함, 고당도 햇 홍로사과 2kg / 4kg (14brix/특품)","[새벽에On] 도넛 모양의 쫀득 거반도 납작 복숭아 600g / 1.2kg (13brix)","[농할 25%쿠폰] 고당도, 국내산 햇사레 딱딱이 복숭아 3kg (8-11입)","[농할 25%쿠폰] 당도선별, 국내산 우수산지 딱딱이 복숭아 1.5kg / 3kg (중과/대과)","[농할 25%쿠폰] 크림처럼 부드럽고 달콤한, 국내산 홍무화과 1kg / 2kg","[농할 25%쿠폰] 연간 50만 송이 판매, 국내산 고당도 수출용 상주 샤인머스켓 (17brix)","[농할 25%쿠폰] 당도선별, 국내산 우수산지 말랑이 복숭아 1.5kg / 3kg (중과/대과/특대과)","[농할 25%쿠폰] 입 안 가득 퍼지는 달콤함, 국내산 고당도 머스크 멜론 1입 / 2입 (14brix)","[농할 25%쿠폰] 당도선별 고당도 국내산 제주 효돈 하우스 감귤 1.5kg / 2.5kg / 4.5kg"];
const rankRail=rankOrder.map((title,i)=>{
  const item=sourceCatalog.ranking.find(x=>x.title===title)||sourceCatalog.domestic.find(x=>x.title===title)||sourceCatalog.peach.find(x=>x.title===title)||sourceCatalog.apple.find(x=>x.title===title)||sourceCatalog.variety.find(x=>x.title===title);
  return item?{...item,benefit:'',review:'',detail:false,id:`rank-${i+1}`}:null;
}).filter(Boolean) as typeof sourceCatalog.ranking;
const appleRail=sourceCatalog.apple.map(item=>item.title.includes('홍로사과')?{...item,original:'46,000원',sale:'46%',price:'24,900원',benefit:'24,825원',review:'16010+'}:item);
const hero = [
  ['/assets/visual-8aaf62.gif','8월 농식품부 할인지원'],
  ['/assets/visual-b7a705.webp','홍로사과'],
  ['/assets/visual-067aad.webp','거반도'],
  ['/assets/visual-e9806a.webp','아오리 사과'],
  ['/assets/visual-e82e9d.webp','복숭아 산지'],
  ['/assets/visual-ddb408.webp','햇사레 복숭아'],
  ['/assets/visual-fdfa1a.gif','블루베리 케이크'],
  ['/assets/visual-321097.webp','온리브릭스'],
  ['/assets/visual-f343e3.webp','신규 혜택'],
  ['/assets/visual-725b52.webp','토스페이'],
];
function dealRemain() {
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
  const n=(t:string)=>Number(parts.find(p=>p.type===t)?.value??0);
  const now=n('hour')*3600+n('minute')*60+n('second');
  const end=9*3600;
  let left=end-now;
  if(left<=0) left+=86400;
  const h=String(Math.floor(left/3600)).padStart(2,'0');
  const m=String(Math.floor(left%3600/60)).padStart(2,'0');
  const s=String(left%60).padStart(2,'0');
  return `0일 ${h}:${m}:${s}`;
}
function cakeRemain() {
  const target=new Date('2026-08-22T00:00:00+09:00').getTime();
  const left=Math.max(0,Math.floor((target-Date.now())/1000));
  const d=Math.floor(left/86400);
  const h=String(Math.floor(left%86400/3600)).padStart(2,'0');
  const m=String(Math.floor(left%3600/60)).padStart(2,'0');
  const s=String(left%60).padStart(2,'0');
  return `${d}일 ${h}:${m}:${s}`;
}
function CakeDeal() {
  const [clock,setClock]=useState(cakeRemain);
  useEffect(()=>{ const id=setInterval(()=>setClock(cakeRemain()),1000); return()=>clearInterval(id); },[]);
  return <section className="deal deal-cake"><div className="chips">{['생과일 케이크 오픈🍰','병조림 2+1 이벤트'].map((x,i)=><button className={i===0?'selected':''} key={x}>{x}</button>)}</div><p className="deal-time"><span>{clock}</span></p><div className="deal-list">{cakeItems.map(item=><article className="deal-card" key={item.title}><button className="deal-img"><img src={item.image} alt=""/><i>장바구니</i></button><div className="deal-info"><p>{item.title}</p><b><strong>{item.sale}</strong><span>{item.price}</span><del>{item.original}</del></b><q>{item.review}</q></div></article>)}</div><button className="deal-all"><span>특가 전체보기</span></button></section>;
}

function parseRoute(): { view: View; productId?: string } {
  const [view = 'home', productId] = location.hash.replace(/^#\/?/, '').split('?')[0].split('/');
  return { view: ['home','products','dawn','sale','product','sugar','story','events','cart','login','my','service','legal','delivery'].includes(view) ? view as View : 'home', productId };
}
function Dialog({ title, onClose, children, className = '' }: { title: string; onClose: () => void; children: React.ReactNode; className?: string }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => { const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; const previous = document.activeElement as HTMLElement | null; document.addEventListener('keydown', escape); close.current?.focus(); return () => { document.removeEventListener('keydown', escape); previous?.focus(); }; }, [onClose]);
  return <div className={`overlay ${className}`} onMouseDown={onClose}><section className="sheet" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={e=>e.stopPropagation()}><button ref={close} className="sheet-close" onClick={onClose} aria-label="닫기">×</button><h2 id="dialog-title">{title}</h2>{children}</section></div>;
}
function SearchLayer({ query, setQuery, onClose, go, products, add }: { query: string; setQuery: (q: string) => void; onClose: () => void; go: (to: string) => void; products: Product[]; add: (product: Product) => void }) {
  const ranked = [...sugarDiary].sort((a, b) => Number(b.num) - Number(a.num));
  const keywords = ['함께특가', '복숭아', '수박', '햇사레', '멜론', '사과', '샤인머스캣'];
  const hits = query ? products.filter(p => p.title.includes(query)) : [];
  return <div className="search-layer" role="dialog" aria-modal="true" aria-label="상품 검색">
    <div className="lnb"><div className="lnb__inner">
      <div className="lnb__util left"><button type="button" className="lnb__btn back" onClick={onClose}>뒤로 가기</button><button type="button" className="lnb__btn home" onClick={()=>{onClose(); go('home');}}>홈</button></div>
      <div className="lnb__util right"><button type="button" className="lnb__btn delivery" onClick={()=>{onClose(); go('delivery');}}>배송</button><button type="button" className="lnb__btn cart" onClick={()=>{onClose(); go('cart');}}>장바구니</button></div>
    </div></div>
    <div className="search-layer__con">
      <form onSubmit={e=>e.preventDefault()}>
        <div className="search--title"><h3 className="title">고객님<br/>어떤 상품을 찾으세요?</h3></div>
        <div className="search"><input className="keyword" autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="검색어를 입력해주세요."/><button type="submit">검색</button></div>
        {query ? <div className="comm-box"><p className="comm-box__title">‘{query}’ 검색 결과</p><div className="search-hits">{hits.length ? hits.map(p=><ProductCard key={p.id} product={p} go={to=>{onClose(); go(to);}} add={add}/>) : <p className="comm-box__title" style={{fontWeight:400}}>검색 결과가 없습니다.</p>}</div></div> : <>
          <div className="comm-box"><div className="recent comm-box__area"><p className="recent__title comm-box__title">최근 검색기록</p><ul className="recent__list comm-box__list"/></div></div>
          <div className="comm-box"><div className="recommned comm-box__area"><p className="recommned__title comm-box__title">추천 검색어</p><ul className="recommned__list comm-box__list">{keywords.map(k=><li className="recommned__item comm-box__list__item" key={k}><button type="button" onClick={()=>setQuery(k)}>{k}</button></li>)}</ul></div></div>
          <div className="comm-box"><div className="today-onbrix comm-box__area"><div className="comm-box__title-wrap"><p className="today-onbrix__title comm-box__title">오늘의 당도</p><p className="today-onbrix__time comm-box__time"><span>20일(목)</span> 06시 기준</p></div><ul className="today-onbrix__list comm-box__list">{ranked.map((d,i)=><li className="today-onbrix__item comm-box__list__item" key={d.name}><button type="button" onClick={()=>{onClose(); go('sugar');}}><span className="num">{i+1}</span><span className="text">{d.name}</span><span className="brix">{d.num} brix</span></button></li>)}</ul></div></div>
        </>}
      </form>
    </div>
  </div>;
}
function ProductCard({ product, go, add }: { product: Product; go: (to: string) => void; add: (product: Product) => void }) {
  return <article className="product"><button className="product-image" onClick={()=>go(`product/${product.id}`)}><img src={product.image} alt={product.title}/></button><button className="cart" onClick={()=>add(product)} aria-label={`${product.title} 장바구니 담기`}>＋</button><div className="badge">{product.delivery}</div><h3><button onClick={()=>go(`product/${product.id}`)}>{product.title}</button></h3>{product.original && <div className="original">{won(product.original)}</div>}<div className="price">{product.discount && <strong>{product.discount}%</strong>} <b>{won(product.price)}</b></div><div className="review">♣ {product.reviews}</div></article>;
}
function Header({ go, count, openSearch, openMenu, view }: { go:(to:string)=>void; count:number; openSearch:()=>void; openMenu:()=>void; view:View }) {
  const tabs: [string,string][] = [['추천','home'],['새벽On','dawn'],['할인','sale'],['베스트','products'],['스토리','story'],['혜택','events']];
  const tabOn = view==='home'?0:view==='dawn'?1:view==='sale'?2:view==='products'?3:view==='story'?4:view==='events'?5:-1;
  return <><header className="header"><button className="wordmark" onClick={()=>go('home')} aria-label="온브릭스 홈"><img src="/assets/intro-logo.png" alt="on brix"/></button><div className="header-actions"><button className="delivery-icon" aria-label="배송" onClick={()=>go('delivery')}/><button className="header-cart" onClick={()=>go('cart')} aria-label="장바구니">{count>0&&<em>{count}</em>}</button><button className="alarm-icon" onClick={()=>go('login')} aria-label="알림"/></div></header><nav className="tabs" aria-label="주요 메뉴">{tabs.map(([name,to],i)=><button className={i===tabOn?'active':''} onClick={()=>go(to)} key={name}>{i===2?<img src="/assets/header/tab-sale.gif" alt="할인"/>:<span>{name}</span>}</button>)}</nav></>;
}
function SubHeader({ title, go, cartCount, openSearch, mode }: { title:string; go:(to:string)=>void; cartCount:number; openSearch?:()=>void; mode?:'sale'|'product'|'cart'|'login'|'service' }) {
  return <header className={`sub-header${mode==='product'?' sale-lnb':''}${mode==='service'||mode==='login'?' cs-lnb':''}`}><div className="sub-lnb-left"><button className="sub-back" onClick={()=>history.back()} aria-label="뒤로 가기"/>{(mode==='product'||mode==='cart')&&<button className="sub-home" onClick={()=>go('home')} aria-label="홈"/>}</div><b>{mode==='product'?'':title}</b><div className="sub-header-actions">{mode==='login'||mode==='service'?null:mode==='sale'?<><button onClick={()=>go('home')} aria-label="홈"/><button onClick={()=>openSearch?openSearch():go('home')} aria-label="검색"/></>:mode==='product'?<><button className="sub-search" onClick={()=>openSearch?openSearch():go('home')} aria-label="검색"/><button className="sub-cart" onClick={()=>go('cart')} aria-label="장바구니">{cartCount>0&&<em>{cartCount}</em>}</button></>:mode==='cart'?<button className="sub-search" onClick={()=>openSearch?openSearch():go('home')} aria-label="검색"/>:<><button onClick={()=>go('home')} aria-label="홈"/><button onClick={()=>openSearch?openSearch():go('home')} aria-label="검색"/><button onClick={()=>go('cart')} aria-label="장바구니">{cartCount>0&&<em>{cartCount}</em>}</button></>}</div></header>;
}
function InfoPage({ title, text }: { title:string; text:string }) { return <main className="page"><span className="eyebrow">ONBRIX</span><h1>{title}</h1><p>{text}</p><div className="notice">온브릭스는 맛있는 과일을 기준으로 산지와 고객을 연결합니다.</div></main>; }

type CatalogItem = { id: string; image: string; title: string; price: string; sale?: string; original?: string; benefit?: string; badge?: string; review?: string; detail?: boolean; compact?: boolean };
function CatalogCard({ item, rank, go, compact }: { item: CatalogItem; rank?: number; go: (to:string)=>void; compact?: boolean }) {
  return <button className="source-card" onClick={()=>go(productPath(item.title))}>
    <span className="source-image"><img src={item.image} alt=""/>{rank!=null&&<i className="rank-best">Best {rank}</i>}<em>장바구니</em></span>
    <span className="source-info">
      <p>{item.title}</p>
      <b>{item.sale&&<strong>{item.sale}</strong>}<span>{item.price}</span>{item.original&&<del>{item.original}</del>}</b>
      {!compact&&item.benefit&&<u>최대 혜택가 <span>{item.benefit}</span></u>}
      {!compact&&item.detail&&<s>자세히보기</s>}
      {item.badge&&<mark className={item.badge==='택배배송'?'parcel':undefined}>{item.badge}</mark>}
      {item.review&&<q>{item.review}</q>}
    </span>
  </button>;
}
function ShowcaseRail({ className, title, subtitle, items, ranked, go }: { className: string; title: string; subtitle: string; items: CatalogItem[]; ranked?: boolean; go: (to:string)=>void }) {
  const rail=ranked?[items[items.length-1],...items]:items;
  return <section className={`source-module ${className}`}><div className="module-head"><div><h2>{title}</h2><p>{subtitle}</p></div>{ranked?null:<button onClick={()=>go('products')}>더보기</button>}</div><div className={`source-rail${ranked?' rank-rail':''}`}>{rail.map((item,i)=><CatalogCard item={item} rank={ranked?(i===0?items.length:i):undefined} go={go} key={`${item.id}-${i}`}/>)}</div>{ranked?<button className="rank-more" onClick={()=>go('products')}><span>실시간 랭킹 과일 전체보기</span></button>:null}</section>;
}

const listCategories=[['/assets/cat-1.webp','TOP100'],['/assets/cat-2.webp','국산과일'],['/assets/cat-3.webp','수입과일'],['/assets/cat-4.webp','선물세트']];
function SourceDawnPage({ go }: { go:(to:string)=>void }) {
  const [tab,setTab]=useState(0);
  const tabs=['BEST 추천과일','국산과일','수입과일','선물용 과일','과일 가공품'];
  const dawnOrder=["[농할 25%쿠폰] 고당도, 국내산 햇사레 말랑이 복숭아 3kg (특품/대과)","[농할 25%쿠폰] 연간 50만 송이 판매, 국내산 고당도 수출용 상주 샤인머스켓 (17brix)","[농할 25%쿠폰] 당도선별, 국내산 우수산지 말랑이 복숭아 1.5kg / 3kg (중과/대과/특대과)","[농할 25%쿠폰] 고당도, 국내산 햇사레 딱딱이 복숭아 3kg (8-11입)","[농할 25%쿠폰] 천천히 익어 더욱 아삭한, 국내산 고당도 수박 8kg / 9kg","[농할 25%쿠폰] 당도선별, 국내산 우수산지 딱딱이 복숭아 1.5kg / 3kg (중과/대과)","[새벽에On] 아삭하게 퍼지는 달콤함, 고당도 햇 홍로사과 2kg / 4kg (14brix/특품)"];
  const dawn=bestList.filter(item=>item.badge==='새벽배송'||/새벽|새벽에On/.test(item.title));
  const imgs: Record<string,string>={
    "[농할 25%쿠폰] 고당도, 국내산 햇사레 말랑이 복숭아 3kg (특품/대과)":'/assets/dawn/prd/1.webp',
    "[농할 25%쿠폰] 연간 50만 송이 판매, 국내산 고당도 수출용 상주 샤인머스켓 (17brix)":'/assets/dawn/prd/2.webp',
    "[농할 25%쿠폰] 당도선별, 국내산 우수산지 말랑이 복숭아 1.5kg / 3kg (중과/대과/특대과)":'/assets/dawn/prd/3.webp',
    "[농할 25%쿠폰] 고당도, 국내산 햇사레 딱딱이 복숭아 3kg (8-11입)":'/assets/dawn/prd/4.webp',
    "[농할 25%쿠폰] 천천히 익어 더욱 아삭한, 국내산 고당도 수박 8kg / 9kg":'/assets/dawn/prd/5.webp',
    "[농할 25%쿠폰] 당도선별, 국내산 우수산지 딱딱이 복숭아 1.5kg / 3kg (중과/대과)":'/assets/dawn/prd/6.webp',
  };
  const ordered=[...dawn].sort((a,b)=>{
    const ia=dawnOrder.indexOf(a.title); const ib=dawnOrder.indexOf(b.title);
    return (ia<0?999:ia)-(ib<0?999:ib);
  }).map(item=>imgs[item.title]?{...item,image:imgs[item.title]}:item);
  const items=tab===0?ordered:tab===1?ordered.filter(i=>/국내산|햇사레|온리브릭스/.test(i.title)&&!/캐나다|제스프리|태국|항공/.test(i.title)):tab===2?ordered.filter(i=>/캐나다|제스프리|태국|항공|수입/.test(i.title)):tab===3?ordered.filter(i=>/선물|세트|바구니/.test(i.title)):ordered.filter(i=>/가공|주스|잼|조각|컷팅|병조림/.test(i.title));
  return <main className="source-dawn-page">
    <section className="dawn-visual"><img className="dawn-hero" src="/assets/dawn/hero-static.jpg" alt="새벽에ON"/><img className="dawn-sub" src="/assets/dawn/banner.webp" alt="배송 안내"/></section>
    <div className="dawn-tabs">{tabs.map((name,i)=><button className={i===tab?'on':''} onClick={()=>setTab(i)} key={name}>{name}</button>)}</div>
    <div className="source-product-grid">{items.map(item=><button className="source-list-card" onClick={()=>go(productPath(item.title))} key={item.rank}><span className="list-image"><img src={item.image} alt=""/><em>장바구니</em></span><p>{item.title}</p>{item.original&&<del>{item.original}</del>}<b>{item.sale&&<strong>{item.sale}</strong>}<span>{item.price}</span></b>{item.benefit&&<u>최대 혜택가 <span>{item.benefit}</span></u>}{item.detail&&<s>자세히보기</s>}{item.badge&&<mark>{item.badge}</mark>}{item.review&&<q>{item.review}</q>}</button>)}</div>
  </main>;
}
function SourceSalePage({ go }: { go:(to:string)=>void }) {
  const top=['/assets/sale/1.jpg','/assets/sale/2.png','/assets/sale/3.png'];
  const bottom=['/assets/sale/4.jpg','/assets/sale/5.jpg','/assets/sale/6.jpg','/assets/sale/7.jpg','/assets/sale/8.jpg','/assets/sale/9.jpg','/assets/sale/10.jpg','/assets/sale/11.jpg','/assets/sale/12.jpg','/assets/sale/13.jpg','/assets/sale/14.jpg','/assets/sale/15.jpg'];
  const titles=['[농할 25%쿠폰] 연간 50만 송이 판매, 국내산 고당도 수출용 상주 샤인머스켓 (17brix)','[농할 25%쿠폰] 당도선별, 국내산 우수산지 말랑이 복숭아 1.5kg / 3kg (중과/대과/특대과)','[농할 25%쿠폰] 당도선별, 국내산 우수산지 딱딱이 복숭아 1.5kg / 3kg (중과/대과)','[농할 25%쿠폰] 국내산 온리브릭스 고당도 말랑이 복숭아 3kg (대과/특대과)','[농할 25%쿠폰] 당도선별 고당도 국내산 제주 효돈 하우스 감귤 1.5kg / 2.5kg / 4.5kg','[농할 25%쿠폰] 16년 연속 브랜드 대상, 국내산 불로초 하우스 감귤 2.5kg / 4.5kg (12.5brix/특품)','[농할 25%쿠폰] 입 안 가득 퍼지는 달콤함, 국내산 고당도 머스크 멜론 1입 / 2입 (14brix)','[농할 25%쿠폰] 탱글한 과육에 가득 찬 과즙, 국내산 거봉 포도 600g / 1.2kg / 1.8kg','[농할 25%쿠폰] 새콤달콤 속 노란, 국내산 천도 복숭아 1kg / 2kg','[농할 25%쿠폰] 입안에 퍼지는 부드러운 풍미, 국내산 캄파리 토마토 1kg'];
  const hashes=['6377d9d6f3914934f0455b91aa75d929','f41bdbc8fda0ba2f7000f3b7de19d56e','f8eebf88bdc3fbba28c7223c917c8a2f','c8bd1de86c1f6bed68bd9a8578f7d435','f62419197f0e22b0060ce89fac8cd3af','11dc35fc53b13fbc968b5259111d48c0','21ead99bb5797905382ef206dcc32b9d','f80f1127e50027067c72439ab52000fe','4d089afe34b9654f91b3bced2825d218','01c2bc251f12a82492ef754283714747'];
  const rail=titles.map((t,i)=>{
    const item=bestList.find(x=>x.title===t);
    return item?{...item,image:`/assets/sale/prd/${hashes[i]}.webp`}:null;
  }).filter((item): item is NonNullable<typeof item>=>!!item);
  return <main className="source-sale-page">{top.map(src=><img src={src} alt="" key={src}/>)}<section className="newpage-coupon"><img className="newpage-coupon__shot" src="/assets/sale/coupon.png" alt="8월 농식품부 할인지원 25%"/></section><section className="newpage-product"><div className="sale-rail">{rail.map(item=><button className="sale-rail-card" onClick={()=>go(productPath(item.title))} key={item.rank}><span className="sale-thumb"><img src={item.image} alt=""/><i>장바구니</i></span><p>{item.title}</p><del>{item.original}원</del><b><strong>{item.sale}</strong><span>{item.price}</span></b>{item.benefit&&<u>최대 혜택가 <em>{item.benefit}</em></u>}</button>)}</div><button className="newpage-pd__more" type="button" onClick={()=>go('dawn')}><span>전체보기</span></button></section>{bottom.map(src=><img src={src} alt="" key={src}/>)}<footer className="sugar-footer"><div className="bottom__area"><button type="button" className="bottom--toggle-btn">㈜온브릭스 사업자 정보</button></div><ul className="bottom__menu"><li><button type="button" onClick={()=>go('service')}>고객센터</button></li><li><button type="button">대량주문문의</button></li><li><button type="button" onClick={()=>go('legal')}>이용약관</button></li><li><button type="button" onClick={()=>go('legal')}>개인정보처리방침</button></li></ul></footer></main>;
}
function SourceDeliveryPage() {
  return <main className="source-delivery-page"><img src="/assets/delivery-guide.webp" alt="배송안내"/><div className="delivery-addr-bar"><button type="button">배송 가능지역 확인하기</button></div></main>;
}
function SourceProductList({ go }: { go:(to:string)=>void }) {
  const items=bestList;
  return <main className="source-list-page"><div className="source-category">{listCategories.map(([image,label])=><button key={label}><img src={image} alt=""/><span>{label}</span></button>)}</div><div className="source-list-top"><b>총 {bestList.length}개</b><button>랭킹순</button></div><div className="source-product-grid">{items.map((item,i)=><button className="source-list-card" onClick={()=>go(productPath(item.title))} key={item.rank}><i className="list-rank">{i+1}</i><span className="list-image"><img src={item.image} alt=""/><em>장바구니</em></span><p>{item.title}</p>{item.original&&<del>{item.original}</del>}<b>{item.sale&&<strong>{item.sale}</strong>}<span>{item.price}</span></b>{item.benefit&&<u>최대 혜택가 <span>{item.benefit}</span></u>}{item.detail&&<s>자세히보기</s>}{item.badge&&<mark>{item.badge}</mark>}{item.review&&<q>{item.review}</q>}</button>)}</div><footer className="home-footer list-footer"><button type="button" className="bottom--toggle-btn">㈜온브릭스 사업자 정보</button><ul className="bottom__menu"><li><button onClick={()=>go('service')}>고객센터</button></li><li><button>대량주문문의</button></li><li><button onClick={()=>go('legal')}>이용약관</button></li><li><button onClick={()=>go('legal')}>개인정보처리방침</button></li></ul></footer></main>;
}
function SourceDetailPage({ product, add, go }: { product:Product; add:(product:Product)=>void; go:(to:string)=>void }) {
  const heroes=[product.image, product.image];
  const editorMap: Record<string,string[]>={
    melon:['/assets/detail/e1.webp','/assets/detail/e2.webp','/assets/detail/e3.webp','/assets/detail/e4.webp','/assets/detail/e5.webp','/assets/detail/e6.webp','/assets/detail/e7.webp','/assets/detail/e8.webp','/assets/detail/e9.webp'],
    grapes:['/assets/detail/grapes/1.webp','/assets/detail/grapes/2.webp','/assets/detail/grapes/3.webp','/assets/detail/grapes/4.png','/assets/detail/grapes/5.webp','/assets/detail/grapes/6.webp','/assets/detail/grapes/7.png','/assets/detail/grapes/8.webp','/assets/detail/grapes/9.webp','/assets/detail/grapes/10.webp','/assets/detail/e9.webp'],
    watermelon:['/assets/detail/watermelon/1.webp','/assets/detail/watermelon/2.webp','/assets/detail/watermelon/3.webp'],
    peach:['/assets/detail/peach/n1.webp','/assets/detail/peach/n2.webp','/assets/detail/peach/n3.webp','/assets/detail/peach/n4.webp','/assets/detail/peach/n5.webp','/assets/detail/peach/n6.webp','/assets/detail/peach/n7.webp','/assets/detail/peach/n8.webp','/assets/detail/peach/n9.webp','/assets/detail/e9.webp'],
    apple:['/assets/detail/apple/n1.webp','/assets/detail/apple/n2.webp','/assets/detail/apple/n3.webp','/assets/detail/apple/n4.webp','/assets/detail/apple/n5.webp','/assets/detail/apple/n6.webp','/assets/detail/e9.webp'],
    blueberry:['/assets/detail/blueberry/n1.webp','/assets/detail/blueberry/n2.webp','/assets/detail/blueberry/n3.webp','/assets/detail/blueberry/n4.webp','/assets/detail/blueberry/n5.webp','/assets/detail/blueberry/n6.webp','/assets/detail/blueberry/n7.webp','/assets/detail/blueberry/n8.webp','/assets/detail/blueberry/n9.webp','/assets/detail/e9.webp'],
  };
  const editors=editorMap[product.id]||editorMap.melon;
  const stories=detailStories[product.id]??detailStories.melon;
  const diaryName: Record<string,string>={melon:'멜론',grapes:'샤인머스켓',peach:'딱딱이 복숭아',apple:'홍로 사과',blueberry:'블루베리'};
  const diary=sugarDiary.find(d=>d.name===diaryName[product.id])??sugarDiary[3];
  const fruitInfo={name:diary.name,icon:diary.icon,sub:diary.reviewTitle,num:diary.num,base:diary.base};
  return <main className={`source-detail ${product.id}-page`}>
    <Swiper className="detail-visual" pagination={{type:'fraction', formatFractionCurrent:n=>String(n).padStart(2,'0'), formatFractionTotal:n=>String(n).padStart(2,'0'), renderFraction:(currentClass,totalClass)=>`<span class="${currentClass}"></span><span class="${totalClass}"></span>`}} modules={[Pagination]}>{heroes.map((image,i)=><SwiperSlide key={`${image}-${i}`}><img src={image} alt=""/></SwiperSlide>)}</Swiper>
    <section className="prd-info">
      <article className="top-info">
        <div className="util-area"><button className="util-like" aria-label="좋아요"/><button className="util-share" aria-label="공유하기"/></div>
        <h1>{product.title}</h1>
        <div className="price-block">
          {product.original?<del>{won(product.original)}</del>:null}
          <p className="price-main">{product.discount?<ins>{product.discount}%</ins>:null}<b>{won(product.price)}</b></p>
          {detailBenefit[product.id]!==undefined&&<p className="price-max"><span>최대 혜택가</span><b>{won(detailBenefit[product.id])}</b><i>?</i></p>}
          {['melon','grapes','peach'].includes(product.id)&&<button className="coupon-btn"><span>쿠폰 받기</span></button>}
        </div>
      </article>
      <article className="brix-block">
        <div className="brix-time-wrap"><p className="comm-time">20일(목){'\u00A0'}06시{'\u00A0'}기준</p></div>
        <div className="brix-inner">
          <div className="brix-top">
            <div className="brix-name"><p className="title"><img className="fruit-img" src={fruitInfo.icon} alt={fruitInfo.name}/>{fruitInfo.name}</p><p className="sub">{fruitInfo.sub}</p></div>
            <div className="brix-value"><p className="brix">{fruitInfo.num}brix</p><p className="sub">기준 {fruitInfo.base}brix</p></div>
          </div>
          <button className="brix-more" type="button" onClick={()=>go('sugar')}><span>오늘의 당도 보기</span></button>
        </div>
      </article>
      <article className="delivery-block">
        <dl>
          <dt>배송정보</dt>
          <dd>
            <div className="brand"><img src="/assets/detail/delivery-brand.png" alt="새벽에On"/><button type="button" className="q-btn" aria-label="질문"/></div>
            <p className="title"><span>8월 22일(토){'\u00A0'}<em>새벽 7시 전 도착 예정</em></span></p>
          </dd>
          <dt>배송비</dt>
          <dd><p className="price-text"><span>3,000원</span><span>30,000원 이상 구매 시 무료배송</span></p></dd>
        </dl>
      </article>
      <article className="review-block">
        <div className="comm-top-area"><h3 className="review-title">고객들이 <span className="point">{detailReviews[product.id]?.percent??'97%'}</span> 만족했어요.</h3><button className="more-btn" type="button"><span>999+개 후기</span></button></div>
        <ul className="review-rail">{(detailReviews[product.id]?.items??detailReviews.melon.items).map(r=><li key={r.date+r.text.slice(0,8)}><div className="img"><img src={r.image} alt=""/></div><div className="info"><div className="info-top"><span className="star"/><b>5</b><p className="data">{r.date}</p></div><div className="text">{r.text}</div></div></li>)}</ul>
      </article>
      <article className="birx-notice">
        <div className="comm-top-area"><h3>네이버페이 공지사항</h3><button type="button" className="toggle-btn">접기</button></div>
        <div className="birx-notice__area"><p className="birx-notice__title">🚨 네이버페이 구매시 주의사항</p><p className="birx-notice__text">공동현관 비밀번호(출입 방법)를 기재하지 않으실 경우, 부득이하게 공동현관 앞으로 배송될 수 있는 점 참고 부탁드립니다.</p></div>
      </article>
    </section>
    <nav className="detail-tabs"><button className="on">상품설명</button><button>상세정보</button><button>후기 999+</button><button>문의 {product.id==='blueberry'?'43':product.id==='apple'?'76':'47'}</button></nav>
    <p className="food-report">식품 안전 정보 확인하기</p>
    <section className={`detail-editor ${product.id}-ed`}>{editors.map(src=><img src={src} alt="" key={src}/>)}</section>
    <section className="birx-story"><div className="comm-top-area"><h3>연관 스토리</h3><button className="more-btn"><span>전체보기</span></button></div><ul>{stories.map(item=><li key={item.title}><span className="rel-thumb"><img src={item.image} alt=""/></span><div>{item.emptyCat&&<p className="category"/>}<p className="category">{item.category}</p><p className="title">{item.title}</p><p className="text">{item.text}</p></div></li>)}</ul></section>
    <footer className="detail-footer"><div className="bottom__area"><button type="button" className="bottom--toggle-btn">㈜온브릭스 사업자 정보</button></div><ul className="bottom__menu"><li><a>고객센터</a></li><li><a>대량주문문의</a></li><li><a>이용약관</a></li><li><a>개인정보처리방침</a></li></ul></footer>
    <div className="detail-buybar"><button className="buy-like" aria-label="좋아요"/>{product.id==='apple'&&<button className="buy-restock" aria-label="재입고 알림"/>}<button className="buy-gift">선물하기</button><button className="buy-now" onClick={()=>add(product)}>구매하기</button></div>
  </main>;
}
const sugarDiary=[
  {name:'샤인머스켓', icon:'/assets/sugar/shine.webp', base:'17.0', num:'17.5', delta:'0.1 상승', dir:'up', prev:'17.4', reviewTitle:'한여름 먼저 만나는 달콤한 하우스 샤인머스켓', reviewBody:'하우스 샤인머스켓은 하우스 재배로 부드럽게 즐기기 좋은 껍질과 진한 달콤함이 매력입니다. 한 알 베어 물면 톡 터지는 과즙과 은은한 향이 어우러져 산뜻한 여름 디저트로 즐기기 좋아요.', rel:{image:'/assets/best/6377d9d6f3914934f0455b91aa75d929.webp', title:'[농할 25%쿠폰] 연간 50만 송이 판매, 국내산 고당도 수출용 상주 샤인머스켓 (17brix)', price:'13,900원', benefit:'10,394원', badge:'새벽배송', review:'7,018+'}},
  {name:'딱딱이 복숭아', icon:'/assets/sugar/hard-peach.webp', base:'11.0', num:'14.8', delta:'1.6 상승', dir:'up', prev:'13.2', reviewTitle:'아삭하게 즐기는 달콤한 딱딱이 복숭아', reviewBody:'딱딱이 복숭아는 아삭하게 씹히는 단단한 과육과 깔끔한 단맛이 매력입니다. 한입 베어 물면 산뜻한 과즙과 은은한 복숭아 향이 퍼져, 여름 내내 즐기기 좋아요.', rel:{image:'/assets/best/f8eebf88bdc3fbba28c7223c917c8a2f.webp', title:'[농할 25%쿠폰] 당도선별, 국내산 우수산지 딱딱이 복숭아 1.5kg / 3kg (중과/대과)', price:'17,900원', benefit:'13,385원', badge:'새벽배송', review:'5,352+'}},
  {name:'말랑이 복숭아', icon:'/assets/sugar/soft-peach.webp', base:'12.0', num:'12.3', delta:'-0.1 하락', dir:'down', prev:'12.4', reviewTitle:'부드럽게 녹아드는 달콤한 말랑이 복숭아', reviewBody:'말랑이 복숭아는 여름에 가장 부드럽게 즐기기 좋은 복숭아입니다. 한입 베어 물면 말랑한 과육 사이로 달콤한 과즙과 향긋한 복숭아 향이 입안 가득 퍼져요.', rel:{image:'/assets/best/f41bdbc8fda0ba2f7000f3b7de19d56e.webp', title:'[농할 25%쿠폰] 당도선별, 국내산 우수산지 말랑이 복숭아 1.5kg / 3kg (중과/대과/특대과)', price:'19,900원', benefit:'14,880원', badge:'새벽배송', review:'4,654+'}},
  {name:'멜론', icon:'/assets/sugar/melon.webp', base:'14.0', num:'14.8', delta:'0.8 상승', dir:'up', prev:'14.0', reviewTitle:'향긋한 달콤함이 가득한 머스크 멜론', reviewBody:'머스크 멜론은 은은하게 퍼지는 향긋한 향과 높은 당도가 매력입니다. 부드럽고 촉촉한 과육을 한입 베어 물면 진한 달콤함과 풍부한 과즙이 입안 가득 퍼져 특별한 디저트처럼 즐기기 좋아요.', rel:{image:'/assets/best/21ead99bb5797905382ef206dcc32b9d.webp', title:'[농할 25%쿠폰] 입 안 가득 퍼지는 달콤함, 국내산 고당도 머스크 멜론 1입 / 2입 (14brix)', price:'12,900원', benefit:'9,646원', badge:'새벽배송', review:'3,750+'}},
  {name:'블루베리', icon:'/assets/sugar/blueberry.webp', base:'13.0', num:'13.8', delta:'-0.4 하락', dir:'down', prev:'14.2', reviewTitle:'톡 터지는 달콤함, 생 블루베리', reviewBody:'블루베리는 입안에서 톡톡 터지는 탱글한 식감과 진한 달콤함이 매력입니다. 한 알씩 가볍게 즐기기 좋고, 요거트나 샐러드에 곁들이면 상큼한 풍미가 더해져 산뜻한 간식으로 좋아요.', rel:{image:'/assets/best/b410d4dc8bdee0d229555aaf5ff255e9.webp', title:'[새벽에On] 항공직송 캐나다산 생 블루베리 500g / 1kg / 1.5kg (14-16mm)', price:'20,900원', benefit:'', badge:'새벽배송', review:'5,328+'}},
  {name:'홍로 사과', icon:'/assets/sugar/hongro.webp', base:'14.0', num:'14.2', delta:'-1.7 하락', dir:'down', prev:'15.9', reviewTitle:'햇사과 시즌을 여는 새콤달콤 홍로', reviewBody:'홍로 햇사과는 햇사과 시즌을 먼저 알리는 대표 사과입니다. 아삭하게 씹히는 단단한 과육과 풍부한 과즙, 은은한 향이 어우러져 새콤달콤한 맛과 초가을의 싱그러움까지 함께 느끼기 좋아요.', rel:{image:'/assets/best/d560d99c2c09478a596224c22a71c5db.webp', title:'[새벽에On] 아삭하게 퍼지는 달콤함, 고당도 햇 홍로사과 2kg / 4kg (14brix/특품)', price:'24,900원', benefit:'24,825원', badge:'새벽배송', review:'16,014+'}},
];
function SourceSugarPage({ go }: { go:(to:string)=>void }) {
  const [active,setActive]=useState(0);
  const mainRef=useRef<SwiperType|null>(null);
  const item={...sugarDiary[active].rel, detail:true};
  return <main className="source-sugar">
    <div className="thumbs-area">
      <div className="thumbs-area__top"><button className="date-btn date-btn--prev" aria-label="이전 날짜"/><button className="date"><span>2026년 8월 20일</span></button><button className="date-btn date-btn--next" disabled aria-label="다음 날짜"/></div>
    </div>
    <Swiper className="sugar-list" onSwiper={s=>{mainRef.current=s;}} onSlideChange={s=>setActive(s.activeIndex)} initialSlide={0}>
      {sugarDiary.map(d=><SwiperSlide key={d.name}>
        <article className="sugar-list__item">
          <div className="prd-con">
            <span className="prd-con__date">20일(목) 06시 기준</span>
            <strong className="prd-con__title">{d.name}</strong>
            <div className="prd-con__img"><img src={d.icon} alt={d.name}/></div>
            <button className="btn--img" type="button"><span>당도 실측 사진보기</span></button>
          </div>
          <div className="sugar">
            <span className="sugar__con">기준<br/>{d.base} brix</span>
            <b className="sugar__num">{d.num}</b>
            <div className={d.dir==='up'?'sugar__score':'sugar__score sugar__score__minus'}><b>{d.delta}</b><span>이전 당도 {d.prev} </span></div>
          </div>
          <div className="review">
            <p className="review__title">{d.reviewTitle}</p>
            <p className="review__con">{d.reviewBody}</p>
            <span className="review__name">Curator 한경구</span>
          </div>
        </article>
      </SwiperSlide>)}
    </Swiper>
    <section className="related-prd">
      <strong>관련 상품</strong>
      <button className="related-prd__item" type="button" onClick={()=>go(productPath(item.title))}>
        <span className="rel-img"><img src={item.image} alt=""/></span>
        <span className="rel-info">
          <p className="rel-title">{item.title}</p>
          <p className="rel-price">{item.price}</p>
          {item.benefit?<p className="rel-max">최대 혜택가 <span>{item.benefit}</span></p>:null}
          {item.badge?<span className="rel-badge">{item.badge}</span>:null}
          {item.review?<span className="rel-review">{item.review}</span>:null}
        </span>
      </button>
    </section>
    <footer className="sugar-footer"><div className="bottom__area"><button type="button" className="bottom--toggle-btn">㈜온브릭스 사업자 정보</button></div><ul className="bottom__menu"><li><button type="button" onClick={()=>go('service')}>고객센터</button></li><li><button type="button">대량주문문의</button></li><li><button type="button" onClick={()=>go('legal')}>이용약관</button></li><li><button type="button" onClick={()=>go('legal')}>개인정보처리방침</button></li></ul></footer>
  </main>;
}
function SourceStoryPage({ go }: { go:(to:string)=>void }) {
  return <main className="source-story-page"><div className="story-top"><div className="story-categories"><button className="story-bookmark" aria-label="북마크"/>{['전체','월간 과일','후르츠 로드','온스토리','과일생활'].map(x=><button key={x}>{x}</button>)}</div><b className="story-scope">모든과일</b></div><div className="story-sort"><b>총 <em>130 개</em></b><button>최근순</button></div><section>{storyList.map(item=><article key={item.id}><img src={item.image} alt=""/><div className="story-info"><div className="story-info-top"><span>{item.category}</span><button aria-label="북마크"/></div><h2>{item.title}</h2><p>{item.body}</p></div></article>)}</section><div className="story-paging"><button className="arrow">{'<<'}</button><button className="arrow">{'<'}</button><span className="page-group">{[1,2,3,4,5].map(n=><button className={n===1?'active':''} key={n}>{n}</button>)}</span><button className="arrow">{'>'}</button><button className="arrow">{'>>'}</button></div><footer className="home-footer story-footer"><button type="button" className="bottom--toggle-btn">㈜온브릭스 사업자 정보</button><ul className="bottom__menu"><li><button onClick={()=>go('service')}>고객센터</button></li><li><button>대량주문문의</button></li><li><button onClick={()=>go('legal')}>이용약관</button></li><li><button onClick={()=>go('legal')}>개인정보처리방침</button></li></ul></footer></main>;
}
function SourceEventPage({ go }: { go:(to:string)=>void }) {
  return <main className="source-event-page">{eventList.map(item=><article className={`${item.period?'has-period':''}${item.period?' is-end':''}`} key={item.id}><div className="evt-list__visual"><img src={item.image} alt={item.title}/></div><div className="evt-list__content"><b>{item.title}</b>{item.period?<span className="evt-list__date">{item.period}</span>:null}</div></article>)}<footer className="home-footer story-footer"><button type="button" className="bottom--toggle-btn">㈜온브릭스 사업자 정보</button><ul className="bottom__menu"><li><button onClick={()=>go('service')}>고객센터</button></li><li><button>대량주문문의</button></li><li><button onClick={()=>go('legal')}>이용약관</button></li><li><button onClick={()=>go('legal')}>개인정보처리방침</button></li></ul></footer></main>;
}
function SourceLoginPage() {
  return <main className="source-login"><div className="login-top"><div className="login-top__logo"><img src="/assets/login-logo.png" alt="온브릭스"/></div><div className="login-top__text"><p className="login-top__text-sub">지금 가입하면 즉시 추가 할인</p><p className="login-top__text-main">최대 1만원 할인 꼭 받으세요</p></div><div className="login-top__benefit"><span/><p>지금 가입하면 <b>3,000원 쿠폰</b>을 드려요</p></div><button className="btn--kakao"><span>카카오로 3초만에 시작하기</span></button><button className="btn--naver"><span>네이버로 계속하기</span></button></div><div className="onbrix-login"><label>로그인 유지</label><button>온브릭스 아이디로 로그인</button></div><ul className="nomember"><li><button>비회원 주문 조회</button></li></ul></main>;
}
const cartRail=[
  {image:'/assets/best/6f891ca84d87ec3ab7c58b06e9a6e377.webp',title:'[농할 25%쿠폰] 고당도, 국내산 햇사레 말랑이 복숭아 3kg (특품/대과)',original:'34,900원',sale:'20%',price:'27,900원',review:'6382+'},
  {image:'/assets/best/f8eebf88bdc3fbba28c7223c917c8a2f.webp',title:'[농할 25%쿠폰] 당도선별, 국내산 우수산지 딱딱이 복숭아 1.5kg / 3kg (중과/대과)',original:'22,400원',sale:'20%',price:'17,900원',review:'5356+'},
  {image:'/assets/best/d560d99c2c09478a596224c22a71c5db.webp',title:'[새벽에On] 아삭하게 퍼지는 달콤함, 고당도 햇 홍로사과 2kg / 4kg (14brix/특품)',original:'46,000원',sale:'46%',price:'24,900원',review:'16015+'},
  {image:'/assets/best/6377d9d6f3914934f0455b91aa75d929.webp',title:'[농할 25%쿠폰] 연간 50만 송이 판매, 국내산 고당도 수출용 상주 샤인머스켓 (17brix)',original:'17,400원',sale:'20%',price:'13,900원',review:'7019+'},
  {image:'/assets/best/f41bdbc8fda0ba2f7000f3b7de19d56e.webp',title:'[농할 25%쿠폰] 당도선별, 국내산 우수산지 말랑이 복숭아 1.5kg / 3kg (중과/대과/특대과)',original:'24,900원',sale:'20%',price:'19,900원',review:'4658+'},
  {image:'/assets/best/b410d4dc8bdee0d229555aaf5ff255e9.webp',title:'[새벽에On] 항공직송 캐나다산 생 블루베리 500g / 1kg / 1.5kg (14-16mm)',original:'',sale:'',price:'20,900원',review:'5328+'},
];
function SourceEmptyCart({ go }: { go:(to:string)=>void }) {
  return <main className="source-empty-cart"><section className="item-lists"><p>장바구니에 등록된 상품이 없습니다.</p></section><div className="cart-banner"><img src="/assets/cart-banner.webp" alt="온브릭스 혜택"/></div><section className="cart-product"><div className="comm-title"><h3 className="comm-title__main">지금 가장 인기 있는 상품</h3><button className="comm-title__more" onClick={()=>go('products')}><span>더보기</span></button></div><div className="cart-rail">{cartRail.map(item=><article className="cart-rail__item" key={item.image}><button className="cart-thumb" onClick={()=>go(productPath(item.title))}><img src={item.image} alt=""/><i>장바구니</i></button><div className="cart-info"><button className="cart-info__link" onClick={()=>go(productPath(item.title))}><p className="cart-info__title">{item.title}</p><p className="cart-info__price">{item.original?<span className="cart-info__del">{item.original}</span>:null}{item.sale?<strong className="cart-info__sale">{item.sale}</strong>:null}<b className="cart-info__main">{item.price}</b></p></button><div className="cart-info__badges"/><div className="cart-info__comment"><span>{item.review}</span></div></div></article>)}</div></section></main>;
}
function MyHeader({ go }: { go:(to:string)=>void }) {
  return <header className="my-lnb"><h2>마이</h2><div className="my-lnb__util"><button className="my-lnb__btn my-delivery" onClick={()=>go('delivery')} aria-label="배송"/><button className="my-lnb__btn my-cart" onClick={()=>go('cart')} aria-label="장바구니"/><button className="my-lnb__btn my-option" aria-label="옵션"/></div></header>;
}
function SourceMyPage({ go }: { go:(to:string)=>void }) {
  return <main className="source-my"><div className="nomem-info"><h3 className="nomem-info__title"><button onClick={()=>go('login')}>로그인·회원가입</button></h3><p>회원가입 시 <em>1만원</em> 혜택을 드려요!</p></div><div className="my-image-banner"><img src="/assets/my-banner.webp" alt=""/></div><div className="mypage-nav"><dl><dt>고객센터</dt><dd><ul><li><button onClick={()=>go('service')}>공지사항</button></li><li><button onClick={()=>go('service')}>대량주문 문의</button></li></ul></dd></dl><dl><dt>서비스 안내</dt><dd><ul><li><button onClick={()=>go('service')}>온브릭스 소개</button></li><li><button onClick={()=>go('delivery')}>배송 안내</button></li></ul></dd></dl></div><p className="mypage-copy">© Onbrix, All Rights Reserved.</p><footer className="home-footer my-footer"><button type="button" className="bottom--toggle-btn">㈜온브릭스 사업자 정보</button><ul className="bottom__menu"><li><button onClick={()=>go('service')}>고객센터</button></li><li><button>대량주문문의</button></li><li><button onClick={()=>go('legal')}>이용약관</button></li><li><button onClick={()=>go('legal')}>개인정보처리방침</button></li></ul></footer></main>;
}
function SourceServicePage({ go }: { go:(to:string)=>void }) {
  const faqs=['[결제/배송] 무료배송 조건이 어떻게 되나요?','[결제/배송]수령인이 주문자 정보를 확인할 수 있나요?','[결제/배송]구매 영수증은 어떻게 확인할 수 있나요?','[결제/배송] 지정된 날짜에 수령할 수 있나요?','[마일리지적립] 적립금 사용기한이 어떻게 되나요?'];
  const notices=[['[공지]홈페이지 개편 및 기존 회원 로그인 안내','2023-02-23'],['2023년 2월 28일 이전 주문내역 안내','2025-08-04'],['2024.08.01 온브릭스 개인정보 처리 방침 개정 내용 사전안내','2025-08-04']];
  return <main className="source-service"><div className="cs-list"><div className="cs-list__item"><div className="info"><p>전화 문의</p><ul><li>평일 : 09:00 - 17:00</li><li>휴무 : 토, 일, 공휴일</li></ul></div><a href="tel:02-6925-2311" className="cs-btn cs-btn-tel"><span>02-6925-2311</span></a></div><div className="cs-list__item"><div className="info"><p>채팅 문의</p><ul><li>평일 : 09:00 - 17:00</li><li>일요일/공휴일 : 09: 00- 12:00</li><li>토요일 : 휴무</li></ul></div><button type="button" className="cs-btn cs-btn-chat"><span>채팅 상담</span></button></div></div><div className="cs-search"><input placeholder="검색어를 입력하세요."/><button type="button" aria-label="검색"/></div><div className="index-con"><div className="index-con__item"><div className="cs-title"><strong>자주하는 질문</strong><button type="button" className="cs-more">전체보기</button></div><ul className="faq-list">{faqs.map(q=><li className="faq-list__item" key={q}><button type="button"><span>{q}</span></button></li>)}</ul></div><div className="index-con__item"><div className="cs-title"><strong>공지사항</strong><button type="button" className="cs-more">전체보기</button></div><ul className="notice-list">{notices.map(([t,d])=><li className="notice-list__item" key={t}><button type="button"><span className="notice-title">{t}</span><span className="notice-date">{d}</span></button></li>)}</ul></div></div><footer className="home-footer service-footer"><button type="button" className="bottom--toggle-btn">㈜온브릭스 사업자 정보</button><ul className="bottom__menu"><li><button onClick={()=>go('service')}>고객센터</button></li><li><button>대량주문문의</button></li><li><button onClick={()=>go('legal')}>이용약관</button></li><li><button onClick={()=>go('legal')}>개인정보처리방침</button></li></ul></footer></main>;
}
function SourceLegalPage() {
  return <main className="source-legal"><div className="content-box" dangerouslySetInnerHTML={{__html:legalCopy.html}}/></main>;
}
function MissingHomeModules({ go }: { go:(to:string)=>void }) {
  const stories=[['/assets/story-direct.webp','월간 과일','산지에서 식탁까지 복숭아 맛을 지키는 세 가지','온도 · 시간 · 배송'],['/assets/story-peach.webp','월간 과일','기대만큼 기준이 높은 프리미엄 복숭아','복숭아 큐레이션'],['/assets/story-watermelon.webp','월간 과일','수박의 기준을 뒤집는 블랙 프리미엄','SWT 흑수박'],['/assets/story-kiwi.webp','월간 과일','코끼리도 놀란 압도적 체급, 썬 골드키위 점보 국내 상륙','키위 큐레이션'],['/assets/story-blueberry.webp','월간 과일','대한민국이 인정한 31년 명인의 유기농 블루베리','블루베리로 장관상까지 휩쓴 비결은?']];
  const instaStats=[[12,0],[31,2],[10,0],[27,0],[71,14],[42,5],[32,3],[25,0],[43,1],[52,1]];
  const [pickTab,setPickTab]=useState(0);
  const [categoryTab,setCategoryTab]=useState(0);
  const pickTabs=['샤인머스켓 + 포도','햇사레 복숭아','신규 오픈 과일 모음','토마토','온리브릭스','조각과일'];
  const pickCopy=[['돌아온 샤인머스켓 & 고당도 포도🍇','캠벨·거봉까지 고당도 3종 모음'],['햇사레 복숭아, 지금이 제철','말랑이·딱딱이 취향대로'],['신규 오픈 과일','온브릭스가 고른 신상'],['토마토 큐레이션','방울부터 완숙까지'],['온리브릭스 단독','산지에서 온 특별한 과일'],['조각과일 컷츠','바로 먹는 프리미엄 컷츠']];
  const pickCatalog=[[sourceCatalog.domestic[1],sourceCatalog.domestic[13]],sourceCatalog.peach,sourceCatalog.variety,sourceCatalog.direct,sourceCatalog.ranking,sourceCatalog.gift];
  return <>
    <ShowcaseRail className="ranking-module" title="실시간 과일 랭킹" subtitle="지금 가장 인기있어요!" items={rankRail} ranked go={go}/>
    <ShowcaseRail className="domestic-module" title="국내산 과일 20% + 25% 할인중" subtitle="달콤한 과일을 마음껏 만날 수 있는 기회!" items={sourceCatalog.domestic} go={go}/>
    <section className="video-module"><div className="comm-title"><h3>on다 on다 온브릭스! 달콤한 과일만 골라서 on다!</h3></div><div className="main-video__main"><iframe title="온다 온다 온브릭스" src="https://www.youtube.com/embed/Ha_wFi-DmGo?autoplay=1&mute=1&loop=1&playlist=Ha_wFi-DmGo" allow="autoplay; encrypted-media"/></div></section>
    <section className="pick-module"><h2>온브릭스 Pick</h2><div className="pick-tabs">{pickTabs.map((tab,i)=><button className={pickTab===i?'on':''} onClick={()=>setPickTab(i)} key={tab}>{tab}</button>)}</div><div className="pick-banner"><img src={`/assets/pick-${pickTab+1}.webp`} alt=""/><b>{pickCopy[pickTab][0]}</b><p>{pickCopy[pickTab][1]}</p></div><div className="source-rail">{pickCatalog[pickTab].slice(0,2).map(item=><CatalogCard item={{...item,review:parseInt(item.review.replace(/,/g,''))>=1000?'1000+':item.review}} compact go={go} key={item.id}/>)}</div><button className="pick-more" onClick={()=>go('products')}><span>전체보기</span></button></section>
    <ShowcaseRail className="peach-module" title="복숭아🍑 취향대로 골라요" subtitle="이름만큼 다양한 복숭아 라인업 준비완료!" items={sourceCatalog.peach.map(item=>({...item,review:'1000+'}))} go={go}/>
    <CakeDeal/>
    <ShowcaseRail className="apple-module" title="아삭-소리부터 남다른 사과" subtitle="부사부터 갓 수확한 홍로사과까지🍎" items={appleRail} go={go}/>
    <ShowcaseRail className="direct-module" title="산지에서 집으로, 다이렉트 산지 배송" subtitle="갓 수확한 신선함과 무료배송 혜택을 더한 혜택" items={sourceCatalog.direct} go={go}/>
    <section className="category-module source-module"><h2>카테고리 별 상품 추천</h2><div className="pick-tabs">{['지금 인기 있어요!🔥','큐레이터 추천⭐','부담 없는 선물'].map((tab,i)=><button className={categoryTab===i?'on':''} onClick={()=>setCategoryTab(i)} key={tab}>{tab}</button>)}</div><div className="source-rail">{[rankRail[0],rankRail[1],rankRail[6]].map(item=><CatalogCard item={{...item,review:'1000+',detail:false,benefit:''}} compact go={go} key={item.id}/>)}</div><button className="pick-more" onClick={()=>go('products')}><span>전체보기</span></button></section>
    <ShowcaseRail className="variety-module" title="품종 발견 프로젝트: 신품종 과일 소개" subtitle="비슷해 보여도 품종에 따른 맛의 차이" items={sourceCatalog.variety} go={go}/>
    <ShowcaseRail className="gift-module" title="간편한 [선물하기]로 과일을 보내요🎁" subtitle="주소 걱정 없이 연락처만 있다면 바로 OK" items={sourceCatalog.gift} go={go}/>
    <section className="source-story"><div className="module-head"><h2>온브릭스 스토리</h2><button className="story-more" onClick={()=>go('story')}><span>더보기</span></button></div><div className="story-chips">{['월간 과일','후르츠 로드','온스토리','과일생활'].map((x,i)=><button className={i===0?'selected':''} key={x}>{x}</button>)}</div><div className="story-rail">{stories.map(([image,cat,line,title])=><button onClick={()=>go('story')} key={title}><img src={image} alt=""/><div className="story-card-info"><div className="story-cat"><span>{cat}</span><p>{line}</p></div><p className="story-card-title">{title}</p></div></button>)}</div></section>
    <section className="source-insta"><h2>인스타그램</h2><div>{instagramImages.map((image,i)=><a className="insta-item" key={image}><img src={image} alt={`인스타그램 게시물 ${i+1}`}/><div className="insta-overlay"><div className="insta-stats"><span className="insta-likes">❤️ {instaStats[i][0]}</span><span className="insta-comments">💬 {instaStats[i][1]}</span></div></div></a>)}</div></section>
  </>;
}
function App() {
  const [route, setRoute] = useState(parseRoute);
  const [promo, setPromo] = useState(true);
  const [salePop, setSalePop] = useState(true);
  const [search, setSearch] = useState(false); const [menu, setMenu] = useState(false); const [pending, setPending] = useState<Product | null>(null); const [optionId, setOptionId] = useState(''); const [optQty, setOptQty] = useState(1); const [optOpen, setOptOpen] = useState(false); const [query, setQuery] = useState(''); const [dealClock, setDealClock] = useState(dealRemain);
  const [cart, setCart] = useState<CartLine[]>(() => { try { const saved: unknown = JSON.parse(localStorage.getItem('onbrix-cart') ?? '[]'); return Array.isArray(saved) && saved.every(x => typeof x === 'object' && x !== null && 'productId' in x && 'optionId' in x && 'quantity' in x) ? saved as CartLine[] : []; } catch { return []; } });
  const go = (to: string) => { location.hash = `#/${to}`; };
  useEffect(()=>{ const update=()=>setRoute(parseRoute()); addEventListener('hashchange',update); if(!location.hash) go('home'); return()=>removeEventListener('hashchange',update); },[]);
  useEffect(()=>{ localStorage.setItem('onbrix-cart', JSON.stringify(cart)); },[cart]);
  useEffect(()=>{ const id=setInterval(()=>setDealClock(dealRemain()),1000); return()=>clearInterval(id); },[]);
  useEffect(()=>{ document.body.style.overflow = search || menu || !!pending ? 'hidden' : ''; return()=>{document.body.style.overflow='';}; },[search,menu,pending]);
  const add = (product: Product) => { setPending(product); setOptionId(''); setOptQty(1); setOptOpen(false); };
  const addPending = () => { if (!pending || !optionId) return; setCart(lines => { const match = lines.findIndex(line=>line.productId===pending.id && line.optionId===optionId); return match < 0 ? [...lines,{productId:pending.id,optionId,quantity:optQty}] : lines.map((line,i)=>i===match?{...line,quantity:line.quantity+optQty}:line); }); setPending(null); go('cart'); };
  const pendingOption = pending?.options.find(o=>o.id===optionId);
  const pendingSum = (pendingOption?.price ?? 0) * optQty;
  const pendingBase = pending?.options[0]?.price ?? 0;
  const cartRows = cart.flatMap(line => { const product=products.find(p=>p.id===line.productId); const option=product?.options.find(o=>o.id===line.optionId); return product&&option?[{...line,product,option}]:[]; });
  const total = cartRows.reduce((sum,line)=>sum+line.option.price*line.quantity,0);
  const product = products.find(p=>p.id===route.productId);
  const main = route.view === 'home' ? <><main><Swiper className="hero" modules={[Autoplay,Pagination]} autoplay={false} loop={false} initialSlide={0} pagination={{type:'fraction', formatFractionCurrent:n=>String(n).padStart(2,'0'), formatFractionTotal:n=>String(n).padStart(2,'0'), renderFraction:(currentClass,totalClass)=>`<span class="${currentClass}"></span><span class="${totalClass}"></span>`}}>{hero.map(([src,label])=><SwiperSlide key={src}><img src={src} alt={label}/></SwiperSlide>)}</Swiper><section className="brix-section"><div className="section-head"><h2>오늘의 당도</h2><p><span>19일(수)</span>{'\u00A0'}06시 기준</p></div><Swiper slidesPerView={'auto'} spaceBetween={0}>{brix.map(([name,value,base,image])=><SwiperSlide key={name} className="brix-slide"><button className="brix-card" onClick={()=>go('sugar')}><span className="brix-thumb"><img src={image} alt=""/></span><div><strong>{name}</strong><span className="rolling-number">{value}</span><small>기준 {base}brix</small></div></button></SwiperSlide>)}</Swiper><button className="brix-all" onClick={()=>go('sugar')}><span>당도 전체보기</span></button></section><section className="deal"><div className="chips">{['🍑납-작복숭아&햇사과 오픈 특가🍎','복숭아&샤인 특가'].map((x,i)=><button className={i===0?'selected':''} key={x}>{x}</button>)}</div><p className="deal-time"><span>{dealClock}</span></p><div className="deal-list">{dealItems.map(item=><article className="deal-card" key={item.title}><button className="deal-img" onClick={()=>go(productPath(item.title))}><img src={item.image} alt=""/><i>장바구니</i></button><div className="deal-info"><p onClick={()=>go(productPath(item.title))}>{item.title}</p><b><strong>{item.sale}</strong><span>{item.price}</span><del>{item.original}</del></b><q>{item.review}</q></div></article>)}</div><button className="deal-all" onClick={()=>go('products')}><span>특가 전체보기</span></button></section><section className="dawn"><div className="dawn-head"><h2>새벽에 온 과일이 그렇게 신선하다며?<span>오늘 주문하고 새벽에 받으세요!</span></h2><button onClick={()=>go('dawn')}>더보기</button></div><div className="dawn-rail">{dawnItems.map(item=><CatalogCard item={item} go={go} key={item.id}/>)}</div></section><MissingHomeModules go={go}/></main><footer className="home-footer"><button type="button" className="bottom--toggle-btn">㈜온브릭스 사업자 정보</button><ul className="bottom__menu"><li><button onClick={()=>go('service')}>고객센터</button></li><li><button>대량주문문의</button></li><li><button onClick={()=>go('legal')}>이용약관</button></li><li><button onClick={()=>go('legal')}>개인정보처리방침</button></li></ul></footer></> : route.view === 'products' ? <SourceProductList go={go}/> : route.view === 'dawn' ? <SourceDawnPage go={go}/> : route.view === 'sale' ? <SourceSalePage go={go}/> : route.view === 'delivery' ? <SourceDeliveryPage/> : route.view === 'product' && product ? <SourceDetailPage product={product} add={add} go={go}/> : route.view === 'sugar' ? <SourceSugarPage go={go}/> : route.view === 'events' ? <SourceEventPage go={go}/> : route.view === 'story' ? <SourceStoryPage go={go}/> : route.view === 'login' ? <SourceLoginPage/> : route.view === 'my' ? <SourceMyPage go={go}/> : route.view === 'service' ? <SourceServicePage go={go}/> : route.view === 'legal' ? <SourceLegalPage/> : <main className="page"><h1>장바구니</h1>{cartRows.length===0?<SourceEmptyCart go={go}/>:<><div className="cart-list">{cartRows.map(line=><div className="cart-row" key={`${line.productId}-${line.optionId}`}><img src={line.product.image} alt=""/><div><p>{line.product.title}</p><small>{line.option.label}</small><b>{won(line.option.price)}</b><div className="quantity"><button aria-label="수량 줄이기" onClick={()=>setCart(x=>x.flatMap(item=>item.productId===line.productId&&item.optionId===line.optionId?(item.quantity===1?[]:[{...item,quantity:item.quantity-1}]):[item]))}>−</button><span>{line.quantity}</span><button aria-label="수량 늘리기" onClick={()=>setCart(x=>x.map(item=>item.productId===line.productId&&item.optionId===line.optionId?{...item,quantity:item.quantity+1}:item))}>＋</button></div></div><button aria-label="상품 삭제" onClick={()=>setCart(x=>x.filter(item=>item.productId!==line.productId||item.optionId!==line.optionId))}>×</button></div>)}</div><div className="cart-total"><span>총 상품금액</span><strong>{won(total)}</strong></div><button className="primary">{cartRows.length}개 상품 주문하기</button></>}</main>;
  return <div className={`app ${['home','products','dawn','story','events','legal','sugar'].includes(route.view)?'main-shell':'sub-shell'}${route.view==='events'?' no-promo':''}`}>{promo&&['home','products','dawn','story','legal','sugar'].includes(route.view)&&<div className="promo"><img src="/assets/header/line-banner.webp" alt="농할 25% 추가할인 샤인머스켓 10,425원"/><button onClick={()=>setPromo(false)} aria-label="프로모션 닫기"/></div>}{['home','products','dawn','story','events','legal','sugar'].includes(route.view)?<Header go={go} count={cart.reduce((n,l)=>n+l.quantity,0)} openSearch={()=>setSearch(true)} openMenu={()=>setMenu(true)} view={route.view}/>:route.view==='my'?<MyHeader go={go}/>:<SubHeader title={route.view==='product'?'상품 상세':route.view==='cart'?'장바구니':route.view==='login'?'로그인':route.view==='sugar'?'당도일지':route.view==='sale'?'무제한 과일 할인지원':route.view==='delivery'?'배송안내':route.view==='service'?'공지사항':'온브릭스'} go={go} cartCount={cart.reduce((n,l)=>n+l.quantity,0)} openSearch={()=>setSearch(true)} mode={route.view==='sale'?'sale':route.view==='product'?'product':route.view==='cart'?'cart':route.view==='login'?'login':route.view==='service'?'service':undefined}/>} {main}<nav className="bottom" aria-label="하단 메뉴"><button onClick={()=>setMenu(true)}>▦<span>카테고리</span></button><button onClick={()=>setSearch(true)}>⌕<span>검색</span></button><button className={route.view==='home'?'on':''} onClick={()=>go('home')}>⌂<span>홈</span></button><button className={['products','dawn'].includes(route.view)?'on':''} onClick={()=>go('events')}>♧<span>특가</span></button><button className={route.view==='my'?'on':''} onClick={()=>go('my')}>♙<span>마이</span></button></nav>{salePop&&['home','products','dawn','story','events','legal','sugar','my','service'].includes(route.view)&&<div className="bottom-pop"><p>46% 할인중</p><button onClick={()=>setSalePop(false)} aria-label="닫기">닫기</button></div>}<div className="float-wrap"><button className="top" aria-label="맨 위로" onClick={()=>scrollTo({top:0,behavior:'smooth'})}><img src="/assets/icons/floating-top.png" alt=""/></button><button className="chat" aria-label="상담"><img src="/assets/icons/floating-chat.png" alt=""/></button></div>
  {search&&<SearchLayer query={query} setQuery={setQuery} onClose={()=>setSearch(false)} go={go} products={products} add={add}/>}
  {menu&&<div className="overlay" onMouseDown={()=>setMenu(false)}><aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="menu-title" onMouseDown={e=>e.stopPropagation()}><div className="drawer-head"><b id="menu-title">ONBRIX</b><button autoFocus onClick={()=>setMenu(false)} aria-label="메뉴 닫기">×</button></div><p>로그인하고 더 많은 혜택을 만나보세요.</p><button className="login" onClick={()=>{setMenu(false);go('login');}}>로그인</button><nav>{[['추천 상품','products'],['새벽On','dawn'],['베스트','products'],['온브릭스 스토리','story'],['이벤트·혜택','events'],['고객센터','service']].map(([name,to])=><button onClick={()=>{setMenu(false);go(to);}} key={name}>{name}<span>›</span></button>)}</nav></aside></div>}
  {pending&&<div className="buy-process active" role="dialog" aria-modal="true" aria-label="옵션 선택"><div className="buy-process__bg" onMouseDown={()=>setPending(null)}/><div className="buy-process__con"><button type="button" className="option-box--btn-close" onClick={()=>setPending(null)}><span>닫기</span></button><div className="buy-process__delivery"><div className="buy-process__delivery__cate"><img src="/assets/product/delivery_category_01.png" alt="새벽에On"/></div><div className="buy-process__delivery__text"><p>8월 22일(토)&nbsp;<em>새벽 7시 전 도착 예정</em></p></div></div><div className="buy-process__option-box option-box"><div className="buy-process__inner-box"><div className="option-box__select"><div className="toggle js_toggle"><button type="button" className={`toggle__btn js_toggle_btn${optOpen?' active':''}`} onClick={()=>setOptOpen(v=>!v)}><span>중량선택</span></button><ul className="toggle__option option">{pending.options.map(o=>{ const extra=o.price-pendingBase; return <li key={o.id}><button type="button" className="js_toggle_tit js_toggle_option" onClick={()=>{setOptionId(o.id); setOptQty(1); setOptOpen(false);}}>{o.label}{extra>0&&<p>(+{extra.toLocaleString('ko-KR')}원)</p>}</button></li>; })}</ul></div></div></div>{pendingOption&&<div className="select-item"><div className="select-item__info"><p className="select-item__info--option">{pendingOption.label}</p><button type="button" className="common-icon common-icon--del3" onClick={()=>{setOptionId(''); setOptQty(1);}}><span>삭제</span></button></div><div className="select-item__price-info"><div className="quantity"><button type="button" className="quantity__minus" onClick={()=>setOptQty(q=>Math.max(1,q-1))}><span>감소</span></button><input type="text" title="수량" value={optQty} readOnly/><button type="button" className="quantity__plus" onClick={()=>setOptQty(q=>q+1)}><span>증가</span></button></div><p className="select-item__price-info--total-price">{pendingSum.toLocaleString('ko-KR')}</p></div></div>}</div><div className="buy-process__bottom"><div className="total-price"><p><span>총 상품금액</span><strong><em>{won(pendingSum)}</em></strong></p></div><div className="buy-process__btn-area btn-area__bottom"><button type="button" className="btn btn--big btn--line" onClick={addPending}>장바구니 담기</button><button type="button" className="btn btn--big npay-buy-btn" onClick={addPending} aria-label="네이버페이"><img src="/assets/npay/logo_npaybk_small.svg" alt="네이버페이"/></button><button type="button" className="btn btn--big btn--buy" onClick={addPending}>바로 구매하기</button></div></div></div></div>}</div>;
}
createRoot(document.getElementById('root')!).render(<App/>);

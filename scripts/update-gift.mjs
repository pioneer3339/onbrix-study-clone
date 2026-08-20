import fs from 'node:fs';
const path = new URL('../src/source-catalog.json', import.meta.url);
const catalog = JSON.parse(fs.readFileSync(path, 'utf8'));
catalog.gift = [
  { id:'gift-1', image:'/assets/catalog/gift-camel3.webp', title:'052 [추석선물] 과일바구니, 카멜3호 9종 6kg이상 (멜론,파인애플)', price:'109,800원', sale:'22%', original:'140,000원', benefit:'109,471원', badge:'새벽배송', review:'1685+', detail:true },
  { id:'gift-2', image:'/assets/catalog/gift-lime2.webp', title:'067 [추석선물] 프리미엄 과일선물세트 6종 라임2호 3.4kg이상 (멜론,애플망고)', price:'45,900원', sale:'', original:'', benefit:'45,762원', badge:'택배배송', review:'778', detail:true },
  { id:'gift-3', image:'/assets/catalog/gift-yeondu1.webp', title:'064 [추석선물] 프리미엄 과일선물세트 7종 연두1호 3.7kg이상 (파인애플,애플망고)', price:'48,900원', sale:'', original:'', benefit:'48,753원', badge:'택배배송', review:'680', detail:true },
  { id:'gift-4', image:'/assets/catalog/gift-lime1.webp', title:'066 [추석선물] 프리미엄 과일선물세트 6종 라임1호 3.1kg이상 (파인애플,애플망고)', price:'42,900원', sale:'', original:'', benefit:'42,771원', badge:'택배배송', review:'778', detail:true },
  { id:'gift-5', image:'/assets/catalog/5b8418e9e8f5ac92.webp', title:'고당도 사과 선물세트 3kg이상(10-12입/특품)', price:'62,800원', sale:'', original:'', benefit:'62,612원', badge:'택배배송', review:'2639+', detail:true },
  { id:'gift-6', image:'/assets/catalog/55623d75e73c9db4.webp', title:'056 [추석선물] 과일바구니, 베이지3호 7종 4kg이상 (파인애플,혼합망고)', price:'79,800원', sale:'20%', original:'100,000원', benefit:'79,561원', badge:'새벽배송', review:'800', detail:true },
  { id:'gift-7', image:'/assets/catalog/9fb8c53bbd83c197.webp', title:'068 [추석선물] 프리미엄 과일선물세트 6종 라임3호 2.4kg이상 (샤인머스켓,애플망고)', price:'48,900원', sale:'', original:'', benefit:'48,753원', badge:'택배배송', review:'778', detail:true },
  { id:'gift-8', image:'/assets/catalog/adaa3fcd271ceb51.webp', title:'055 [추석선물] 과일바구니, 베이지2호 7종 4.3kg이상 (멜론,혼합망고)', price:'84,900원', sale:'21%', original:'107,000원', benefit:'84,645원', badge:'새벽배송', review:'800', detail:true },
  { id:'gift-9', image:'/assets/catalog/7ac0f1738fe0fd23.webp', title:'053 [추석선물] 과일바구니, 카멜4호 9종 5.2kg이상 (샤인머스켓,멜론)', price:'119,800원', sale:'20%', original:'150,000원', benefit:'119,441원', badge:'새벽배송', review:'1685+', detail:true },
  { id:'gift-10', image:'/assets/catalog/afdb053581575f95.webp', title:'058 [추석선물] 프리미엄 과일선물세트 9종 에메랄드1호 5.3kg이상 (파인애플,혼합망고)', price:'74,900원', sale:'21%', original:'95,000원', benefit:'74,675원', badge:'택배배송', review:'1035+', detail:true },
  { id:'gift-11', image:'/assets/catalog/10a0f1aeacc3d944.webp', title:'그린 에디션, 프리미엄 사과 선물세트 3kg이상(9입/특품)', price:'79,900원', sale:'', original:'', benefit:'79,660원', badge:'택배배송', review:'308', detail:true },
  { id:'gift-12', image:'/assets/catalog/826a7a95b30d88cd.webp', title:'생 복숭아 식감을 살린, 병조림 선물세트(백도&황도)', price:'26,800원', sale:'', original:'', benefit:'26,720원', badge:'택배배송', review:'132', detail:true },
  { id:'gift-13', image:'/assets/catalog/a26f8959eb0b4145.webp', title:'프리미엄 조각과일 컷츠, 6종 선물세트 (사과/샤인머스캣/파인애플/애플망고/용과/멜론)', price:'49,900원', sale:'', original:'', benefit:'49,750원', badge:'택배배송', review:'18', detail:true },
  { id:'gift-14', image:'/assets/catalog/f29ee39004d38d01.webp', title:'프리미엄 조각과일 컷츠, 9종 선물세트 (사과/샤인머스캣/파인애플/용과/오렌지/방울토마토/애플망고/자몽/멜론)', price:'59,900원', sale:'', original:'', benefit:'59,720원', badge:'택배배송', review:'27', detail:true },
  { id:'gift-15', image:'/assets/catalog/cd6155b538054630.webp', title:'051 [추석선물] 과일바구니, 카멜2호 10종 6.6kg이상 (샤인머스켓,멜론)', price:'139,800원', sale:'20%', original:'175,000원', benefit:'139,381원', badge:'새벽배송', review:'1685+', detail:true },
  { id:'gift-16', image:'/assets/catalog/929d07eb7fc0a253.webp', title:'054 [추석선물] 과일바구니, 베이지1호 7종 3.3kg이상 (샤인머스켓,혼합망고)', price:'89,800원', sale:'22%', original:'115,000원', benefit:'89,531원', badge:'새벽배송', review:'800', detail:true },
  { id:'gift-17', image:'/assets/catalog/f25f31ab50dd5d89.webp', title:'050 [추석선물] 과일바구니, 카멜1호 10종 7.1kg이상 (멜론,혼합망고)', price:'129,800원', sale:'21%', original:'165,000원', benefit:'129,411원', badge:'새벽배송', review:'1685+', detail:true },
  { id:'gift-18', image:'/assets/catalog/0f157aca1ee05171.webp', title:'049 [추석선물] 과일바구니, 브라운2호 12종 10kg이상 (샤인,멜론,파인애플)', price:'179,800원', sale:'22%', original:'230,000원', benefit:'179,261원', badge:'새벽배송', review:'323', detail:true },
];
fs.writeFileSync(path, JSON.stringify(catalog, null, 2) + '\n');
console.log('gift updated:', catalog.gift.length);

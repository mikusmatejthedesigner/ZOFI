/* Sdílená data webu i aplikace Fasádní akademie ZOFI (prototyp).
   Videa jsou skutečná videa z kanálu youtube.com/@zofifasady.
   Rozdělení do kurzů, podklady, ceny a dotazy jsou zástupné. */

const VIDEOS = [
  {v:'7DFgjeVmT1Y',t:'Úvod do seriálu: co vás čeká',d:'8:32',hq:1,free:1,desc:'Jaký dům zateplujeme, jaký systém a materiál jsme zvolili a co všechno v seriálu uvidíte.'},
  {v:'9w69d0tfcNU',t:'Příprava staveniště před zateplením',d:'3:48',hq:1,desc:'Lešení, zakrytí oken a okolí domu, uskladnění materiálu. Co připravit dřív, než se otevře první pytel lepidla.'},
  {v:'lcx6Xk41iSg',t:'Příprava břízolitového podkladu',d:'4:34',hq:1,desc:'Jak zkontrolovat a připravit starý břízolit, aby na něm lepidlo spolehlivě drželo.'},
  {v:'Er5tVaQ3u2U',t:'Lepení šedého polystyrenu lepicím tmelem',d:'3:17',hq:1,free:1,desc:'Nanesení lepicího tmelu po obvodu a v terčích, přiložení desky a kontrola roviny.'},
  {v:'gzl2szVtVQo',t:'Zápustné kotvení polystyrenu hmoždinkou WKTHERM S8',d:'7:12',hq:1,desc:'Rozmístění hmoždinek, zápustná montáž a zátky. Proč kotvit zápustně a na co si dát pozor.'},
  {v:'VqUMz2YFEPw',t:'Frézování otvorů pro zápustnou montáž',d:'2:07',hq:1,desc:'Frézování otvoru do polystyrenu kovovou frézkou ZOFITHERM.'},
  {v:'bCudN8yMi64',t:'Armovací vrstva a stěrka',d:'8:18',hq:1,desc:'Natažení stěrky, vložení síťoviny a kontrola rovinnosti vodováhou.'},
  {v:'iw0XkCWs-KY',t:'Proč do armování patří diagonály',d:'1:34',hq:1,desc:'Proč se v rozích otvorů vkládají diagonální výztuže a jak je osadit.'},
  {v:'Yew7mJ6kQZM',t:'Natažení silikonové fasádní omítky',d:'5:00',hq:1,desc:'Natažení a zatočení silikonové omítky, práce v záběrech a napojování.'},
  {v:'Yub8roZU1T8',t:'Hotová fasáda: kontrola a předání',d:'11:43',desc:'Prohlídka hotové fasády a body, na které se při přejímce dívat.'},

  {v:'etar5LJJeCY',t:'Založení fasády soklovým profilem LW-206',d:'3:33',desc:'Založení fasády soklovým profilem Likov LW-206 krok za krokem.'},
  {v:'ss8zz5Yg6WY',t:'Založení fasády: hotová realizace',d:'1:00',hq:1,desc:'Jak vypadá hotové založení fasády s profilem LW-206.'},
  {v:'JQsUyljbayE',t:'Ukončení nopové fólie u zateplené fasády',d:'9:59',hq:1,isNew:1,desc:'Jak správně ukončit nopovou fólii u soklu zateplené fasády profilem ZOFITHERM LNF.'},
  {v:'IX-1IWWdTcQ',t:'Mozaiková omítka na sokl',d:'3:35',desc:'Mozaiková omítka ZOFITHERM MOZAIK na sokl: kdy ji použít a jak ji nanést.'},
  {v:'5_gtUSrFs-Q',t:'Okna a dveře: jaké profily použít a proč',d:'6:10',free:1,desc:'Které profily patří kolem oken a dveří a proč právě na nich záleží nejvíc.'},
  {v:'dv5w8z7GOQA',t:'Podbití střechy s OSB deskou a polystyrenem',d:'8:04',hq:1,desc:'Úprava podbití střechy s OSB deskou, polystyrenem a omítkovým souvrstvím.'},
  {v:'Rk-BBlIEPWE',t:'Podbití střechy deskou UNIPLATTE bez OSB',d:'4:26',desc:'Podbití střechy deskou Austrotherm UNIPLATTE ve variantě bez OSB desky.'},
  {v:'ZX89aaMajH4',t:'Cihlová fasáda bez obkladu',d:'6:21',desc:'Omítka Ceresit CT 60 VISAGE a šablona s imitací cihly místo obkladu.'},

  {v:'WpDBIUGskFg',t:'Hromosvod a trubky v zateplené fasádě',d:'11:55',hq:1,desc:'Ukotvení hromosvodu a trubek do zateplené fasády držáky ZOFITHERM HP-PRO a HP-PRO T.'},
  {v:'aEtE0ip0ZkM',t:'Držák hromosvodu bez tepelného mostu',d:'8:28',hq:1,desc:'Montáž držáku hromosvodu ZOFITHERM HP do zateplení bez tepelných mostů.'},
  {v:'cXmpSogRKKY',t:'Držák hromosvodu HP pro drát 8 mm',d:'2:56',hq:1,isNew:1,desc:'Držák hromosvodu ZOFITHERM HP pro drát o průměru 8 mm.'},
  {v:'Xzvpp_Q29Yc',t:'Světla, schránky a kamery na fasádě',d:'5:00',desc:'Kotvení světel, schránek a kamer do zateplené fasády hmoždinkou ZOFITHERM HTI45.'},
  {v:'eQTPR0zh5_E',t:'Kotvení izolace IsoFux Rocket EVOlution',d:'4:55',desc:'Rychlé a pevné kotvení izolace bez tepelných mostů.'},
  {v:'ojADyZqeGOE',t:'Injektované kotvení izolantu',d:'3:27',hq:1,desc:'Injektované kotvení fasádního izolantu systémem SPIRAL ANKSYS.'},
  {v:'PPLYiow1M0Q',t:'SPIRAL ANKSYS u zateplovacích systémů',d:'2:36',desc:'Injektované kotvení u kontaktních zateplovacích systémů.'},
  {v:'KPtJJG9cmvo',t:'Injektované kotvení provětrávaných fasád',d:'2:36',hq:1,isNew:1,desc:'Kotvení provětrávaných fasád systémem Spiral Anksys SA/PL60.'},

  {v:'2SlGQlGqOak',t:'PIR desky pro tenké zateplení',d:'6:14',hq:1,desc:'Kdy dává smysl PIR deska EUROPIR a proč se hodí tam, kde není místo na silnou izolaci.'},
  {v:'ZoKv93eH8ik',t:'Trh s EPS v roce 2026',d:'4:22',free:1,isNew:1,desc:'Co se letos děje na trhu s EPS izolacemi a proč je těžké je sehnat.'},
  {v:'Jgf9IC6I0gU',t:'Míchárna fasádních omítek v Olomouci',d:'2:52',hq:1,free:1,isNew:1,desc:'Jak funguje míchárna fasádních omítek ZOFI a jak si nechat namíchat odstín.'},
  {v:'L-ietmDZFZ8',t:'Nový katalog ZOFITHERM',d:'2:46',hq:1,free:1,isNew:1,desc:'Co najdete v novém katalogu prvků ZOFITHERM pro zateplení fasád.'}
];

const COURSES = [
  {id:'zatepleni', title:'Zateplení rodinného domu krok za krokem', short:'Zateplení krok za krokem', level:'Pro začátečníky', cover:'bCudN8yMi64',
   desc:'Celý kontaktní zateplovací systém na jednom domě, od přípravy staveniště po hotovou omítku. V pořadí, v jakém se na stavbě opravdu pracuje.',
   forWho:'Pro majitele domů a stavebníky, kteří chtějí zateplovat svépomocí nebo rozumět tomu, co jim na domě dělá firma.',
   chapters:[
     {t:'Příprava',l:['7DFgjeVmT1Y','9w69d0tfcNU','lcx6Xk41iSg']},
     {t:'Izolant a kotvení',l:['Er5tVaQ3u2U','gzl2szVtVQo','VqUMz2YFEPw']},
     {t:'Armovací vrstva',l:['bCudN8yMi64','iw0XkCWs-KY']},
     {t:'Omítka a předání',l:['Yew7mJ6kQZM','Yub8roZU1T8']}
   ]},
  {id:'detaily', title:'Detaily, které rozhodují', short:'Detaily, které rozhodují', level:'Pokročilé', cover:'dv5w8z7GOQA',
   desc:'Místa, kde se fasády pokazí nejčastěji: sokl, okna a dveře, podbití střechy. Zblízka a bez spěchu.',
   forWho:'Pro ty, kdo mají za sebou první fasádu, a pro fasádníky, kteří chtějí mít detaily vyřešené jednou provždy.',
   chapters:[
     {t:'Sokl',l:['etar5LJJeCY','ss8zz5Yg6WY','JQsUyljbayE','IX-1IWWdTcQ']},
     {t:'Okna a dveře',l:['5_gtUSrFs-Q']},
     {t:'Podbití střechy',l:['dv5w8z7GOQA','Rk-BBlIEPWE']},
     {t:'Povrchy',l:['ZX89aaMajH4']}
   ]},
  {id:'kotveni', title:'Kotvení do zateplené fasády', short:'Kotvení do fasády', level:'Pro fasádníky', cover:'WpDBIUGskFg',
   desc:'Hromosvody, světla, schránky a samotný izolant. Jak kotvit pevně a bez tepelných mostů.',
   forWho:'Pro realizační firmy, elektrikáře a každého, kdo potřebuje něco pověsit na hotovou fasádu.',
   chapters:[
     {t:'Hromosvod',l:['WpDBIUGskFg','aEtE0ip0ZkM','cXmpSogRKKY']},
     {t:'Prvky na fasádě',l:['Xzvpp_Q29Yc']},
     {t:'Kotvení izolantu',l:['eQTPR0zh5_E','ojADyZqeGOE','PPLYiow1M0Q','KPtJJG9cmvo']}
   ]}
];

// kind: doc | sheet | drawing
const FILES = [
  {id:'f1', t:'Technologický postup kontaktního zateplení', kind:'doc', ext:'PDF', s:'28 stran', size:'6,2 MB', c:'zatepleni', l:'7DFgjeVmT1Y'},
  {id:'f2', t:'Kontrolní seznam před zateplením', kind:'doc', ext:'PDF', s:'4 strany', size:'0,8 MB', c:'zatepleni', l:'9w69d0tfcNU'},
  {id:'f3', t:'Kalkulačka spotřeby materiálu na m²', kind:'sheet', ext:'XLSX', s:'tabulka', size:'0,1 MB', c:'zatepleni', l:'Er5tVaQ3u2U'},
  {id:'f4', t:'Schéma kotvení podle výšky budovy', kind:'drawing', ext:'PDF', s:'6 výkresů', size:'1,4 MB', c:'zatepleni', l:'gzl2szVtVQo'},
  {id:'f5', t:'Přejímka fasády: kontrolní body', kind:'doc', ext:'PDF', s:'5 stran', size:'0,9 MB', c:'zatepleni', l:'Yub8roZU1T8'},
  {id:'f6', t:'Šablona rozpočtu zateplení rodinného domu', kind:'sheet', ext:'XLSX', s:'tabulka', size:'0,2 MB', c:'zatepleni'},
  {id:'f7', t:'Detail založení fasády u soklu', kind:'drawing', ext:'PDF', s:'2 výkresy', size:'1,1 MB', c:'detaily', l:'etar5LJJeCY'},
  {id:'f8', t:'Ukončení nopové fólie v řezu', kind:'drawing', ext:'PDF', s:'1 výkres', size:'0,6 MB', c:'detaily', l:'JQsUyljbayE'},
  {id:'f9', t:'Detaily ostění a parapetu', kind:'drawing', ext:'PDF', s:'12 výkresů', size:'3,8 MB', c:'detaily', l:'5_gtUSrFs-Q'},
  {id:'f10',t:'Skladba podbití střechy', kind:'drawing', ext:'PDF', s:'2 výkresy', size:'0,7 MB', c:'detaily', l:'dv5w8z7GOQA'},
  {id:'f11',t:'Přehled kotvicích prvků ZOFITHERM', kind:'doc', ext:'PDF', s:'10 stran', size:'2,3 MB', c:'kotveni', l:'Xzvpp_Q29Yc'},
  {id:'f12',t:'Montáž držáku hromosvodu', kind:'doc', ext:'PDF', s:'3 strany', size:'1,0 MB', c:'kotveni', l:'aEtE0ip0ZkM'},
  {id:'f13',t:'Srovnání izolantů: EPS, šedý EPS, vata, PIR', kind:'doc', ext:'PDF', s:'8 stran', size:'1,6 MB', l:'2SlGQlGqOak'}
];

const THREADS = [
  {id:'q1', subject:'Starý břízolit se místy drolí', c:'zatepleni', l:'lcx6Xk41iSg', status:'Zodpovězeno', msgs:[
    {me:1, when:'Po 5. 10. v 18:42', text:'Dobrý den, na domě máme starý břízolit a na severní straně se místy drolí. Stačí ho penetrovat, nebo je potřeba ho v těch místech strhnout?'},
    {me:0, when:'Út 6. 10. v 8:15', text:'Dobrý den, místa, kde se drolí, oklepejte až na pevný podklad a vyrovnejte. Na zbytku udělejte odtrhovou zkoušku lepidla na několika místech. Postup ukazujeme v lekci Příprava břízolitového podkladu. Kdyby si nebyl podklad jistý, pošlete nám fotky.'}
  ]},
  {id:'q2', subject:'Kolik hmoždinek na m² u rohu domu?', c:'zatepleni', l:'gzl2szVtVQo', status:'Čeká na odpověď', msgs:[
    {me:1, when:'Dnes v 9:03', text:'Dům je patrový, výška asi 7 m. Je potřeba v rozích přidat hmoždinky oproti ploše?'}
  ]}
];

const PLANS = {
  rok:{name:'Ročně', price:2290, unit:'rok', per:'Vychází na 191 Kč měsíčně', note:'Dva měsíce zdarma'},
  mesic:{name:'Měsíčně', price:249, unit:'měsíc', per:'Zrušíte kdykoliv', note:''}
};

/* ---------- pomocné funkce ---------- */
const vid = id => VIDEOS.find(x=>x.v===id);
const course = id => COURSES.find(c=>c.id===id);
const courseLessons = c => c.chapters.flatMap(ch=>ch.l);
const courseOf = id => COURSES.find(c=>courseLessons(c).includes(id));
const standalone = () => VIDEOS.filter(x=>!courseOf(x.v));
const thumb = (x, small) => `https://i.ytimg.com/vi/${x.v}/${x.hq && !small ? 'maxresdefault' : 'hqdefault'}.jpg`;
const secs = d => d.split(':').reduce((a,b)=>a*60+Number(b),0);
const fmtMin = s => { const m=Math.round(s/60); return m>=60 ? `${Math.floor(m/60)} h ${m%60} min` : `${m} min`; };
const courseSecs = c => courseLessons(c).reduce((a,id)=>a+secs(vid(id).d),0);
const kc = n => n.toLocaleString('cs-CZ').replace(/\s/g,' ')+' Kč';

/* české typografické mezery: jednopísmenné předložky a spojky, číslo + jednotka */
function czech(root){
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentNode.nodeName)?2:1});
  let n; while((n=w.nextNode())){
    const s=n.nodeValue
      .replace(/(^|[\s(„])([ksvzouaiKSVZOUAI])\s+/g,'$1$2 ')
      .replace(/(\d)\s+(Kč|min|h|stran|strany|výkresů|výkresy|výkres|lekcí|lekce|podkladů|podklady|%|dnů|m²|MB|z)(?=[\s.,)]|$)/g,'$1 $2');
    if(s!==n.nodeValue) n.nodeValue=s;
  }
}

const LOGO = `<svg viewBox="0 0 982.9 458.4" aria-hidden="true"><g fill="currentColor"><path d="M417.7,358.5h83.4V399H361.8v-41.3L442,211h-78.6v-40.5h137.7v37.7L417.7,358.5z"/><path d="M523.4,292.9c0.4-78.2,1.2-128.4,80.6-128.4c78.2,0,78.6,50.2,79,128.4c0.4,79.4-10.9,113.4-79,112.2C534.7,406.3,523,372.3,523.4,292.9z M576.1,324.5c0,28,2.4,40.1,28,40.1c24.3,0,26.300-12.2,26.3-40.1v-76.2c0-21.5,0-43.3-26.3-43.3c-28,0-28,21.9-28,43.3V324.5z"/><path d="M704.9,209v-38.5h20.3v-22.7c0-41.3,17-52.7,55.5-52.7h19.8v42.1c-4.1-1.2-8.5-2.4-11.7-2.4c-7.7,0-10.9,3.6-10.9,8.9v26.7h22.7V209h-22.7v190h-52.7V209H704.9z"/><path d="M834.6,143V95.2h52.7V143H834.6z M834.6,399V170.5h52.7V399H834.6z"/></g><path fill="#EE2E5D" d="M281.7,212.5l-84.2-102.6c18.7-9.2,31.8-28.1,32.4-50.3c0.9-32-24.2-58.6-56.2-59.6c-32-0.9-58.6,24.2-59.6,56.2c-0.4,14.8,4.7,28.5,13.6,39l-32.3,26.5V89.2c0-4.4-3.6-8-8-8H61.3c-4.4,0-8,3.6-8,8v67.1l-36.8,30.2c-18.3,15-9.3,44.6,14.2,46.9l17.3,1.7L65.7,399h62.7v27.6h-23.4c-9.9,0-17.9,8-17.9,17.9v14h41.3h21.5v-31.8V399h5.5v27.6v31.8h21.5h41.3v-14c0-9.9-8-17.9-17.9-17.9h-23.4V399h57.7L250.1,255l8.5,0.8C282.1,258.1,296.7,230.8,281.7,212.5z M193.6,295.9h-86.9v-37.4c0-14.3,11.6-25.9,25.9-25.9h35c14.3,0,25.9,11.6,25.9,25.9V295.9z"/><path fill="#1d1d1b" d="M135.4,238.1c-13,0-23.5,10.5-23.5,23.5c0,13,10.5,23.5,23.5,23.5c13,0,23.5-10.5,23.5-23.5C158.8,248.7,148.3,238.1,135.4,238.1z M144.9,258c-3.7,0-6.6-3-6.6-6.6s3-6.6,6.6-6.6s6.6,3,6.6,6.6S148.6,258,144.9,258z"/><path fill="#fff" d="M152.7,371.7c-30.1,0-57.3-17.8-69.4-45.4c-0.6-1.3,0-2.8,1.3-3.3c1.3-0.6,2.8,0,3.3,1.3c11.3,25.7,36.7,42.3,64.8,42.3c28.1,0,53.5-16.6,64.8-42.3c0.6-1.3,2-1.9,3.3-1.3c1.3,0.6,1.900,2,1.3,3.3C210,353.9,182.7,371.7,152.7,371.7z"/><path fill="#EE2E5D" d="M52.7,325.3l-0.1-0.2l-7.5,2.1c-5.6,1.6-8.9,7.5-7.3,13.1l5.3,18.4L16,366.5C4.3,369.8-2.5,382,0.9,393.7l0.2,0.9c3.4,11.7,15.6,18.5,27.3,15.1l32.4-9.3l-0.1-0.9L52.7,325.3z"/><path fill="#EE2E5D" d="M306.7,376c0-12.2-9.9-22.1-22.1-22.1l-28.2,0l0-19.1c0-5.2-3.8-9.5-8.7-10.4l-8,74.5l45,0c12.2,0,22.1-9.9,22.1-22.1L306.7,376z"/></svg>`;

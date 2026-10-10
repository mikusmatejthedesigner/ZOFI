/* Obsah aplikace Fasádní akademie (prototyp).
   Okamžiky ve videích, kvízy, výpočty, počasí a deník jsou zástupné.
   Technická tvrzení je potřeba ověřit s techniky ZOFI. */

/* ---------- lekce: okamžiky [sekunda, název], hlavní body, kvíz, detail v atlasu ---------- */
const LESSON = {
  '7DFgjeVmT1Y':{m:[[0,'Co nás v seriálu čeká'],[95,'Dům a jeho výchozí stav'],[230,'Zvolený systém a materiál'],[390,'Pořadí prací']],
    k:['Celý seriál natáčíme na jednom rodinném domě, od přípravy po předání.','Ukazujeme konkrétní systém i materiál a vysvětlujeme, proč právě ten.','Lekce jdou v pořadí, v jakém se na stavbě opravdu pracuje.']},
  '9w69d0tfcNU':{m:[[0,'Lešení a přístup'],[60,'Zakrytí oken a parapetů'],[130,'Uskladnění materiálu'],[190,'Kontrola před začátkem']],
    k:['Lešení postavte s odstupem, ve kterém se vejde izolant i ruka s hladítkem.','Okna, parapety a dlažbu zakryjte dřív, než se otevře první pytel.','Materiál skladujte v suchu a mimo přímé slunce.'],
    q:{q:'Co je potřeba zakrýt ještě před začátkem prací?',o:['Jen okna','Okna, parapety a okolí domu','Nic, všechno se dá umýt'],a:1,e:'Lepidlo ani stěrka z oken a dlažby snadno nejdou dolů. Zakrytí trvá hodinu, čištění dny.'}},
  'lcx6Xk41iSg':{m:[[0,'Jak poznat soudržný podklad'],[70,'Odtrhová zkouška'],[150,'Oklepání a vyrovnání'],[220,'Penetrace podkladu']],d:'lepeni',
    k:['Starý břízolit nejdřív prověřte, fasáda drží jen tak dobře jako podklad.','Místa, která se drolí, oklepejte až na pevný podklad a vyrovnejte.','Odtrhovou zkoušku udělejte na několika místech, hlavně na severní straně.'],
    q:{q:'Co udělat s místy, kde se starý břízolit drolí?',o:['Jen je přepenetrovat','Oklepat až na pevný podklad a vyrovnat','Přelepit izolantem, ten je zpevní'],a:1,e:'Penetrace nesoudržný podklad nezachrání. Lepidlo by drželo na vrstvě, která se odlupuje.'}},
  'Er5tVaQ3u2U':{m:[[0,'Příprava lepicího tmelu'],[58,'Obvodový pruh a terče'],[110,'Přiložení desky'],[155,'Kontrola roviny latí']],d:'lepeni',
    k:['Lepidlo nanášejte po celém obvodu desky a doprostřed přidejte terče.','Po přitlačení má lepidlo pokrýt nejméně 40 % plochy desky.','Rovinu kontrolujte latí hned, dokud se deska dá posunout.'],
    q:{q:'Kolik plochy desky má lepicí tmel pokrýt nejméně?',o:['20 %','40 %','Celou plochu'],a:1,e:'Pruh po obvodu a terče uprostřed. Při menším pokrytí může deska pracovat a obrysy desek se propíšou do omítky.'}},
  'gzl2szVtVQo':{m:[[0,'Kdy začít kotvit'],[70,'Schéma rozmístění'],[170,'Vrtání a zápustná montáž'],[300,'Zátky z izolantu'],[380,'Kontrola']],d:'hmozdinky',
    k:['Kotvěte až po zatvrdnutí lepidla, obvykle nejdříve druhý den.','Talíř hmoždinky zapusťte do izolantu a otvor zakryjte zátkou.','Počet a rozmístění hmoždinek se řídí výškou budovy a schématem.'],
    q:{q:'Proč se hmoždinky montují zápustně?',o:['Montáž je rychlejší','Talíř se nepropíše na fasádu a nevznikne studený bod','Hmoždinky jsou levnější'],a:1,e:'Talíř u povrchu je chladnější než okolí. Drží se na něm vlhkost a na fasádě vzniknou tečky.'}},
  'VqUMz2YFEPw':{m:[[0,'Frézka a vrtačka'],[35,'Frézování otvoru'],[85,'Osazení hmoždinky']],d:'hmozdinky',
    k:['Kovová frézka vyřízne čistý otvor pro talíř hmoždinky.','Hloubku frézování držte stejnou na celé ploše.','Výřez z izolantu poslouží jako zátka.']},
  'bCudN8yMi64':{m:[[0,'Příprava stěrky'],[80,'Rohové lišty'],[170,'Natažení stěrky'],[260,'Síťovina a přesahy'],[400,'Kontrola rovinnosti']],d:'diagonaly',
    k:['Síťovina patří do stěrky, ne pod ni. Musí být celá zakrytá.','Pruhy síťoviny se překrývají aspoň o 10 cm.','Rovinnost kontrolujte vodováhou nebo latí po celé ploše.'],
    q:{q:'Kde má být síťovina v armovací vrstvě?',o:['Přímo na izolantu, pod stěrkou','Zatlačená do čerstvé stěrky a celá zakrytá','Navrchu, aby byla vidět'],a:1,e:'Síťovina přenáší napětí jen tehdy, když je zapuštěná ve stěrce. Položená na izolantu nefunguje.'}},
  'iw0XkCWs-KY':{m:[[0,'Proč diagonály'],[20,'Osazení pruhu pod 45°'],[60,'Napojení na celoplošnou síťovinu']],d:'diagonaly',
    k:['V rozích otvorů se soustřeďuje napětí, odtud vycházejí praskliny.','Do každého rohu vložte pruh síťoviny pod úhlem 45°.','Diagonály přijdou do stěrky před celoplošným armováním.'],
    q:{q:'Kdy se do rohů otvorů vkládají diagonální pruhy síťoviny?',o:['Před celoplošným armováním','Až po omítce','Nikdy, stačí rohová lišta'],a:0,e:'Diagonála musí ležet ve stěrce pod celoplošnou síťovinou, jinak trhlinu v rohu nezastaví.'}},
  'Yew7mJ6kQZM':{m:[[0,'Penetrace a příprava'],[60,'Natažení omítky'],[150,'Zatočení hladítkem'],[230,'Napojování záběrů']],
    k:['Penetrace sjednotí savost, omítka pak tuhne všude stejně.','Omítku natahujte v jednom záběru od rohu k rohu.','Přerušená práce uprostřed stěny zůstane na fasádě vidět.'],
    q:{q:'Proč natahovat omítku v jednom záběru od rohu k rohu?',o:['Kvůli spotřebě materiálu','Aby nebyla vidět napojení','Aby rychleji vyschla'],a:1,e:'Napojení zaschlé a čerstvé omítky je vidět navždy. Proto se pracuje stěna po stěně bez přestávky.'}},
  'Yub8roZU1T8':{m:[[0,'Prohlídka hotového domu'],[160,'Rovinnost a napojení'],[360,'Okna a sokl'],[560,'Na co se dívat při přejímce']],
    k:['Na rovinnost se dívejte šikmo proti světlu, ráno nebo večer.','U oken a soklu kontrolujte napojení a ukončení profilů.','Přejímku si projděte podle kontrolního seznamu v podkladech.'],
    q:{q:'Jak nejlépe zkontrolovat rovinnost hotové fasády?',o:['Zepředu v poledne','Šikmo proti světlu','Na fotce z mobilu'],a:1,e:'Šikmé světlo zvýrazní každou nerovnost i napojení omítky.'}},
  'etar5LJJeCY':{m:[[0,'Soklový profil'],[60,'Ustavení do roviny'],[130,'Kotvení profilu'],[180,'Navázání první řady']],d:'sokl',
    k:['Soklový profil určuje výšku a rovinu celé fasády.','Profil ustavte do vodováhy po celém obvodu domu.','První řada desek musí na profilu sedět bez mezer.'],
    q:{q:'Proč musí být soklový profil přesně v rovině?',o:['Kvůli vzhledu soklu','Určuje rovinu celé fasády nad ním','Aby se dal lépe natřít'],a:1,e:'Každá další řada desek navazuje na profil. Chyba dole se nahoru jen zvětšuje.'}},
  'JQsUyljbayE':{m:[[0,'Proč na ukončení záleží'],[90,'Špatné řešení'],[200,'Profil ZOFITHERM LNF'],[380,'Montáž krok za krokem'],[520,'Hotový detail']],d:'nopova',
    k:['Volný horní okraj nopové fólie pustí za fólii vodu a nečistoty.','Okraj zakryje ukončovací lišta přitlačená k soklu.','Terén a kačírek zasypte až po osazení lišty.'],
    q:{q:'K čemu slouží ukončovací lišta nopové fólie?',o:['Je jen ozdobná','Zabrání zatékání vody a nečistot za fólii','Drží terén u domu'],a:1,e:'Bez lišty teče voda po fólii přímo za ni, k izolantu a ke zdi.'}},
  '5_gtUSrFs-Q':{m:[[0,'Okno jako slabé místo'],[60,'Okenní připojovací profil'],[170,'Izolant v ostění'],[280,'Parapet a nadpraží']],d:'osteni',
    k:['Okno se pohybuje jinak než fasáda, napojení musí být pružné.','Okenní připojovací profil zachytí pohyb a utěsní spáru.','I tenká vrstva izolantu v ostění omezí tepelný most.'],
    q:{q:'Co zachytí pohyb okna vůči fasádě?',o:['Silnější vrstva omítky','Okenní připojovací profil','Nic, okno se nehýbe'],a:1,e:'Profil se nalepí na rám a stěrka se do něj ukončí. Spára kolem okna pak nepraská.'}},
  'dv5w8z7GOQA':{m:[[0,'Výchozí stav podbití'],[100,'OSB deska'],[220,'Polystyren na podbití'],[340,'Omítkové souvrství']],d:'podbiti',
    k:['Podbití je součást fasády, ne dodatek.','Izolant fasády dotáhněte až k podbití.','Na podbití patří deska, izolant a omítkové souvrství.'],
    q:{q:'Proč dotáhnout zateplení až k podbití střechy?',o:['Kvůli vzhledu','Aby v napojení neunikalo teplo','Aby se podbití nemuselo natírat'],a:1,e:'Mezera mezi fasádou a podbitím je tepelný most po celém obvodu domu.'}},
  'WpDBIUGskFg':{m:[[0,'Problém kotvení do zateplení'],[120,'HP-PRO pro drát'],[330,'HP-PRO T pro trubku'],[540,'Montáž a utěsnění']],d:'hromosvod',
    k:['Držák musí nést do nosného zdiva, ne do izolantu.','Prvky do zateplení přerušují tepelný most.','Prostup fasádou je potřeba utěsnit.']},
  'aEtE0ip0ZkM':{m:[[0,'Držák HP'],[90,'Vrtání do zdiva'],[200,'Osazení bez tepelného mostu'],[380,'Upevnění vodiče']],d:'hromosvod',
    k:['Ocelový držák skrz izolant je tepelný most i místo, kudy zatéká.','Držák do zateplení se kotví do zdiva přes izolační tělo.','Vodič veďte v odstupu od povrchu fasády.'],
    q:{q:'Proč nevrtat ocelový držák skrz izolant přímo do zdi?',o:['Vznikne tepelný most a riziko zatékání','Držák by byl moc dlouhý','Nejde to vyvrtat'],a:0,e:'Ocel vede teplo ven a kolem neutěsněného prostupu zatéká. Na fasádě se pak objeví vlhká skvrna.'}},
  'Xzvpp_Q29Yc':{m:[[0,'Co se věší na fasádu'],[60,'Hmoždinka HTI45'],[150,'Montáž'],[240,'Hotový detail']],
    k:['Světla, schránky a kamery potřebují kotvení do nosného zdiva.','Hmoždinka do zateplení přenese zatížení bez tepelného mostu.','Pozice prvků si naplánujte ještě před armováním.']},
  'ojADyZqeGOE':{m:[[0,'Princip injektovaného kotvení'],[60,'Vrtání'],[120,'Injektáž a osazení']],
    k:['Injektované kotvení se hodí tam, kde běžná hmoždinka nedrží.','Kotva se v podkladu zalije a vytvrdne.','Postup ukazujeme na systému SPIRAL ANKSYS.']}
};
function lessonInfo(id){
  const x = vid(id), e = LESSON[id];
  if(e) return e;
  const d = secs(x.d);
  return {m:[[0,'Úvod'],[Math.round(d*.3),'Postup krok za krokem'],[Math.round(d*.78),'Shrnutí']], k:[x.desc]};
}

/* ---------- kurzy: doplňující informace ---------- */
const COURSE_X = {
  zatepleni:{tag:'Deset lekcí, jeden skutečný dům. Od lešení po předání.',
    out:['Prověřit podklad a připravit staveniště','Lepit desky tak, aby fasáda byla rovná','Kotvit zápustně a bez tepelných mostů','Udělat armovací vrstvu, která nepraská','Natáhnout omítku bez viditelných napojení','Zkontrolovat a převzít hotovou fasádu']},
  detaily:{tag:'Sokl, okna a střecha. Místa, kde se rozhoduje o životnosti fasády.',
    out:['Založit fasádu na soklovém profilu do roviny','Ukončit nopovou fólii, aby za ni nezatékalo','Napojit fasádu na okna přes připojovací profil','Vyřešit podbití střechy jako součást fasády','Udělat sokl odolný vodě a nečistotám']},
  kotveni:{tag:'Všechno, co se na fasádu věší. Pevně a bez tepelných mostů.',
    out:['Ukotvit hromosvod a trubky do zateplení','Pověsit světla, schránky a kamery na hotovou fasádu','Vybrat správný způsob kotvení izolantu','Použít injektované kotvení tam, kde hmoždinka nestačí']}
};

/* ---------- atlas detailů ---------- */
const DETAILS = [
  {id:'lepeni', t:'Lepení desek: obvod a terče', cat:'Plocha', short:'Jak nanést lepidlo, aby deska nepracovala.', bad:true,
   why:'Lepidlo drží celou fasádu. Když chybí na okrajích, deska se může prohnout, vznikají spáry a na hotové fasádě jsou vidět obrysy desek.',
   steps:[['Po celém obvodu desky naneste pruh lepidla.',1],['Doprostřed desky přidejte nejméně tři terče.',2],['Po přitlačení má lepidlo pokrýt nejméně 40 % plochy desky.',3],['Desku přiložte, přitlačte a hned zkontrolujte rovinu latí.',0]],
   mistake:'Lepení jen na terče. Okraje desky nedrží, deska se prohne a obrysy desek se propíšou do omítky.',
   mat:['Lepicí a stěrkový tmel','Fasádní izolant EPS','Hliníková lať 2 m'], les:[['Er5tVaQ3u2U',58]], file:'f3'},
  {id:'hmozdinky', t:'Zápustná montáž hmoždinek', cat:'Plocha', short:'Kotvení, které na fasádě nebude vidět.', bad:true,
   why:'Talíř hmoždinky u povrchu je chladnější než okolní plocha. Drží se na něm vlhkost a na fasádě se v místě každé hmoždinky objeví tečka.',
   steps:[['Kotvěte až po zatvrdnutí lepidla, obvykle nejdříve druhý den.',0],['Vrtejte do nosného zdiva v hloubce podle typu hmoždinky.',3],['Talíř hmoždinky zapusťte do izolantu.',1],['Otvor zakryjte zátkou z izolantu zarovnanou s povrchem.',2]],
   mistake:'Hmoždinka osazená na povrch izolantu. Talíř tvoří studený bod a jeho obrys se propisuje do omítky.',
   mat:['Hmoždinka WKTHERM S8','Kovová frézka ZOFITHERM','Zátky z EPS'], les:[['gzl2szVtVQo',170],['VqUMz2YFEPw',35]], file:'f4'},
  {id:'diagonaly', t:'Diagonály v rozích otvorů', cat:'Otvory', short:'Pruh síťoviny, který zastaví praskliny.', bad:true,
   why:'V rozích oken a dveří se soustřeďuje napětí. Bez vyztužení z nich vycházejí šikmé trhliny, které jsou na fasádě vidět jako první.',
   steps:[['Na hrany ostění osaďte rohové lišty se síťovinou.',3],['Do každého rohu vložte pruh síťoviny zhruba 30 × 20 cm pod úhlem 45°.',1],['Diagonály vložte do stěrky ještě před celoplošným armováním.',1],['Celoplošnou síťovinu natáhněte s přesahy aspoň 10 cm.',2]],
   mistake:'Armování bez diagonál. Z rohů otvorů se po čase objeví šikmé praskliny.',
   mat:['Výztužná síťovina','Rohová lišta se síťovinou','Lepicí a stěrkový tmel'], les:[['iw0XkCWs-KY',20],['bCudN8yMi64',260]], file:'f9'},
  {id:'osteni', t:'Ostění a okenní připojovací profil', cat:'Otvory', short:'Napojení na okno, které vydrží jeho pohyb.', bad:false,
   why:'Okno se teplem a větrem pohybuje jinak než fasáda. Bez pružného napojení vznikne kolem rámu spára, kudy zatéká, a nezateplené ostění je tepelný most.',
   steps:[['Ostění zateplete alespoň tenkou vrstvou izolantu, pokud to rám dovolí.',1],['Izolant fasády přetáhněte přes izolant ostění.',3],['Na rám nalepte okenní připojovací profil.',2],['Stěrku a omítku ukončete do profilu, ne přímo na rám.',2]],
   mistake:'Omítka natažená až k rámu okna. Při prvních mrazech se odtrhne a vznikne spára.',
   mat:['Okenní připojovací profil','Izolant do ostění','Rohová lišta'], les:[['5_gtUSrFs-Q',60]], file:'f9'},
  {id:'sokl', t:'Založení fasády na soklovém profilu', cat:'Sokl', short:'První řada desek určuje celou fasádu.', bad:false,
   why:'Soklový profil určuje výšku a rovinu celé fasády. Když není v rovině, každá další řada desek chybu jen zvětší.',
   steps:[['Vyměřte výšku založení po celém obvodu domu.',1],['Soklový profil ukotvěte přesně do roviny a do vodováhy.',1],['Pod profilem použijte izolant určený do soklu, který snese vlhkost.',2],['Sokl dokončete omítkou odolnou vodě, třeba mozaikovou.',3]],
   mistake:'Profil osazený od oka podle terénu. Fasáda nad ním je křivá a spáry desek se rozjíždějí.',
   mat:['Soklový profil','Izolant do soklu','Mozaiková omítka ZOFITHERM MOZAIK'], les:[['etar5LJJeCY',60],['IX-1IWWdTcQ',0]], file:'f7'},
  {id:'nopova', t:'Ukončení nopové fólie', cat:'Sokl', short:'Aby voda nezatékala za fólii.', bad:true,
   why:'Nopová fólie chrání izolaci pod terénem. Když její horní okraj zůstane volný, zatéká za ni voda a nečistoty a vlhkost se dostane k izolantu i ke zdi.',
   steps:[['Fólii veďte po izolantu soklu až nad úroveň terénu.',2],['Horní okraj fólie zakryjte ukončovací lištou.',1],['Lištu přitlačte k soklu, aby voda stékala po ní, ne za ni.',1],['Terén a kačírek zasypte až po osazení lišty.',3]],
   mistake:'Fólie s volným horním okrajem. Voda a hlína se dostanou za fólii a sokl začne vlhnout.',
   mat:['Nopová fólie','Ukončovací lišta ZOFITHERM LNF','Kačírek'], les:[['JQsUyljbayE',200]], file:'f8'},
  {id:'hromosvod', t:'Hromosvod v zateplené fasádě', cat:'Prvky na fasádě', short:'Držák, který nevytvoří tepelný most.', bad:true,
   why:'Ocelový držák vrtaný skrz izolant vede teplo ven a kolem prostupu může zatékat. Na zateplené fasádě se v tom místě objeví vlhká skvrna.',
   steps:[['Držák ukotvěte do nosného zdiva, ne jen do izolantu.',1],['Použijte prvek s tělem bez tepelného mostu, určený do zateplení.',2],['Prostup fasádou utěsněte.',2],['Vodič veďte v odstupu od povrchu fasády podle normy.',3]],
   mistake:'Ocelový držák skrz izolant přímo do zdi. Vznikne tepelný most a neutěsněný prostup.',
   mat:['Držák hromosvodu ZOFITHERM HP','Držák HP-PRO T pro trubku','Vodič Ø 8 mm'], les:[['aEtE0ip0ZkM',200],['WpDBIUGskFg',120]], file:'f12'},
  {id:'podbiti', t:'Napojení zateplení na podbití', cat:'Střecha', short:'Místo, kde teplo uniká nejčastěji.', bad:false,
   why:'Napojení fasády na střechu je vidět jen zespodu, a proto se často odbyde. Mezera mezi izolantem a podbitím je přitom tepelný most po celém obvodu domu.',
   steps:[['Izolant fasády dotáhněte až k podbití.',1],['Podbití řešte jako součást fasády: deska, izolant a omítkové souvrství.',2],['Styk fasády a podbití udělejte pružně, aby se při pohybu střechy neotrhl.',3]],
   mistake:'Zateplení ukončené pod podbitím s mezerou. Teplo uniká po celém obvodu domu.',
   mat:['OSB deska','Izolant EPS nebo deska UNIPLATTE','Lepicí a stěrkový tmel'], les:[['dv5w8z7GOQA',220],['Rk-BBlIEPWE',0]], file:'f10'}
];
const detail = id => DETAILS.find(d=>d.id===id);
const DETAIL_CATS = ['Plocha','Otvory','Sokl','Střecha','Prvky na fasádě'];

/* ---------- tipy ze stavby (krátká videa) ---------- */
const TIPS = [
  {id:'t1', v:'Er5tVaQ3u2U', s:58,  d:'0:45', t:'Lepidlo nikdy jen na terče', cat:'Lepení', det:'lepeni'},
  {id:'t2', v:'iw0XkCWs-KY', s:20,  d:'0:40', t:'Diagonála v rohu okna: 40 vteřin proti prasklinám', cat:'Armování', det:'diagonaly'},
  {id:'t3', v:'gzl2szVtVQo', s:170, d:'0:55', t:'Proč hmoždinku zapustit', cat:'Kotvení', det:'hmozdinky'},
  {id:'t4', v:'bCudN8yMi64', s:260, d:'0:50', t:'Síťovina patří do stěrky, ne pod ni', cat:'Armování'},
  {id:'t5', v:'JQsUyljbayE', s:90,  d:'0:45', t:'Nopovka bez lišty: voda za izolantem', cat:'Sokl', det:'nopova'},
  {id:'t6', v:'Yew7mJ6kQZM', s:230, d:'0:40', t:'Omítku nikdy nepřerušujte uprostřed stěny', cat:'Omítka'},
  {id:'t7', v:'Xzvpp_Q29Yc', s:150, d:'0:50', t:'Jak pověsit světlo na hotovou fasádu', cat:'Kotvení'},
  {id:'t8', v:'2SlGQlGqOak', s:40,  d:'0:45', t:'PIR deska, když není místo na silnou izolaci', cat:'Materiály'}
];
const tip = id => TIPS.find(t=>t.id===id);

/* ---------- učební cesty ---------- */
const PATHS = [
  {id:'svepomoc', t:'Zateplujete svépomocí', d:'Od přípravy po přejímku. Postup, detaily a váš projekt.', steps:[['course','zatepleni'],['detail','lepeni'],['detail','diagonaly'],['course','detaily'],['project']]},
  {id:'majitel', t:'Kontrolujete firmu', d:'Víte, na co se ptát a kam se při přejímce dívat.', steps:[['lesson','7DFgjeVmT1Y'],['detail','sokl'],['detail','osteni'],['lesson','Yub8roZU1T8'],['file','f5']]},
  {id:'fasadnik', t:'Jste fasádník', d:'Detaily a kotvení na úrovni, kterou ocení každý zákazník.', steps:[['course','detaily'],['course','kotveni'],['detail','hromosvod'],['detail','podbiti']]}
];

/* ---------- můj projekt (ukázkový) ---------- */
const PROJECT = {
  name:'Rodinný dům Novákovi', place:'Olomouc-Holice', role:'svepomoc', podklad:'Břízolit', area:182, openings:26, thick:160, ins:'Šedý EPS', grain:'1,5',
  phases:[
    {t:'Příprava', cond:'Suchý a soudržný podklad', tasks:[['p1','Postavit lešení s odstupem pro izolant'],['p2','Zakrýt okna, parapety a okolí domu'],['p3','Odtrhová zkouška břízolitu'],['p4','Oklepat nesoudržná místa a vyrovnat']], les:['9w69d0tfcNU','lcx6Xk41iSg'], files:['f2'], det:[]},
    {t:'Lepení izolantu', cond:'+5 až +25 °C, bez deště a přímého slunce', tasks:[['l1','Osadit soklový profil do roviny'],['l2','Lepit desky na vazbu, odspodu nahoru'],['l3','Po každé řadě zkontrolovat rovinu latí'],['l4','Spáry vyplnit izolantem nebo PUR pěnou, ne lepidlem'],['l5','Po zatvrdnutí přebrousit nerovnosti']], les:['etar5LJJeCY','Er5tVaQ3u2U'], files:['f3','f7'], det:['sokl','lepeni']},
    {t:'Kotvení', cond:'Lepidlo musí být zatvrdlé', tasks:[['k1','Počkat, až lepidlo zatvrdne'],['k2','Rozmístit hmoždinky podle schématu'],['k3','Zápustná montáž a zátky'],['k4','Osadit kotvicí prvky pro světla a hromosvod']], les:['gzl2szVtVQo','VqUMz2YFEPw','aEtE0ip0ZkM'], files:['f4','f11'], det:['hmozdinky','hromosvod']},
    {t:'Armování', cond:'+5 až +25 °C, bez deště', tasks:[['a1','Rohové lišty a okenní profily'],['a2','Diagonály v rozích otvorů'],['a3','Celoplošná stěrka se síťovinou'],['a4','Kontrola rovinnosti']], les:['bCudN8yMi64','iw0XkCWs-KY','5_gtUSrFs-Q'], files:['f9'], det:['diagonaly','osteni']},
    {t:'Omítka a přejímka', cond:'+5 až +25 °C, bez deště, větru a přímého slunce', tasks:[['o1','Penetrace podkladu'],['o2','Omítka v jednom záběru, stěna po stěně'],['o3','Přejímka podle kontrolního seznamu']], les:['Yew7mJ6kQZM','Yub8roZU1T8'], files:['f5'], det:[]}
  ]
};
const WEATHER = {city:'Olomouc', days:[
  {d:'Dnes', t:14, lo:6, ic:'part', ok:2, txt:'Ideální na lepení i armování.'},
  {d:'St', t:12, lo:5, ic:'rain', ok:0, txt:'Déšť od poledne. Stěrky ani omítky nedělejte.'},
  {d:'Čt', t:9, lo:3, ic:'cloud', ok:1, txt:'Ráno pod +5 °C. Začněte až dopoledne.'},
  {d:'Pá', t:13, lo:4, ic:'sun', ok:2, txt:'Vhodné. Omítky chraňte před přímým sluncem.'},
  {d:'So', t:15, lo:7, ic:'sun', ok:2, txt:'Vhodné na všechny práce.'}
]};
const DIARY = [
  {d:'Po 5. 10.', t:'Lepení severní strany, 3. až 6. řada', img:'Er5tVaQ3u2U', note:'Rovina v toleranci, u rohu přebrousit.'},
  {d:'Pá 2. 10.', t:'Soklový profil osazen po celém obvodu', img:'etar5LJJeCY', note:'Vodováhou zkontrolováno ve třech bodech.'},
  {d:'Čt 1. 10.', t:'Odtrhová zkouška břízolitu', img:'lcx6Xk41iSg', note:'Dvě místa oklepána, zbytek drží. Fotky poslány technikovi.', sent:true}
];

/* orientační spotřeby materiálu na m² (výrobci se liší) */
const CALC = {
  waste:1.05, board:.5, glue:4.5, skim:4.5, mesh:1.15, dowels:6, primer:.25, render:{'1,5':2.5,'2':3.0},
  packs:{glue:25, skim:25, mesh:50, dowels:100, primer:5, render:25}
};

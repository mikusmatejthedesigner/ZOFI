/* Videa z kanálu youtube.com/@zofifasady (převzato z prototypu). */
export type Video = {
  /** YouTube ID */
  v: string
  t: string
  /** délka m:ss */
  d: string
  desc: string
  /** existuje náhled v plném rozlišení */
  hq?: boolean
  /** zdarma i bez předplatného */
  free?: boolean
  isNew?: boolean
}

export const VIDEOS: Video[] = [
  {
    "v": "7DFgjeVmT1Y",
    "t": "Úvod do seriálu: co vás čeká",
    "d": "8:32",
    "hq": true,
    "free": true,
    "desc": "Jaký dům zateplujeme, jaký systém a materiál jsme zvolili a co všechno v seriálu uvidíte."
  },
  {
    "v": "9w69d0tfcNU",
    "t": "Příprava staveniště před zateplením",
    "d": "3:48",
    "hq": true,
    "desc": "Lešení, zakrytí oken a okolí domu, uskladnění materiálu. Co připravit dřív, než se otevře první pytel lepidla."
  },
  {
    "v": "lcx6Xk41iSg",
    "t": "Příprava břízolitového podkladu",
    "d": "4:34",
    "hq": true,
    "desc": "Jak zkontrolovat a připravit starý břízolit, aby na něm lepidlo spolehlivě drželo."
  },
  {
    "v": "Er5tVaQ3u2U",
    "t": "Lepení šedého polystyrenu lepicím tmelem",
    "d": "3:17",
    "hq": true,
    "free": true,
    "desc": "Nanesení lepicího tmelu po obvodu a v terčích, přiložení desky a kontrola roviny."
  },
  {
    "v": "gzl2szVtVQo",
    "t": "Zápustné kotvení polystyrenu hmoždinkou WKTHERM S8",
    "d": "7:12",
    "hq": true,
    "desc": "Rozmístění hmoždinek, zápustná montáž a zátky. Proč kotvit zápustně a na co si dát pozor."
  },
  {
    "v": "VqUMz2YFEPw",
    "t": "Frézování otvorů pro zápustnou montáž",
    "d": "2:07",
    "hq": true,
    "desc": "Frézování otvoru do polystyrenu kovovou frézkou ZOFITHERM."
  },
  {
    "v": "bCudN8yMi64",
    "t": "Armovací vrstva a stěrka",
    "d": "8:18",
    "hq": true,
    "desc": "Natažení stěrky, vložení síťoviny a kontrola rovinnosti vodováhou."
  },
  {
    "v": "iw0XkCWs-KY",
    "t": "Proč do armování patří diagonály",
    "d": "1:34",
    "hq": true,
    "desc": "Proč se v rozích otvorů vkládají diagonální výztuže a jak je osadit."
  },
  {
    "v": "Yew7mJ6kQZM",
    "t": "Natažení silikonové fasádní omítky",
    "d": "5:00",
    "hq": true,
    "desc": "Natažení a zatočení silikonové omítky, práce v záběrech a napojování."
  },
  {
    "v": "Yub8roZU1T8",
    "t": "Hotová fasáda: kontrola a předání",
    "d": "11:43",
    "desc": "Prohlídka hotové fasády a body, na které se při přejímce dívat."
  },
  {
    "v": "etar5LJJeCY",
    "t": "Založení fasády soklovým profilem LW-206",
    "d": "3:33",
    "desc": "Založení fasády soklovým profilem Likov LW-206 krok za krokem."
  },
  {
    "v": "ss8zz5Yg6WY",
    "t": "Založení fasády: hotová realizace",
    "d": "1:00",
    "hq": true,
    "desc": "Jak vypadá hotové založení fasády s profilem LW-206."
  },
  {
    "v": "JQsUyljbayE",
    "t": "Ukončení nopové fólie u zateplené fasády",
    "d": "9:59",
    "hq": true,
    "isNew": true,
    "desc": "Jak správně ukončit nopovou fólii u soklu zateplené fasády profilem ZOFITHERM LNF."
  },
  {
    "v": "IX-1IWWdTcQ",
    "t": "Mozaiková omítka na sokl",
    "d": "3:35",
    "desc": "Mozaiková omítka ZOFITHERM MOZAIK na sokl: kdy ji použít a jak ji nanést."
  },
  {
    "v": "5_gtUSrFs-Q",
    "t": "Okna a dveře: jaké profily použít a proč",
    "d": "6:10",
    "free": true,
    "desc": "Které profily patří kolem oken a dveří a proč právě na nich záleží nejvíc."
  },
  {
    "v": "dv5w8z7GOQA",
    "t": "Podbití střechy s OSB deskou a polystyrenem",
    "d": "8:04",
    "hq": true,
    "desc": "Úprava podbití střechy s OSB deskou, polystyrenem a omítkovým souvrstvím."
  },
  {
    "v": "Rk-BBlIEPWE",
    "t": "Podbití střechy deskou UNIPLATTE bez OSB",
    "d": "4:26",
    "desc": "Podbití střechy deskou Austrotherm UNIPLATTE ve variantě bez OSB desky."
  },
  {
    "v": "ZX89aaMajH4",
    "t": "Cihlová fasáda bez obkladu",
    "d": "6:21",
    "desc": "Omítka Ceresit CT 60 VISAGE a šablona s imitací cihly místo obkladu."
  },
  {
    "v": "WpDBIUGskFg",
    "t": "Hromosvod a trubky v zateplené fasádě",
    "d": "11:55",
    "hq": true,
    "desc": "Ukotvení hromosvodu a trubek do zateplené fasády držáky ZOFITHERM HP-PRO a HP-PRO T."
  },
  {
    "v": "aEtE0ip0ZkM",
    "t": "Držák hromosvodu bez tepelného mostu",
    "d": "8:28",
    "hq": true,
    "desc": "Montáž držáku hromosvodu ZOFITHERM HP do zateplení bez tepelných mostů."
  },
  {
    "v": "cXmpSogRKKY",
    "t": "Držák hromosvodu HP pro drát 8 mm",
    "d": "2:56",
    "hq": true,
    "isNew": true,
    "desc": "Držák hromosvodu ZOFITHERM HP pro drát o průměru 8 mm."
  },
  {
    "v": "Xzvpp_Q29Yc",
    "t": "Světla, schránky a kamery na fasádě",
    "d": "5:00",
    "desc": "Kotvení světel, schránek a kamer do zateplené fasády hmoždinkou ZOFITHERM HTI45."
  },
  {
    "v": "eQTPR0zh5_E",
    "t": "Kotvení izolace IsoFux Rocket EVOlution",
    "d": "4:55",
    "desc": "Rychlé a pevné kotvení izolace bez tepelných mostů."
  },
  {
    "v": "ojADyZqeGOE",
    "t": "Injektované kotvení izolantu",
    "d": "3:27",
    "hq": true,
    "desc": "Injektované kotvení fasádního izolantu systémem SPIRAL ANKSYS."
  },
  {
    "v": "PPLYiow1M0Q",
    "t": "SPIRAL ANKSYS u zateplovacích systémů",
    "d": "2:36",
    "desc": "Injektované kotvení u kontaktních zateplovacích systémů."
  },
  {
    "v": "KPtJJG9cmvo",
    "t": "Injektované kotvení provětrávaných fasád",
    "d": "2:36",
    "hq": true,
    "isNew": true,
    "desc": "Kotvení provětrávaných fasád systémem Spiral Anksys SA/PL60."
  },
  {
    "v": "2SlGQlGqOak",
    "t": "PIR desky pro tenké zateplení",
    "d": "6:14",
    "hq": true,
    "desc": "Kdy dává smysl PIR deska EUROPIR a proč se hodí tam, kde není místo na silnou izolaci."
  },
  {
    "v": "ZoKv93eH8ik",
    "t": "Trh s EPS v roce 2026",
    "d": "4:22",
    "free": true,
    "isNew": true,
    "desc": "Co se letos děje na trhu s EPS izolacemi a proč je těžké je sehnat."
  },
  {
    "v": "Jgf9IC6I0gU",
    "t": "Míchárna fasádních omítek v Olomouci",
    "d": "2:52",
    "hq": true,
    "free": true,
    "isNew": true,
    "desc": "Jak funguje míchárna fasádních omítek ZOFI a jak si nechat namíchat odstín."
  },
  {
    "v": "L-ietmDZFZ8",
    "t": "Nový katalog ZOFITHERM",
    "d": "2:46",
    "hq": true,
    "free": true,
    "isNew": true,
    "desc": "Co najdete v novém katalogu prvků ZOFITHERM pro zateplení fasád."
  }
]

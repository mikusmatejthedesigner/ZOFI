/* Kurzy (převzato z prototypu, rozdělení je zástupné). */
export type Chapter = { t: string; l: string[] }
export type Course = {
  id: string
  title: string
  short: string
  level: string
  cover: string
  desc: string
  forWho: string
  tag: string
  out: string[]
  chapters: Chapter[]
}

export const COURSES: Course[] = [
  {
    "id": "zatepleni",
    "title": "Zateplení rodinného domu krok za krokem",
    "short": "Zateplení krok za krokem",
    "level": "Pro začátečníky",
    "cover": "bCudN8yMi64",
    "desc": "Celý kontaktní zateplovací systém na jednom domě, od přípravy staveniště po hotovou omítku. V pořadí, v jakém se na stavbě opravdu pracuje.",
    "forWho": "Pro majitele domů a stavebníky, kteří chtějí zateplovat svépomocí nebo rozumět tomu, co jim na domě dělá firma.",
    "chapters": [
      {
        "t": "Příprava",
        "l": [
          "7DFgjeVmT1Y",
          "9w69d0tfcNU",
          "lcx6Xk41iSg"
        ]
      },
      {
        "t": "Izolant a kotvení",
        "l": [
          "Er5tVaQ3u2U",
          "gzl2szVtVQo",
          "VqUMz2YFEPw"
        ]
      },
      {
        "t": "Armovací vrstva",
        "l": [
          "bCudN8yMi64",
          "iw0XkCWs-KY"
        ]
      },
      {
        "t": "Omítka a předání",
        "l": [
          "Yew7mJ6kQZM",
          "Yub8roZU1T8"
        ]
      }
    ],
    "tag": "Deset lekcí, jeden skutečný dům. Od lešení po předání.",
    "out": [
      "Prověřit podklad a připravit staveniště",
      "Lepit desky tak, aby fasáda byla rovná",
      "Kotvit zápustně a bez tepelných mostů",
      "Udělat armovací vrstvu, která nepraská",
      "Natáhnout omítku bez viditelných napojení",
      "Zkontrolovat a převzít hotovou fasádu"
    ]
  },
  {
    "id": "detaily",
    "title": "Detaily, které rozhodují",
    "short": "Detaily, které rozhodují",
    "level": "Pokročilé",
    "cover": "dv5w8z7GOQA",
    "desc": "Místa, kde se fasády pokazí nejčastěji: sokl, okna a dveře, podbití střechy. Zblízka a bez spěchu.",
    "forWho": "Pro ty, kdo mají za sebou první fasádu, a pro fasádníky, kteří chtějí mít detaily vyřešené jednou provždy.",
    "chapters": [
      {
        "t": "Sokl",
        "l": [
          "etar5LJJeCY",
          "ss8zz5Yg6WY",
          "JQsUyljbayE",
          "IX-1IWWdTcQ"
        ]
      },
      {
        "t": "Okna a dveře",
        "l": [
          "5_gtUSrFs-Q"
        ]
      },
      {
        "t": "Podbití střechy",
        "l": [
          "dv5w8z7GOQA",
          "Rk-BBlIEPWE"
        ]
      },
      {
        "t": "Povrchy",
        "l": [
          "ZX89aaMajH4"
        ]
      }
    ],
    "tag": "Sokl, okna a střecha. Místa, kde se rozhoduje o životnosti fasády.",
    "out": [
      "Založit fasádu na soklovém profilu do roviny",
      "Ukončit nopovou fólii, aby za ni nezatékalo",
      "Napojit fasádu na okna přes připojovací profil",
      "Vyřešit podbití střechy jako součást fasády",
      "Udělat sokl odolný vodě a nečistotám"
    ]
  },
  {
    "id": "kotveni",
    "title": "Kotvení do zateplené fasády",
    "short": "Kotvení do fasády",
    "level": "Pro fasádníky",
    "cover": "WpDBIUGskFg",
    "desc": "Hromosvody, světla, schránky a samotný izolant. Jak kotvit pevně a bez tepelných mostů.",
    "forWho": "Pro realizační firmy, elektrikáře a každého, kdo potřebuje něco pověsit na hotovou fasádu.",
    "chapters": [
      {
        "t": "Hromosvod",
        "l": [
          "WpDBIUGskFg",
          "aEtE0ip0ZkM",
          "cXmpSogRKKY"
        ]
      },
      {
        "t": "Prvky na fasádě",
        "l": [
          "Xzvpp_Q29Yc"
        ]
      },
      {
        "t": "Kotvení izolantu",
        "l": [
          "eQTPR0zh5_E",
          "ojADyZqeGOE",
          "PPLYiow1M0Q",
          "KPtJJG9cmvo"
        ]
      }
    ],
    "tag": "Všechno, co se na fasádu věší. Pevně a bez tepelných mostů.",
    "out": [
      "Ukotvit hromosvod a trubky do zateplení",
      "Pověsit světla, schránky a kamery na hotovou fasádu",
      "Vybrat správný způsob kotvení izolantu",
      "Použít injektované kotvení tam, kde hmoždinka nestačí"
    ]
  }
]

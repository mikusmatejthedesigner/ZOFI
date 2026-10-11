# ZOFI: marketing (videa, texty, Fasádní akademie)

Uživatel dělá marketing pro ZOFI (zateplování fasád, Olomouc). Komunikace česky, vykání, stručně.

## Složka

- `01 Videa/` — každé video má svou číslovanou složku (`01 EUROPIR`, `02 EPS GREY`, …):
  - nahoře hotová verze `<NÁZEV>-v<verze>-s-titulky.mp4`, titulky `.srt` a texty `<NÁZEV>-texty.md` (verze bez titulků jen na požádání)
  - `Podklady/`: zdrojové video, vizualizace, odkaz na produkt
  - `Starší verze/`: předchozí verze (přesouvá je `render-video.sh`)
  - promo aplikace je v `Promo Fasádní akademie/`
- `02 Manuály/` — `Manual-videi-ZOFI.md`, `Manual-videi-ZOFI-prvky.jpg`, `Styl-komunikace-ZOFI.md`, `Prehled-firmy-ZOFI.md`
- `03 Fasádní akademie/` — prototyp webu a aplikace (`index.html`, `app.html`, `shared/`, `Starší verze/`)
- `technika/` — Remotion projekt videí (knihovna prvků `src/zofi/`, návrhy nových prvků před schválením `src/zofi-navrhy/`, videa `src/videos/<slug>/`, skripty `scripts/`). Uživatel sem nesahá.

## Postupy

- **Videa** (reels, YouTube Shorts): skill `zofi-video`, pravidla v `02 Manuály/Manual-videi-ZOFI.md`.
- **Texty** (názvy a popisky YouTube Shorts, texty ve videích, odpovědi): skill `zofi-texty`, styl v `02 Manuály/Styl-komunikace-ZOFI.md`, podklady a kontrola `technika/scripts/yt-text.mjs`.
- **Fasádní akademie:** náhled přes `.claude/launch.json` (akademie) nebo dvojklik na `index.html`.

Neměnit schválený styl bez souhlasu. Nepublikovat nic za ZOFI bez rozhodnutí uživatele. Technické údaje ve videích a textech označit k ověření technikem.

## Platforma Fasádní akademie (tento repozitář)

Vlastní placená platforma na videokurzy ZOFI, náhrada za Herohero, Patreon a členství na YouTube (bez jejich poplatků a s plnou kontrolou). Videa s hodnotou, která nechceme dávat na YouTube zdarma, jsou rozdělená do kurzů za paywallem.

- **Dvě části:** prodejní web na `/` (musí zákazníkovi aplikaci prodat, animovaný, moderní) a aplikace na `/app` (přehledná a jednoduchá jako od Apple). „Přihlásit se“ vede z webu rovnou do aplikace.
- **Vzhled:** Apple styl. Barvy a typografie v `src/styles/base.css` (vychází z `prototyp/shared/base.css`), písmo systémové, jinde Inter. Aplikace má světlý i tmavý režim podle systému, web ne.
- **Stav:** prototyp. Přihlášení, platby a předplatné jen vypadají jako skutečné. Průběh lekcí se ukládá do prohlížeče (`src/lib/progress.ts`). Videa jsou z YouTube (`youtube-nocookie.com`). Pro skutečný paywall budou potřeba neveřejná videa jinde (např. Bunny Stream, Mux, Cloudflare Stream).
- **Obsah:** `src/data/` (videa, kurzy, okamžiky a hlavní body lekcí) převzatý z prototypu. Rozdělení do kurzů, ceny a okamžiky ve videích jsou zástupné. Texty vrstev fasády a hlavních bodů ověřit s technikem.
- **Struktura:** `src/web/` (sekce webu, `web.css`), `src/app/` (rozvržení, `pages/`, `app.css`), `src/components/reactbits/` (převzaté a upravené komponenty React Bits), `src/lib/` (Lenis, česká typografie, průběh).
- **Technika:** Vite + React + TypeScript, React Router, ikony lucide-react, animace GSAP (`gsap`, `@gsap/react`, ScrollTrigger, SplitText), plynulý scroll Lenis jen na webu (`src/lib/smooth-scroll.ts`). React Bits není balíček: komponenty se kopírují jednotlivě (`npx shadcn@latest add @react-bits/<Název>-<JS|TS>-<CSS|TW>`, případně z github.com/DavidHDev/react-bits), licence MIT + Commons Clause.
- **Magic UI** (magicui.design, MIT): 76 komponent zkopírovaných z github.com/magicuidesign/magicui do `src/components/magicui/` (+ `src/components/ui/` s Button a ScrollArea). Importují se přes alias `@/` (`import { Marquee } from '@/components/magicui/marquee'`). Chybí tweet-card, client-tweet-card a code-comparison (potřebují Next.js/server). Další přidává `npx shadcn@latest add @magicui/<název>` (je připravený `components.json`) nebo kopie ze zdrojového repozitáře. Komponenty jsou vyřazené z lintu.
- **Tailwind CSS v4** je přidaný jen kvůli Magic UI, **bez resetu (preflight)**: `src/styles/magicui.css` (tokeny ZOFI v názvech shadcn, animace a keyframes). Utility jsou mimo `@layer`, takže vyhrají nad vlastními styly. Pozor na kolize názvů vlastních tříd s Tailwindem (už se stalo u `.ring`, přejmenováno na `.pring`). Tailwind skenuje všechny komponenty, takže CSS je zatím o ~70 kB větší. Po výběru konkrétních komponent nepoužité smazat.
- **Česká typografie:** `useCzechTypography` doplní nezlomitelné mezery za jednopísmenné předložky. Text, který se dál dělí na slova (SplitText, ScrollReveal), předem projít funkcí `cz()`.
- **`prototyp/`:** původní statický prototyp (`index.html`, `app.html`, `shared/`). Slouží jen jako reference, nestavíme na něm.
- **Příkazy:** `npm run dev` (vývoj), `npm run build`, `npm run lint`. Hosting jako SPA (`public/_redirects` pro Netlify).

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

- **Dvě části:** prodejní web (musí zákazníkovi aplikaci prodat) a aplikace. Tlačítko přihlášení vede z webu rovnou do aplikace.
- **Vzhled:** Apple styl, čistá a praktická aplikace. Barvy a typografie z `prototyp/shared/base.css`.
- **Stav:** zatím jen prototyp, nic nemá fungovat doopravdy (přihlášení, platby, videa).
- **Technika:** Vite + React + TypeScript, animace GSAP (`gsap`, `@gsap/react`), plynulý scroll Lenis (`src/lib/smooth-scroll.ts`). React Bits není balíček: komponenty se kopírují jednotlivě (`npx shadcn@latest add @react-bits/<Název>-<JS|TS>-<CSS|TW>`), licence MIT + Commons Clause.
- **`prototyp/`:** původní statický prototyp (`index.html`, `app.html`, `shared/`). Slouží jen jako reference, nestavíme na něm.
- **Příkazy:** `npm run dev` (vývoj), `npm run build`, `npm run lint`.

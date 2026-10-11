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
- **Aplikace jako YouTube nebo Apple TV:** obsah je hlavní, ovládání ustupuje. Nic není postavené na konkrétním počtu videí: řady se posouvají do strany, mřížky mají tolik sloupců, kolik se vejde, témata a kurzy se berou z dat.
- **Rozvržení** (`AppRoutes.tsx`): horní lišta (logo, hledání uprostřed, avatar = účet) a úzký pruh vlevo se 4 místy: Domů, Videa, Kurzy, Knihovna. Na mobilu (pod 860 px) místo pruhu spodní lišta se stejnými 4 místy. Hledání (`Search.tsx`, ⌘K nebo „/“): našeptávač s videi a lekcemi, šipky vyberou, Enter bez výběru otevře všechny výsledky (`/app/hledat?q=`).
- **Stavební kameny** (`ui.tsx`): jedna karta videa `VCard` (náhled, název, jeden řádek popisku, tenký pruh průběhu), jedna karta kurzu `CCard` (plakát s názvem), vodorovná řada `Shelf` (posun šipkami i prstem, počet viditelných karet podle šířky přes container queries), velký banner `Feature` (střídá zvýrazněné položky), řádek `VRow`.
- **Stránky:**
  - **Domů** (`/app`, `Home.tsx`): banner (nejnovější video, rozkoukaný kurz), řady Pokračovat ve sledování, Nová videa, Kurzy, řada pro každé téma a pro každý kurz.
  - **Videa** (`/app/videa`, `Videos.tsx`): samostatná videa mimo kurzy, čipy témat (`?tema=`) a mřížka, nejnovější první. Data v `src/data/feed.ts` (datum, téma, počty, ukázkové komentáře jsou zástupné).
  - **Kurzy** (`/app/kurzy`, `Courses.tsx`): plakáty kurzů. **Kurz** (`/app/kurzy/<kurz>`, `CourseDetail.tsx`) jako stránka seriálu: velký úvod s tlačítkem Pokračovat a lekce po kapitolách jako epizody.
  - **Video a lekce** (`Watch.tsx`, `/app/videa/<id>` i `/app/kurzy/<kurz>/<id>`): jedna stránka jako na YouTube. Přehrávač, název, Líbí se, Uložit, Sdílet (u lekce Další lekce), popis s hlavními body a kapitolami (klepnutí skočí ve videu). Vpravo u lekce seznam lekcí kurzu, u videa další videa. Komentáře jen u samostatných videí.
  - **Knihovna** (`/app/knihovna`, `Library.tsx`): Uložené a Historie. Starý odkaz `/app/ulozene` přesměruje.
  - Video patří buď do kurzu, nebo do Videí. Správnou adresu vrací `videoHref(id)`. Starý odkaz `/app/lekce/<id>` přesměruje.
- **Vzhled aplikace** (`src/app/app.css`): tokeny pro světlý i tmavý režim, tlačítka `.b` (`.b-pill`, `.b-primary`, `.b-light`, `.b-glass`, `.b-lg`), žádné rámečky a počty navíc. Přechod mezi stránkami jemné prolnutí (GSAP), vše respektuje „omezit pohyb“.
- **Vzhled:** Apple styl. Barvy a typografie v `src/styles/base.css` (vychází z `prototyp/shared/base.css`), písmo systémové, jinde Inter. Aplikace má světlý i tmavý režim podle systému, web ne.
- **Stav:** prototyp. Přihlášení, platby a předplatné jen vypadají jako skutečné. Průběh lekcí se ukládá do prohlížeče (`src/lib/progress.ts`). Videa jsou z YouTube (`youtube-nocookie.com`). Pro skutečný paywall budou potřeba neveřejná videa jinde (např. Bunny Stream, Mux, Cloudflare Stream).
- **Obsah:** `src/data/` (videa, kurzy, okamžiky a hlavní body lekcí) převzatý z prototypu. Rozdělení do kurzů, ceny a okamžiky ve videích jsou zástupné. Texty vrstev fasády a hlavních bodů ověřit s technikem.
- **Web prodává aplikaci** (`src/web/Landing.tsx`), pořadí sekcí: úvod, čísla, aplikace naživo, výrok, prohlídka řezu fasádou, kurzy, kotvení ZOFITHERM, stěna videí, pro koho, srovnání, ceník, otázky, závěr.
- **Aplikace naživo** (`AppTour.tsx`, `#aplikace`): připnutá sekce se 6 kroky (hledání, kapitoly a další lekce, pokračování z Domů, uložení do Knihovny, řady videí v tmavém režimu, mobil). V okně notebooku a telefonu běží **skutečná aplikace** (`demo.html` → `src/demo/main.tsx`, MemoryRouter) a scénář `src/demo/director.ts` ji ovládá kurzorem: píše do hledání, kliká, přepíná záložky. Web volá `iframe.contentWindow.zofiDemo.play('<scéna>')`, scéna běží dokola. V ukázce je průběh jen v paměti (`__ZOFI_DEMO__` v `progress.ts`, nesahá na skutečný průběh), přehrávač nenačítá YouTube (`playerDemo` v `app/hooks.ts`) a tmavý režim se vynutí třídou `theme-dark` na `<html>` (`app.css`). Na mobilu jen telefon a popisek kroku. Při změně aplikace zkontrolovat, že selektory ve scénáři sedí.
- **Build má dvě vstupní stránky** (`vite.config.ts`, `build.rolldownOptions.input`): `index.html` a `demo.html`.
- **Úvod** (`Hero.tsx`): nabídka a tlačítka, pod nimi okno prohlížeče s aplikací (obrazovka Domů ve stejném vzhledu jako skutečná aplikace, banner má jako náhled render ZOFITHERM). Z okna vystupuje živý 3D talíř ZOFITHERM, naklání se za myší a při scrollu se natáčí. Bez WebGL nebo při „omezit pohyb“ se místo 3D ukáže render talíře.
- **3D talíř ZOFITHERM** (`src/web/washer/`): procedurální model podle renderu výrobce (`geometry.ts`: zvlněný okraj s 8 výřezy, dvě řady trnů, límec, 6 otvorů a žebra, zápustný kužel), lesklý plast ve studiovém světle bez stahování HDR (`WasherScene.tsx`, three.js + React Three Fiber + drei, načítá se líně). Režim `hero` (úvod) a `inspect` (sekce Kotvení, otáčení tažením myší). Model je jen vizuální, ne technický výkres.
- **Prohlídka řezu fasádou** (`FacadeTour.tsx`, `tour.ts`, `#vrstvy`): připnutá sekce, kamera jede po skutečném renderu řezu (`src/assets/renders/rez-fasady-*.webp`) přes 7 zastávek (podklad, založení, izolant, zápustné kotvení, armování, omítka, sokl). U každé vrstvy krátký text a odkaz na konkrétní lekci nebo video v aplikaci. Na mobilu jen karta aktuální vrstvy, při „omezit pohyb“ celý řez a seznam. Texty vrstev ověřit s technikem.
- **Kotvení** (`Anchoring.tsx`, `#kotveni`): 3D model s přepínačem Spirálová kotva / Talíř ZOFITHERM (otáčení tažením myší) a 4 rendery z praxe (hromosvod, prvky na fasádě, dřevostavba, beton) s odkazy na lekce a kurz Kotvení. Spirálová kotva je procedurální model v `washer/anchor.ts` (šroubovitý závit, EPDM podložka, matice, závitová tyč). Popisky renderů ověřit s technikem.
- **Rendery** od uživatele jsou v `src/assets/renders/` jako WebP (zmenšené, originály nejsou v repozitáři).
- **Další efekty webu:** 3D stěna všech videí (`VideoWall`), naklánění karet kurzů, ShimmerButton a BorderBeam v ceníku i úvodu, Particles v závěru. Sekce Bento je zrušená (nahradila ji Aplikace naživo). Po změně výšky obsahu (náhled aplikace, písmo) se volá `ScrollTrigger.refresh()`, jinak by připnuté sekce jely posunutě.
- **Struktura:** `src/web/` (sekce webu, `web.css`, `washer/` 3D talíř a kotva), `src/demo/` (ukázka aplikace pro web), `src/app/` (rozvržení, `pages/`, `app.css`), `src/components/reactbits/` (převzaté a upravené komponenty React Bits), `src/lib/` (Lenis, česká typografie, průběh).
- **Technika:** Vite + React + TypeScript, React Router, ikony lucide-react, animace GSAP (`gsap`, `@gsap/react`, ScrollTrigger, SplitText), 3D three.js + `@react-three/fiber` + `@react-three/drei`, plynulý scroll Lenis jen na webu (`src/lib/smooth-scroll.ts`). React Bits není balíček: komponenty se kopírují jednotlivě (`npx shadcn@latest add @react-bits/<Název>-<JS|TS>-<CSS|TW>`, případně z github.com/DavidHDev/react-bits), licence MIT + Commons Clause.
- **Magic UI** (magicui.design, MIT): 76 komponent zkopírovaných z github.com/magicuidesign/magicui do `src/components/magicui/` (+ `src/components/ui/` s Button a ScrollArea). Importují se přes alias `@/` (`import { Marquee } from '@/components/magicui/marquee'`). Chybí tweet-card, client-tweet-card a code-comparison (potřebují Next.js/server). Další přidává `npx shadcn@latest add @magicui/<název>` (je připravený `components.json`) nebo kopie ze zdrojového repozitáře. Komponenty jsou vyřazené z lintu.
- **Tailwind CSS v4** je přidaný jen kvůli Magic UI, **bez resetu (preflight)**: `src/styles/magicui.css` (tokeny ZOFI v názvech shadcn, animace a keyframes). Utility jsou mimo `@layer`, takže vyhrají nad vlastními styly. Pozor na kolize názvů vlastních tříd s Tailwindem (už se stalo u `.ring`) i mezi `web.css` a `app.css`: oba soubory zůstanou načtené po přechodu z webu do aplikace a zpět (proto `.ctile` místo webového `.ccard` a styly sdíleného `.thumb` v aplikaci jen pod `.app`). Tailwind skenuje všechny komponenty, takže CSS je zatím o ~70 kB větší. Po výběru konkrétních komponent nepoužité smazat.
- **Česká typografie:** `useCzechTypography` doplní nezlomitelné mezery za jednopísmenné předložky. Text, který se dál dělí na slova (SplitText, ScrollReveal), předem projít funkcí `cz()`.
- **`prototyp/`:** původní statický prototyp (`index.html`, `app.html`, `shared/`). Slouží jen jako reference, nestavíme na něm.
- **Příkazy:** `npm run dev` (vývoj), `npm run build`, `npm run lint`. Hosting jako SPA (`public/_redirects` pro Netlify).

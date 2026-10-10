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

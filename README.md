# FinTrak – Správce osobních financí

Pololetní projekt – webová aplikace pro sledování příjmů a výdajů.

## O projektu

FinTrak je jednostránková aplikace (SPA) pro správu osobních financí. Umožňuje přidávat, upravovat a mazat transakce, organizovat je do kategorií a sledovat přehled příjmů a výdajů v čase.

## Funkce

- **Přehled (Dashboard)** – souhrnné statistiky (zůstatek, celkové příjmy, výdaje) a sloupcový SVG graf vývoje za posledních 6 měsíců
- **Transakce** – přehledný seznam všech transakcí s vyhledáváním, filtrováním (typ, kategorie) a řazením
- **Formulář transakce** – modální okno pro přidání nebo úpravu transakce (typ, popis, částka, datum, kategorie, poznámka) s validací
- **Kategorie** – správa kategorií s výběrem ikony a barvy
- **Perzistence dat** – vše uloženo v `localStorage`, data přežijí obnovu stránky

## Technologie

- **TypeScript** – statická typová kontrola v celém projektu
- **React 19** – funkcionální komponenty a hooky
- **Vite** – rychlý vývojový server a build nástroj
- **CSS** – vlastní styly bez externích UI knihoven

## Spuštění

```bash
npm install
npm run dev
```

Nebo build pro produkci:

```bash
npm run build
npm run preview
```

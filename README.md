# Ledger — Crypto Market Dashboard

A live cryptocurrency dashboard with sortable market data, watchlists, sparklines, and
price history charts. Built with React, Vite, Tailwind CSS, and Recharts, pulling
real-time data from the public CoinGecko API.

**[Live demo →](#)** https://ledger-crypto-market-dashboard.onrender.com/

## Features

- **Live market data** for the top 50 coins by market cap (CoinGecko API, no key required)
- **Sortable table** — click any column header (price, 24h %, market cap) to sort
- **Search** with debounced input, filtering by name or symbol
- **Watchlist** — star coins to track, persisted to `localStorage`, with a dedicated filter view
- **Sparklines** — 7-day inline price trend per coin, colored by direction
- **Detail view** — click any coin for a larger chart with 24H / 7D / 30D ranges (Recharts)
- **Auto-refresh** every 60 seconds, toggleable, with a live "last updated" indicator
- **Robust states** — loading skeletons, an explicit error state with retry (including
  rate-limit handling), and empty states for no-results/empty-watchlist
- **Dark / light mode** — respects system preference, remembers your choice
- **Fully responsive** — sortable table on desktop, card list on mobile

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 19 |
| Build tool | Vite |
| Styling | Tailwind CSS 3 |
| Charts | Recharts |
| Data | [CoinGecko API](https://www.coingecko.com/en/api) (public, no auth) |
| Icons | Lucide React |



## Project structure

```
src/
├── components/
│   ├── Toolbar.jsx           # Search, watchlist filter, auto-refresh, theme toggle
│   ├── CoinTable.jsx         # Sortable desktop table with sparklines
│   ├── CoinCards.jsx         # Mobile card list
│   ├── CoinDetailModal.jsx   # Price chart with selectable ranges
│   ├── Sparkline.jsx         # Lightweight inline SVG sparkline
│   ├── TableSkeleton.jsx     # Loading state
│   └── ErrorState.jsx        # Error + retry state
├── hooks/
│   ├── useCoins.js           # Fetching, polling, error handling
│   ├── useWatchlist.js       # localStorage-backed watchlist
│   ├── useDebounce.js        # Debounced search input
│   └── useDarkMode.js        # Theme toggle + system preference
├── App.jsx                   # Sorting/filtering logic, layout
└── index.css                 # Design tokens, skeleton & pulse animations
```

## Design notes

The visual language borrows from trading terminals: a dark, near-navy base palette,
monospace figures for anything numeric (prices, percentages, market caps), and a
strict green/red signal pair for price direction rather than arbitrary accent colors.
A pulsing dot next to the "last updated" timestamp signals the live auto-refresh state.

## API notes

This app calls CoinGecko's public API directly from the client. The free tier is
rate-limited — if you refresh very frequently you may see a "rate limited" error
state, which is handled explicitly rather than failing silently.

## Deploying

Static Vite build — deploys to any static host:

- **Vercel**: import the repo, framework preset "Vite", no config needed
- **Netlify**: build command `npm run build`, publish directory `dist`
- **Render**: build command `npm install && npm run build`, publish directory `dist`

## License

MIT

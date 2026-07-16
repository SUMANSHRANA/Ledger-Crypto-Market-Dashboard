import { Moon, RefreshCw, Search, Star, Sun } from 'lucide-react';

function formatTimeAgo(ts) {
  if (!ts) return '—';
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 5) return 'just now';
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  return `${mins}m ago`;
}

export default function Toolbar({
  search,
  setSearch,
  showWatchlistOnly,
  setShowWatchlistOnly,
  watchlistCount,
  autoRefresh,
  setAutoRefresh,
  lastUpdated,
  onRefresh,
  isRefreshing,
  dark,
  setDark,
}) {
  return (
    <div className="border-b border-mist-200 dark:border-base-700 bg-white/80 dark:bg-base-900/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 mr-2">
          <svg width="22" height="22" viewBox="0 0 64 64" className="shrink-0">
            <rect width="64" height="64" rx="12" fill="#161C25" />
            <polyline points="12,42 22,34 30,40 40,20 52,26" fill="none" stroke="#3ECF8E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 className="font-mono font-semibold text-base-900 dark:text-mist-50 text-lg tracking-tight">Ledger</h1>
        </div>

        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-base-900/30 dark:text-mist-200/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coins…"
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md bg-mist-100 dark:bg-base-800 border border-mist-200 dark:border-base-600 text-base-900 dark:text-mist-50 placeholder:text-base-900/30 dark:placeholder:text-mist-200/30 focus:outline-none focus:ring-1 focus:ring-signal-up"
          />
        </div>

        <button
          onClick={() => setShowWatchlistOnly(!showWatchlistOnly)}
          className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide px-3 py-1.5 rounded-md border transition-colors ${
            showWatchlistOnly
              ? 'bg-amber-400/15 border-amber-400 text-amber-500 dark:text-amber-400'
              : 'border-mist-200 dark:border-base-600 text-base-900/60 dark:text-mist-200/60 hover:border-amber-400/60'
          }`}
        >
          <Star size={12} className={showWatchlistOnly ? 'fill-amber-400' : ''} />
          Watchlist {watchlistCount > 0 && `(${watchlistCount})`}
        </button>

        <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide text-base-900/60 dark:text-mist-200/60 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="accent-signal-up"
          />
          Auto-refresh
        </label>

        <div className="flex items-center gap-2 ml-auto">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-base-900/40 dark:text-mist-200/40">
            {autoRefresh && <span className="live-dot w-1.5 h-1.5 rounded-full bg-signal-up inline-block" />}
            Updated {formatTimeAgo(lastUpdated)}
          </div>
          <button
            onClick={onRefresh}
            aria-label="Refresh now"
            className="p-1.5 rounded-md text-base-900/60 dark:text-mist-200/60 hover:text-signal-up hover:bg-mist-100 dark:hover:bg-base-800 transition-colors"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle color theme"
            className="p-1.5 rounded-md text-base-900/60 dark:text-mist-200/60 hover:bg-mist-100 dark:hover:bg-base-800 transition-colors"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}

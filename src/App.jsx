import { useMemo, useState } from 'react';
import Toolbar from './components/Toolbar';
import CoinTable from './components/CoinTable';
import CoinCards from './components/CoinCards';
import TableSkeleton from './components/TableSkeleton';
import ErrorState from './components/ErrorState';
import CoinDetailModal from './components/CoinDetailModal';
import { useCoins } from './hooks/useCoins';
import { useWatchlist } from './hooks/useWatchlist';
import { useDebounce } from './hooks/useDebounce';
import { useDarkMode } from './hooks/useDarkMode';

export default function App() {
  const [dark, setDark] = useDarkMode();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' });
  const [selectedCoin, setSelectedCoin] = useState(null);

  const { coins, status, errorMessage, lastUpdated, refetch } = useCoins({ autoRefresh });
  const { watchlist, toggle, isWatched } = useWatchlist();

  function handleSort(key) {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'desc' };
    });
  }

  const visibleCoins = useMemo(() => {
    let list = coins;

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q));
    }

    if (showWatchlistOnly) {
      list = list.filter(c => watchlist.includes(c.id));
    }

    const sorted = [...list].sort((a, b) => {
      const { key, direction } = sortConfig;
      let aVal = a[key];
      let bVal = b[key];
      if (key === 'name') {
        aVal = aVal?.toLowerCase() ?? '';
        bVal = bVal?.toLowerCase() ?? '';
        return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      aVal = aVal ?? 0;
      bVal = bVal ?? 0;
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return sorted;
  }, [coins, debouncedSearch, showWatchlistOnly, watchlist, sortConfig]);

  return (
    <div className="min-h-screen bg-mist-50 dark:bg-base-950">
      <Toolbar
        search={search}
        setSearch={setSearch}
        showWatchlistOnly={showWatchlistOnly}
        setShowWatchlistOnly={setShowWatchlistOnly}
        watchlistCount={watchlist.length}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        lastUpdated={lastUpdated}
        onRefresh={refetch}
        isRefreshing={status === 'loading'}
        dark={dark}
        setDark={setDark}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {status === 'loading' && <TableSkeleton />}

        {status === 'error' && <ErrorState message={errorMessage} onRetry={refetch} />}

        {status === 'success' && visibleCoins.length === 0 && (
          <div className="text-center py-16 text-sm text-base-900/40 dark:text-mist-200/40 font-mono">
            {showWatchlistOnly
              ? 'Your watchlist is empty. Star a coin to add it here.'
              : 'No coins match your search.'}
          </div>
        )}

        {status === 'success' && visibleCoins.length > 0 && (
          <>
            <div className="hidden md:block">
              <CoinTable
                coins={visibleCoins}
                sortConfig={sortConfig}
                onSort={handleSort}
                isWatched={isWatched}
                toggleWatch={toggle}
                onSelectCoin={setSelectedCoin}
              />
            </div>
            <div className="md:hidden">
              <CoinCards
                coins={visibleCoins}
                isWatched={isWatched}
                toggleWatch={toggle}
                onSelectCoin={setSelectedCoin}
              />
            </div>
          </>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 md:px-6 py-6 text-center">
        <p className="text-[11px] font-mono text-base-900/30 dark:text-mist-200/25 tracking-wide">
          Data from CoinGecko · Developed by <span className="text-base-900/50 dark:text-mist-200/45 font-medium">Sumansh Rana</span>
        </p>
      </footer>

      <CoinDetailModal
        coin={selectedCoin}
        onClose={() => setSelectedCoin(null)}
        isWatched={isWatched}
        toggleWatch={toggle}
      />
    </div>
  );
}

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'ledger.watchlist.v1';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const toggle = useCallback((coinId) => {
    setWatchlist(prev =>
      prev.includes(coinId) ? prev.filter(id => id !== coinId) : [...prev, coinId]
    );
  }, []);

  const isWatched = useCallback((coinId) => watchlist.includes(coinId), [watchlist]);

  return { watchlist, toggle, isWatched };
}

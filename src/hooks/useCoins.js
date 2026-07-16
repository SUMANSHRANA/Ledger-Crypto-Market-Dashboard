import { useCallback, useEffect, useRef, useState } from 'react';

const MARKETS_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h';

const REFRESH_INTERVAL_MS = 60_000;

export function useCoins({ autoRefresh }) {
  const [coins, setCoins] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchCoins = useCallback(async ({ silent } = {}) => {
    if (!silent) setStatus('loading');
    try {
      const res = await fetch(MARKETS_URL);
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('Rate limited by the API. Wait a moment and retry.');
        }
        throw new Error(`Request failed (${res.status})`);
      }
      const data = await res.json();
      setCoins(data);
      setStatus('success');
      setErrorMessage('');
      setLastUpdated(Date.now());
    } catch (err) {
      setErrorMessage(
        err instanceof TypeError
          ? 'Network error — check your connection and try again.'
          : err.message || 'Something went wrong fetching market data.'
      );
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  useEffect(() => {
    if (!autoRefresh) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      fetchCoins({ silent: true });
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, fetchCoins]);

  return {
    coins,
    status,
    errorMessage,
    lastUpdated,
    refetch: () => fetchCoins(),
  };
}

export async function fetchCoinHistory(coinId, days = 7) {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load chart data (${res.status})`);
  const data = await res.json();
  return data.prices.map(([timestamp, price]) => ({ timestamp, price }));
}

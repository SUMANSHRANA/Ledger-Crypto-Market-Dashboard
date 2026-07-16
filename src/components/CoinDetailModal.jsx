import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDown, ArrowUp, Star, X } from 'lucide-react';
import { fetchCoinHistory } from '../hooks/useCoins';

const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

const RANGES = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="bg-white dark:bg-base-800 border border-mist-200 dark:border-base-600 rounded-md px-2.5 py-1.5 text-xs font-mono shadow-lg">
      <p className="text-base-900 dark:text-mist-50">{currencyFmt.format(point.price)}</p>
      <p className="text-base-900/40 dark:text-mist-200/40">
        {new Date(point.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
}

export default function CoinDetailModal({ coin, onClose, isWatched, toggleWatch }) {
  const [range, setRange] = useState(7);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!coin) return;
    let cancelled = false;
    setStatus('loading');
    fetchCoinHistory(coin.id, range)
      .then((data) => {
        if (!cancelled) {
          setHistory(data);
          setStatus('success');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => { cancelled = true; };
  }, [coin, range]);

  if (!coin) return null;

  const positive = (coin.price_change_percentage_24h ?? 0) >= 0;
  const watched = isWatched(coin.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-base-950/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-base-900 border border-mist-200 dark:border-base-700 rounded-lg shadow-2xl p-5"
      >
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <img src={coin.image} alt="" width={32} height={32} className="rounded-full" />
            <div>
              <h3 className="font-mono font-semibold text-base-900 dark:text-mist-50">{coin.name}</h3>
              <p className="text-[11px] font-mono text-base-900/40 dark:text-mist-200/40 uppercase">{coin.symbol}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleWatch(coin.id)}
              className={watched ? 'text-amber-400 p-1' : 'text-base-900/30 dark:text-mist-200/30 p-1 hover:text-amber-400'}
              aria-label="Toggle watchlist"
            >
              <Star size={17} className={watched ? 'fill-amber-400' : ''} />
            </button>
            <button onClick={onClose} className="text-base-900/40 dark:text-mist-200/40 hover:text-base-900 dark:hover:text-mist-50 p-1" aria-label="Close">
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-3 mb-4">
          <span className="font-mono text-2xl font-semibold text-base-900 dark:text-mist-50">
            {currencyFmt.format(coin.current_price)}
          </span>
          <span className={`font-mono text-sm inline-flex items-center gap-0.5 ${positive ? 'text-signal-up' : 'text-signal-down'}`}>
            {positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(coin.price_change_percentage_24h ?? 0).toFixed(2)}% (24h)
          </span>
        </div>

        <div className="flex gap-1.5 mb-3">
          {RANGES.map(r => (
            <button
              key={r.days}
              onClick={() => setRange(r.days)}
              className={`text-[11px] font-mono uppercase tracking-wide px-2.5 py-1 rounded-md border transition-colors ${
                range === r.days
                  ? 'bg-signal-up/15 border-signal-up text-signal-up'
                  : 'border-mist-200 dark:border-base-600 text-base-900/50 dark:text-mist-200/50'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="h-52">
          {status === 'loading' && (
            <div className="w-full h-full skeleton rounded-md" />
          )}
          {status === 'error' && (
            <div className="w-full h-full flex items-center justify-center text-sm text-base-900/40 dark:text-mist-200/40 font-mono">
              Couldn't load chart data.
            </div>
          )}
          {status === 'success' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                <XAxis dataKey="timestamp" hide />
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={positive ? '#3ECF8E' : '#F2545B'}
                  strokeWidth={1.75}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-mist-200 dark:border-base-700">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wide text-base-900/40 dark:text-mist-200/40">Market Cap</p>
            <p className="font-mono text-sm text-base-900 dark:text-mist-50">${coin.market_cap?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wide text-base-900/40 dark:text-mist-200/40">24h Volume</p>
            <p className="font-mono text-sm text-base-900 dark:text-mist-50">${coin.total_volume?.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

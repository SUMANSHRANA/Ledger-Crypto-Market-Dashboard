import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Star } from 'lucide-react';
import Sparkline from './Sparkline';

const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

const compactFmt = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

function SortHeader({ label, sortKey, sortConfig, onSort, align = 'right' }) {
  const active = sortConfig.key === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      className={`px-3 py-2.5 font-mono text-[11px] uppercase tracking-wide text-base-900/50 dark:text-mist-200/40 cursor-pointer select-none whitespace-nowrap text-${align}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active && (sortConfig.direction === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />)}
      </span>
    </th>
  );
}

export default function CoinTable({ coins, sortConfig, onSort, isWatched, toggleWatch, onSelectCoin }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-mist-200 dark:border-base-700">
      <table className="w-full text-sm border-collapse min-w-[760px]">
        <thead>
          <tr className="border-b border-mist-200 dark:border-base-700 bg-mist-50 dark:bg-base-900">
            <th className="px-3 py-2.5 w-8"></th>
            <SortHeader label="Coin" sortKey="name" sortConfig={sortConfig} onSort={onSort} align="left" />
            <SortHeader label="Price" sortKey="current_price" sortConfig={sortConfig} onSort={onSort} />
            <SortHeader label="24h %" sortKey="price_change_percentage_24h" sortConfig={sortConfig} onSort={onSort} />
            <SortHeader label="Market Cap" sortKey="market_cap" sortConfig={sortConfig} onSort={onSort} />
            <th className="px-3 py-2.5 font-mono text-[11px] uppercase tracking-wide text-base-900/50 dark:text-mist-200/40 text-right">7d</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => {
            const positive = (coin.price_change_percentage_24h ?? 0) >= 0;
            const watched = isWatched(coin.id);
            return (
              <tr
                key={coin.id}
                onClick={() => onSelectCoin(coin)}
                className="border-b border-mist-200/60 dark:border-base-700/60 last:border-0 hover:bg-mist-50 dark:hover:bg-base-800/60 cursor-pointer transition-colors"
              >
                <td className="px-3 py-2.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWatch(coin.id); }}
                    aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
                    className={watched ? 'text-amber-400' : 'text-base-900/20 dark:text-mist-200/25 hover:text-amber-400'}
                  >
                    <Star size={14} className={watched ? 'fill-amber-400' : ''} />
                  </button>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <img src={coin.image} alt="" width={22} height={22} className="rounded-full" />
                    <div className="min-w-0">
                      <p className="font-medium text-base-900 dark:text-mist-50 truncate">{coin.name}</p>
                      <p className="text-[11px] font-mono text-base-900/40 dark:text-mist-200/40 uppercase">{coin.symbol}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-base-900 dark:text-mist-50">
                  {currencyFmt.format(coin.current_price)}
                </td>
                <td className={`px-3 py-2.5 text-right font-mono ${positive ? 'text-signal-up' : 'text-signal-down'}`}>
                  <span className="inline-flex items-center gap-0.5 justify-end">
                    {positive ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                    {Math.abs(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-base-900/70 dark:text-mist-200/70">
                  ${compactFmt.format(coin.market_cap)}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <div className="flex justify-end">
                    <Sparkline data={coin.sparkline_in_7d?.price} positive={positive} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

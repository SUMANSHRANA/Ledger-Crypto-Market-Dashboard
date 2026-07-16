import { ArrowDown, ArrowUp, Star } from 'lucide-react';
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

export default function CoinCards({ coins, isWatched, toggleWatch, onSelectCoin }) {
  return (
    <div className="flex flex-col gap-2">
      {coins.map((coin) => {
        const positive = (coin.price_change_percentage_24h ?? 0) >= 0;
        const watched = isWatched(coin.id);
        return (
          <div
            key={coin.id}
            onClick={() => onSelectCoin(coin)}
            className="rounded-lg border border-mist-200 dark:border-base-700 bg-white dark:bg-base-900 px-3.5 py-3 cursor-pointer active:bg-mist-50 dark:active:bg-base-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <img src={coin.image} alt="" width={26} height={26} className="rounded-full shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-base-900 dark:text-mist-50 truncate text-sm">{coin.name}</p>
                <p className="text-[11px] font-mono text-base-900/40 dark:text-mist-200/40 uppercase">{coin.symbol}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleWatch(coin.id); }}
                aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
                className={watched ? 'text-amber-400 shrink-0' : 'text-base-900/20 dark:text-mist-200/25 shrink-0'}
              >
                <Star size={16} className={watched ? 'fill-amber-400' : ''} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-2.5">
              <div>
                <p className="font-mono text-sm text-base-900 dark:text-mist-50">
                  {currencyFmt.format(coin.current_price)}
                </p>
                <p className={`font-mono text-xs inline-flex items-center gap-0.5 ${positive ? 'text-signal-up' : 'text-signal-down'}`}>
                  {positive ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                  {Math.abs(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
                  <span className="text-base-900/30 dark:text-mist-200/30 ml-1">
                    · ${compactFmt.format(coin.market_cap)} cap
                  </span>
                </p>
              </div>
              <Sparkline data={coin.sparkline_in_7d?.price} positive={positive} width={90} height={28} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center rounded-lg border border-mist-200 dark:border-base-700">
      <AlertTriangle size={26} className="text-signal-down" />
      <div>
        <h3 className="font-mono font-semibold text-base-900 dark:text-mist-50 text-sm mb-1">
          Couldn't load market data
        </h3>
        <p className="text-sm text-base-900/50 dark:text-mist-200/50 max-w-xs">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 bg-signal-up/15 text-signal-up hover:bg-signal-up/25 font-mono text-xs uppercase tracking-wide px-3.5 py-2 rounded-md transition-colors"
      >
        <RefreshCw size={13} /> Retry
      </button>
    </div>
  );
}

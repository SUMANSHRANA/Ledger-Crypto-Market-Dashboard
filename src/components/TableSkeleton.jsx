export default function TableSkeleton({ rows = 8 }) {
  return (
    <div className="rounded-lg border border-mist-200 dark:border-base-700 overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3.5 border-b border-mist-200/60 dark:border-base-700/60 last:border-0"
        >
          <div className="skeleton w-6 h-6 rounded-full shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="skeleton h-3 w-28 rounded" />
            <div className="skeleton h-2.5 w-14 rounded" />
          </div>
          <div className="skeleton h-3 w-16 rounded hidden sm:block" />
          <div className="skeleton h-3 w-12 rounded hidden md:block" />
          <div className="skeleton h-8 w-24 rounded hidden lg:block" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonBox({ className = '', rounded = 'rounded-xl' }) {
  return (
    <div className={`shimmer ${rounded} ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-surface-dark-card rounded-2xl p-5 border border-gray-100 dark:border-surface-dark-border space-y-3 animate-pulse">
      <SkeletonBox className="h-4 w-2/3" />
      <SkeletonBox className="h-3 w-full" />
      <SkeletonBox className="h-3 w-4/5" />
      <div className="flex gap-2 pt-1">
        <SkeletonBox className="h-6 w-16 rounded-full" />
        <SkeletonBox className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonTripCard() {
  return (
    <div className="bg-white dark:bg-surface-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-surface-dark-border animate-pulse">
      <SkeletonBox className="h-44 w-full" rounded="rounded-none" />
      <div className="p-5 space-y-3">
        <SkeletonBox className="h-5 w-3/4" />
        <SkeletonBox className="h-3 w-full" />
        <SkeletonBox className="h-3 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <SkeletonBox className="h-6 w-20 rounded-full" />
          <SkeletonBox className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="bg-white dark:bg-surface-dark-card rounded-2xl p-5 border border-gray-100 dark:border-surface-dark-border animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <SkeletonBox className="h-4 w-1/3" />
        <SkeletonBox className="h-9 w-9 rounded-xl" />
      </div>
      <SkeletonBox className="h-8 w-1/2 mb-1" />
      <SkeletonBox className="h-3 w-2/3" />
    </div>
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox
          key={i}
          className={`h-3 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export default function Skeleton({ type = 'card', count = 1 }) {
  const components = {
    card: SkeletonCard,
    trip: SkeletonTripCard,
    stat: SkeletonStatCard,
  };
  const Component = components[type] || SkeletonCard;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </>
  );
}

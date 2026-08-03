import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-slate-900/70 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
      <div className="aspect-[2/3] w-full animate-shimmer" />
      <div className="p-3.5 flex flex-col gap-2">
        <div className="h-4 w-3/4 bg-slate-800 rounded animate-pulse" />
        <div className="h-3 w-1/3 bg-slate-800 rounded animate-pulse" />
        <div className="flex gap-1.5 mt-1">
          <div className="h-4 w-12 bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-14 bg-slate-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}

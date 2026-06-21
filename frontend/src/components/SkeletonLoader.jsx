import React from 'react';

const SkeletonLoader = ({ variant = 'list', count = 3 }) => {
  const PulseBlock = ({ className }) => (
    <div className={`animate-pulse bg-slate-800/60 rounded-xl ${className}`} />
  );

  switch (variant) {
    case 'kpi':
      return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-850 p-5 rounded-2xl shadow-lg space-y-3">
              <PulseBlock className="h-3 w-1/3" />
              <PulseBlock className="h-8 w-2/3" />
              <PulseBlock className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      );

    case 'table':
      return (
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl space-y-4 w-full">
          <PulseBlock className="h-6 w-1/4 mb-4" />
          <div className="space-y-3">
            {/* Table Header skeleton */}
            <div className="flex gap-4 border-b border-slate-800 pb-3">
              <PulseBlock className="h-4 w-1/3" />
              <PulseBlock className="h-4 w-1/4" />
              <PulseBlock className="h-4 w-1/6" />
              <PulseBlock className="h-4 w-1/12 ml-auto" />
            </div>
            {/* Table Rows skeleton */}
            {Array.from({ length: count }).map((_, idx) => (
              <div key={idx} className="flex gap-4 items-center py-2.5">
                <PulseBlock className="h-10 w-10 rounded-full" />
                <div className="flex-grow space-y-1.5">
                  <PulseBlock className="h-4 w-1/3" />
                  <PulseBlock className="h-3 w-1/4" />
                </div>
                <PulseBlock className="h-4 w-1/6" />
                <PulseBlock className="h-6 w-20 rounded-full ml-auto" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'kanban':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {Array.from({ length: 3 }).map((_, colIdx) => (
            <div key={colIdx} className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col space-y-4 min-h-[400px]">
              {/* Column Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <PulseBlock className="h-5 w-1/3" />
                <PulseBlock className="h-5 w-8 rounded-lg" />
              </div>
              {/* Column Cards */}
              {Array.from({ length: 2 }).map((_, cardIdx) => (
                <div key={cardIdx} className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <PulseBlock className="h-4 w-1/4" />
                    <PulseBlock className="h-4 w-16 rounded-full" />
                  </div>
                  <PulseBlock className="h-4 w-3/4" />
                  <PulseBlock className="h-12 w-full" />
                  <div className="flex justify-between items-center pt-2">
                    <PulseBlock className="h-4 w-20" />
                    <PulseBlock className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      );

    case 'chart':
      return (
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl shadow-lg space-y-3 w-full h-[320px] flex flex-col justify-between">
          <PulseBlock className="h-5 w-1/4" />
          <div className="flex-grow flex items-end gap-3 px-2 pt-4">
            {/* Chart mock bars */}
            <PulseBlock className="h-1/3 w-1/6" />
            <PulseBlock className="h-2/3 w-1/6" />
            <PulseBlock className="h-1/2 w-1/6" />
            <PulseBlock className="h-5/6 w-1/6" />
            <PulseBlock className="h-3/4 w-1/6" />
            <PulseBlock className="h-2/5 w-1/6" />
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-850/60">
            <PulseBlock className="h-3 w-12" />
            <PulseBlock className="h-3 w-12" />
            <PulseBlock className="h-3 w-12" />
            <PulseBlock className="h-3 w-12" />
          </div>
        </div>
      );

    case 'list':
    default:
      return (
        <div className="space-y-4 w-full">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-855 p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <PulseBlock className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <PulseBlock className="h-4 w-40" />
                  <PulseBlock className="h-3 w-28" />
                </div>
              </div>
              <PulseBlock className="h-8 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      );
  }
};

export default SkeletonLoader;

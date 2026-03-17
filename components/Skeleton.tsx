import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-slate-200 rounded ${className}`}
          style={{ minHeight: '1em' }}
        />
      ))}
    </>
  );
};

export const PatientSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-slate-200 rounded-full" />
            <div className="w-16 h-6 bg-slate-200 rounded-full" />
        </div>
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-slate-200 rounded w-1/2 mb-4" />
        <div className="h-3 bg-slate-200 rounded w-1/3" />
    </div>
);

export const UserRowSkeleton: React.FC = () => (
    <tr className="animate-pulse border-b border-slate-50">
        <td className="py-3 px-4">
            <div className="h-4 bg-slate-100 rounded w-3/4 mb-1" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
        </td>
        <td className="py-3 px-4">
            <div className="h-4 bg-slate-100 rounded w-16" />
        </td>
        <td className="py-3 px-4">
            <div className="h-3 bg-slate-100 rounded w-24 mb-1" />
            <div className="h-2 bg-slate-100 rounded w-12" />
        </td>
        <td className="py-3 px-4 text-right">
            <div className="h-6 w-6 bg-slate-100 rounded ml-auto" />
        </td>
    </tr>
);

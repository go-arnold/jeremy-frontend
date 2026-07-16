"use client";

import React, { useState } from 'react';

interface PaginationProps {
  onLoadMore: (page: number) => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  label?: string;
}

export default function VoirPlusPagination({ 
  onLoadMore, 
  hasMore, 
  isLoading,
  label = "Voir plus" 
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!hasMore && !isLoading) return null;

  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    await onLoadMore(nextPage);
    setCurrentPage(nextPage);
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 w-full animate-fade-up">
      <button
        onClick={handleLoadMore}
        disabled={isLoading}
        className={`
          group relative flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300
          ${isLoading 
            ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed" 
            : "bg-primary text-white hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-xl shadow-primary/20 border border-primary/30"
          }
        `}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Chargement...
          </>
        ) : (
          <>
            {label}
            <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-y-0.5">
              expand_more
            </span>
          </>
        )}
      </button>
      {!isLoading && hasMore && (
        <p className="mt-4 text-[10px] font-bold text-[#8A8178] uppercase tracking-[0.2em]">
          Charger 15 éléments supplémentaires
        </p>
      )}
    </div>
  );
}

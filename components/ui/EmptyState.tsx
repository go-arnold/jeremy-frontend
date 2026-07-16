import React from 'react';

interface EmptyStateProps {
  message?: string;
  description?: string;
  icon?: string;
}

export default function EmptyState({ 
  message = "Aucune donnée trouvée", 
  description = "Nous n'avons trouvé aucun résultat correspondant à votre recherche.",
  icon = "search_off"
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-up">
      <div className="w-20 h-20 rounded-full bg-navy/20 border border-primary/20 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-primary text-4xl">
          {icon}
        </span>
      </div>
      <h3 className="text-2xl font-black text-text-primary mb-2">
        {message}
      </h3>
      <p className="text-text-muted max-w-xs mx-auto text-sm leading-relaxed">
        {description}
      </p>
      <div className="mt-8 w-12 h-1 bg-primary/30 rounded-full mx-auto" />
    </div>
  );
}

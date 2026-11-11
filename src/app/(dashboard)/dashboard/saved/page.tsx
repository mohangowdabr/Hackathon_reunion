'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { OpportunityCard } from '@/components/opportunities/opportunity-card';
import { EmptyState } from '@/components/ui/empty-state';
import { dataStore } from '@/lib/data-store';
import { Opportunity } from '@/types';
import { Bookmark, Compass } from 'lucide-react';

export default function SavedOpportunitiesPage() {
  const [savedOpportunities, setSavedOpportunities] = useState<Opportunity[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = () => {
    const ids = dataStore.getSavedOpportunityIds();
    setSavedIds(ids);
    const all = dataStore.getOpportunities();
    setSavedOpportunities(all.filter((o) => ids.includes(o.id)));
  };

  const handleToggleSave = (id: string) => {
    dataStore.toggleSaveOpportunity(id);
    loadSaved();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-6 border-b border-[#1e2044]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-2">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Saved Opportunities
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Opportunities you have bookmarked to review or apply for later.
        </p>
      </div>

      {savedOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              isSaved={true}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bookmark className="w-8 h-8" />}
          title="No saved opportunities yet"
          description="Click the bookmark icon on any opportunity card in Opportunity Radar to save it here for quick access."
          action={{
            label: 'Explore Opportunities',
            onClick: () => {
              window.location.href = '/discover';
            },
          }}
        />
      )}
    </div>
  );
}


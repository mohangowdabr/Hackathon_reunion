'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { OpportunityCard } from '@/components/opportunities/opportunity-card';
import { OpportunityFiltersSidebar } from '@/components/opportunities/opportunity-filters';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { dataStore } from '@/lib/data-store';
import { CATEGORIES } from '@/lib/constants/categories';
import { Opportunity, OpportunityCategory, OpportunityFormat, OpportunityCost } from '@/types';
import { daysUntil } from '@/lib/utils';
import {
  Compass,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Search,
  Filter,
} from 'lucide-react';

function DiscoverContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL initialized state
  const initialCategory = (searchParams.get('category') as OpportunityCategory) || '';
  const initialSearch = searchParams.get('q') || '';

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<{
    search: string;
    category: OpportunityCategory | '';
    format: OpportunityFormat | '';
    cost: OpportunityCost | '';
    deadline: 'all' | 'urgent' | 'week' | 'month';
    skill: string;
    sort: 'newest' | 'deadline' | 'popular';
  }>({
    search: initialSearch,
    category: initialCategory,
    format: '',
    cost: '',
    deadline: 'all',
    skill: '',
    sort: 'newest',
  });

  // Load from data store on mount
  useEffect(() => {
    setOpportunities(dataStore.getOpportunities());
    setSavedIds(dataStore.getSavedOpportunityIds());
  }, []);

  // Update query params when category or search changes
  useEffect(() => {
    const categoryParam = searchParams.get('category') as OpportunityCategory;
    if (categoryParam && categoryParam !== filters.category) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [searchParams]);

  const handleFilterChange = (updated: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      format: '',
      cost: '',
      deadline: 'all',
      skill: '',
      sort: 'newest',
    });
  };

  const handleToggleSave = (id: string) => {
    const isNowSaved = dataStore.toggleSaveOpportunity(id);
    setSavedIds(dataStore.getSavedOpportunityIds());
  };

  // Filtered & Sorted Opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Must be approved listing in public feed
      if (opp.status !== 'approved') return false;

      // Search match
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(query);
        const matchesDesc = opp.short_description.toLowerCase().includes(query);
        const matchesOrg = opp.organizer_name.toLowerCase().includes(query);
        const matchesSkill = opp.required_skills.some((s) => s.toLowerCase().includes(query));
        const matchesTag = opp.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesOrg && !matchesSkill && !matchesTag) {
          return false;
        }
      }

      // Category match
      if (filters.category && opp.category !== filters.category) {
        return false;
      }

      // Format match
      if (filters.format && opp.format !== filters.format) {
        return false;
      }

      // Cost match
      if (filters.cost && opp.cost !== filters.cost) {
        return false;
      }

      // Skill match
      if (filters.skill && !opp.required_skills.includes(filters.skill)) {
        return false;
      }

      // Deadline filter
      if (filters.deadline !== 'all') {
        const days = daysUntil(opp.registration_deadline);
        if (days < 0) return false;
        if (filters.deadline === 'urgent' && days > 3) return false;
        if (filters.deadline === 'week' && days > 7) return false;
        if (filters.deadline === 'month' && days > 30) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sort === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (filters.sort === 'deadline') {
        return new Date(a.registration_deadline).getTime() - new Date(b.registration_deadline).getTime();
      }
      if (filters.sort === 'popular') {
        return (b.views_count + b.saves_count * 2) - (a.views_count + a.saves_count * 2);
      }
      return 0;
    });
  }, [opportunities, filters]);

  const activeCategory = CATEGORIES.find((c) => c.id === filters.category);

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-200">
      <Header />

      {/* Hero Banner */}
      <div className="border-b border-[#1e2044] bg-[#0d0e1f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Opportunity Radar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {activeCategory ? activeCategory.name : 'Explore All Tech Opportunities'}
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            {activeCategory
              ? activeCategory.description
              : 'Discover competitions, open source programs, hackathons, fellowships, and conferences from vetted technology communities worldwide.'}
          </p>

          {/* Quick Categories Bar */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => handleFilterChange({ category: '' })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filters.category === ''
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'bg-[#111225] border border-[#1e2044] text-slate-400 hover:text-white'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleFilterChange({ category: cat.id })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filters.category === cat.id
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : 'bg-[#111225] border border-[#1e2044] text-slate-400 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Discover Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full sm:max-w-md">
            <SearchInput
              value={filters.search}
              onChange={(value) => handleFilterChange({ search: value })}
              placeholder="Search by title, technology, organizer..."
            />
          </div>

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </Button>

            {/* Sort Control */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange({ sort: e.target.value as any })}
                className="h-10 rounded-lg border border-[#1e2044] bg-[#111225] px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="newest">Newest Added</option>
                <option value="deadline">Approaching Deadline</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-400">
          <p>
            Showing <strong className="text-white">{filteredOpportunities.length}</strong> opportunities
          </p>

          {(filters.search || filters.category || filters.format || filters.cost || filters.skill) && (
            <button
              onClick={handleResetFilters}
              className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
            >
              Clear all filters <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Grid and Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <OpportunityFiltersSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              totalCount={filteredOpportunities.length}
            />
          </div>

          {/* Cards Grid */}
          <div className="lg:col-span-3">
            {filteredOpportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOpportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    isSaved={savedIds.includes(opp.id)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Search className="w-8 h-8" />}
                title="No opportunities found"
                description="We couldn't find any opportunities matching your active filters. Try broadening your search or resetting your filters."
                action={{
                  label: 'Reset Filters',
                  onClick: handleResetFilters,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-[#111225] h-full overflow-y-auto p-6 z-10 border-l border-[#1e2044]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1e2044]">
              <h3 className="font-bold text-white">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <OpportunityFiltersSidebar
              filters={filters}
              onChange={(updated) => {
                handleFilterChange(updated);
              }}
              onReset={handleResetFilters}
              totalCount={filteredOpportunities.length}
            />
            <div className="mt-6 pt-4 border-t border-[#1e2044]">
              <Button
                className="w-full"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Show {filteredOpportunities.length} Results
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0b14]" />}>
      <DiscoverContent />
    </Suspense>
  );
}


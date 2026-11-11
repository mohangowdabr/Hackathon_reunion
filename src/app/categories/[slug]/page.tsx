'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { OpportunityCard } from '@/components/opportunities/opportunity-card';
import { CATEGORIES, CATEGORY_MAP } from '@/lib/constants/categories';
import { dataStore } from '@/lib/data-store';
import { Opportunity, OpportunityCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Compass, Filter, Sparkles } from 'lucide-react';

function CategoryContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as OpportunityCategory;

  const categoryInfo = CATEGORIES.find((c) => c.id === slug) || CATEGORIES[0];
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const all = dataStore.getOpportunities();
    const matching = all.filter((o) => o.category === slug && o.status === 'approved');
    setOpportunities(matching);
    setSavedIds(dataStore.getSavedOpportunityIds());
  }, [slug]);

  const handleToggleSave = (id: string) => {
    dataStore.toggleSaveOpportunity(id);
    setSavedIds(dataStore.getSavedOpportunityIds());
  };

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-200">
      <Header />

      {/* Hero Banner */}
      <div className="border-b border-[#1e2044] bg-[#0d0e1f] py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Opportunity Radar
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: `${categoryInfo.color}20`, color: categoryInfo.color }}
            >
              Category Hub
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">{opportunities.length} active listings</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            {categoryInfo.name}
          </h1>
          <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
            {categoryInfo.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <Link href={`/discover?category=${categoryInfo.id}`}>
              <Button size="sm" className="gap-2 text-xs font-semibold">
                <Compass className="w-4 h-4" /> Filter in Radar
              </Button>
            </Link>
            <Link href="/organizer/opportunities/new">
              <Button variant="outline" size="sm" className="text-xs">
                Publish a {categoryInfo.name.slice(0, -1)}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                isSaved={savedIds.includes(opp.id)}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#111225] border border-[#1e2044] rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-2">No listings in {categoryInfo.name} right now</h3>
            <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto">
              Be the first organizer to publish an opportunity in this category or check out other categories on the Opportunity Radar.
            </p>
            <Link href="/discover">
              <Button>Browse All Categories</Button>
            </Link>
          </div>
        )}

        {/* Other Categories Nav */}
        <div className="mt-16 pt-10 border-t border-[#1e2044]">
          <h2 className="text-lg font-bold text-white mb-4">Explore Other Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CATEGORIES.filter((c) => c.id !== slug).slice(0, 10).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="p-3 rounded-xl bg-[#111225] border border-[#1e2044] hover:border-slate-700 text-center transition-all group"
              >
                <p className="text-xs font-semibold text-slate-300 group-hover:text-blue-400 truncate">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0b14]" />}>
      <CategoryContent />
    </Suspense>
  );
}


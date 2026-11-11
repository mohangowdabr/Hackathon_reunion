'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/data-store';
import { Opportunity } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDateShort } from '@/lib/utils';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Bookmark,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export default function ManageOpportunitiesPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'approved' | 'pending' | 'draft'>('all');

  useEffect(() => {
    loadOpps();
  }, []);

  const loadOpps = () => {
    setOpportunities(dataStore.getOpportunities());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      dataStore.deleteOpportunity(id);
      loadOpps();
    }
  };

  const filtered = opportunities.filter((o) => {
    if (activeFilter === 'all') return true;
    return o.status === activeFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1e2044]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Listing Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Manage Opportunities
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review status, edit details, or archive your technology events.
          </p>
        </div>

        <Link href="/organizer/opportunities/new">
          <Button className="gap-2 font-semibold">
            <Plus className="w-4 h-4" /> Create Opportunity
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1e2044] pb-4">
        {[
          { id: 'all', label: 'All Listings', count: opportunities.length },
          { id: 'approved', label: 'Published & Active', count: opportunities.filter((o) => o.status === 'approved').length },
          { id: 'pending', label: 'Pending Review', count: opportunities.filter((o) => o.status === 'pending').length },
          { id: 'draft', label: 'Drafts', count: opportunities.filter((o) => o.status === 'draft').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeFilter === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-[#111225] border border-[#1e2044] text-slate-400 hover:text-white'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Listings Table */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((opp) => (
            <div
              key={opp.id}
              className="p-5 rounded-2xl bg-[#111225] border border-[#1e2044] flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" size="sm" className="capitalize text-xs">
                    {opp.category}
                  </Badge>
                  <Badge
                    variant={opp.status === 'approved' ? 'success' : opp.status === 'pending' ? 'warning' : 'outline'}
                    size="sm"
                    className="capitalize text-xs font-semibold"
                  >
                    {opp.status}
                  </Badge>
                  <span className="text-xs text-slate-500 capitalize">• {opp.format}</span>
                </div>

                <h3 className="text-base font-bold text-white hover:text-blue-400 transition-colors">
                  <Link href={`/opportunities/${opp.slug}`}>{opp.title}</Link>
                </h3>

                <p className="text-xs text-slate-400 line-clamp-1">{opp.short_description}</p>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-400 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#1e2044]">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span>{opp.views_count} views</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-slate-500" />
                  <span>{opp.saves_count} saves</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/opportunities/${opp.slug}`}>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      Preview
                    </Button>
                  </Link>

                  <button
                    onClick={() => handleDelete(opp.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Layers className="w-8 h-8" />}
          title="No opportunities found"
          description="Create your first opportunity listing to publish to TechOrbit."
          action={{
            label: 'Create Opportunity',
            onClick: () => {
              window.location.href = '/organizer/opportunities/new';
            },
          }}
        />
      )}
    </div>
  );
}


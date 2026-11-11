'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/data-store';
import { Opportunity } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDateShort } from '@/lib/utils';
import {
  Building2,
  Plus,
  Layers,
  Clock,
  Eye,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';

export default function OrganizerDashboardPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    setOpportunities(dataStore.getOpportunities());
  }, []);

  const totalPublished = opportunities.filter((o) => o.status === 'approved').length;
  const pendingReview = opportunities.filter((o) => o.status === 'pending').length;
  const draftCount = opportunities.filter((o) => o.status === 'draft').length;
  const totalViews = opportunities.reduce((acc, o) => acc + (o.views_count || 0), 0);
  const totalSaves = opportunities.reduce((acc, o) => acc + (o.saves_count || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#111225] via-[#151633] to-[#111225] border border-[#1e2044]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Organizer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Organizer Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Publish technology events, manage registrations, and review reach analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/organizer/opportunities/new">
            <Button className="gap-2 font-semibold">
              <Plus className="w-4 h-4" /> Create Opportunity
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111225] border border-[#1e2044]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Published Active</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{totalPublished}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Live on Opportunity Radar</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111225] border border-[#1e2044]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Under Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{pendingReview}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Awaiting admin approval</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111225] border border-[#1e2044]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Views</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{totalViews.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Verified impressions</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111225] border border-[#1e2044]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Bookmarks</span>
            <Bookmark className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{totalSaves.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Saved in My Activities</span>
        </div>
      </div>

      {/* Moderation Workflow Notice */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white">Moderation & Verification Policy:</strong> All newly submitted opportunities undergo a review to ensure authenticity and protect participants. Approved opportunities immediately appear in the public feed.
        </div>
      </div>

      {/* Recent Listings */}
      <div className="p-6 rounded-2xl bg-[#111225] border border-[#1e2044] space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#1e2044]">
          <h2 className="text-base font-bold text-white">Your Managed Listings</h2>
          <Link href="/organizer/opportunities" className="text-xs text-blue-400 hover:underline">
            Manage All →
          </Link>
        </div>

        <div className="space-y-3">
          {opportunities.slice(0, 5).map((opp) => (
            <div
              key={opp.id}
              className="p-4 rounded-xl bg-[#0a0b14] border border-[#1e2044] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" size="sm" className="capitalize text-[10px]">
                    {opp.category}
                  </Badge>
                  <Badge
                    variant={opp.status === 'approved' ? 'success' : opp.status === 'pending' ? 'warning' : 'outline'}
                    size="sm"
                    className="capitalize text-[10px]"
                  >
                    {opp.status}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-white">{opp.title}</h3>
                <p className="text-slate-500 mt-0.5">Deadline: {formatDateShort(opp.registration_deadline)}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {opp.views_count}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5" /> {opp.saves_count}
                </span>
                <Link href={`/organizer/opportunities/${opp.id}/edit`}>
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


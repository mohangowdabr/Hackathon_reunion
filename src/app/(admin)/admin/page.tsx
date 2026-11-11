'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/data-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Opportunity, Profile } from '@/types';
import {
  Shield,
  FileCheck,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Building2,
  TrendingUp,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    setOpportunities(dataStore.getOpportunities());
    setProfiles(dataStore.getProfiles());
  }, []);

  const pendingListings = opportunities.filter((o) => o.status === 'pending');
  const approvedListings = opportunities.filter((o) => o.status === 'approved');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#111225] via-[#1c1833] to-[#111225] border border-[#1e2044]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Platform Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Overview & Moderation
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Global opportunity verification, user governance, and platform health metrics.
          </p>
        </div>

        <Link href="/admin/opportunities">
          <Button variant="destructive" className="gap-2 font-semibold">
            <FileCheck className="w-4 h-4" /> Moderation Queue ({pendingListings.length})
          </Button>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111225] border border-[#1e2044]">
          <span className="text-xs text-slate-400 block mb-1">Total Users</span>
          <p className="text-2xl font-bold text-white">{profiles.length + 1}</p>
          <span className="text-[11px] text-slate-500">Registered profiles</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111225] border border-[#1e2044]">
          <span className="text-xs text-slate-400 block mb-1">Live Opportunities</span>
          <p className="text-2xl font-bold text-emerald-400">{approvedListings.length}</p>
          <span className="text-[11px] text-slate-500">Active on radar</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111225] border border-[#1e2044]">
          <span className="text-xs text-slate-400 block mb-1">Pending Approval</span>
          <p className="text-2xl font-bold text-amber-400">{pendingListings.length}</p>
          <span className="text-[11px] text-slate-500">Requires review</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111225] border border-[#1e2044]">
          <span className="text-xs text-slate-400 block mb-1">Reports</span>
          <p className="text-2xl font-bold text-slate-400">0</p>
          <span className="text-[11px] text-emerald-400">Clean standing</span>
        </div>
      </div>

      {/* Quick Action Queue */}
      <div className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#1e2044]">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">Pending Moderation Queue</h2>
          </div>
          <Link href="/admin/opportunities" className="text-xs text-blue-400 hover:underline">
            Open Full Queue →
          </Link>
        </div>

        {pendingListings.length > 0 ? (
          <div className="space-y-3">
            {pendingListings.map((opp) => (
              <div
                key={opp.id}
                className="p-4 rounded-xl bg-[#0a0b14] border border-[#1e2044] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <Badge variant="warning" size="sm" className="mb-1 text-[10px]">
                    Pending Verification
                  </Badge>
                  <h3 className="text-sm font-semibold text-white">{opp.title}</h3>
                  <p className="text-slate-400">by {opp.organizer_name}</p>
                </div>

                <Link href="/admin/opportunities">
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    Review Listing
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">
            Queue is clear! All submitted opportunities have been reviewed.
          </p>
        )}
      </div>
    </div>
  );
}


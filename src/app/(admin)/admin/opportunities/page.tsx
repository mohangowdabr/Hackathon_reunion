'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dataStore } from '@/lib/data-store';
import { Opportunity, OpportunityStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDateShort } from '@/lib/utils';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Trash2,
  ExternalLink,
  Eye,
} from 'lucide-react';

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    loadOpps();
  }, []);

  const loadOpps = () => {
    setOpportunities(dataStore.getOpportunities());
  };

  const handleUpdateStatus = (opp: Opportunity, status: OpportunityStatus) => {
    dataStore.saveOpportunity({
      ...opp,
      status,
      updated_at: new Date().toISOString(),
    });
    loadOpps();
  };

  const handleToggleVerify = (opp: Opportunity) => {
    dataStore.saveOpportunity({
      ...opp,
      is_verified: !opp.is_verified,
      updated_at: new Date().toISOString(),
    });
    loadOpps();
  };

  const handleDelete = (id: string) => {
    if (confirm('Permanently delete this listing?')) {
      dataStore.deleteOpportunity(id);
      loadOpps();
    }
  };

  const filtered = opportunities.filter((o) => {
    if (activeTab === 'all') return true;
    return o.status === activeTab;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="pb-6 border-b border-[#1e2044]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium mb-2">
          <FileCheck className="w-3.5 h-3.5" />
          <span>Listing Moderation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Opportunity Moderation
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Approve, reject, or mark organizer verified for all public submissions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1e2044] pb-4">
        {[
          { id: 'pending', label: 'Pending Review', count: opportunities.filter((o) => o.status === 'pending').length },
          { id: 'approved', label: 'Approved Live', count: opportunities.filter((o) => o.status === 'approved').length },
          { id: 'rejected', label: 'Rejected', count: opportunities.filter((o) => o.status === 'rejected').length },
          { id: 'all', label: 'All Submissions', count: opportunities.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                : 'bg-[#111225] border border-[#1e2044] text-slate-400 hover:text-white'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="space-y-4">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="p-5 rounded-2xl bg-[#111225] border border-[#1e2044] flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" size="sm" className="capitalize text-xs">
                  {opp.category}
                </Badge>
                <Badge
                  variant={opp.status === 'approved' ? 'success' : opp.status === 'pending' ? 'warning' : 'destructive'}
                  size="sm"
                  className="capitalize text-xs font-semibold"
                >
                  {opp.status}
                </Badge>
                {opp.is_verified && (
                  <Badge variant="default" size="sm" className="text-[10px] gap-1 bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <ShieldCheck className="w-3 h-3" /> Verified Badge
                  </Badge>
                )}
              </div>

              <h3 className="text-base font-bold text-white">
                <Link href={`/opportunities/${opp.slug}`} target="_blank" className="hover:text-blue-400">
                  {opp.title} <ExternalLink className="w-3 h-3 inline ml-1 text-slate-500" />
                </Link>
              </h3>

              <p className="text-xs text-slate-400">
                Organizer: <strong className="text-slate-300">{opp.organizer_name}</strong> • Deadline: {formatDateShort(opp.registration_deadline)}
              </p>
            </div>

            {/* Moderation Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#1e2044]">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleToggleVerify(opp)}
                className="text-xs h-8"
              >
                {opp.is_verified ? 'Remove Verified' : 'Mark Verified'}
              </Button>

              {opp.status !== 'approved' && (
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(opp, 'approved')}
                  className="text-xs h-8 bg-emerald-600 hover:bg-emerald-500 text-white gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </Button>
              )}

              {opp.status !== 'rejected' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus(opp, 'rejected')}
                  className="text-xs h-8 text-red-400 border-red-500/30 hover:bg-red-500/10 gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </Button>
              )}

              <button
                onClick={() => handleDelete(opp.id)}
                className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


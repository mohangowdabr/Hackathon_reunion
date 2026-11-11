'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { dataStore } from '@/lib/data-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORIES } from '@/lib/constants/categories';
import { Opportunity, OpportunityCategory, OpportunityFormat, OpportunityCost } from '@/types';
import { ArrowLeft } from 'lucide-react';

function EditOpportunityContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [category, setCategory] = useState<OpportunityCategory>('hackathon');
  const [format, setFormat] = useState<OpportunityFormat>('online');
  const [prizeInfo, setPrizeInfo] = useState('');
  const [eligibility, setEligibility] = useState('');

  useEffect(() => {
    if (id) {
      const all = dataStore.getOpportunities();
      const target = all.find((o) => o.id === id || o.slug === id);
      if (target) {
        setOpp(target);
        setTitle(target.title);
        setDescription(target.description);
        setShortDesc(target.short_description);
        setCategory(target.category);
        setFormat(target.format);
        setPrizeInfo(target.prize_info || '');
        setEligibility(target.eligibility);
      }
    }
  }, [id]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opp) return;

    dataStore.saveOpportunity({
      ...opp,
      title,
      description,
      short_description: shortDesc,
      category,
      format,
      prize_info: prizeInfo || null,
      eligibility,
      updated_at: new Date().toISOString(),
    });

    alert('Opportunity updated successfully.');
    router.push('/organizer/opportunities');
  };

  if (!opp) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading opportunity details...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl pb-16">
      <div className="pb-6 border-b border-[#1e2044]">
        <Link
          href="/organizer/opportunities"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Listings
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Edit Opportunity: {opp.title}
        </h1>
      </div>

      <form onSubmit={handleSave} className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Opportunity Title
          </label>
          <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Tagline / Summary
          </label>
          <Input value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Description
          </label>
          <Textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={6} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full h-10 rounded-lg border border-[#1e2044] bg-[#0a0b14] px-3 text-xs text-slate-200"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full h-10 rounded-lg border border-[#1e2044] bg-[#0a0b14] px-3 text-xs text-slate-200"
            >
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Prize Information
          </label>
          <Input value={prizeInfo} onChange={(e) => setPrizeInfo(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Eligibility
          </label>
          <Textarea value={eligibility} onChange={(e) => setEligibility(e.target.value)} rows={2} />
        </div>

        <div className="pt-4 border-t border-[#1e2044] flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => router.push('/organizer/opportunities')}>
            Cancel
          </Button>
          <Button type="submit" className="font-semibold">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function EditOpportunityPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading editor...</div>}>
      <EditOpportunityContent />
    </Suspense>
  );
}

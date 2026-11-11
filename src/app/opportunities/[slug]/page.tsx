'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { OpportunityCard } from '@/components/opportunities/opportunity-card';
import { dataStore } from '@/lib/data-store';
import { useAuth } from '@/lib/auth-context';
import { Opportunity } from '@/types';
import { formatDate, formatDateShort, daysUntil } from '@/lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Bookmark,
  Share2,
  ExternalLink,
  Trophy,
  ArrowLeft,
  Eye,
  ShieldCheck,
  Building2,
  Layers,
  Sparkles,
  Users,
  Check,
  AlertTriangle,
} from 'lucide-react';

function OpportunityDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { user } = useAuth();

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [relatedOpportunities, setRelatedOpportunities] = useState<Opportunity[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (slug) {
      const opp = dataStore.getOpportunityBySlug(slug);
      if (opp) {
        setOpportunity(opp);
        dataStore.incrementOpportunityViews(opp.id);

        const savedIds = dataStore.getSavedOpportunityIds();
        setIsSaved(savedIds.includes(opp.id));

        // Related by category
        const all = dataStore.getOpportunities();
        const related = all
          .filter((o) => o.id !== opp.id && (o.category === opp.category || o.format === opp.format))
          .slice(0, 3);
        setRelatedOpportunities(related);
      }
    }
  }, [slug]);

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-[#0a0b14] text-slate-200">
        <Header />
        <div className="max-w-4xl mx-auto py-24 px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Opportunity Not Found</h2>
          <p className="text-slate-400 mb-6">The opportunity you are looking for may have been removed or the link is expired.</p>
          <Link href="/discover">
            <Button>Return to Opportunity Radar</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const days = daysUntil(opportunity.registration_deadline);

  const handleToggleSave = () => {
    const updatedState = dataStore.toggleSaveOpportunity(opportunity.id);
    setIsSaved(updatedState);
  };

  const handleShare = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleProceedToExternal = () => {
    // Record application intent in TechOrbit
    if (user) {
      dataStore.recordApplicationIntent(user.id, opportunity.id, 'applied');
    }
    setShowApplyModal(false);

    // If real external url exists and not '#'
    if (opportunity.registration_url && opportunity.registration_url !== '#') {
      window.open(opportunity.registration_url, '_blank', 'noopener,noreferrer');
    } else {
      // Mock external redirect simulation
      window.open('https://example.com/apply', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-200">
      <Header />

      {/* Breadcrumb & Navigation */}
      <div className="border-b border-[#1e2044] bg-[#0d0e1f] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Opportunity Radar
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#1e2044] bg-[#111225] hover:text-white transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={handleToggleSave}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                  : 'border-[#1e2044] bg-[#111225] text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Detail Header */}
      <div className="border-b border-[#1e2044] bg-[#0a0b14] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="default" className="capitalize text-xs">
              {opportunity.category.replace('-', ' ')}
            </Badge>
            <Badge variant="outline" className="capitalize text-xs">
              {opportunity.format}
            </Badge>
            <Badge
              variant={opportunity.cost === 'free' ? 'success' : 'warning'}
              className="text-xs"
            >
              {opportunity.cost === 'free' ? 'Free Registration' : `Entry Fee: $${opportunity.cost_amount}`}
            </Badge>
            {opportunity.is_verified && (
              <Badge variant="default" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30 gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified by TechOrbit
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 max-w-4xl">
            {opportunity.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-500" />
              <span>Organized by <strong className="text-white font-medium">{opportunity.organizer_name}</strong></span>
            </div>

            {opportunity.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>{opportunity.location}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-500" />
              <span>{opportunity.views_count} views</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-slate-500" />
              <span>{opportunity.saves_count} saves</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Main Details + Action Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content (2 cols) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview / Description */}
            <section className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-4">About this Opportunity</h2>
              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-4">
                {opportunity.description}
              </div>
            </section>

            {/* Required Skills */}
            <section className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-4">Relevant Technologies & Skills</h2>
              <p className="text-xs text-slate-400 mb-4">
                Recommended skills for this program. You can still participate and learn along the way!
              </p>
              <div className="flex flex-wrap gap-2">
                {opportunity.required_skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0a0b14] border border-[#1e2044] text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Eligibility & Guidelines */}
            <section className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-4">Eligibility Requirements</h2>
              <div className="p-4 rounded-xl bg-[#0a0b14] border border-[#1e2044] text-sm text-slate-300 leading-relaxed">
                {opportunity.eligibility}
              </div>
            </section>

            {/* Team Collaboration CTA */}
            <section className="bg-gradient-to-r from-violet-900/20 to-blue-900/20 border border-violet-500/30 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">
                    <Users className="w-4 h-4" /> TeamMatch
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Looking for teammates for this event?
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md">
                    Connect with other participants looking for complementary skills to form a winning team.
                  </p>
                </div>
                <Link href={`/dashboard/teammates`}>
                  <Button variant="secondary" className="whitespace-nowrap font-semibold">
                    Find Teammates
                  </Button>
                </Link>
              </div>
            </section>
          </div>

          {/* Action Sidebar (1 col) */}
          <div className="space-y-6">
            {/* Primary Action Card */}
            <div className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6 sticky top-24 shadow-2xl">
              {/* Prize Highlight if present */}
              {opportunity.prize_info && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                    <Trophy className="w-4 h-4" /> Prize Information
                  </div>
                  <p className="text-base font-bold text-white">{opportunity.prize_info}</p>
                </div>
              )}

              {/* Deadline countdown */}
              <div className="mb-6 pb-6 border-b border-[#1e2044]">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Registration Closes:</span>
                  <span className={days <= 3 ? 'text-red-400 font-bold' : days <= 7 ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                    {days > 0 ? `${days} days remaining` : days === 0 ? 'Closes today!' : 'Deadline passed'}
                  </span>
                </div>
                <p className="text-lg font-bold text-white">
                  {formatDate(opportunity.registration_deadline)}
                </p>
              </div>

              {/* Key Timeline */}
              <div className="space-y-4 mb-6 text-xs">
                <div className="flex items-start justify-between">
                  <span className="text-slate-400">Event Start Date:</span>
                  <span className="text-white font-medium text-right">
                    {formatDateShort(opportunity.start_date)}
                  </span>
                </div>
                {opportunity.end_date && (
                  <div className="flex items-start justify-between">
                    <span className="text-slate-400">Event End Date:</span>
                    <span className="text-white font-medium text-right">
                      {formatDateShort(opportunity.end_date)}
                    </span>
                  </div>
                )}
                {opportunity.duration && (
                  <div className="flex items-start justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="text-white font-medium text-right">{opportunity.duration}</span>
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <span className="text-slate-400">Format:</span>
                  <span className="text-white font-medium capitalize text-right">{opportunity.format}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-400">Cost:</span>
                  <span className="text-emerald-400 font-semibold capitalize text-right">
                    {opportunity.cost === 'free' ? 'Free' : `$${opportunity.cost_amount}`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full h-12 text-base font-bold shadow-lg shadow-blue-600/30 gap-2"
                >
                  Apply Now <ExternalLink className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  onClick={handleToggleSave}
                  className="w-full gap-2"
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-blue-400' : ''}`} />
                  {isSaved ? 'Saved in My Activities' : 'Save for Later'}
                </Button>
              </div>

              <p className="text-[11px] text-slate-500 text-center mt-4">
                TechOrbit redirects to the official organizer registration portal.
              </p>
            </div>

            {/* Organizer Card */}
            <div className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                About the Organizer
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  {opportunity.organizer_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1">
                    {opportunity.organizer_name}
                    {opportunity.is_verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    )}
                  </h4>
                  <p className="text-xs text-slate-500">Verified Organization</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                This opportunity has been vetted according to TechOrbit listing guidelines.
              </p>
            </div>
          </div>
        </div>

        {/* Related Opportunities */}
        {relatedOpportunities.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#1e2044]">
            <h2 className="text-2xl font-bold text-white mb-6">Related Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Official Application Intent Modal (Honesty & Tracking) */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Official Opportunity Application"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 leading-relaxed">
            <p className="font-semibold text-white mb-1">Redirecting to official organizer portal</p>
            You are about to be redirected to <strong>{opportunity.organizer_name}</strong>&apos;s registration website to submit your application.
          </div>

          <div className="p-3.5 rounded-xl bg-[#0a0b14] border border-[#1e2044] text-xs text-slate-400 space-y-2">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>We will automatically add this to your <strong>My Activities</strong> dashboard so you can track your deadlines and status.</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>TechOrbit does not submit the application on your behalf. Complete all steps on the organizer&apos;s official portal.</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowApplyModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleProceedToExternal} className="gap-2 font-semibold">
              Continue to Official Site <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

export default function OpportunityDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0b14]" />}>
      <OpportunityDetailsContent />
    </Suspense>
  );
}

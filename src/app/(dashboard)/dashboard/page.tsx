'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/data-store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Opportunity, Application, Profile, Team } from '@/types';
import { formatDateShort, daysUntil } from '@/lib/utils';
import {
  Compass,
  Activity,
  Bookmark,
  Users,
  Trophy,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function ParticipantDashboardPage() {
  const { user, profile } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<Opportunity[]>([]);
  const [teammateSuggestions, setTeammateSuggestions] = useState<Profile[]>([]);
  const [recommendedOpps, setRecommendedOpps] = useState<Opportunity[]>([]);

  useEffect(() => {
    // Load real data from data store
    const userApps = dataStore.getApplications(user?.id || 'dev-user-1');
    setApplications(userApps);

    const savedIds = dataStore.getSavedOpportunityIds();
    const allOpps = dataStore.getOpportunities();
    const saved = allOpps.filter((o) => savedIds.includes(o.id));
    setSavedOpportunities(saved);

    // Recommended based on skills or featured
    const recommended = allOpps
      .filter((o) => o.is_featured && !savedIds.includes(o.id))
      .slice(0, 3);
    setRecommendedOpps(recommended.length > 0 ? recommended : allOpps.slice(0, 3));

    // Teammate suggestions
    const profiles = dataStore.getProfiles().filter((p) => p.is_looking_for_team);
    setTeammateSuggestions(profiles.slice(0, 3));
  }, [user]);

  const firstName = profile?.full_name ? profile.full_name.split(' ')[0] : 'Developer';

  // Urgent deadlines from applications & saved
  const activeApps = applications.filter(
    (a) => a.status !== 'completed' && a.status !== 'rejected' && a.status !== 'withdrawn'
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#111225] via-[#151633] to-[#111225] border border-[#1e2044] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[250px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {firstName}.
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            You have <strong className="text-blue-400">{activeApps.length} active applications</strong> and{' '}
            <strong className="text-violet-400">{savedOpportunities.length} saved opportunities</strong> in your pipeline.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link href="/discover">
            <Button className="gap-2 text-sm font-semibold">
              <Compass className="w-4 h-4" /> Explore Radar
            </Button>
          </Link>
          <Link href="/dashboard/activities">
            <Button variant="outline" className="gap-2 text-sm">
              <Activity className="w-4 h-4" /> My Activities
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Completion Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#111225] border border-[#1e2044] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/25 flex items-center justify-center font-bold">
            {profile?.profile_completion || 85}%
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Developer Passport Completion</h4>
            <p className="text-xs text-slate-400">Complete your profile to unlock verified recommendations & recruiter visibility.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-36 h-2 rounded-full bg-[#1a1b35] overflow-hidden hidden md:block">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
              style={{ width: `${profile?.profile_completion || 85}%` }}
            />
          </div>
          <Link href="/dashboard/passport">
            <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs">
              Edit Passport
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Upcoming Deadlines + Active Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Active Activities & Recommended Opportunities */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Applications Section */}
          <div className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#1e2044]">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold text-white">Active Participation Pipeline</h2>
              </div>
              <Link href="/dashboard/activities" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                View All ({applications.length}) →
              </Link>
            </div>

            {applications.length > 0 ? (
              <div className="space-y-3">
                {applications.slice(0, 4).map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-[#0a0b14] border border-[#1e2044] hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" size="sm" className="capitalize text-[10px]">
                          {app.opportunity?.category || 'Program'}
                        </Badge>
                        <Badge
                          variant={
                            app.status === 'accepted' || app.status === 'participating'
                              ? 'success'
                              : app.status === 'applied'
                              ? 'default'
                              : 'warning'
                          }
                          size="sm"
                          className="capitalize text-[10px]"
                        >
                          {app.status}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-semibold text-white">
                        <Link
                          href={`/opportunities/${app.opportunity?.slug || ''}`}
                          className="hover:text-blue-400 transition-colors"
                        >
                          {app.opportunity?.title || 'Opportunity'}
                        </Link>
                      </h4>
                      {app.notes && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
                          &ldquo;{app.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs shrink-0">
                      {app.opportunity?.registration_deadline && (
                        <span className="text-slate-400">
                          Deadline: {formatDateShort(app.opportunity.registration_deadline)}
                        </span>
                      )}
                      <Link href="/dashboard/activities">
                        <Button variant="ghost" size="sm" className="text-xs text-blue-400 h-8">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                You haven&apos;t started tracking any opportunities yet.{' '}
                <Link href="/discover" className="text-blue-400 underline">
                  Discover on Radar
                </Link>
              </div>
            )}
          </div>

          {/* Recommended for You */}
          <div className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#1e2044]">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-violet-400" />
                <h2 className="text-base font-bold text-white">Recommended for Your Profile</h2>
              </div>
              <Link href="/discover" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                Explore More →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedOpps.slice(0, 2).map((opp) => (
                <div
                  key={opp.id}
                  className="p-4 rounded-xl bg-[#0a0b14] border border-[#1e2044] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="default" size="sm" className="capitalize text-[10px]">
                        {opp.category}
                      </Badge>
                      <span className="text-[11px] text-emerald-400 font-semibold">
                        {opp.cost === 'free' ? 'Free' : `$${opp.cost_amount}`}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1 line-clamp-1">
                      <Link href={`/opportunities/${opp.slug}`} className="hover:text-blue-400">
                        {opp.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                      {opp.short_description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#1e2044] flex items-center justify-between text-xs text-slate-500">
                    <span>Deadline: {formatDateShort(opp.registration_deadline)}</span>
                    <Link
                      href={`/opportunities/${opp.slug}`}
                      className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Deadlines + TeamMatch Suggestions */}
        <div className="space-y-8">
          {/* Upcoming Deadlines Widget */}
          <div className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1e2044]">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Upcoming Deadlines</h3>
            </div>

            {savedOpportunities.length > 0 ? (
              <div className="space-y-3">
                {savedOpportunities.slice(0, 4).map((opp) => {
                  const days = daysUntil(opp.registration_deadline);
                  return (
                    <div
                      key={opp.id}
                      className="p-3 rounded-xl bg-[#0a0b14] border border-[#1e2044] flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-white truncate">{opp.title}</p>
                        <p className="text-slate-500 text-[11px]">{formatDateShort(opp.registration_deadline)}</p>
                      </div>
                      <span
                        className={`shrink-0 font-bold ${
                          days <= 3 ? 'text-red-400' : days <= 7 ? 'text-amber-400' : 'text-slate-400'
                        }`}
                      >
                        {days > 0 ? `${days}d left` : 'Passed'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                No saved deadlines. Bookmark opportunities to track here.
              </p>
            )}
          </div>

          {/* TeamMatch Suggestions */}
          <div className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e2044]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white">TeamMatch Suggestions</h3>
              </div>
              <Link href="/dashboard/teammates" className="text-xs text-blue-400 hover:text-blue-300">
                Browse
              </Link>
            </div>

            <div className="space-y-3">
              {teammateSuggestions.map((person) => (
                <div
                  key={person.id}
                  className="p-3 rounded-xl bg-[#0a0b14] border border-[#1e2044] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#1a1b35] border border-[#1e2044] flex items-center justify-center font-bold text-xs text-slate-300 shrink-0">
                      {person.full_name.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{person.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{person.title || person.college_or_org}</p>
                    </div>
                  </div>

                  <Link href={`/people/${person.username}`}>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-400">
                      Profile
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


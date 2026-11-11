'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { dataStore } from '@/lib/data-store';
import { Profile, Achievement, Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  IdCard,
  MapPin,
  GraduationCap,
  Trophy,
  Award,
  CheckCircle2,
  ExternalLink,
  Globe,
  Share2,
  Check,
  UserPlus,
  ArrowLeft,
} from 'lucide-react';
import { Github, Linkedin } from '@/components/ui/icons';

function ProfileContent() {
  const params = useParams();
  const username = params?.username as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (username) {
      const p = dataStore.getProfileByUsername(username);
      if (p) {
        setProfile(p);
        setAchievements(dataStore.getAchievements(p.user_id));
        setProjects(dataStore.getProjects(p.user_id));
      } else {
        // Fallback for default demo user
        const allProfiles = dataStore.getProfiles();
        const fallback = allProfiles[0];
        if (fallback) {
          setProfile(fallback);
          setAchievements(dataStore.getAchievements(fallback.user_id));
          setProjects(dataStore.getProjects(fallback.user_id));
        }
      }
    }
  }, [username]);

  const handleShare = () => {
    navigator?.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0b14] text-slate-200">
        <Header />
        <div className="max-w-4xl mx-auto py-24 px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
          <p className="text-slate-400 mb-6">This developer passport does not exist or has been made private.</p>
          <Link href="/people">
            <Button>Discover Developers</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-200">
      <Header />

      {/* Top Banner */}
      <div className="border-b border-[#1e2044] bg-[#0d0e1f] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <Link href="/people" className="inline-flex items-center gap-1.5 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Community
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#1e2044] bg-[#111225] hover:text-white"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Share Passport'}</span>
          </button>
        </div>
      </div>

      {/* Passport Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Passport Card Header */}
        <div className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#1e2044]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-blue-500/20">
                {profile.full_name.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {profile.full_name}
                  </h1>
                  <Badge variant="default" size="sm" className="gap-1 bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                    <CheckCircle2 className="w-3 h-3" /> TechOrbit Passport
                  </Badge>
                </div>
                <p className="text-sm text-slate-400">
                  {profile.title || 'Software Developer'} • @{profile.username}
                </p>
              </div>
            </div>

            <Link href="/dashboard/teammates">
              <Button className="gap-2 font-semibold">
                <UserPlus className="w-4 h-4" /> Connect / Invite
              </Button>
            </Link>
          </div>

          {/* Details */}
          <div className="py-6 space-y-4">
            {profile.bio && (
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {profile.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              {profile.college_or_org && (
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-slate-500" /> {profile.college_or_org}
                </span>
              )}
              {profile.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-500" /> {profile.location}
                </span>
              )}
              {profile.is_looking_for_team && (
                <Badge variant="success" size="sm">
                  Looking for Team
                </Badge>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-4 border-t border-[#1e2044] flex flex-wrap gap-4 text-xs text-slate-400">
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white">
                <Github className="w-4 h-4" /> GitHub
              </a>
            )}
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
            {profile.website_url && (
              <a href={profile.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white">
                <Globe className="w-4 h-4" /> Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Verified Achievements */}
        <div className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[#1e2044]">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Achievements & Recognitions</h2>
          </div>

          {achievements.length > 0 ? (
            <div className="space-y-4">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="p-4 rounded-xl bg-[#0a0b14] border border-[#1e2044] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{ach.title}</h3>
                      <Badge
                        variant={ach.verification === 'verified' ? 'default' : ach.verification === 'organizer-confirmed' ? 'success' : 'outline'}
                        size="sm"
                        className="text-[10px]"
                      >
                        {ach.verification === 'verified'
                          ? 'TechOrbit Verified'
                          : ach.verification === 'organizer-confirmed'
                          ? 'Organizer Confirmed'
                          : 'Self-Reported'}
                      </Badge>
                    </div>
                    {ach.description && <p className="text-slate-400">{ach.description}</p>}
                    <span className="text-[11px] text-slate-500 block">Date: {ach.date}</span>
                  </div>

                  {ach.proof_url && (
                    <a
                      href={ach.proof_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline flex items-center gap-1 shrink-0"
                    >
                      Proof <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No public achievements listed.</p>
          )}
        </div>

        {/* Featured Projects */}
        {projects.length > 0 && (
          <div className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white pb-4 border-b border-[#1e2044]">
              Featured Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-xl bg-[#0a0b14] border border-[#1e2044] space-y-2">
                  <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.tech_stack.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-[#1a1b35] text-blue-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function PublicDeveloperProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0b14]" />}>
      <ProfileContent />
    </Suspense>
  );
}

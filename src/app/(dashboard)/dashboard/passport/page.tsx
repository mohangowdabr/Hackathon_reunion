'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/data-store';
import { Profile, Achievement, Project, AchievementVerification } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { ALL_SKILLS } from '@/lib/constants/skills';
import {
  IdCard,
  ExternalLink,
  Plus,
  Trophy,
  Award,
  CheckCircle2,
  ShieldCheck,
  Copy,
  Check,
  Edit2,
  Trash2,
  Share2,
  Globe,
  MapPin,
  GraduationCap,
} from 'lucide-react';
import { Github, Linkedin } from '@/components/ui/icons';

export default function DeveloperPassportPage() {
  const { user, profile, updateProfile } = useAuth();
  const userId = user?.id || 'dev-user-1';

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Profile Edit modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [title, setTitle] = useState(profile?.title || '');
  const [collegeOrOrg, setCollegeOrOrg] = useState(profile?.college_or_org || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isLookingForTeam, setIsLookingForTeam] = useState(profile?.is_looking_for_team || false);
  const [availability, setAvailability] = useState(profile?.availability || '');

  // Add achievement modal
  const [isAddAchOpen, setIsAddAchOpen] = useState(false);
  const [achTitle, setAchTitle] = useState('');
  const [achDesc, setAchDesc] = useState('');
  const [achType, setAchType] = useState<'participation' | 'award' | 'certification' | 'completion'>('award');
  const [achVerification, setAchVerification] = useState<AchievementVerification>('self-reported');
  const [achDate, setAchDate] = useState('2025-01-01');
  const [achProofUrl, setAchProofUrl] = useState('');

  useEffect(() => {
    loadPassportData();
  }, [userId]);

  const loadPassportData = () => {
    setAchievements(dataStore.getAchievements(userId));
    setProjects(dataStore.getProjects(userId));
  };

  const handleCopyPublicUrl = () => {
    const url = `${window.location.origin}/people/${profile?.username || 'alexchen'}`;
    navigator?.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      full_name: fullName,
      title,
      college_or_org: collegeOrOrg,
      location,
      bio,
      is_looking_for_team: isLookingForTeam,
      availability,
    });
    setIsEditProfileOpen(false);
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achTitle) return;

    dataStore.saveAchievement(userId, {
      title: achTitle,
      description: achDesc || null,
      opportunity_id: null,
      type: achType,
      verification: achVerification,
      date: achDate,
      proof_url: achProofUrl || null,
      is_public: true,
    });

    loadPassportData();
    setIsAddAchOpen(false);
    setAchTitle('');
    setAchDesc('');
    setAchProofUrl('');
  };

  const handleDeleteAchievement = (id: string) => {
    dataStore.deleteAchievement(userId, id);
    loadPassportData();
  };

  const getVerificationBadge = (verification: AchievementVerification) => {
    switch (verification) {
      case 'verified':
        return (
          <Badge variant="default" size="sm" className="bg-blue-500/20 text-blue-400 border-blue-500/30 gap-1 text-[10px]">
            <CheckCircle2 className="w-3 h-3" /> TechOrbit Verified
          </Badge>
        );
      case 'organizer-confirmed':
        return (
          <Badge variant="success" size="sm" className="gap-1 text-[10px]">
            <CheckCircle2 className="w-3 h-3" /> Organizer Confirmed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" size="sm" className="text-slate-400 text-[10px]">
            Self-Reported
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1e2044]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-2">
            <IdCard className="w-3.5 h-3.5" />
            <span>Developer Passport</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Developer Passport
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Your single unified technology portfolio, verified achievements, and public resume.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyPublicUrl} className="gap-1.5 text-xs">
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink ? 'Link Copied' : 'Copy Public URL'}
          </Button>

          <Link href={`/people/${profile?.username || 'alexchen'}`} target="_blank">
            <Button size="sm" className="gap-1.5 text-xs">
              View Public Page <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#1e2044]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/20">
              {profile?.full_name ? profile.full_name.slice(0, 2).toUpperCase() : 'DV'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white">{profile?.full_name}</h2>
                <Badge variant="default" size="sm">
                  Passport Verified
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                {profile?.title || 'Full-Stack Developer'} • {profile?.college_or_org}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFullName(profile?.full_name || '');
              setTitle(profile?.title || '');
              setCollegeOrOrg(profile?.college_or_org || '');
              setLocation(profile?.location || '');
              setBio(profile?.bio || '');
              setIsLookingForTeam(profile?.is_looking_for_team || false);
              setAvailability(profile?.availability || '');
              setIsEditProfileOpen(true);
            }}
            className="gap-1.5 text-xs"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit Information
          </Button>
        </div>

        {/* Bio & Details */}
        <div className="py-6 space-y-4">
          {profile?.bio && (
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              {profile.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
            {profile?.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> {profile.location}
              </span>
            )}
            {profile?.college_or_org && (
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500" /> {profile.college_or_org}
              </span>
            )}
            {profile?.is_looking_for_team && (
              <Badge variant="success" size="sm" className="text-[10px]">
                Actively Looking for Teams
              </Badge>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-4 border-t border-[#1e2044] flex flex-wrap gap-4 text-xs text-slate-400">
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white">
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
          )}
          {profile?.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white">
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </a>
          )}
          {profile?.website_url && (
            <a href={profile.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white">
              <Globe className="w-3.5 h-3.5" /> Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#1e2044]">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Achievements & Badges</h2>
              <p className="text-xs text-slate-400">Track verified hackathon wins, open-source recognitions, and awards.</p>
            </div>
          </div>

          <Button size="sm" onClick={() => setIsAddAchOpen(true)} className="gap-1.5 text-xs font-semibold">
            <Plus className="w-3.5 h-3.5" /> Add Achievement
          </Button>
        </div>

        {achievements.length > 0 ? (
          <div className="space-y-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="p-4 rounded-xl bg-[#0a0b14] border border-[#1e2044] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{ach.title}</h3>
                    {getVerificationBadge(ach.verification)}
                  </div>
                  {ach.description && (
                    <p className="text-xs text-slate-400">{ach.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span>Date: {ach.date}</span>
                    {ach.proof_url && (
                      <a href={ach.proof_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-0.5">
                        Verification proof <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteAchievement(ach.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors self-end sm:self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">
            No achievements added yet. Add awards or certificates to showcase on your passport.
          </p>
        )}
      </div>

      {/* Projects Showcase Section */}
      <div className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#1e2044]">
          <div>
            <h2 className="text-lg font-bold text-white">Featured Projects</h2>
            <p className="text-xs text-slate-400">Showcase software built in hackathons or open-source.</p>
          </div>
          <Link href="/dashboard/projects">
            <Button variant="outline" size="sm" className="text-xs">
              Manage Projects ({projects.length})
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div key={proj.id} className="p-4 rounded-xl bg-[#0a0b14] border border-[#1e2044] space-y-2">
              <h3 className="text-sm font-bold text-white">{proj.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{proj.description}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {proj.tech_stack.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-[#1a1b35] text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Passport Details"
        size="md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Headline / Title
            </label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. AI Specialist & Full-Stack Engineer" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              College or Organization
            </label>
            <Input value={collegeOrOrg} onChange={(e) => setCollegeOrOrg(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Location
            </label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Bio
            </label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="looking"
              checked={isLookingForTeam}
              onChange={(e) => setIsLookingForTeam(e.target.checked)}
              className="rounded border-[#1e2044] text-blue-600 focus:ring-0"
            />
            <label htmlFor="looking" className="text-xs text-slate-300 font-medium cursor-pointer">
              Show &ldquo;Looking for Team&rdquo; badge on TeamMatch
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="font-semibold">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Achievement Modal */}
      <Modal
        isOpen={isAddAchOpen}
        onClose={() => setIsAddAchOpen(false)}
        title="Add New Achievement"
        size="md"
      >
        <form onSubmit={handleAddAchievement} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Achievement Title
            </label>
            <Input
              required
              value={achTitle}
              onChange={(e) => setAchTitle(e.target.value)}
              placeholder="e.g. 1st Place — AI Sprint 2025"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Verification Tier
            </label>
            <select
              value={achVerification}
              onChange={(e) => setAchVerification(e.target.value as AchievementVerification)}
              className="w-full h-10 rounded-lg border border-[#1e2044] bg-[#0a0b14] px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="self-reported">Self-Reported</option>
              <option value="organizer-confirmed">Organizer-Confirmed</option>
              <option value="verified">TechOrbit Verified</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Note: Never claim an achievement is verified without authentic proof.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <Textarea
              value={achDesc}
              onChange={(e) => setAchDesc(e.target.value)}
              rows={2}
              placeholder="Track name, prize amount, or team role..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Date
              </label>
              <Input
                type="date"
                value={achDate}
                onChange={(e) => setAchDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Proof URL (Optional)
              </label>
              <Input
                value={achProofUrl}
                onChange={(e) => setAchProofUrl(e.target.value)}
                placeholder="https://devpost.com/..."
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsAddAchOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="font-semibold">
              Add Achievement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

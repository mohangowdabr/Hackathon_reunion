'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/data-store';
import { Profile, ExperienceLevel } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchInput } from '@/components/ui/search-input';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Users,
  Search,
  Filter,
  MapPin,
  GraduationCap,
  Sparkles,
  Send,
  CheckCircle2,
  ExternalLink,
  Clock,
  UserPlus,
} from 'lucide-react';

export default function FindTeammatesPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [onlyLooking, setOnlyLooking] = useState(true);

  // Collab request modal
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  useEffect(() => {
    const list = dataStore.getProfiles();
    setProfiles(list);

    // Existing sent requests
    const sent = dataStore.getCollaborationRequests(user?.id || 'dev-user-1');
    setSentRequests(sent.map((r) => r.to_user_id));
  }, [user]);

  const handleOpenCollabModal = (profile: Profile) => {
    setSelectedProfile(profile);
    setRequestMessage(
      `Hi ${profile.full_name.split(' ')[0]}! I saw your profile on TechOrbit TeamMatch and would love to collaborate on upcoming hackathons.`
    );
    setIsRequestModalOpen(true);
  };

  const handleSendRequest = () => {
    if (selectedProfile && user) {
      dataStore.sendCollaborationRequest({
        from_user_id: user.id,
        to_user_id: selectedProfile.user_id,
        team_id: null,
        message: requestMessage,
        status: 'pending',
      });
      setSentRequests((prev) => [...prev, selectedProfile.user_id]);
      setIsRequestModalOpen(false);
      setSelectedProfile(null);
    }
  };

  const filteredProfiles = profiles.filter((p) => {
    // Exclude self if logged in
    if (user && p.user_id === user.id) return false;

    if (onlyLooking && !p.is_looking_for_team) return false;

    if (selectedExperience && p.experience_level !== selectedExperience) return false;

    if (search) {
      const q = search.toLowerCase();
      const matchesName = p.full_name.toLowerCase().includes(q);
      const matchesOrg = p.college_or_org?.toLowerCase().includes(q) || false;
      const matchesBio = p.bio?.toLowerCase().includes(q) || false;
      const matchesLoc = p.location?.toLowerCase().includes(q) || false;
      if (!matchesName && !matchesOrg && !matchesBio && !matchesLoc) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1e2044]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-medium mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>TeamMatch Collaboration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Find Teammates
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover passionate developers, designers, and AI specialists to team up for upcoming challenges.
          </p>
        </div>

        <Link href="/dashboard/teams">
          <Button variant="outline" className="gap-2 font-semibold">
            My Teams
          </Button>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#111225] border border-[#1e2044] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:max-w-md">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name, university, or keywords..."
          />
        </div>

        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className="h-10 rounded-lg border border-[#1e2044] bg-[#0a0b14] px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Experience Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer px-3 py-2 rounded-lg bg-[#0a0b14] border border-[#1e2044]">
            <input
              type="checkbox"
              checked={onlyLooking}
              onChange={(e) => setOnlyLooking(e.target.checked)}
              className="rounded border-[#1e2044] text-blue-600 focus:ring-0"
            />
            <span>Actively looking for team</span>
          </label>
        </div>
      </div>

      {/* Profiles Grid */}
      {filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((person) => {
            const hasSent = sentRequests.includes(person.user_id);

            return (
              <Card
                key={person.id}
                hover
                className="flex flex-col justify-between border-[#1e2044] hover:border-violet-500/40"
              >
                <div className="p-6">
                  {/* Avatar & Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30 flex items-center justify-center font-bold text-base">
                        {person.full_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white hover:text-blue-400">
                          <Link href={`/people/${person.username}`}>
                            {person.full_name}
                          </Link>
                        </h3>
                        <p className="text-xs text-slate-400 capitalize">
                          {person.title || `${person.experience_level} developer`}
                        </p>
                      </div>
                    </div>

                    {person.is_looking_for_team && (
                      <Badge variant="success" size="sm" className="shrink-0 text-[10px]">
                        Available
                      </Badge>
                    )}
                  </div>

                  {/* University & Location */}
                  <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                    {person.college_or_org && (
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{person.college_or_org}</span>
                      </div>
                    )}
                    {person.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{person.location}</span>
                      </div>
                    )}
                    {person.availability && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{person.availability}</span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  {person.bio && (
                    <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                      {person.bio}
                    </p>
                  )}

                  {/* Completion Pill */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-[#1e2044]">
                    <span>Passport Quality</span>
                    <span className="text-blue-400 font-semibold">{person.profile_completion}%</span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="px-6 py-3.5 bg-[#0d0e1f] border-t border-[#1e2044] flex items-center justify-between gap-3">
                  <Link
                    href={`/people/${person.username}`}
                    className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    View Passport →
                  </Link>

                  <Button
                    size="sm"
                    variant={hasSent ? 'outline' : 'secondary'}
                    disabled={hasSent}
                    onClick={() => handleOpenCollabModal(person)}
                    className="gap-1.5 text-xs h-8"
                  >
                    {hasSent ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Requested
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" /> Connect
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title="No teammates match your filters"
          description="Try removing experience filters or searching with different keywords."
          action={{
            label: 'Clear Filters',
            onClick: () => {
              setSearch('');
              setSelectedExperience('');
              setOnlyLooking(false);
            },
          }}
        />
      )}

      {/* Collaboration Request Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Send Collaboration Request"
        description={`Connect with ${selectedProfile?.full_name}`}
        size="md"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-slate-400 leading-relaxed">
            Send an in-app collaboration request to team up. Once accepted, you can invite each other into hackathon teams.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Introduction Message
            </label>
            <Textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              rows={4}
              placeholder="Explain what event you're preparing for and what skills you bring..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={() => setIsRequestModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleSendRequest}
              className="gap-2 font-semibold"
            >
              <Send className="w-4 h-4" /> Send Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


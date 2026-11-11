'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/data-store';
import { Team, Opportunity } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/ui/empty-state';
import { ALL_SKILLS } from '@/lib/constants/skills';
import {
  UsersRound,
  Plus,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  Crown,
  Layers,
} from 'lucide-react';

export default function TeamsPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [selectedOppId, setSelectedOppId] = useState('');
  const [maxMembers, setMaxMembers] = useState(4);
  const [skillsNeeded, setSkillsNeeded] = useState<string[]>(['React', 'Python']);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    loadTeams();
    setOpportunities(dataStore.getOpportunities());
  }, []);

  const loadTeams = () => {
    const list = dataStore.getTeams();
    setTeams(list);
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;

    dataStore.createTeam({
      name: teamName,
      description: teamDesc || null,
      opportunity_id: selectedOppId || null,
      creator_id: user?.id || 'dev-user-1',
      skills_needed: skillsNeeded,
      max_members: maxMembers,
      is_open: true,
      status: 'forming',
      members: [
        {
          id: `tm-${Date.now()}`,
          team_id: 'temp',
          user_id: user?.id || 'dev-user-1',
          role: 'leader',
          joined_at: new Date().toISOString(),
        },
      ],
    });

    loadTeams();
    setIsCreateModalOpen(false);
    setTeamName('');
    setTeamDesc('');
  };

  const handleJoinTeam = (teamId: string) => {
    const success = dataStore.joinTeam(teamId, user?.id || 'dev-user-1');
    if (success) {
      loadTeams();
      alert('Successfully joined the team!');
    } else {
      alert('You are already a member or this team is full.');
    }
  };

  const addSkill = () => {
    if (skillInput && !skillsNeeded.includes(skillInput)) {
      setSkillsNeeded([...skillsNeeded, skillInput]);
      setSkillInput('');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1e2044]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-medium mb-2">
            <UsersRound className="w-3.5 h-3.5" />
            <span>Team Collaboration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Teams & Rosters
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build squads for hackathons, share roles, and collaborate on tech challenges.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2 font-semibold"
        >
          <Plus className="w-4 h-4" /> Create New Team
        </Button>
      </div>

      {/* Teams Grid */}
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => {
            const opp = opportunities.find((o) => o.id === team.opportunity_id);
            const memberCount = team.members?.length || 1;
            const isUserMember = team.members?.some(
              (m) => m.user_id === (user?.id || 'dev-user-1')
            );

            return (
              <Card
                key={team.id}
                className="p-6 border-[#1e2044] bg-[#111225] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="default" size="sm" className="capitalize">
                      {team.status}
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <strong>{memberCount}</strong> / {team.max_members} Members
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{team.name}</h3>

                  {opp && (
                    <div className="mb-3 p-2.5 rounded-lg bg-[#0a0b14] border border-[#1e2044] text-xs">
                      <span className="text-slate-500 block">Formed for:</span>
                      <Link
                        href={`/opportunities/${opp.slug}`}
                        className="font-semibold text-blue-400 hover:text-blue-300 line-clamp-1"
                      >
                        {opp.title} →
                      </Link>
                    </div>
                  )}

                  {team.description && (
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                      {team.description}
                    </p>
                  )}

                  {/* Skills needed */}
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Skills Needed:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {team.skills_needed.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded text-[11px] bg-[#1a1b35] text-violet-300 border border-violet-500/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Team Footer Action */}
                <div className="pt-4 border-t border-[#1e2044] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Created by {team.creator_id === user?.id ? 'You' : 'Leader'}</span>
                  </div>

                  {isUserMember ? (
                    <Badge variant="success" size="sm">
                      Joined
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={memberCount >= team.max_members}
                      onClick={() => handleJoinTeam(team.id)}
                      className="text-xs h-8"
                    >
                      {memberCount >= team.max_members ? 'Team Full' : 'Request to Join'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<UsersRound className="w-8 h-8" />}
          title="No teams formed yet"
          description="Create your first team to start recruiting collaborators for upcoming hackathons."
          action={{
            label: 'Create Team',
            onClick: () => setIsCreateModalOpen(true),
          }}
        />
      )}

      {/* Create Team Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create a New Team"
        size="md"
      >
        <form onSubmit={handleCreateTeam} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Team Name
            </label>
            <Input
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. ByteForge AI Squad"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Associated Opportunity (Optional)
            </label>
            <select
              value={selectedOppId}
              onChange={(e) => setSelectedOppId(e.target.value)}
              className="w-full h-10 rounded-lg border border-[#1e2044] bg-[#0a0b14] px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">None / General Purpose</option>
              {opportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  {opp.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Team Description & Goals
            </label>
            <Textarea
              value={teamDesc}
              onChange={(e) => setTeamDesc(e.target.value)}
              rows={3}
              placeholder="What are you building? What kind of teammate are you looking for?"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Skills Needed
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="e.g. UI/UX Designer, Rust, PyTorch"
                className="h-9"
              />
              <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {skillsNeeded.map((skill) => (
                <span
                  key={skill}
                  onClick={() => setSkillsNeeded(skillsNeeded.filter((s) => s !== skill))}
                  className="px-2 py-0.5 rounded text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30 cursor-pointer"
                >
                  {skill} ×
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="font-semibold">
              Create Team
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


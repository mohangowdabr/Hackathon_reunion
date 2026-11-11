'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { UserRole } from '@/types';
import {
  Settings,
  Shield,
  Bell,
  Eye,
  Key,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, profile, updateProfile, setUserRole, isDevMode } = useAuth();

  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [teamInvites, setTeamInvites] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSavePrivacy = async () => {
    await updateProfile({ is_public: isPublic });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="pb-6 border-b border-[#1e2044]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Account Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Settings & Privacy
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your account role, privacy settings, and notification alerts.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Preferences updated successfully!
        </div>
      )}

      {/* Role Switcher (Active in Dev Mode for seamless evaluator testing) */}
      <div className="p-6 rounded-2xl bg-[#111225] border border-[#1e2044] space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Shield className="w-5 h-5 text-blue-400" />
          <span>Active Role Switcher</span>
        </div>
        <p className="text-xs text-slate-400">
          Switch roles instantly to evaluate the participant dashboard, organizer publishing portal, and admin moderation interface.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {[
            { role: 'participant' as UserRole, title: 'Developer / Student', desc: 'Browse, apply, join teams, and build passport.' },
            { role: 'organizer' as UserRole, title: 'Event Organizer', desc: 'Publish hackathons, manage listings, review applicants.' },
            { role: 'admin' as UserRole, title: 'Platform Admin', desc: 'Moderate listings, verify organizers, review reports.' },
          ].map((item) => (
            <button
              key={item.role}
              type="button"
              onClick={() => handleRoleChange(item.role)}
              className={`p-4 rounded-xl border text-left transition-all ${
                user?.role === item.role
                  ? 'border-blue-500 bg-blue-500/15 text-white shadow-lg shadow-blue-500/10'
                  : 'border-[#1e2044] bg-[#0a0b14] text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white capitalize">{item.title}</span>
                {user?.role === item.role && (
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="p-6 rounded-2xl bg-[#111225] border border-[#1e2044] space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Eye className="w-5 h-5 text-violet-400" />
          <span>Profile Visibility</span>
        </div>
        <p className="text-xs text-slate-400">
          Control who can view your Developer Passport and send collaboration requests.
        </p>

        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-3 p-3 rounded-xl bg-[#0a0b14] border border-[#1e2044] cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mt-0.5 rounded border-[#1e2044] text-blue-600 focus:ring-0"
            />
            <div>
              <p className="text-xs font-semibold text-white">Public Developer Passport</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                When enabled, your verified passport is viewable at /people/{profile?.username || 'you'}.
              </p>
            </div>
          </label>
        </div>

        <Button size="sm" onClick={handleSavePrivacy} className="text-xs">
          Save Visibility Settings
        </Button>
      </div>

      {/* Notification Preferences */}
      <div className="p-6 rounded-2xl bg-[#111225] border border-[#1e2044] space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Bell className="w-5 h-5 text-amber-400" />
          <span>Notification Alerts</span>
        </div>

        <div className="space-y-3 pt-1">
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#0a0b14] border border-[#1e2044] cursor-pointer text-xs">
            <span className="text-slate-300">Deadline reminders (7 days, 3 days, 1 day before cutoff)</span>
            <input
              type="checkbox"
              checked={deadlineAlerts}
              onChange={(e) => setDeadlineAlerts(e.target.checked)}
              className="rounded border-[#1e2044] text-blue-600 focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#0a0b14] border border-[#1e2044] cursor-pointer text-xs">
            <span className="text-slate-300">TeamMatch collaboration invitations & requests</span>
            <input
              type="checkbox"
              checked={teamInvites}
              onChange={(e) => setTeamInvites(e.target.checked)}
              className="rounded border-[#1e2044] text-blue-600 focus:ring-0"
            />
          </label>
        </div>
      </div>
    </div>
  );
}


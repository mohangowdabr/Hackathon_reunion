'use client';

import { useState, useEffect } from 'react';
import { dataStore } from '@/lib/data-store';
import { Profile, UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, GraduationCap, MapPin, CheckCircle2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    setProfiles(dataStore.getProfiles());
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="pb-6 border-b border-[#1e2044]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium mb-2">
          <Users className="w-3.5 h-3.5" />
          <span>User Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          User Directory & Roles
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review participant profiles, verified credentials, and administrative permissions.
        </p>
      </div>

      <div className="space-y-3">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl bg-[#111225] border border-[#1e2044] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                {p.full_name.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{p.full_name}</h3>
                  <Badge variant="outline" size="sm" className="capitalize text-[10px]">
                    {p.experience_level}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  {p.title || 'Developer'} • {p.college_or_org}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              {p.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> {p.location}
                </span>
              )}
              <Badge variant="success" size="sm">
                Active
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


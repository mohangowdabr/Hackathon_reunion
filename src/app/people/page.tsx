'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { dataStore } from '@/lib/data-store';
import { Profile } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import {
  Users,
  MapPin,
  GraduationCap,
  ExternalLink,
  Sparkles,
  Search,
} from 'lucide-react';

export default function PeoplePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setProfiles(dataStore.getProfiles());
  }, []);

  const filtered = profiles.filter((p) => {
    if (!p.is_public) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.full_name.toLowerCase().includes(q) ||
      p.college_or_org?.toLowerCase().includes(q) ||
      p.title?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-200">
      <Header />

      <div className="border-b border-[#1e2044] bg-[#0d0e1f] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Developer Ecosystem</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Community Discovery
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Explore public Developer Passports, connect with builders, and find collaborators across universities and companies.
          </p>

          <div className="mt-6 max-w-md">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search developers by name or university..."
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((person) => (
            <Card
              key={person.id}
              hover
              className="p-6 border-[#1e2044] hover:border-violet-500/40 flex flex-col justify-between"
            >
              <div>
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
                    <Badge variant="success" size="sm" className="text-[10px]">
                      Available
                    </Badge>
                  )}
                </div>

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
                </div>

                {person.bio && (
                  <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                    {person.bio}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-[#1e2044] flex items-center justify-between">
                <span className="text-xs text-slate-500">{person.profile_completion}% passport</span>
                <Link href={`/people/${person.username}`}>
                  <Button size="sm" variant="outline" className="text-xs h-8 gap-1">
                    View Passport <ExternalLink className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}


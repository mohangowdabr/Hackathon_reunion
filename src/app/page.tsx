'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CATEGORIES } from '@/lib/constants/categories';
import { SEED_OPPORTUNITIES } from '@/data/seed-opportunities';
import { formatDateShort, daysUntil } from '@/lib/utils';
import {
  Compass, Users, Rocket, TrendingUp, Zap, Trophy, Globe, Code,
  ArrowRight, CheckCircle2, Sparkles, Shield, Building2, Calendar,
  Clock, MapPin, Search, ChevronRight, Star, Award, Layers
} from 'lucide-react';

function HomeContent() {
  const trending = SEED_OPPORTUNITIES.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-200">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36 bg-grid">
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs sm:text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The All-in-One Tech Opportunity Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-[1.1]">
            Every Tech Opportunity.{' '}
            <span className="gradient-text">One Ecosystem.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover hackathons, coding competitions, open-source programs, internships,
            workshops, conferences, and more. Find your team, participate, and build your future.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/discover">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base">
                <Compass className="w-5 h-5" />
                Explore Opportunities
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base">
                Join TechOrbit
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto p-4 rounded-2xl border border-[#1e2044] bg-[#111225]/60 backdrop-blur-sm">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">500+</p>
              <p className="text-xs sm:text-sm text-slate-500">Opportunities Listed</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">50K+</p>
              <p className="text-xs sm:text-sm text-slate-500">Developers & Students</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">1,200+</p>
              <p className="text-xs sm:text-sm text-slate-500">Teams Formed</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">200+</p>
              <p className="text-xs sm:text-sm text-slate-500">Verified Organizers</p>
            </div>
          </div>

          {/* Visual Preview */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="rounded-2xl border border-[#1e2044] bg-[#111225] p-4 sm:p-6 shadow-2xl glow-blue text-left">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1e2044]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  <span className="text-xs text-slate-500 ml-2 font-mono">techorbit.dev/dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">Live Preview</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mini card 1 */}
                <div className="p-4 rounded-xl bg-[#0a0b14] border border-[#1e2044]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-400">Hackathon</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">Online</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">CodeSprint 2025</h4>
                  <p className="text-xs text-slate-500 mb-3">48-hour global hackathon for AI & Web3</p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-emerald-400 font-semibold">$50,000</span>
                    <span className="text-amber-400">3 days left</span>
                  </div>
                </div>
                {/* Mini card 2 */}
                <div className="p-4 rounded-xl bg-[#0a0b14] border border-[#1e2044]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-violet-400">Open Source</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Free</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">Summer of Code 2025</h4>
                  <p className="text-xs text-slate-500 mb-3">Contribute to top open-source projects</p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-blue-400">Stipend Available</span>
                    <span>Starts Jun 1</span>
                  </div>
                </div>
                {/* Mini card 3 */}
                <div className="p-4 rounded-xl bg-[#0a0b14] border border-[#1e2044]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-cyan-400">TeamMatch</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400">3 Members</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">Team ByteForge</h4>
                  <p className="text-xs text-slate-500 mb-3">Looking for: UI/UX Designer & ML Engineer</p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>For: CodeSprint</span>
                    <span className="text-blue-400 font-medium">Join Team →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 border-t border-[#1e2044]/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Explore Every Opportunity Category
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From competitive coding to research fellowships, discover opportunities tailored to your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} href={`/discover?category=${cat.id}`}>
                <Card hover className="p-5 h-full transition-all group">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Opportunities */}
      <section className="py-20 border-t border-[#1e2044]/50 bg-[#0a0b14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Trending Right Now
              </h2>
              <p className="text-slate-400">
                Top opportunities closing soon or gaining the most attention.
              </p>
            </div>
            <Link href="/discover" className="mt-4 sm:mt-0 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 font-medium">
              View All Opportunities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((opp) => {
              const days = daysUntil(opp.registration_deadline);
              return (
                <Card key={opp.id} hover className="flex flex-col h-full">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="default" size="sm">{opp.category}</Badge>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" size="sm">{opp.format}</Badge>
                        <Badge variant={opp.cost === 'free' ? 'success' : 'warning'} size="sm">
                          {opp.cost === 'free' ? 'Free' : `$${opp.cost_amount}`}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 hover:text-blue-400 transition-colors">
                      <Link href={`/opportunities/${opp.slug}`}>{opp.title}</Link>
                    </h3>

                    <p className="text-xs text-slate-500 mb-2 font-medium">
                      by {opp.organizer_name}
                      {opp.is_verified && (
                        <span className="inline-flex items-center ml-1 text-blue-400" title="Verified Organizer">
                          <CheckCircle2 className="w-3 h-3 inline" />
                        </span>
                      )}
                    </p>

                    <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">
                      {opp.short_description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {opp.required_skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 rounded text-[11px] bg-[#1a1b35] text-slate-400 border border-[#1e2044]">
                          {skill}
                        </span>
                      ))}
                      {opp.required_skills.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[11px] text-slate-500">
                          +{opp.required_skills.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Bottom meta */}
                    <div className="pt-4 border-t border-[#1e2044] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Deadline: {formatDateShort(opp.registration_deadline)}</span>
                      </div>
                      <span className={days <= 3 ? 'text-red-400 font-semibold' : days <= 7 ? 'text-amber-400' : 'text-slate-500'}>
                        {days > 0 ? `${days}d left` : 'Passed'}
                      </span>
                    </div>

                    {opp.prize_info && (
                      <div className="mt-3 pt-3 border-t border-[#1e2044]/50 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Prize Pool</span>
                        <span className="text-emerald-400 font-semibold">{opp.prize_info}</span>
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-3 bg-[#0d0e1f] border-t border-[#1e2044] flex items-center justify-between">
                    <Link href={`/opportunities/${opp.slug}`} className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                      View Details →
                    </Link>
                    <span className="text-[11px] text-slate-500">{opp.views_count} views</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-[#1e2044]/50 bg-grid">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How TechOrbit Works
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A complete journey from discovering opportunities to building your developer identity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Discover',
                description: 'Browse hundreds of technology opportunities across 15+ categories with powerful filters.',
                icon: Compass,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
              },
              {
                step: '02',
                title: 'Connect',
                description: 'Find teammates with complementary skills using TeamMatch for hackathons and projects.',
                icon: Users,
                color: 'text-violet-400',
                bg: 'bg-violet-500/10',
              },
              {
                step: '03',
                title: 'Participate',
                description: 'Apply through official channels, track deadlines, and manage your progress in My Activities.',
                icon: Rocket,
                color: 'text-cyan-400',
                bg: 'bg-cyan-500/10',
              },
              {
                step: '04',
                title: 'Grow',
                description: 'Build your Developer Passport with verified achievements, projects, and participation history.',
                icon: TrendingUp,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
              },
            ].map((item) => (
              <div key={item.step} className="p-6 rounded-xl border border-[#1e2044] bg-[#111225] relative">
                <span className="text-3xl font-black text-[#1e2044] absolute top-4 right-4">
                  {item.step}
                </span>
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TeamMatch Section */}
      <section className="py-20 border-t border-[#1e2044]/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-4">
                <Users className="w-3.5 h-3.5" />
                <span>TeamMatch</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Find Your Perfect Teammates
              </h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                No more scrambling for hackathon teammates on Discord or WhatsApp.
                TeamMatch helps you find collaborators with the exact skills, experience level,
                and availability you need.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Search collaborators by skills, experience, and interests',
                  'Filter by availability and participation preferences',
                  'Create teams and send collaboration requests',
                  'View public developer profiles and past projects',
                ].map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard/teammates">
                <Button variant="secondary" className="gap-2">
                  <Users className="w-4 h-4" />
                  Find Teammates Now
                </Button>
              </Link>
            </div>

            {/* Mock profiles */}
            <div className="space-y-3">
              {[
                {
                  name: 'Priya Sharma',
                  role: 'Full-Stack Developer',
                  org: 'IIT Bombay',
                  skills: ['React', 'Node.js', 'Python', 'PostgreSQL'],
                  looking: true,
                },
                {
                  name: 'Marcus Johnson',
                  role: 'ML Engineer',
                  org: 'Georgia Tech',
                  skills: ['PyTorch', 'TensorFlow', 'FastAPI', 'Docker'],
                  looking: true,
                },
                {
                  name: 'Aisha Patel',
                  role: 'UI/UX Designer',
                  org: 'Design Lab',
                  skills: ['Figma', 'Prototyping', 'User Research', 'Tailwind CSS'],
                  looking: false,
                },
              ].map((person) => (
                <div key={person.name} className="p-4 rounded-xl border border-[#1e2044] bg-[#111225] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a1b35] border border-[#1e2044] flex items-center justify-center font-semibold text-sm text-slate-300">
                      {person.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{person.name}</p>
                      <p className="text-xs text-slate-500">{person.role} • {person.org}</p>
                      <div className="flex gap-1 mt-1">
                        {person.skills.slice(0, 3).map((s) => (
                          <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1b35] text-slate-400">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {person.looking && (
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shrink-0">
                      Looking for Team
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Developer Passport Section */}
      <section className="py-20 border-t border-[#1e2044]/50 bg-[#0a0b14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Mock Passport */}
            <div className="p-6 rounded-2xl border border-[#1e2044] bg-[#111225] glow-blue">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1e2044]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
                    AC
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">Alex Chen</h4>
                    <p className="text-xs text-slate-500">techorbit.dev/people/alexchen</p>
                  </div>
                </div>
                <Badge variant="default" size="sm">Passport Verified</Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-2">Verified Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'].map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded text-xs bg-[#1a1b35] text-slate-300 border border-[#1e2044]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-2">Recent Achievements</p>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-[#0a0b14] border border-[#1e2044] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-white font-medium">1st Place — AI Sprint 2024</span>
                      </div>
                      <span className="text-[10px] text-emerald-400">Verified</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0a0b14] border border-[#1e2044] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-white font-medium">GSOC 2024 Contributor</span>
                      </div>
                      <span className="text-[10px] text-emerald-400">Verified</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Profile Completion</span>
                  <span className="text-blue-400 font-semibold">85%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1a1b35] overflow-hidden">
                  <div className="w-[85%] h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-4">
                <Shield className="w-3.5 h-3.5" />
                <span>Developer Passport</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Your Unified Tech Identity
              </h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Showcase everything in one shareable profile: hackathon wins, open-source
                contributions, certifications, projects, and verified skills.
                Distinguish between self-reported and organizer-verified achievements.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Unified showcase for projects, skills, and achievements',
                  'Clear verification badges: self-reported vs. organizer-confirmed',
                  'Shareable public profile URL for resumes and applications',
                  'Full privacy controls — choose what to make public',
                ].map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className="gap-2">
                  Create Your Passport
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Organizers */}
      <section className="py-20 border-t border-[#1e2044]/50 bg-grid">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-4">
              <Building2 className="w-3.5 h-3.5" />
              <span>For Organizers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Publish & Manage Opportunities
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Reach thousands of developers, manage listings, and track engagement with TechOrbit organizer tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { title: 'Global Reach', desc: 'Put your event in front of 50K+ developers, designers, and students worldwide.', icon: Globe },
              { title: 'Verified Badge', desc: 'Build trust with an organizer verification badge on all your listings.', icon: Shield },
              { title: 'Listing Management', desc: 'Create, edit, draft, and archive opportunities with an intuitive dashboard.', icon: Layers },
              { title: 'Engagement Insights', desc: 'Track real views, saves, and application intent from interested participants.', icon: TrendingUp },
            ].map((item) => (
              <Card key={item.title} className="p-6">
                <item.icon className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/organizer">
              <Button size="lg" className="gap-2">
                <Building2 className="w-4 h-4" />
                Start Publishing Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 border-t border-[#1e2044]/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-violet-600/5 to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            Ready to Discover Your Next Opportunity?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Join thousands of developers who are finding opportunities, forming teams, and building their futures on TechOrbit.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/discover">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                Browse Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0b14]" />}>
      <HomeContent />
    </Suspense>
  );
}

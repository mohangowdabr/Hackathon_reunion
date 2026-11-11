import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Orbit, Compass, Users, IdCard, Shield, Globe, Award, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-200">
      <Header />

      <div className="border-b border-[#1e2044] bg-[#0d0e1f] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-4">
            <Orbit className="w-3.5 h-3.5" />
            <span>The TechOrbit Mission</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Every Opportunity. <span className="gradient-text">One Ecosystem.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            TechOrbit is unifying the fragmented world of technology competitions, hackathons, open source programs, and developer collaboration.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Core Vision */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">The Problem We Are Solving</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Today, technology opportunities are scattered across hundreds of disparate websites, social media groups, college Discord servers, and corporate portals. Participants struggle to discover opportunities on time, find reliable teammates, track multi-stage applications, or showcase verified accomplishments in one credible place.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            TechOrbit bridges this divide by creating a complete end-to-end journey:
            <strong className="text-blue-400"> Discover → Explore → Apply → Connect → Participate → Showcase → Grow</strong>.
          </p>
        </section>

        {/* Pillar grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#111225] border border-[#1e2044]">
            <Compass className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Opportunity Radar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A centralized discovery engine indexing hackathons, CTFs, research fellowships, coding competitions, and conferences with multi-dimensional filtering.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111225] border border-[#1e2044]">
            <Users className="w-8 h-8 text-violet-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">TeamMatch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find teammates with complementary skills based on availability, timezone, and project interests, without relying on fragmented chat groups.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111225] border border-[#1e2044]">
            <IdCard className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Developer Passport</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A unified public portfolio showcasing verified hackathon wins, open-source commits, and certifications with transparent verification tiers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111225] border border-[#1e2044]">
            <Shield className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Organizer & Moderation Tools</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              An ecosystem where community organizers publish authentic opportunities while admin moderation safeguards participant trust.
            </p>
          </div>
        </div>

        {/* CTA */}
        <section className="text-center p-8 rounded-2xl bg-[#111225] border border-[#1e2044]">
          <h3 className="text-xl font-bold text-white mb-2">Ready to explore?</h3>
          <p className="text-xs text-slate-400 mb-6">Join developers and students discovering their next tech breakthrough.</p>
          <div className="flex justify-center gap-3">
            <Link href="/register">
              <Button>Join TechOrbit</Button>
            </Link>
            <Link href="/discover">
              <Button variant="outline">Browse Radar</Button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}


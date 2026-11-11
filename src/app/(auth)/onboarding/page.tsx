'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { SKILL_GROUPS, ALL_SKILLS } from '@/lib/constants/skills';
import { CATEGORIES } from '@/lib/constants/categories';
import { ExperienceLevel, OpportunityCategory } from '@/types';
import {
  Orbit,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Briefcase,
  Compass,
  Code,
  Globe,
} from 'lucide-react';
import { Github, Linkedin } from '@/components/ui/icons';

const STEPS = [
  { id: 1, title: 'Identity', desc: 'Who you are' },
  { id: 2, title: 'Background', desc: 'Where you are' },
  { id: 3, title: 'Skills', desc: 'What you build with' },
  { id: 4, title: 'Interests', desc: 'Opportunities you seek' },
  { id: 5, title: 'Links', desc: 'Your public footprint' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [isStudent, setIsStudent] = useState(true);
  const [collegeOrOrg, setCollegeOrOrg] = useState(profile?.college_or_org || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    profile?.experience_level || 'beginner'
  );
  const [bio, setBio] = useState(profile?.bio || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js']);
  const [selectedInterests, setSelectedInterests] = useState<OpportunityCategory[]>([
    'hackathon',
    'open-source',
    'coding-competition',
  ]);
  const [githubUrl, setGithubUrl] = useState(profile?.github_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url || '');
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || '');

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleInterest = (catId: OpportunityCategory) => {
    setSelectedInterests((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const handleNext = () => {
    if (step < STEPS.length) {
      setStep((s) => s + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const finishOnboarding = async () => {
    await updateProfile({
      full_name: fullName,
      is_student: isStudent,
      college_or_org: collegeOrOrg,
      location,
      experience_level: experienceLevel,
      bio,
      github_url: githubUrl || null,
      linkedin_url: linkedinUrl || null,
      website_url: websiteUrl || null,
      onboarding_completed: true,
      profile_completion: 80,
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0a0b14] py-12 px-4 sm:px-6 lg:px-8 relative bg-grid">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Orbit className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white">Tech<span className="gradient-text">Orbit</span> Onboarding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Let&apos;s personalize your experience</h1>
          <p className="text-sm text-slate-400 mt-1">This helps us match opportunities, teammates, and track your achievements.</p>
        </div>

        {/* Stepper Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#1e2044] -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />
            {STEPS.map((s) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step >= s.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-4 ring-[#0a0b14]'
                      : 'bg-[#111225] border border-[#1e2044] text-slate-500'
                  }`}
                >
                  {s.id}
                </div>
                <span className="text-[11px] text-slate-400 mt-2 font-medium hidden sm:block">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Card Content */}
        <div className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          {/* STEP 1: Identity */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-semibold text-white">How should we address you?</h3>
                <p className="text-xs text-slate-400 mt-1">Your display name across TechOrbit, TeamMatch, and Developer Passport.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Primary Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsStudent(true)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isStudent
                        ? 'border-blue-500 bg-blue-500/10 text-white'
                        : 'border-[#1e2044] bg-[#0a0b14] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5 mb-2 text-blue-400" />
                    <p className="text-sm font-semibold text-white">Student / Learner</p>
                    <p className="text-xs text-slate-500 mt-1">In college, bootcamp, or self-learning</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsStudent(false)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      !isStudent
                        ? 'border-blue-500 bg-blue-500/10 text-white'
                        : 'border-[#1e2044] bg-[#0a0b14] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Briefcase className="w-5 h-5 mb-2 text-violet-400" />
                    <p className="text-sm font-semibold text-white">Professional / Builder</p>
                    <p className="text-xs text-slate-500 mt-1">Working developer, founder, or designer</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Background */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-semibold text-white">Tell us about your background</h3>
                <p className="text-xs text-slate-400 mt-1">This helps tailor eligibility checks and local events.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  {isStudent ? 'College / University' : 'Company / Organization'}
                </label>
                <Input
                  value={collegeOrOrg}
                  onChange={(e) => setCollegeOrOrg(e.target.value)}
                  placeholder={isStudent ? 'e.g. Stanford University or MIT' : 'e.g. Acme Corp or Self-employed'}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  City, Country
                </label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, USA or Bengaluru, India"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Experience Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['beginner', 'intermediate', 'advanced', 'expert'] as ExperienceLevel[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setExperienceLevel(level)}
                      className={`p-3 rounded-lg border text-center capitalize text-xs font-medium transition-all ${
                        experienceLevel === level
                          ? 'border-blue-500 bg-blue-500/15 text-blue-400'
                          : 'border-[#1e2044] bg-[#0a0b14] text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Bio / Headline (Optional)
                </label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Briefly describe what you like building or looking to collaborate on..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Skills */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-semibold text-white">Select your tech stack & skills</h3>
                <p className="text-xs text-slate-400 mt-1">Choose skills you know or actively practice. Teammates will search for these.</p>
              </div>

              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#0a0b14] border border-[#1e2044] min-h-[48px]">
                {selectedSkills.length === 0 && (
                  <span className="text-xs text-slate-500">No skills selected yet. Click below to add.</span>
                )}
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 cursor-pointer hover:bg-blue-500/30"
                  >
                    {skill} ×
                  </span>
                ))}
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {Object.entries(SKILL_GROUPS).map(([group, skills]) => (
                  <div key={group}>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{group}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill) => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                              isSelected
                                ? 'bg-blue-600 text-white font-medium shadow-sm'
                                : 'bg-[#0a0b14] border border-[#1e2044] text-slate-300 hover:border-slate-600'
                            }`}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Interests */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-semibold text-white">What opportunities interest you?</h3>
                <p className="text-xs text-slate-400 mt-1">We will prioritize these on your Opportunity Radar dashboard feed.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedInterests.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleInterest(cat.id)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/15 text-white'
                          : 'border-[#1e2044] bg-[#0a0b14] text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                      >
                        <Compass className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{cat.name}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{cat.description}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Links */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-semibold text-white">Connect your portfolio & links</h3>
                <p className="text-xs text-slate-400 mt-1">Make it easy for teammates and organizers to view your public work.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Github className="w-3.5 h-3.5" /> GitHub Profile
                  </label>
                  <Input
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/yourhandle"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn Profile
                  </label>
                  <Input
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourhandle"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" /> Personal Website / Portfolio
                  </label>
                  <Input
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourportfolio.dev"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-[#1e2044] flex items-center justify-between">
            {step > 1 ? (
              <Button variant="ghost" onClick={handleBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              {step > 1 && step < STEPS.length && (
                <Button variant="ghost" onClick={handleNext} className="text-slate-400 hover:text-white">
                  Skip
                </Button>
              )}
              <Button onClick={handleNext} className="gap-2 font-semibold">
                {step === STEPS.length ? 'Complete Setup' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

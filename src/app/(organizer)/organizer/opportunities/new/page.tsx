'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/data-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORIES } from '@/lib/constants/categories';
import { ALL_SKILLS } from '@/lib/constants/skills';
import { Opportunity, OpportunityCategory, OpportunityFormat, OpportunityCost } from '@/types';
import { slugify } from '@/lib/utils';
import {
  Building2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function CreateOpportunityPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<OpportunityCategory>('hackathon');
  const [format, setFormat] = useState<OpportunityFormat>('online');
  const [cost, setCost] = useState<OpportunityCost>('free');
  const [costAmount, setCostAmount] = useState<number | ''>('');
  const [organizerName, setOrganizerName] = useState(profile?.college_or_org || 'DevSphere Labs');
  const [location, setLocation] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('https://');
  const [startDate, setStartDate] = useState('2025-08-01');
  const [endDate, setEndDate] = useState('2025-08-03');
  const [deadline, setDeadline] = useState('2025-07-25');
  const [duration, setDuration] = useState('48 hours');
  const [prizeInfo, setPrizeInfo] = useState('$15,000 in Prizes & Mentorship');
  const [prizeAmount, setPrizeAmount] = useState<number | ''>(15000);
  const [eligibility, setEligibility] = useState('Open to all students, developers, and makers aged 18+.');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'Node.js', 'Python']);
  const [skillInput, setSkillInput] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSkill = () => {
    if (skillInput && !selectedSkills.includes(skillInput)) {
      setSelectedSkills([...selectedSkills, skillInput]);
      setSkillInput('');
    }
  };

  const handleSubmit = (status: 'draft' | 'pending' | 'approved') => {
    if (!title || !description) {
      alert('Please fill in title and description.');
      return;
    }

    setIsSubmitting(true);

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title,
      slug: slugify(title) || `opp-${Date.now()}`,
      description,
      short_description: shortDesc || title,
      category,
      format,
      cost,
      cost_amount: cost === 'paid' && costAmount ? Number(costAmount) : null,
      currency: cost === 'paid' ? 'USD' : null,
      organizer_id: user?.id || 'org-user-1',
      organizer_name: organizerName,
      organizer_logo: null,
      location: format !== 'online' ? location : null,
      registration_url: registrationUrl,
      start_date: new Date(startDate).toISOString(),
      end_date: endDate ? new Date(endDate).toISOString() : null,
      registration_deadline: new Date(deadline).toISOString(),
      duration,
      prize_info: prizeInfo || null,
      prize_amount: prizeAmount ? Number(prizeAmount) : null,
      eligibility,
      required_skills: selectedSkills,
      tags: [category, format, ...selectedSkills.slice(0, 3)],
      cover_image: null,
      is_verified: false,
      is_featured: false,
      status: status, // enters moderation unless approved
      views_count: 0,
      saves_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    dataStore.saveOpportunity(newOpp);
    setIsSubmitting(false);

    alert(
      status === 'pending'
        ? 'Opportunity submitted for moderation! An admin will review it shortly.'
        : 'Opportunity saved as draft.'
    );
    router.push('/organizer/opportunities');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl pb-16">
      {/* Header */}
      <div className="pb-6 border-b border-[#1e2044]">
        <Link
          href="/organizer"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Organizer Portal
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Publish a Technology Opportunity
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          List your hackathon, competition, conference, or workshop on TechOrbit Opportunity Radar.
        </p>
      </div>

      <div className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6 sm:p-8 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Opportunity Title *
          </label>
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. CodeSprint 2025 — Global Online Hackathon"
          />
        </div>

        {/* Short description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Short Tagline / Summary (1-2 sentences)
          </label>
          <Input
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            placeholder="e.g. A 48-hour global hackathon tackling AI and sustainability challenges."
          />
        </div>

        {/* Full description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Full Description (Markdown Supported) *
          </label>
          <Textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            placeholder="Describe the opportunity, tracks, challenges, submission guidelines, and schedule..."
          />
        </div>

        {/* Category & Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
              className="w-full h-10 rounded-lg border border-[#1e2044] bg-[#0a0b14] px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Format *
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as OpportunityFormat)}
              className="w-full h-10 rounded-lg border border-[#1e2044] bg-[#0a0b14] px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="online">Online / Virtual</option>
              <option value="hybrid">Hybrid (Online + In-Person)</option>
              <option value="offline">Offline / In-Person Only</option>
            </select>
          </div>
        </div>

        {/* Location if not online */}
        {format !== 'online' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Venue / Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA or IIT Delhi Campus"
            />
          </div>
        )}

        {/* Organizer info */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Organizer Name *
          </label>
          <Input
            required
            value={organizerName}
            onChange={(e) => setOrganizerName(e.target.value)}
            placeholder="e.g. NexaCode Foundation"
          />
        </div>

        {/* Registration URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Official Registration URL *
          </label>
          <Input
            required
            value={registrationUrl}
            onChange={(e) => setRegistrationUrl(e.target.value)}
            placeholder="https://..."
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Applicants will be redirected here when clicking Apply Now.
          </p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Registration Deadline *
            </label>
            <Input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Start Date *
            </label>
            <Input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Cost & Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Cost / Fee
            </label>
            <select
              value={cost}
              onChange={(e) => setCost(e.target.value as OpportunityCost)}
              className="w-full h-10 rounded-lg border border-[#1e2044] bg-[#0a0b14] px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="free">Free for all participants</option>
              <option value="paid">Paid Registration Fee</option>
            </select>
          </div>

          {cost === 'paid' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Fee Amount ($ USD)
              </label>
              <Input
                type="number"
                value={costAmount}
                onChange={(e) => setCostAmount(e.target.value ? Number(e.target.value) : '')}
                placeholder="25"
              />
            </div>
          )}
        </div>

        {/* Prize Pool */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Prize Pool / Perks Summary
          </label>
          <Input
            value={prizeInfo}
            onChange={(e) => setPrizeInfo(e.target.value)}
            placeholder="e.g. $10,000 + Cloud Credits"
          />
        </div>

        {/* Eligibility */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Eligibility Requirements
          </label>
          <Textarea
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value)}
            rows={2}
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Recommended Skills
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="e.g. Machine Learning, React, Go"
              className="h-9"
            />
            <Button type="button" variant="outline" size="sm" onClick={addSkill}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedSkills.map((s) => (
              <span
                key={s}
                onClick={() => setSelectedSkills(selectedSkills.filter((sk) => sk !== s))}
                className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 cursor-pointer"
              >
                {s} ×
              </span>
            ))}
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 rounded border-[#1e2044] text-blue-600 focus:ring-0"
            />
            <span>
              I certify that this opportunity is authentic, adheres to community standards, and agrees to TechOrbit moderation policies.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-[#1e2044] flex flex-col sm:flex-row items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => handleSubmit('draft')}
          >
            Save as Draft
          </Button>

          <Button
            type="button"
            disabled={!agreedTerms || isSubmitting}
            onClick={() => handleSubmit('pending')}
            className="font-bold gap-2"
          >
            Submit for Moderation Review
          </Button>
        </div>
      </div>
    </div>
  );
}


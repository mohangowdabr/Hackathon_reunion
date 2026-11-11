'use client';

import Link from 'next/link';
import { Opportunity } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateShort, daysUntil } from '@/lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Bookmark,
  Share2,
  ExternalLink,
  Trophy,
  ArrowRight,
  Eye,
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export function OpportunityCard({
  opportunity,
  isSaved = false,
  onToggleSave,
}: OpportunityCardProps) {
  const days = daysUntil(opportunity.registration_deadline);

  const getDeadlineBadge = () => {
    if (days < 0) {
      return <Badge variant="outline" size="sm" className="text-slate-500">Passed</Badge>;
    }
    if (days <= 3) {
      return (
        <Badge variant="destructive" size="sm" className="font-semibold animate-pulse">
          {days === 0 ? 'Last Day' : `${days}d left`}
        </Badge>
      );
    }
    if (days <= 7) {
      return (
        <Badge variant="warning" size="sm" className="font-medium">
          {days}d left
        </Badge>
      );
    }
    return (
      <span className="text-xs text-slate-400">
        {formatDateShort(opportunity.registration_deadline)}
      </span>
    );
  };

  return (
    <Card hover className="flex flex-col h-full group border-[#1e2044] hover:border-blue-500/40 transition-all duration-300">
      <div className="p-6 flex-1 flex flex-col">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="default" size="sm" className="capitalize">
            {opportunity.category.replace('-', ' ')}
          </Badge>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" size="sm" className="capitalize">
              {opportunity.format}
            </Badge>
            <Badge
              variant={opportunity.cost === 'free' ? 'success' : 'warning'}
              size="sm"
            >
              {opportunity.cost === 'free' ? 'Free' : `$${opportunity.cost_amount || ''}`}
            </Badge>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-1.5 line-clamp-2 group-hover:text-blue-400 transition-colors">
          <Link href={`/opportunities/${opportunity.slug}`}>
            {opportunity.title}
          </Link>
        </h3>

        {/* Organizer info */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <span>by <strong className="text-slate-300 font-medium">{opportunity.organizer_name}</strong></span>
          {opportunity.is_verified && (
            <span title="Verified Organizer" className="inline-flex text-blue-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          )}
          {opportunity.location && (
            <span className="inline-flex items-center gap-0.5 text-slate-500 ml-1">
              • <MapPin className="w-3 h-3 ml-0.5" /> {opportunity.location}
            </span>
          )}
        </div>

        {/* Short description */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4 flex-1">
          {opportunity.short_description}
        </p>

        {/* Required skills */}
        <div className="flex flex-wrap gap-1 mb-4">
          {opportunity.required_skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded text-[11px] bg-[#1a1b35] text-slate-300 border border-[#1e2044]"
            >
              {skill}
            </span>
          ))}
          {opportunity.required_skills.length > 3 && (
            <span className="px-1.5 py-0.5 text-[11px] text-slate-500">
              +{opportunity.required_skills.length - 3}
            </span>
          )}
        </div>

        {/* Prize / Reward if applicable */}
        {opportunity.prize_info && (
          <div className="mb-4 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
            <span className="text-emerald-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Prize Pool
            </span>
            <span className="text-emerald-300 font-semibold truncate max-w-[180px]">
              {opportunity.prize_info.split('|')[0]}
            </span>
          </div>
        )}

        {/* Deadline and duration */}
        <div className="pt-3 border-t border-[#1e2044] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Deadline:</span>
          </div>
          <div>{getDeadlineBadge()}</div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-6 py-3.5 bg-[#0d0e1f] border-t border-[#1e2044] flex items-center justify-between">
        <div className="flex items-center gap-1">
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(opportunity.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                  : 'bg-[#1a1b35] text-slate-400 border-[#1e2044] hover:text-white hover:border-slate-600'
              }`}
              title={isSaved ? 'Saved to My Activities' : 'Save opportunity'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}
          <span className="text-[11px] text-slate-500 flex items-center gap-1 ml-2">
            <Eye className="w-3 h-3" /> {opportunity.views_count}
          </span>
        </div>

        <Link
          href={`/opportunities/${opportunity.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}


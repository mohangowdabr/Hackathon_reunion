'use client';

import { CATEGORIES } from '@/lib/constants/categories';
import { ALL_SKILLS } from '@/lib/constants/skills';
import { OpportunityCategory, OpportunityFormat, OpportunityCost } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X, RotateCcw, ChevronDown, Check } from 'lucide-react';

interface FiltersState {
  search: string;
  category: OpportunityCategory | '';
  format: OpportunityFormat | '';
  cost: OpportunityCost | '';
  deadline: 'all' | 'urgent' | 'week' | 'month';
  skill: string;
  sort: 'newest' | 'deadline' | 'popular';
}

interface OpportunityFiltersProps {
  filters: FiltersState;
  onChange: (updated: Partial<FiltersState>) => void;
  onReset: () => void;
  totalCount: number;
}

export function OpportunityFiltersSidebar({
  filters,
  onChange,
  onReset,
  totalCount,
}: OpportunityFiltersProps) {
  const activeFilterCount = [
    filters.category ? 1 : 0,
    filters.format ? 1 : 0,
    filters.cost ? 1 : 0,
    filters.deadline !== 'all' ? 1 : 0,
    filters.skill ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="bg-[#111225] border border-[#1e2044] rounded-2xl p-5 sticky top-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1e2044]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="default" size="sm">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Category
        </label>
        <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
          <button
            onClick={() => onChange({ category: '' })}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
              filters.category === ''
                ? 'bg-blue-600/20 text-blue-400 font-semibold'
                : 'text-slate-400 hover:bg-[#1a1b35] hover:text-white'
            }`}
          >
            <span>All Categories</span>
            {filters.category === '' && <Check className="w-3.5 h-3.5" />}
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onChange({ category: isSelected ? '' : cat.id })}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-blue-600/20 text-blue-400 font-semibold'
                    : 'text-slate-400 hover:bg-[#1a1b35] hover:text-white'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Format */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Format
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['online', 'hybrid', 'offline'] as OpportunityFormat[]).map((fmt) => {
            const isSelected = filters.format === fmt;
            return (
              <button
                key={fmt}
                onClick={() => onChange({ format: isSelected ? '' : fmt })}
                className={`py-1.5 px-2 rounded-lg text-xs capitalize text-center border transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300 font-semibold'
                    : 'border-[#1e2044] bg-[#0a0b14] text-slate-400 hover:border-slate-700'
                }`}
              >
                {fmt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cost */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Cost / Pricing
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {(['free', 'paid'] as OpportunityCost[]).map((c) => {
            const isSelected = filters.cost === c;
            return (
              <button
                key={c}
                onClick={() => onChange({ cost: isSelected ? '' : c })}
                className={`py-1.5 px-2 rounded-lg text-xs capitalize text-center border transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold'
                    : 'border-[#1e2044] bg-[#0a0b14] text-slate-400 hover:border-slate-700'
                }`}
              >
                {c === 'free' ? 'Free Access' : 'Paid Entry'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Deadline Filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Registration Deadline
        </label>
        <div className="space-y-1 text-xs">
          {[
            { id: 'all', label: 'Any Deadline' },
            { id: 'urgent', label: 'Closing in 3 days 🔥' },
            { id: 'week', label: 'Within 7 days' },
            { id: 'month', label: 'Within 30 days' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onChange({ deadline: item.id as any })}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                filters.deadline === item.id
                  ? 'bg-blue-600/20 text-blue-400 font-medium'
                  : 'text-slate-400 hover:bg-[#1a1b35] hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {filters.deadline === item.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Skill filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Required Skill
        </label>
        <select
          value={filters.skill}
          onChange={(e) => onChange({ skill: e.target.value })}
          className="w-full h-9 rounded-lg border border-[#1e2044] bg-[#0a0b14] px-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">Any Skill</option>
          {ALL_SKILLS.slice(0, 30).map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}


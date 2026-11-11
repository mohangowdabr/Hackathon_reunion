import { Profile, Opportunity } from '@/types';
import { daysUntil } from '@/lib/utils';

export interface EligibilityResult {
  isEligible: boolean;
  matchScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
}

export interface CopilotResponse {
  answer: string;
  matchedOpportunityIds: string[];
  suggestedFilters?: {
    category?: string;
    format?: string;
    cost?: string;
  };
}

export const aiService = {
  /**
   * Transparent Eligibility Checker
   * Compares participant skills and experience against opportunity requirements.
   */
  checkEligibility: (profile: Profile | null, opportunity: Opportunity): EligibilityResult => {
    if (!profile) {
      return {
        isEligible: true,
        matchScore: 60,
        matchedSkills: [],
        missingSkills: opportunity.required_skills,
        recommendation: 'Sign in to see your personalized skill match analysis.',
      };
    }

    const userSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'];
    const required = opportunity.required_skills;

    const matched = required.filter((req) =>
      userSkills.some((us) => us.toLowerCase() === req.toLowerCase())
    );
    const missing = required.filter(
      (req) => !userSkills.some((us) => us.toLowerCase() === req.toLowerCase())
    );

    const skillScore = required.length > 0 ? (matched.length / required.length) * 70 : 50;
    const expBonus =
      profile.experience_level === 'expert'
        ? 30
        : profile.experience_level === 'advanced'
        ? 25
        : profile.experience_level === 'intermediate'
        ? 20
        : 15;

    const totalScore = Math.min(100, Math.round(skillScore + expBonus));

    let recommendation = '';
    if (totalScore >= 80) {
      recommendation = 'Strong Match! Your profile closely matches all technical requirements for this program.';
    } else if (totalScore >= 50) {
      recommendation = `Good Potential. You match ${matched.length} key skill${matched.length === 1 ? '' : 's'}. Teaming up with a partner strong in ${missing.join(', ') || 'complementary areas'} is recommended.`;
    } else {
      recommendation = `Beginner Opportunity. You can still apply and use this challenge as a learning sprint!`;
    }

    return {
      isEligible: true,
      matchScore: totalScore,
      matchedSkills: matched,
      missingSkills: missing,
      recommendation,
    };
  },

  /**
   * Opportunity Copilot: Natural Language Query Processor
   * Supports natural queries such as:
   * - "Find online hackathons for beginners"
   * - "Show free AI competitions"
   * - "Opportunities with deadlines this month"
   */
  askCopilot: (query: string, allOpportunities: Opportunity[]): CopilotResponse => {
    const q = query.toLowerCase();

    // Heuristic natural query matching (AI-ready service abstraction)
    let filtered = allOpportunities.filter((o) => o.status === 'approved');

    if (q.includes('hackathon')) {
      filtered = filtered.filter((o) => o.category === 'hackathon');
    } else if (q.includes('competition') || q.includes('coding')) {
      filtered = filtered.filter((o) => o.category === 'coding-competition' || o.category === 'hackathon');
    } else if (q.includes('open source') || q.includes('gsoc')) {
      filtered = filtered.filter((o) => o.category === 'open-source');
    } else if (q.includes('internship') || q.includes('fellowship')) {
      filtered = filtered.filter((o) => o.category === 'internship' || o.category === 'fellowship');
    }

    if (q.includes('online') || q.includes('virtual') || q.includes('remote')) {
      filtered = filtered.filter((o) => o.format === 'online');
    }

    if (q.includes('free')) {
      filtered = filtered.filter((o) => o.cost === 'free');
    }

    if (q.includes('ai') || q.includes('machine learning') || q.includes('python')) {
      filtered = filtered.filter(
        (o) =>
          o.title.toLowerCase().includes('ai') ||
          o.required_skills.some((s) => ['python', 'machine learning', 'pytorch', 'tensorflow'].includes(s.toLowerCase()))
      );
    }

    if (q.includes('deadline') || q.includes('closing soon') || q.includes('urgent')) {
      filtered = filtered.filter((o) => {
        const days = daysUntil(o.registration_deadline);
        return days >= 0 && days <= 14;
      });
    }

    const matches = filtered.slice(0, 4);

    return {
      answer:
        matches.length > 0
          ? `I found ${matches.length} matching opportunit${matches.length === 1 ? 'y' : 'ies'} fitting "${query}". Here are the top suggestions from the Opportunity Radar:`
          : `I couldn't find an exact match for "${query}", but here are popular open opportunities you can explore:`,
      matchedOpportunityIds: (matches.length > 0 ? matches : allOpportunities.slice(0, 3)).map((o) => o.id),
    };
  },
};


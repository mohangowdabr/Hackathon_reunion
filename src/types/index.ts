// User and Profile types
export type UserRole = 'participant' | 'organizer' | 'admin';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  title: string | null;
  college_or_org: string | null;
  location: string | null;
  experience_level: ExperienceLevel;
  is_student: boolean;
  github_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  twitter_url: string | null;
  is_public: boolean;
  is_looking_for_team: boolean;
  availability: string | null;
  onboarding_completed: boolean;
  profile_completion: number;
  created_at: string;
  updated_at: string;
}

// Opportunity types
export type OpportunityCategory =
  | 'hackathon' | 'coding-competition' | 'tech-conference' | 'webinar'
  | 'workshop' | 'bootcamp' | 'open-source' | 'internship'
  | 'fellowship' | 'research' | 'startup-challenge' | 'ctf'
  | 'design-challenge' | 'mentorship' | 'certification';

export type OpportunityFormat = 'online' | 'offline' | 'hybrid';
export type OpportunityCost = 'free' | 'paid';
export type OpportunityStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'expired' | 'reported';

export interface Opportunity {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  category: OpportunityCategory;
  format: OpportunityFormat;
  cost: OpportunityCost;
  cost_amount: number | null;
  currency: string | null;
  organizer_id: string;
  organizer_name: string;
  organizer_logo: string | null;
  location: string | null;
  registration_url: string;
  start_date: string;
  end_date: string | null;
  registration_deadline: string;
  duration: string | null;
  prize_info: string | null;
  prize_amount: number | null;
  eligibility: string;
  required_skills: string[];
  tags: string[];
  cover_image: string | null;
  is_verified: boolean;
  is_featured: boolean;
  status: OpportunityStatus;
  views_count: number;
  saves_count: number;
  created_at: string;
  updated_at: string;
}

// Application tracking
export type ApplicationStatus =
  | 'interested' | 'saved' | 'planning' | 'applied'
  | 'shortlisted' | 'accepted' | 'participating'
  | 'completed' | 'rejected' | 'withdrawn';

export interface Application {
  id: string;
  user_id: string;
  opportunity_id: string;
  opportunity?: Opportunity;
  status: ApplicationStatus;
  applied_date: string | null;
  notes: string | null;
  external_link: string | null;
  deadline_reminder: boolean;
  created_at: string;
  updated_at: string;
}

// Team types
export type TeamStatus = 'forming' | 'active' | 'completed' | 'disbanded';

export interface Team {
  id: string;
  name: string;
  description: string | null;
  opportunity_id: string | null;
  opportunity?: Opportunity;
  creator_id: string;
  skills_needed: string[];
  max_members: number;
  is_open: boolean;
  status: TeamStatus;
  members?: TeamMember[];
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  profile?: Profile;
  role: 'leader' | 'member';
  joined_at: string;
}

export type CollaborationRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface CollaborationRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  from_profile?: Profile;
  to_profile?: Profile;
  team_id: string | null;
  message: string | null;
  status: CollaborationRequestStatus;
  created_at: string;
  updated_at: string;
}

// Organizer types
export type OrganizerType = 'company' | 'startup' | 'university' | 'community' | 'government' | 'nonprofit' | 'individual';
export type OrganizerVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface Organizer {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | null;
  type: OrganizerType;
  website: string | null;
  email: string;
  logo_url: string | null;
  social_links: Record<string, string>;
  verification_status: OrganizerVerificationStatus;
  is_trusted: boolean;
  created_at: string;
  updated_at: string;
}

// Developer Passport
export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  tech_stack: string[];
  project_url: string | null;
  github_url: string | null;
  image_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export type AchievementVerification = 'self-reported' | 'organizer-confirmed' | 'verified';

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  opportunity_id: string | null;
  opportunity?: Opportunity;
  type: 'participation' | 'award' | 'certification' | 'completion' | 'contribution';
  verification: AchievementVerification;
  date: string;
  proof_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// Notification types
export type NotificationType =
  | 'collaboration_request' | 'team_invitation' | 'opportunity_approved'
  | 'deadline_approaching' | 'application_updated' | 'organizer_announcement'
  | 'platform_notification';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

// Category metadata
export interface CategoryInfo {
  id: OpportunityCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  count?: number;
}

// Filters
export interface OpportunityFilters {
  search?: string;
  category?: OpportunityCategory | '';
  format?: OpportunityFormat | '';
  cost?: OpportunityCost | '';
  skills?: string[];
  eligibility?: string;
  sort?: 'newest' | 'deadline' | 'popular';
  page?: number;
  limit?: number;
}

-- ==============================================================================
-- TechOrbit Database Schema & Supabase Row Level Security (RLS) Policies
-- Migration: 20250101000000_initial_schema.sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES & IDENTITY
-- ------------------------------------------------------------------------------

CREATE TYPE user_role AS ENUM ('participant', 'organizer', 'admin');
CREATE TYPE experience_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    title TEXT,
    college_or_org TEXT,
    location TEXT,
    experience_level experience_level DEFAULT 'beginner',
    is_student BOOLEAN DEFAULT TRUE,
    role user_role DEFAULT 'participant',
    github_url TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    twitter_url TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    is_looking_for_team BOOLEAN DEFAULT FALSE,
    availability TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    profile_completion INTEGER DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_looking_team ON public.profiles(is_looking_for_team);

-- Skills Master & Junction
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    years_experience NUMERIC(3, 1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- ------------------------------------------------------------------------------
-- 2. ORGANIZERS & OPPORTUNITIES
-- ------------------------------------------------------------------------------

CREATE TYPE organizer_type AS ENUM ('company', 'startup', 'university', 'community', 'government', 'nonprofit', 'individual');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');

CREATE TABLE IF NOT EXISTS public.organizers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    type organizer_type DEFAULT 'community',
    website TEXT,
    email TEXT NOT NULL,
    logo_url TEXT,
    social_links JSONB DEFAULT '{}',
    verification_status verification_status DEFAULT 'unverified',
    is_trusted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE opportunity_category AS ENUM (
    'hackathon', 'coding-competition', 'tech-conference', 'webinar',
    'workshop', 'bootcamp', 'open-source', 'internship',
    'fellowship', 'research', 'startup-challenge', 'ctf',
    'design-challenge', 'mentorship', 'certification'
);

CREATE TYPE opportunity_format AS ENUM ('online', 'offline', 'hybrid');
CREATE TYPE opportunity_cost AS ENUM ('free', 'paid');
CREATE TYPE opportunity_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'expired', 'reported');

CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    category opportunity_category NOT NULL,
    format opportunity_format NOT NULL DEFAULT 'online',
    cost opportunity_cost NOT NULL DEFAULT 'free',
    cost_amount NUMERIC(10, 2),
    currency TEXT DEFAULT 'USD',
    organizer_id UUID REFERENCES public.organizers(id) ON DELETE SET NULL,
    organizer_name TEXT NOT NULL,
    organizer_logo TEXT,
    location TEXT,
    registration_url TEXT NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    registration_deadline TIMESTAMPTZ NOT NULL,
    duration TEXT,
    prize_info TEXT,
    prize_amount NUMERIC(12, 2),
    eligibility TEXT NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    cover_image TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    status opportunity_status DEFAULT 'pending',
    views_count INTEGER DEFAULT 0,
    saves_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_opportunities_category ON public.opportunities(category);
CREATE INDEX idx_opportunities_status ON public.opportunities(status);
CREATE INDEX idx_opportunities_deadline ON public.opportunities(registration_deadline);
CREATE INDEX idx_opportunities_format ON public.opportunities(format);
CREATE INDEX idx_opportunities_cost ON public.opportunities(cost);

-- ------------------------------------------------------------------------------
-- 3. PARTICIPATION & MY ACTIVITIES
-- ------------------------------------------------------------------------------

CREATE TYPE application_status AS ENUM (
    'interested', 'saved', 'planning', 'applied',
    'shortlisted', 'accepted', 'participating',
    'completed', 'rejected', 'withdrawn'
);

CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
    status application_status DEFAULT 'applied',
    applied_date TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    external_link TEXT,
    deadline_reminder BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, opportunity_id)
);

CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, opportunity_id)
);

-- ------------------------------------------------------------------------------
-- 4. DEVELOPER PASSPORT: PROJECTS & ACHIEVEMENTS
-- ------------------------------------------------------------------------------

CREATE TYPE achievement_type AS ENUM ('participation', 'award', 'certification', 'completion', 'contribution');
CREATE TYPE achievement_verification AS ENUM ('self-reported', 'organizer-confirmed', 'verified');

CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
    type achievement_type DEFAULT 'award',
    verification achievement_verification DEFAULT 'self-reported',
    date DATE NOT NULL,
    proof_url TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] DEFAULT '{}',
    project_url TEXT,
    github_url TEXT,
    image_url TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. TEAMMATCH & COLLABORATION
-- ------------------------------------------------------------------------------

CREATE TYPE team_status AS ENUM ('forming', 'active', 'completed', 'disbanded');

CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    skills_needed TEXT[] DEFAULT '{}',
    max_members INTEGER DEFAULT 4,
    is_open BOOLEAN DEFAULT TRUE,
    status team_status DEFAULT 'forming',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

CREATE TYPE collab_request_status AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE IF NOT EXISTS public.collaboration_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    to_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    message TEXT,
    status collab_request_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. NOTIFICATIONS
-- ------------------------------------------------------------------------------

CREATE TYPE notification_type AS ENUM (
    'collaboration_request', 'team_invitation', 'opportunity_approved',
    'deadline_approaching', 'application_updated', 'organizer_announcement',
    'platform_notification'
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read);

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view public profiles; user can edit only their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Opportunities: Approved opportunities are viewable by all; organizers edit own; admins edit all
CREATE POLICY "Approved opportunities are viewable by everyone" ON public.opportunities
    FOR SELECT USING (status = 'approved' OR auth.uid() IN (
        SELECT user_id FROM public.profiles WHERE role IN ('admin', 'organizer')
    ));

CREATE POLICY "Organizers can create opportunities" ON public.opportunities
    FOR INSERT WITH CHECK (auth.uid() IN (
        SELECT user_id FROM public.profiles WHERE role IN ('organizer', 'admin')
    ));

CREATE POLICY "Organizers can update own opportunities" ON public.opportunities
    FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.organizers WHERE id = organizer_id) OR auth.uid() IN (
        SELECT user_id FROM public.profiles WHERE role = 'admin'
    ));

-- Applications: Users can manage only their own applications
CREATE POLICY "Users can view own applications" ON public.applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON public.applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON public.applications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON public.applications
    FOR DELETE USING (auth.uid() = user_id);

-- Saved Opportunities
CREATE POLICY "Users can manage own saved opportunities" ON public.saved_opportunities
    FOR ALL USING (auth.uid() = user_id);

-- Achievements & Projects: Viewable if public or by owner; editable only by owner
CREATE POLICY "Public achievements are viewable by all" ON public.achievements
    FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can modify own achievements" ON public.achievements
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public projects are viewable by all" ON public.projects
    FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can modify own projects" ON public.projects
    FOR ALL USING (auth.uid() = user_id);

-- Teams: Viewable by all; manageable by team creator / members
CREATE POLICY "Teams are viewable by everyone" ON public.teams
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can create teams" ON public.teams
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update teams" ON public.teams
    FOR UPDATE USING (auth.uid() = creator_id);

-- Notifications: Only visible to the target user
CREATE POLICY "Users can view and update own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);


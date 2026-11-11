# TechOrbit — Every Opportunity. One Ecosystem.

TechOrbit is an all-in-one technology opportunity discovery, participation, collaboration, and career-growth platform. It unifies the fragmented technology opportunity experience: connecting hackathons, coding competitions, open-source programs, fellowships, workshops, bootcamps, and conferences with developer team formation, participation tracking, and verified developer portfolios.

---

## 🌟 Key Differentiators & Features

### 1. 📡 Opportunity Radar
- Centralized discovery engine covering all **15 opportunity categories** (Hackathons, Coding Competitions, Conferences, Open Source, Internships, Fellowships, Bootcamps, Workshops, CTFs, Design Challenges, and more).
- Multi-dimensional filtering: Category, Online/Hybrid/Offline, Free vs. Paid, Urgency/Deadline Countdown, and Required Skills.
- Real-time search by keyword, title, technologies, and organizers with URL-query synchronization (`/discover?category=hackathon`).
- Dedicated detail pages with comprehensive eligibility criteria, required skills, timeline breakdowns, and direct external redirect tracking.
- **Honest Application Tracking**: Automatically logs application intent in *My Activities* while redirecting users to the organizer's official portal without falsely claiming external submission.

### 2. 🤝 TeamMatch — Find Teammates
- Dedicated collaborator discovery engine with skill filters, experience levels, and availability flags.
- Complete Team creation and squad management workflows (defining team name, associated opportunity, required skills, member rosters).
- In-app collaboration requests workflow with personalized introductory messages.

### 3. 🛡️ Developer Passport
- A unified public-facing professional identity for developers, students, and makers.
- Distinguishes transparently between **TechOrbit Verified**, **Organizer-Confirmed**, and **Self-Reported** achievements.
- Interactive showcase for projects, tech stacks, live demo URLs, and GitHub repositories.
- Shareable public passport URL (`/people/[username]`) with one-click copy and privacy controls.

### 4. 📈 My Activities — Participation Tracker
- Personal activity management pipeline tracking opportunities across all 10 stages:
  *Interested*, *Saved*, *Planning to Apply*, *Applied*, *Shortlisted*, *Accepted*, *Participating*, *Completed*, *Rejected*, *Withdrawn*.
- Manual status updates with custom personal notes and progress updates.
- Urgent deadline monitors and reminder notifications.

### 5. 🏢 Organizer Portal
- Event publishing dashboard with impression metrics and bookmark analytics.
- Multi-field opportunity creation form supporting start/end dates, registration cutoffs, prize pools, eligibility rules, and required skill chips.
- Listing management to edit, update, or archive events.
- Transparent moderation flow: newly submitted opportunities are routed to review before being published publicly.

### 6. ⚖️ Admin Moderation Center
- Platform governance overview tracking active listings and user counts.
- Dedicated moderation queue to inspect submitted events, approve for public listing, reject, or grant the **Verified Badge**.
- User directory with role management.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18.18+ or 20+ (tested on Node v26.13.0)
- npm or pnpm

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/yourusername/techorbit.git
cd techorbit
npm install
```

### 2. Environment Configuration
TechOrbit is built with a **graceful local development mode**. When Supabase keys are not provided, it automatically boots in development mode using rich seed data with full state persistence in browser `localStorage`.

Copy the sample environment file:
```bash
cp .env.example .env.local
```

For zero-config local testing, `.env.local` contains:
```env
NEXT_PUBLIC_DEV_MODE=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=TechOrbit
```

To connect a live Supabase database, set:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_DEV_MODE=false
```

### 3. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Accounts & Role Switcher

In development mode, you can sign in with any of the pre-configured accounts (any password works):

| Account Email | Role | Character Persona | Access |
|---|---|---|---|
| `demo@techorbit.dev` | Participant | Alex Chen (Full-stack developer) | Participant Dashboard, My Activities, Passport, Teams |
| `organizer@techorbit.dev` | Organizer | Sarah Mitchell (DevSphere Foundation) | Organizer Portal, Create & Edit Events |
| `admin@techorbit.dev` | Admin | TechOrbit Platform Administrator | Admin Overview, Moderation Queue, User Directory |

> **Pro-Tip**: You can also switch roles on the fly at any time via **Dashboard → Settings → Active Role Switcher** to test all three perspectives without logging out!

---

## 🗄️ Database Architecture & Migrations

The complete PostgreSQL schema with foreign keys, indexes, and Supabase Row Level Security (RLS) is located at:
- `supabase/migrations/20250101000000_initial_schema.sql`

### Tables Included
1. **Identity & Profiles**: `profiles`, `skills`, `user_skills`
2. **Opportunities**: `opportunities`, `organizers`, `categories`
3. **Participation**: `applications`, `saved_opportunities`
4. **Passport**: `achievements`, `projects`
5. **TeamMatch**: `teams`, `team_members`, `collaboration_requests`
6. **Platform**: `notifications`

### Running Migrations in Supabase
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Paste the contents of `supabase/migrations/20250101000000_initial_schema.sql` and click **Run**.
4. All tables and RLS policies are applied automatically.

---

## 🚢 Deployment (Vercel)

1. Push your repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Set your environment variables from `.env.example`.
4. Deploy! Next.js App Router will optimize static and dynamic routes automatically.

---

## 📋 Feature Completion Checklist

- [x] Modern futuristic SaaS design with dark theme, electric blue, violet, and cyan accents.
- [x] Responsive public website with Hero, Categories, Trending, How it Works, TeamMatch preview, Passport preview, and Organizer sections.
- [x] Opportunity Radar (`/discover`) with search, 15 categories, format, cost, skills, sorting, and URL persistence.
- [x] Opportunity detail page (`/opportunities/[slug]`) with timeline, prize info, related items, save action, and external apply modal.
- [x] Complete Auth suite (`/login`, `/register`, `/forgot-password`, `/onboarding` 5-step flow).
- [x] Participant Dashboard (`/dashboard`) with deadlines widget, active pipeline, and recommendations.
- [x] My Activities (`/dashboard/activities`) with 10-stage status tracker, notes editor, and tab filters.
- [x] Saved opportunities manager (`/dashboard/saved`).
- [x] TeamMatch collaborator finder (`/dashboard/teammates`) with collaboration request modal.
- [x] Team creator and squad manager (`/dashboard/teams`).
- [x] Developer Passport editor (`/dashboard/passport`) with verification tiers and public URL copy.
- [x] Public Developer Passport (`/people/[username]`).
- [x] Projects showcase manager (`/dashboard/projects`).
- [x] Notification center (`/dashboard/notifications`).
- [x] Settings with dynamic role switching and privacy controls (`/dashboard/settings`).
- [x] Organizer dashboard, listing manager, and create opportunity form (`/organizer`).
- [x] Admin overview and opportunity moderation queue (`/admin`).
- [x] 25+ realistic fictional seed opportunities across all 15 categories.
- [x] PostgreSQL migration file with RLS security policies.

---

## 📄 License
MIT © 2025 TechOrbit Ecosystem. Built for developers worldwide.

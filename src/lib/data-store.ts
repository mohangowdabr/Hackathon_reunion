'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Opportunity,
  OpportunityFilters,
  Application,
  ApplicationStatus,
  Team,
  Profile,
  CollaborationRequest,
  Project,
  Achievement,
  Notification,
  Organizer,
} from '@/types';
import { SEED_OPPORTUNITIES } from '@/data/seed-opportunities';
import { SEED_PROFILES } from '@/data/seed-profiles';
import { SEED_TEAMS } from '@/data/seed-teams';

const STORAGE_KEYS = {
  OPPORTUNITIES: 'techorbit_opportunities',
  APPLICATIONS: 'techorbit_applications',
  SAVED_IDS: 'techorbit_saved_opportunity_ids',
  TEAMS: 'techorbit_teams',
  PROFILES: 'techorbit_profiles',
  COLLAB_REQUESTS: 'techorbit_collab_requests',
  PROJECTS: 'techorbit_projects',
  ACHIEVEMENTS: 'techorbit_achievements',
  NOTIFICATIONS: 'techorbit_notifications',
  ORGANIZERS: 'techorbit_organizers',
};

// Initial seed projects for Alex Chen (default demo user)
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    user_id: 'dev-user-1',
    title: 'CodePulse — Real-Time Dev Metrics',
    description: 'An open-source telemetry dashboard for remote engineering teams built with Next.js, WebSockets, and TimescaleDB.',
    tech_stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'WebSockets', 'PostgreSQL'],
    project_url: 'https://codepulse-demo.dev',
    github_url: 'https://github.com/alexchen/codepulse',
    image_url: null,
    is_public: true,
    created_at: '2024-11-10T00:00:00Z',
    updated_at: '2025-01-12T00:00:00Z',
  },
  {
    id: 'proj-2',
    user_id: 'dev-user-1',
    title: 'MedEcho — AI Radiology Assistant',
    description: 'Award-winning prototype from HealthTech Hacks 2024 that flags chest X-ray anomalies with 94% precision.',
    tech_stack: ['Python', 'FastAPI', 'PyTorch', 'React', 'Docker'],
    project_url: 'https://medecho.tech',
    github_url: 'https://github.com/alexchen/medecho',
    image_url: null,
    is_public: true,
    created_at: '2024-09-15T00:00:00Z',
    updated_at: '2024-10-20T00:00:00Z',
  },
];

// Initial seed achievements for Alex Chen
const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    user_id: 'dev-user-1',
    title: '1st Place — HealthTech Hacks 2024',
    description: 'Winner of overall track and Best Clinical Impact category with project MedEcho.',
    opportunity_id: 'opp-2',
    type: 'award',
    verification: 'verified',
    date: '2024-10-14',
    proof_url: 'https://verify.techorbit.dev/certs/ht-2024-alexchen',
    is_public: true,
    created_at: '2024-10-15T00:00:00Z',
    updated_at: '2024-10-15T00:00:00Z',
  },
  {
    id: 'ach-2',
    user_id: 'dev-user-1',
    title: 'Open Source Fellow — PyTorch Foundation',
    description: 'Completed 12-week fellowship contributing to torch.compile backend optimizations.',
    opportunity_id: null,
    type: 'contribution',
    verification: 'organizer-confirmed',
    date: '2024-08-30',
    proof_url: 'https://github.com/pytorch/pytorch/pulls?q=author%3Aalexchen',
    is_public: true,
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-09-01T00:00:00Z',
  },
  {
    id: 'ach-3',
    user_id: 'dev-user-1',
    title: 'AWS Certified Solutions Architect — Associate',
    description: 'Scored 890/1000 on SAA-C03 cloud architecture certification.',
    opportunity_id: null,
    type: 'certification',
    verification: 'self-reported',
    date: '2024-05-18',
    proof_url: 'https://aws.amazon.com/verification',
    is_public: true,
    created_at: '2024-05-20T00:00:00Z',
    updated_at: '2024-05-20T00:00:00Z',
  },
];

// Initial seed applications for Alex Chen
const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    user_id: 'dev-user-1',
    opportunity_id: 'opp-1',
    status: 'applied',
    applied_date: '2025-03-12T10:00:00Z',
    notes: 'Submitted team application with NeuralNinjas squad. Preparing project architecture.',
    external_link: 'https://codesprint2025.dev',
    deadline_reminder: true,
    created_at: '2025-03-10T00:00:00Z',
    updated_at: '2025-03-12T10:00:00Z',
  },
  {
    id: 'app-2',
    user_id: 'dev-user-1',
    opportunity_id: 'opp-2',
    status: 'accepted',
    applied_date: '2025-02-14T09:30:00Z',
    notes: 'Confirmation received. Attending on-site in Boston with travel stipend approved.',
    external_link: null,
    deadline_reminder: true,
    created_at: '2025-02-10T00:00:00Z',
    updated_at: '2025-03-01T15:00:00Z',
  },
  {
    id: 'app-3',
    user_id: 'dev-user-1',
    opportunity_id: 'opp-7',
    status: 'planning',
    applied_date: null,
    notes: 'Need to draft open-source proposal before the upcoming cutoff.',
    external_link: null,
    deadline_reminder: true,
    created_at: '2025-03-18T00:00:00Z',
    updated_at: '2025-03-18T00:00:00Z',
  },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'dev-user-1',
    type: 'team_invitation',
    title: 'New Team Invitation',
    message: 'Sophia Chen invited you to join NeuralNinjas for CodeSprint 2025.',
    link: '/dashboard/teams',
    is_read: false,
    created_at: '2025-04-10T14:30:00Z',
  },
  {
    id: 'notif-2',
    user_id: 'dev-user-1',
    type: 'deadline_approaching',
    title: 'Registration Closing Soon',
    message: 'CodeSprint 2025 registration deadline is in 3 days! Finalize team roster.',
    link: '/opportunities/codesprint-2025-global-online-hackathon',
    is_read: false,
    created_at: '2025-04-12T08:00:00Z',
  },
  {
    id: 'notif-3',
    user_id: 'dev-user-1',
    type: 'application_updated',
    title: 'Application Status Updated',
    message: 'Your registration for HealthTech Hacks has been marked as Accepted.',
    link: '/dashboard/activities',
    is_read: true,
    created_at: '2025-04-05T12:00:00Z',
  },
];

export const dataStore = {
  // --- OPPORTUNITIES ---
  getOpportunities: (): Opportunity[] => {
    if (typeof window === 'undefined') return SEED_OPPORTUNITIES;
    const stored = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(SEED_OPPORTUNITIES));
      return SEED_OPPORTUNITIES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return SEED_OPPORTUNITIES;
    }
  },

  getOpportunityBySlug: (slug: string): Opportunity | undefined => {
    const opps = dataStore.getOpportunities();
    return opps.find((o) => o.slug === slug || o.id === slug);
  },

  saveOpportunity: (opp: Opportunity): void => {
    const opps = dataStore.getOpportunities();
    const index = opps.findIndex((o) => o.id === opp.id);
    if (index >= 0) {
      opps[index] = opp;
    } else {
      opps.unshift(opp);
    }
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
  },

  deleteOpportunity: (id: string): void => {
    const opps = dataStore.getOpportunities().filter((o) => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
  },

  incrementOpportunityViews: (id: string): void => {
    const opps = dataStore.getOpportunities();
    const item = opps.find((o) => o.id === id);
    if (item) {
      item.views_count = (item.views_count || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
    }
  },

  // --- SAVED OPPORTUNITY IDS ---
  getSavedOpportunityIds: (): string[] => {
    if (typeof window === 'undefined') return ['opp-1', 'opp-2', 'opp-7'];
    const stored = localStorage.getItem(STORAGE_KEYS.SAVED_IDS);
    if (!stored) {
      const initial = ['opp-1', 'opp-2', 'opp-7'];
      localStorage.setItem(STORAGE_KEYS.SAVED_IDS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  toggleSaveOpportunity: (id: string): boolean => {
    const saved = dataStore.getSavedOpportunityIds();
    const isSaved = saved.includes(id);
    let updated: string[];
    if (isSaved) {
      updated = saved.filter((s) => s !== id);
    } else {
      updated = [...saved, id];
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_IDS, JSON.stringify(updated));

    // Update saves_count in opportunity record
    const opps = dataStore.getOpportunities();
    const item = opps.find((o) => o.id === id);
    if (item) {
      item.saves_count = Math.max(0, (item.saves_count || 0) + (isSaved ? -1 : 1));
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
    }
    return !isSaved;
  },

  // --- APPLICATIONS / MY ACTIVITIES ---
  getApplications: (userId?: string): Application[] => {
    if (typeof window === 'undefined') return INITIAL_APPLICATIONS;
    const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    let apps: Application[] = [];
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
      apps = INITIAL_APPLICATIONS;
    } else {
      try {
        apps = JSON.parse(stored);
      } catch {
        apps = INITIAL_APPLICATIONS;
      }
    }

    // Attach full opportunity objects
    const opps = dataStore.getOpportunities();
    const enriched = apps.map((app) => ({
      ...app,
      opportunity: opps.find((o) => o.id === app.opportunity_id),
    }));

    if (userId) {
      return enriched.filter((a) => a.user_id === userId);
    }
    return enriched;
  },

  updateApplicationStatus: (
    appId: string,
    status: ApplicationStatus,
    notes?: string
  ): Application | null => {
    const apps = dataStore.getApplications();
    const target = apps.find((a) => a.id === appId);
    if (!target) return null;

    target.status = status;
    if (notes !== undefined) target.notes = notes;
    target.updated_at = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    return target;
  },

  recordApplicationIntent: (
    userId: string,
    opportunityId: string,
    status: ApplicationStatus = 'applied',
    notes?: string
  ): Application => {
    const apps = dataStore.getApplications();
    const existing = apps.find((a) => a.user_id === userId && a.opportunity_id === opportunityId);

    if (existing) {
      existing.status = status;
      if (notes) existing.notes = notes;
      existing.updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      return existing;
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      user_id: userId,
      opportunity_id: opportunityId,
      status,
      applied_date: new Date().toISOString(),
      notes: notes || 'Applied via TechOrbit official redirect.',
      external_link: null,
      deadline_reminder: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    apps.unshift(newApp);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    return newApp;
  },

  removeApplication: (appId: string): void => {
    const apps = dataStore.getApplications().filter((a) => a.id !== appId);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
  },

  // --- TEAMS & TEAMMATCH ---
  getTeams: (): Team[] => {
    if (typeof window === 'undefined') return SEED_TEAMS;
    const stored = localStorage.getItem(STORAGE_KEYS.TEAMS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(SEED_TEAMS));
      return SEED_TEAMS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return SEED_TEAMS;
    }
  },

  getTeamById: (teamId: string): Team | undefined => {
    const teams = dataStore.getTeams();
    return teams.find((t) => t.id === teamId);
  },

  createTeam: (team: Omit<Team, 'id' | 'created_at' | 'updated_at'>): Team => {
    const teams = dataStore.getTeams();
    const newTeam: Team = {
      ...team,
      id: `team-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    teams.unshift(newTeam);
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    return newTeam;
  },

  joinTeam: (teamId: string, userId: string, role: 'leader' | 'member' = 'member'): boolean => {
    const teams = dataStore.getTeams();
    const team = teams.find((t) => t.id === teamId);
    if (!team) return false;

    team.members = team.members || [];
    if (team.members.some((m) => m.user_id === userId)) return false;

    team.members.push({
      id: `tm-${Date.now()}`,
      team_id: teamId,
      user_id: userId,
      role,
      joined_at: new Date().toISOString(),
    });

    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    return true;
  },

  // --- COLLABORATION REQUESTS ---
  getCollaborationRequests: (userId?: string): CollaborationRequest[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.COLLAB_REQUESTS);
    if (!stored) return [];
    try {
      const all: CollaborationRequest[] = JSON.parse(stored);
      if (userId) {
        return all.filter((r) => r.to_user_id === userId || r.from_user_id === userId);
      }
      return all;
    } catch {
      return [];
    }
  },

  sendCollaborationRequest: (req: Omit<CollaborationRequest, 'id' | 'created_at' | 'updated_at'>): CollaborationRequest => {
    const list = dataStore.getCollaborationRequests();
    const newReq: CollaborationRequest = {
      ...req,
      id: `collab-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    list.unshift(newReq);
    localStorage.setItem(STORAGE_KEYS.COLLAB_REQUESTS, JSON.stringify(list));
    return newReq;
  },

  // --- PROFILES ---
  getProfiles: (): Profile[] => {
    if (typeof window === 'undefined') return SEED_PROFILES;
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(SEED_PROFILES));
      return SEED_PROFILES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return SEED_PROFILES;
    }
  },

  getProfileByUsername: (username: string): Profile | undefined => {
    const profiles = dataStore.getProfiles();
    return profiles.find((p) => p.username.toLowerCase() === username.toLowerCase());
  },

  // --- PASSPORT: PROJECTS & ACHIEVEMENTS ---
  getProjects: (userId: string): Project[] => {
    if (typeof window === 'undefined') return INITIAL_PROJECTS;
    const stored = localStorage.getItem(`${STORAGE_KEYS.PROJECTS}_${userId}`);
    if (!stored) {
      localStorage.setItem(`${STORAGE_KEYS.PROJECTS}_${userId}`, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_PROJECTS;
    }
  },

  saveProject: (userId: string, project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }): Project => {
    const projects = dataStore.getProjects(userId);
    let result: Project;
    if (project.id) {
      const idx = projects.findIndex((p) => p.id === project.id);
      result = {
        ...project,
        id: project.id,
        user_id: userId,
        created_at: idx >= 0 ? projects[idx].created_at : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (idx >= 0) projects[idx] = result;
      else projects.unshift(result);
    } else {
      result = {
        ...project,
        id: `proj-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      projects.unshift(result);
    }
    localStorage.setItem(`${STORAGE_KEYS.PROJECTS}_${userId}`, JSON.stringify(projects));
    return result;
  },

  deleteProject: (userId: string, projectId: string): void => {
    const projects = dataStore.getProjects(userId).filter((p) => p.id !== projectId);
    localStorage.setItem(`${STORAGE_KEYS.PROJECTS}_${userId}`, JSON.stringify(projects));
  },

  getAchievements: (userId: string): Achievement[] => {
    if (typeof window === 'undefined') return INITIAL_ACHIEVEMENTS;
    const stored = localStorage.getItem(`${STORAGE_KEYS.ACHIEVEMENTS}_${userId}`);
    if (!stored) {
      localStorage.setItem(`${STORAGE_KEYS.ACHIEVEMENTS}_${userId}`, JSON.stringify(INITIAL_ACHIEVEMENTS));
      return INITIAL_ACHIEVEMENTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  },

  saveAchievement: (userId: string, ach: Omit<Achievement, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }): Achievement => {
    const list = dataStore.getAchievements(userId);
    let result: Achievement;
    if (ach.id) {
      const idx = list.findIndex((a) => a.id === ach.id);
      result = {
        ...ach,
        id: ach.id,
        user_id: userId,
        created_at: idx >= 0 ? list[idx].created_at : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (idx >= 0) list[idx] = result;
      else list.unshift(result);
    } else {
      result = {
        ...ach,
        id: `ach-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      list.unshift(result);
    }
    localStorage.setItem(`${STORAGE_KEYS.ACHIEVEMENTS}_${userId}`, JSON.stringify(list));
    return result;
  },

  deleteAchievement: (userId: string, achId: string): void => {
    const list = dataStore.getAchievements(userId).filter((a) => a.id !== achId);
    localStorage.setItem(`${STORAGE_KEYS.ACHIEVEMENTS}_${userId}`, JSON.stringify(list));
  },

  // --- NOTIFICATIONS ---
  getNotifications: (userId: string): Notification[] => {
    if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
    const stored = localStorage.getItem(`${STORAGE_KEYS.NOTIFICATIONS}_${userId}`);
    if (!stored) {
      localStorage.setItem(`${STORAGE_KEYS.NOTIFICATIONS}_${userId}`, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  markNotificationAsRead: (userId: string, id: string): void => {
    const list = dataStore.getNotifications(userId);
    const target = list.find((n) => n.id === id);
    if (target) {
      target.is_read = true;
      localStorage.setItem(`${STORAGE_KEYS.NOTIFICATIONS}_${userId}`, JSON.stringify(list));
    }
  },

  markAllNotificationsRead: (userId: string): void => {
    const list = dataStore.getNotifications(userId).map((n) => ({ ...n, is_read: true }));
    localStorage.setItem(`${STORAGE_KEYS.NOTIFICATIONS}_${userId}`, JSON.stringify(list));
  },
};

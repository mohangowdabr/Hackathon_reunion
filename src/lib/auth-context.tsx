'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Profile, UserRole } from '@/types';

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  isLoading: boolean;
  isDevMode: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dev mode mock profiles
const DEV_USERS: Record<string, { user: AuthUser; profile: Profile }> = {
  'demo@techorbit.dev': {
    user: { id: 'dev-user-1', email: 'demo@techorbit.dev', role: 'participant' },
    profile: {
      id: 'dev-profile-1',
      user_id: 'dev-user-1',
      full_name: 'Alex Chen',
      username: 'alexchen',
      avatar_url: null,
      bio: 'Full-stack developer passionate about hackathons and open-source. Building cool stuff with React, Node.js, and Python.',
      title: 'Computer Science Student',
      college_or_org: 'Stanford University',
      location: 'San Francisco, CA',
      experience_level: 'intermediate',
      is_student: true,
      github_url: 'https://github.com/alexchen',
      linkedin_url: 'https://linkedin.com/in/alexchen',
      website_url: 'https://alexchen.dev',
      twitter_url: null,
      is_public: true,
      is_looking_for_team: true,
      availability: 'Weekends and evenings',
      onboarding_completed: true,
      profile_completion: 85,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-11-01T00:00:00Z',
    },
  },
  'organizer@techorbit.dev': {
    user: { id: 'dev-user-2', email: 'organizer@techorbit.dev', role: 'organizer' },
    profile: {
      id: 'dev-profile-2',
      user_id: 'dev-user-2',
      full_name: 'Sarah Mitchell',
      username: 'sarahmitchell',
      avatar_url: null,
      bio: 'Event organizer and community builder. Running hackathons and developer events.',
      title: 'Community Manager',
      college_or_org: 'DevSphere Foundation',
      location: 'New York, NY',
      experience_level: 'advanced',
      is_student: false,
      github_url: null,
      linkedin_url: 'https://linkedin.com/in/sarahmitchell',
      website_url: null,
      twitter_url: null,
      is_public: true,
      is_looking_for_team: false,
      availability: null,
      onboarding_completed: true,
      profile_completion: 70,
      created_at: '2024-02-20T00:00:00Z',
      updated_at: '2024-10-15T00:00:00Z',
    },
  },
  'admin@techorbit.dev': {
    user: { id: 'dev-user-3', email: 'admin@techorbit.dev', role: 'admin' },
    profile: {
      id: 'dev-profile-3',
      user_id: 'dev-user-3',
      full_name: 'TechOrbit Admin',
      username: 'admin',
      avatar_url: null,
      bio: 'Platform administrator.',
      title: 'Platform Admin',
      college_or_org: 'TechOrbit',
      location: null,
      experience_level: 'expert',
      is_student: false,
      github_url: null,
      linkedin_url: null,
      website_url: null,
      twitter_url: null,
      is_public: false,
      is_looking_for_team: false,
      availability: null,
      onboarding_completed: true,
      profile_completion: 50,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  },
};

const STORAGE_KEY = 'techorbit_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

  // Restore session from storage on mount
  useEffect(() => {
    if (isDevMode) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const { email } = JSON.parse(stored);
          const devData = DEV_USERS[email];
          if (devData) {
            setUser(devData.user);
            setProfile(devData.profile);
          } else {
            // Custom registered user
            const customProfile = localStorage.getItem(`${STORAGE_KEY}_profile_${email}`);
            if (customProfile) {
              const parsed = JSON.parse(customProfile);
              setUser({ id: parsed.user_id, email, role: parsed.role || 'participant' });
              setProfile(parsed);
            }
          }
        }
      } catch (e) {
        console.error('Failed to restore auth session:', e);
      }
    }
    setIsLoading(false);
  }, [isDevMode]);

  const login = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    if (isDevMode) {
      const devData = DEV_USERS[email.toLowerCase()];
      if (devData) {
        setUser(devData.user);
        setProfile(devData.profile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: email.toLowerCase() }));
        return {};
      }
      // Check custom registered users
      const customProfile = localStorage.getItem(`${STORAGE_KEY}_profile_${email.toLowerCase()}`);
      if (customProfile) {
        const parsed = JSON.parse(customProfile);
        const storedPassword = localStorage.getItem(`${STORAGE_KEY}_pw_${email.toLowerCase()}`);
        if (storedPassword !== password) {
          return { error: 'Invalid email or password' };
        }
        setUser({ id: parsed.user_id, email: email.toLowerCase(), role: parsed.role || 'participant' });
        setProfile(parsed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: email.toLowerCase() }));
        return {};
      }
      return { error: 'Invalid email or password. In dev mode, use: demo@techorbit.dev, organizer@techorbit.dev, or admin@techorbit.dev (any password)' };
    }
    // TODO: Supabase auth
    return { error: 'Supabase not configured. Enable dev mode or configure Supabase credentials.' };
  }, [isDevMode]);

  const register = useCallback(async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    if (isDevMode) {
      const userId = `user-${Date.now()}`;
      const username = name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
      const newProfile: Profile = {
        id: `profile-${Date.now()}`,
        user_id: userId,
        full_name: name,
        username,
        avatar_url: null,
        bio: null,
        title: null,
        college_or_org: null,
        location: null,
        experience_level: 'beginner',
        is_student: true,
        github_url: null,
        linkedin_url: null,
        website_url: null,
        twitter_url: null,
        is_public: true,
        is_looking_for_team: false,
        availability: null,
        onboarding_completed: false,
        profile_completion: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const authUser: AuthUser = { id: userId, email: email.toLowerCase(), role: 'participant' };
      localStorage.setItem(`${STORAGE_KEY}_profile_${email.toLowerCase()}`, JSON.stringify({ ...newProfile, role: 'participant' }));
      localStorage.setItem(`${STORAGE_KEY}_pw_${email.toLowerCase()}`, password);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: email.toLowerCase() }));
      setUser(authUser);
      setProfile(newProfile);
      return {};
    }
    return { error: 'Supabase not configured. Enable dev mode or configure Supabase credentials.' };
  }, [isDevMode]);

  const logout = useCallback(async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (profile) {
      const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
      setProfile(updated);
      if (isDevMode && user) {
        localStorage.setItem(`${STORAGE_KEY}_profile_${user.email}`, JSON.stringify({ ...updated, role: user.role }));
      }
    }
  }, [profile, isDevMode, user]);

  const setUserRole = useCallback((role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      if (isDevMode) {
        const profileData = localStorage.getItem(`${STORAGE_KEY}_profile_${user.email}`);
        if (profileData) {
          const parsed = JSON.parse(profileData);
          localStorage.setItem(`${STORAGE_KEY}_profile_${user.email}`, JSON.stringify({ ...parsed, role }));
        }
      }
    }
  }, [user, isDevMode]);

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, isDevMode, login, register, logout, updateProfile, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


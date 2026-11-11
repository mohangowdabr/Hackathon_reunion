'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Orbit, LayoutDashboard, Compass, Activity, Bookmark,
  Users, UsersRound, IdCard, FolderGit2, Bell, Settings,
  Building2, Calendar, Plus, Shield, FileCheck, Menu, X,
  ChevronLeft, LogOut,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const MAIN_SECTIONS: NavSection[] = [
  {
    title: 'Main',
    items: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Discover', href: '/discover', icon: Compass },
      { label: 'My Activities', href: '/dashboard/activities', icon: Activity },
      { label: 'Saved', href: '/dashboard/saved', icon: Bookmark },
    ],
  },
  {
    title: 'Collaborate',
    items: [
      { label: 'Find Teammates', href: '/dashboard/teammates', icon: Users },
      { label: 'My Teams', href: '/dashboard/teams', icon: UsersRound },
    ],
  },
  {
    title: 'Profile',
    items: [
      { label: 'Developer Passport', href: '/dashboard/passport', icon: IdCard },
      { label: 'Projects', href: '/dashboard/projects', icon: FolderGit2 },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
  },
];

const ORGANIZER_SECTION: NavSection = {
  title: 'Organizer',
  items: [
    { label: 'Org Dashboard', href: '/organizer', icon: Building2 },
    { label: 'My Events', href: '/organizer/opportunities', icon: Calendar },
    { label: 'Create Event', href: '/organizer/opportunities/new', icon: Plus },
  ],
};

const ADMIN_SECTION: NavSection = {
  title: 'Admin',
  items: [
    { label: 'Admin Panel', href: '/admin', icon: Shield },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Moderation', href: '/admin/opportunities', icon: FileCheck },
  ],
};

function getRoleBadgeVariant(role: string | undefined): 'default' | 'success' | 'warning' | 'destructive' | 'secondary' {
  switch (role) {
    case 'admin':
      return 'destructive';
    case 'organizer':
      return 'warning';
    default:
      return 'secondary';
  }
}

function getRoleLabel(role: string | undefined): string {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'organizer':
      return 'Organizer';
    default:
      return 'Developer';
  }
}

function DashboardSidebarContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const role = user?.role;

  const sections: NavSection[] = [
    ...MAIN_SECTIONS,
    ...(role === 'organizer' || role === 'admin' ? [ORGANIZER_SECTION] : []),
    ...(role === 'admin' ? [ADMIN_SECTION] : []),
  ];

  // Add notification badge if needed (placeholder — in production this would come from context/API)
  const notificationCount = 0;
  const sectionsWithBadges = sections.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      if (item.href === '/dashboard/notifications' && notificationCount > 0) {
        return { ...item, badge: notificationCount };
      }
      return item;
    }),
  }));

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    if (href === '/discover') return pathname === '/discover';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#1e2044] shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Orbit className="w-7 h-7 text-blue-500 group-hover:text-blue-400 transition-colors" />
            <div className="absolute inset-0 w-7 h-7 bg-blue-500/20 rounded-full blur-lg group-hover:bg-blue-400/30 transition-colors" />
          </div>
          <span className="text-lg font-bold">
            <span className="text-white">Tech</span>
            <span className="gradient-text">Orbit</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1b35] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-[#1e2044] scrollbar-track-transparent">
        {sectionsWithBadges.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150',
                      active
                        ? 'text-white bg-gradient-to-r from-blue-500/15 to-violet-500/10 border border-blue-500/20 shadow-sm shadow-blue-500/5'
                        : 'text-slate-400 hover:text-white hover:bg-[#1a1b35] border border-transparent'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-[18px] h-[18px] shrink-0 transition-colors',
                        active
                          ? 'text-blue-400'
                          : 'text-slate-500 group-hover:text-slate-300'
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 px-1.5 text-[11px] font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User info */}
      <div className="shrink-0 border-t border-[#1e2044] p-3">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1a1b35] transition-colors">
          <Avatar
            src={profile?.avatar_url}
            fallback={profile?.full_name ? profile.full_name.slice(0, 2) : 'U'}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {profile?.full_name || 'User'}
            </p>
            <Badge variant={getRoleBadgeVariant(role)} className="text-[10px] px-1.5 py-0">
              {getRoleLabel(role)}
            </Badge>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden p-2.5 rounded-xl border border-[#1e2044] bg-[#111225]/90 backdrop-blur-sm text-slate-400 hover:text-white hover:bg-[#1a1b35] transition-colors shadow-lg"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 bg-[#111225] border-r border-[#1e2044]">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="absolute inset-y-0 left-0 w-72 bg-[#111225] border-r border-[#1e2044] shadow-2xl animate-slide-right">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

export function DashboardSidebar() {
  return (
    <Suspense fallback={<aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30 bg-[#0d0e1f] border-r border-[#1e2044]" />}>
      <DashboardSidebarContent />
    </Suspense>
  );
}

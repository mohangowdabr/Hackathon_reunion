'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Orbit, Menu, X, ChevronDown, LogOut, LayoutDashboard, User, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Discover', href: '/discover' },
  { label: 'Categories', href: '/discover#categories' },
  { label: 'Community', href: '/people' },
  { label: 'For Organizers', href: '/organizer' },
  { label: 'About', href: '/about' },
];

function HeaderContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-[#1e2044]/50 bg-[#0a0b14]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Orbit className="w-8 h-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
              <div className="absolute inset-0 w-8 h-8 bg-blue-500/20 rounded-full blur-lg group-hover:bg-blue-400/30 transition-colors" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-white">Tech</span>
              <span className="gradient-text">Orbit</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  pathname === item.href
                    ? 'text-white bg-[#1a1b35]'
                    : 'text-slate-400 hover:text-white hover:bg-[#1a1b35]/50'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#1a1b35] transition-colors"
                >
                  <Avatar src={profile?.avatar_url} fallback={profile?.full_name ? profile.full_name.slice(0, 2) : 'U'} size="sm" />
                  <span className="text-sm text-slate-300">{profile?.full_name || 'User'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#1e2044] bg-[#111225] shadow-2xl z-50 animate-scale-in overflow-hidden">
                      <div className="p-3 border-b border-[#1e2044]">
                        <p className="text-sm font-medium text-white">{profile?.full_name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                      <div className="p-1">
                        <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-[#1a1b35] rounded-lg transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link href="/dashboard/passport" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-[#1a1b35] rounded-lg transition-colors">
                          <User className="w-4 h-4" /> My Passport
                        </Link>
                        <Link href="/dashboard/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-[#1a1b35] rounded-lg transition-colors">
                          <Settings className="w-4 h-4" /> Settings
                        </Link>
                      </div>
                      <div className="p-1 border-t border-[#1e2044]">
                        <button onClick={() => { logout(); setUserMenuOpen(false); }} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1b35] transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1e2044] bg-[#0a0b14] animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors',
                  pathname === item.href
                    ? 'text-white bg-[#1a1b35]'
                    : 'text-slate-400 hover:text-white hover:bg-[#1a1b35]'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-[#1e2044] space-y-2">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start gap-2 text-red-400" onClick={() => { logout(); setMobileOpen(false); }}>
                    <LogOut className="w-4 h-4" /> Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">Sign in</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Header() {
  return (
    <Suspense fallback={<header className="sticky top-0 z-50 h-16 border-b border-[#1e2044]/50 bg-[#0a0b14]/80 backdrop-blur-xl" />}>
      <HeaderContent />
    </Suspense>
  );
}

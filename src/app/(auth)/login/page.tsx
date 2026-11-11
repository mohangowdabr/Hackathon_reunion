'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Orbit, AlertCircle, Info, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isDevMode } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo1234');
  };

  return (
    <div className="min-h-screen bg-[#0a0b14] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-grid">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 group mb-6">
          <div className="relative">
            <Orbit className="w-10 h-10 text-blue-500 group-hover:text-blue-400 transition-colors" />
            <div className="absolute inset-0 w-10 h-10 bg-blue-500/20 rounded-full blur-md" />
          </div>
          <span className="text-2xl font-bold">
            <span className="text-white">Tech</span>
            <span className="gradient-text">Orbit</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to your TechOrbit account to access opportunities & teams
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-[#111225] border border-[#1e2044] py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-base font-semibold"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Quick Demo Switcher in Dev Mode */}
          {isDevMode && (
            <div className="mt-6 pt-6 border-t border-[#1e2044]">
              <div className="flex items-center gap-2 mb-3 text-xs text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold text-slate-300">Quick Test Accounts (Dev Mode):</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('demo@techorbit.dev')}
                  className="text-left px-3 py-2 rounded-lg bg-[#0a0b14] hover:bg-[#1a1b35] border border-[#1e2044] text-xs text-slate-300 flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="font-medium text-white">demo@techorbit.dev</p>
                    <p className="text-[11px] text-slate-500">Participant (Alex Chen)</p>
                  </div>
                  <span className="text-[10px] text-blue-400">Fill →</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('organizer@techorbit.dev')}
                  className="text-left px-3 py-2 rounded-lg bg-[#0a0b14] hover:bg-[#1a1b35] border border-[#1e2044] text-xs text-slate-300 flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="font-medium text-white">organizer@techorbit.dev</p>
                    <p className="text-[11px] text-slate-500">Organizer (DevSphere Foundation)</p>
                  </div>
                  <span className="text-[10px] text-amber-400">Fill →</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin@techorbit.dev')}
                  className="text-left px-3 py-2 rounded-lg bg-[#0a0b14] hover:bg-[#1a1b35] border border-[#1e2044] text-xs text-slate-300 flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="font-medium text-white">admin@techorbit.dev</p>
                    <p className="text-[11px] text-slate-500">Platform Admin</p>
                  </div>
                  <span className="text-[10px] text-red-400">Fill →</span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-slate-400">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import Link from 'next/link';
import { Orbit, Mail } from 'lucide-react';
import { Github, Twitter, Linkedin } from '@/components/ui/icons';

const FOOTER_LINKS = {
  Product: [
    { label: 'Discover', href: '/discover' },
    { label: 'Categories', href: '/discover#categories' },
    { label: 'Community', href: '/people' },
    { label: 'Find Teammates', href: '/dashboard/teammates' },
  ],
  Resources: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '#' },
    { label: 'Documentation', href: '#' },
  ],
  Organizers: [
    { label: 'Create Event', href: '/organizer/opportunities/new' },
    { label: 'Dashboard', href: '/organizer' },
    { label: 'Verification', href: '/organizer' },
    { label: 'API', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[#1e2044] bg-[#0a0b14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Orbit className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-bold">
                <span className="text-white">Tech</span>
                <span className="gradient-text">Orbit</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 mb-4">
              Every Opportunity. One Ecosystem.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-[#1a1b35] transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-[#1a1b35] transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-[#1a1b35] transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-[#1a1b35] transition-colors" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#1e2044] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © 2025 TechOrbit. All rights reserved. Built for the global developer community.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span>Made with</span>
            <span className="text-red-500">♥</span>
            <span>for developers everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

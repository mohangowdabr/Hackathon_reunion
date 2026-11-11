'use client';

import { Suspense } from 'react';
import { DashboardSidebar } from './dashboard-sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a0b14]">
      <Suspense fallback={<div className="w-64 hidden lg:block bg-[#0a0b14] border-r border-[#1e2044]" />}>
        <DashboardSidebar />
      </Suspense>
      <main className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

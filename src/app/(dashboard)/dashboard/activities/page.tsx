'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/data-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/ui/empty-state';
import { Application, ApplicationStatus, Opportunity } from '@/types';
import { formatDateShort, formatDate, daysUntil } from '@/lib/utils';
import {
  Activity,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  Search,
  Filter,
  Check,
  AlertCircle,
} from 'lucide-react';

const STATUS_OPTIONS: { value: ApplicationStatus; label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' }[] = [
  { value: 'interested', label: 'Interested', variant: 'secondary' },
  { value: 'saved', label: 'Saved', variant: 'outline' },
  { value: 'planning', label: 'Planning to Apply', variant: 'warning' },
  { value: 'applied', label: 'Applied', variant: 'default' },
  { value: 'shortlisted', label: 'Shortlisted', variant: 'warning' },
  { value: 'accepted', label: 'Accepted', variant: 'success' },
  { value: 'participating', label: 'Participating', variant: 'success' },
  { value: 'completed', label: 'Completed', variant: 'success' },
  { value: 'rejected', label: 'Rejected', variant: 'destructive' },
  { value: 'withdrawn', label: 'Withdrawn', variant: 'outline' },
];

export default function MyActivitiesPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'accepted' | 'completed'>('all');
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>('applied');
  const [notes, setNotes] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadApplications();
  }, [user]);

  const loadApplications = () => {
    const list = dataStore.getApplications(user?.id || 'dev-user-1');
    setApplications(list);
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setSelectedStatus(app.status);
    setNotes(app.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveStatus = () => {
    if (editingApp) {
      dataStore.updateApplicationStatus(editingApp.id, selectedStatus, notes);
      loadApplications();
      setIsModalOpen(false);
      setEditingApp(null);
    }
  };

  const handleDelete = (appId: string) => {
    if (confirm('Are you sure you want to remove this record from My Activities?')) {
      dataStore.removeApplication(appId);
      loadApplications();
    }
  };

  // Filter applications by tab
  const filteredApps = applications.filter((app) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') {
      return ['planning', 'applied', 'shortlisted', 'participating'].includes(app.status);
    }
    if (activeTab === 'accepted') {
      return ['accepted', 'shortlisted'].includes(app.status);
    }
    if (activeTab === 'completed') {
      return app.status === 'completed';
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1e2044]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Participation Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Activities
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track and manage your opportunity lifecycle from planning through completion.
          </p>
        </div>

        <Link href="/discover">
          <Button className="gap-2 font-semibold">
            <Plus className="w-4 h-4" /> Add Opportunity
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1e2044] pb-4 overflow-x-auto">
        {[
          { id: 'all', label: 'All Activities', count: applications.length },
          {
            id: 'active',
            label: 'Active & In-Progress',
            count: applications.filter((a) =>
              ['planning', 'applied', 'shortlisted', 'participating'].includes(a.status)
            ).length,
          },
          {
            id: 'accepted',
            label: 'Accepted & Shortlisted',
            count: applications.filter((a) => ['accepted', 'shortlisted'].includes(a.status)).length,
          },
          {
            id: 'completed',
            label: 'Completed',
            count: applications.filter((a) => a.status === 'completed').length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-[#111225] border border-[#1e2044] text-slate-400 hover:text-white'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Applications Table / Cards */}
      {filteredApps.length > 0 ? (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const opp = app.opportunity;
            const statusConfig = STATUS_OPTIONS.find((s) => s.value === app.status) || STATUS_OPTIONS[0];
            const days = opp?.registration_deadline ? daysUntil(opp.registration_deadline) : null;

            return (
              <div
                key={app.id}
                className="bg-[#111225] border border-[#1e2044] rounded-2xl p-6 transition-all hover:border-slate-700"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Opportunity Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {opp?.category && (
                        <Badge variant="outline" size="sm" className="capitalize text-xs">
                          {opp.category}
                        </Badge>
                      )}
                      <Badge variant={statusConfig.variant} size="sm" className="capitalize text-xs font-semibold">
                        {statusConfig.label}
                      </Badge>
                      {opp?.format && (
                        <span className="text-xs text-slate-500 capitalize">• {opp.format}</span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white hover:text-blue-400 transition-colors">
                      {opp ? (
                        <Link href={`/opportunities/${opp.slug}`}>{opp.title}</Link>
                      ) : (
                        'Opportunity'
                      )}
                    </h3>

                    {opp?.organizer_name && (
                      <p className="text-xs text-slate-400">
                        by <strong className="text-slate-300">{opp.organizer_name}</strong>
                      </p>
                    )}

                    {app.notes && (
                      <div className="mt-3 p-3 rounded-xl bg-[#0a0b14] border border-[#1e2044] text-xs text-slate-300 italic">
                        &ldquo;{app.notes}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Right Deadline & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#1e2044]">
                    {opp?.registration_deadline && (
                      <div className="text-left sm:text-right text-xs">
                        <span className="text-slate-500 block mb-0.5">Registration Deadline</span>
                        <p className="font-semibold text-white">
                          {formatDateShort(opp.registration_deadline)}
                        </p>
                        {days !== null && (
                          <span
                            className={`text-[11px] font-medium ${
                              days <= 3 ? 'text-red-400' : days <= 7 ? 'text-amber-400' : 'text-slate-400'
                            }`}
                          >
                            {days > 0 ? `${days} days left` : 'Passed'}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(app)}
                        className="gap-1.5 text-xs h-9"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Update Status
                      </Button>

                      <button
                        onClick={() => handleDelete(app.id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove from activities"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Activity className="w-8 h-8" />}
          title="No activities found"
          description="You don't have any opportunities in this category. Browse the Opportunity Radar to find and track competitions, hackathons, and programs."
          action={{
            label: 'Browse Opportunities',
            onClick: () => {
              window.location.href = '/discover';
            },
          }}
        />
      )}

      {/* Status Update Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update Participation Status"
        description={editingApp?.opportunity?.title}
        size="md"
      >
        <div className="space-y-5 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Current Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
              className="w-full h-10 rounded-lg border border-[#1e2044] bg-[#0a0b14] px-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Personal Notes / Progress Update
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Submitted project draft, received confirmation email, or preparing presentation slides..."
              rows={4}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStatus} className="font-semibold">
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


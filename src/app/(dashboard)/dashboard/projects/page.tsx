'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/data-store';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { EmptyState } from '@/components/ui/empty-state';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Trash2,
  Edit2,
  Globe,
} from 'lucide-react';
import { Github } from '@/components/ui/icons';

export default function ProjectsManagementPage() {
  const { user } = useAuth();
  const userId = user?.id || 'dev-user-1';

  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjId, setEditingProjId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState<string[]>(['React', 'TypeScript']);
  const [techInput, setTechInput] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  useEffect(() => {
    loadProjects();
  }, [userId]);

  const loadProjects = () => {
    setProjects(dataStore.getProjects(userId));
  };

  const handleOpenCreate = () => {
    setEditingProjId(null);
    setTitle('');
    setDescription('');
    setTechStack(['React', 'TypeScript']);
    setProjectUrl('');
    setGithubUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setEditingProjId(proj.id);
    setTitle(proj.title);
    setDescription(proj.description);
    setTechStack(proj.tech_stack);
    setProjectUrl(proj.project_url || '');
    setGithubUrl(proj.github_url || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    dataStore.saveProject(userId, {
      id: editingProjId || undefined,
      title,
      description,
      tech_stack: techStack,
      project_url: projectUrl || null,
      github_url: githubUrl || null,
      image_url: null,
      is_public: true,
    });

    loadProjects();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this project?')) {
      dataStore.deleteProject(userId, id);
      loadProjects();
    }
  };

  const addTech = () => {
    if (techInput && !techStack.includes(techInput)) {
      setTechStack([...techStack, techInput]);
      setTechInput('');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1e2044]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-2">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Project Showcase</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Projects
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Showcase your hackathon solutions, open-source repos, and prototypes on your Developer Passport.
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="gap-2 font-semibold">
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <Card
              key={proj.id}
              className="p-6 border-[#1e2044] bg-[#111225] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white">{proj.title}</h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(proj)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1b35]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {proj.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[11px] bg-[#0a0b14] border border-[#1e2044] text-blue-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#1e2044] flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:text-white"
                    >
                      <Github className="w-3.5 h-3.5" /> Code
                    </a>
                  )}
                  {proj.project_url && (
                    <a
                      href={proj.project_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-400 hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                    </a>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">Public on Passport</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FolderGit2 className="w-8 h-8" />}
          title="No projects added yet"
          description="Add your hackathon builds or personal projects to display on your public passport."
          action={{
            label: 'Add First Project',
            onClick: handleOpenCreate,
          }}
        />
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProjId ? 'Edit Project' : 'Add New Project'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Project Title
            </label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. MedEcho — AI Diagnostic App"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Short Description
            </label>
            <Textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What does it do? What problem does it solve?"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Tech Stack
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="e.g. Next.js, FastAPI, PyTorch"
                className="h-9"
              />
              <Button type="button" variant="outline" size="sm" onClick={addTech}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  onClick={() => setTechStack(techStack.filter((t) => t !== tech))}
                  className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 cursor-pointer"
                >
                  {tech} ×
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Live URL (Optional)
              </label>
              <Input
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                GitHub Repo (Optional)
              </label>
              <Input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="font-semibold">
              Save Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

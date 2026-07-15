"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Briefcase, 
  Mail, 
  LogOut, 
  Plus, 
  Trash2, 
  Check, 
  MessageSquare, 
  Folder, 
  Eye, 
  EyeOff, 
  Edit2, 
  X,
  ExternalLink
} from 'lucide-react';
import { api } from '../api';

const Github = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);


interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  tags: string;
  order: number;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'messages'>('overview');
  const [loading, setLoading] = useState(true);
  
  // Project Form State
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formGithubUrl, setFormGithubUrl] = useState('');
  const [formLiveUrl, setFormLiveUrl] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formOrder, setFormOrder] = useState('0');

  // Message Viewer State
  const [viewingMessage, setViewingMessage] = useState<Message | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin');
        return;
      }

      try {
        const res = await api.checkAuth();
        if (res.success) {
          setAuthenticated(true);
          fetchData();
        } else {
          localStorage.removeItem('admin_token');
          router.push('/admin');
        }
      } catch (err) {
        router.push('/admin');
      }
    };

    checkAuthentication();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const projectsRes = await api.getProjects();
      const messagesRes = await api.getMessages();
      
      if (projectsRes.success) setProjects(projectsRes.data || []);
      if (messagesRes.success) setMessages(messagesRes.data || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  // Project Handlers
  const handleOpenAddForm = () => {
    setEditingProject(null);
    setFormTitle('');
    setFormDescription('');
    setFormImageUrl('');
    setFormGithubUrl('');
    setFormLiveUrl('');
    setFormTags('');
    setFormOrder('0');
    setIsProjectFormOpen(true);
  };

  const handleOpenEditForm = (project: Project) => {
    setEditingProject(project);
    setFormTitle(project.title);
    setFormDescription(project.description);
    setFormImageUrl(project.imageUrl || '');
    setFormGithubUrl(project.githubUrl || '');
    setFormLiveUrl(project.liveUrl || '');
    setFormTags(project.tags);
    setFormOrder(project.order.toString());
    setIsProjectFormOpen(true);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectPayload = {
      title: formTitle,
      description: formDescription,
      imageUrl: formImageUrl || undefined,
      githubUrl: formGithubUrl || undefined,
      liveUrl: formLiveUrl || undefined,
      tags: formTags,
      order: parseInt(formOrder, 10) || 0
    };

    try {
      let res;
      if (editingProject) {
        res = await api.updateProject(editingProject.id, projectPayload);
      } else {
        res = await api.createProject(projectPayload);
      }

      if (res.success) {
        setIsProjectFormOpen(false);
        fetchData();
      } else {
        alert(res.message || 'Action failed');
      }
    } catch (err) {
      alert('Error updating project database');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await api.deleteProject(id);
      if (res.success) {
        fetchData();
      }
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  // Message Handlers
  const handleToggleRead = async (message: Message) => {
    try {
      const res = await api.updateMessageStatus(message.id, !message.read);
      if (res.success) {
        setMessages(messages.map(m => m.id === message.id ? { ...m, read: !m.read } : m));
        if (viewingMessage?.id === message.id) {
          setViewingMessage({ ...viewingMessage, read: !message.read });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      const res = await api.deleteMessage(id);
      if (res.success) {
        setMessages(messages.filter(m => m.id !== id));
        if (viewingMessage?.id === id) {
          setViewingMessage(null);
        }
      }
    } catch (err) {
      alert('Failed to delete message');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono">
        Verifying system authority...
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans relative overflow-x-hidden selection:bg-blue-500/20">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Navbar */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Admin Console</h1>
              <p className="text-xs text-slate-500 font-mono">LancerFlow Portfolio Server</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-sm font-semibold transition-all text-slate-400 hover:text-red-400"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Layout Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'text-slate-400 hover:text-white'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'projects' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'text-slate-400 hover:text-white'}`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${activeTab === 'messages' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'text-slate-400 hover:text-white'}`}
          >
            Inbox
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500 font-mono">
            Accessing database nodes...
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-6 right-6 text-blue-500/20">
                      <Briefcase size={64} />
                    </div>
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Projects</p>
                    <h3 className="text-5xl font-black">{projects.length}</h3>
                    <p className="text-xs text-slate-400 mt-4">Active and visible on the website homepage</p>
                  </div>

                  <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-6 right-6 text-purple-500/20">
                      <Mail size={64} />
                    </div>
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Inquiries</p>
                    <h3 className="text-5xl font-black">{messages.length}</h3>
                    <p className="text-xs text-slate-400 mt-4">Messages received from contact form</p>
                  </div>

                  <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-6 right-6 text-red-500/20">
                      <MessageSquare size={64} />
                    </div>
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Unread Messages</p>
                    <h3 className="text-5xl font-black text-red-400">{unreadCount}</h3>
                    <p className="text-xs text-slate-450 mt-4">Require review and response</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-4">Quick Project Management</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                      Create, modify, or archive your work. You can customize descriptions, tags, and source/deploy links which reflect directly on the main site.
                    </p>
                    <button 
                      onClick={handleOpenAddForm}
                      className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm text-white transition-all flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add New Project
                    </button>
                  </div>

                  <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-4">Recent Mailbox Submissions</h3>
                    {messages.length === 0 ? (
                      <p className="text-slate-500 text-sm">Inbox is completely clean.</p>
                    ) : (
                      <div className="space-y-3">
                        {messages.slice(0, 3).map((m) => (
                          <div 
                            key={m.id} 
                            onClick={() => {
                              setViewingMessage(m);
                              setActiveTab('messages');
                            }}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${m.read ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10'}`}
                          >
                            <div>
                              <h4 className="text-sm font-bold">{m.name}</h4>
                              <p className="text-xs text-slate-450 truncate max-w-[250px]">{m.message}</p>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(m.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black">Project Repository</h2>
                    <p className="text-sm text-slate-500">Configure public cases showing in portfolio.</p>
                  </div>
                  <button 
                    onClick={handleOpenAddForm}
                    className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm text-white transition-all flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Project
                  </button>
                </div>

                <div className="bg-slate-900/30 border border-white/5 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-slate-500 text-xs font-bold uppercase tracking-wider">
                          <th className="p-6">Order</th>
                          <th className="p-6">Title & Details</th>
                          <th className="p-6">Tags</th>
                          <th className="p-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {projects.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-12 text-center text-slate-500 font-mono text-sm">
                              No projects registered. Click &quot;Add Project&quot; to begin.
                            </td>
                          </tr>
                        ) : (
                          projects.map((project) => (
                            <tr key={project.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-6 font-mono text-sm">{project.order}</td>
                              <td className="p-6">
                                <h3 className="font-bold text-base text-white">{project.title}</h3>
                                <p className="text-xs text-slate-450 mt-1 line-clamp-1 max-w-lg">{project.description}</p>
                                <div className="flex gap-4 mt-2">
                                  {project.githubUrl && (
                                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
                                      <Github size={12} /> GitHub
                                    </a>
                                  )}
                                  {project.liveUrl && (
                                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
                                      <ExternalLink size={12} /> Live Link
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="flex flex-wrap gap-1.5">
                                  {project.tags.split(',').map((tag) => (
                                    <span key={tag} className="px-2 py-0.5 rounded bg-slate-800 border border-white/5 text-[10px] font-semibold text-slate-400">
                                      {tag.trim()}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-6 text-right">
                                <div className="inline-flex gap-2">
                                  <button 
                                    onClick={() => handleOpenEditForm(project)}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-blue-600/10 border border-white/10 hover:border-blue-600/20 text-slate-400 hover:text-blue-400 transition-all"
                                    title="Edit"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProject(project.id)}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-red-600/10 border border-white/10 hover:border-red-600/20 text-slate-400 hover:text-red-450 transition-all"
                                    title="Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* MESSAGES TAB */}
            {activeTab === 'messages' && (
              <div className="grid lg:grid-cols-3 gap-8 items-start">
                
                {/* Inbox List */}
                <div className="lg:col-span-1 bg-slate-900/30 border border-white/5 rounded-3xl p-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold">Mailbox Inbox</h2>
                    <p className="text-xs text-slate-500 mt-1">Review contact responses.</p>
                  </div>

                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {messages.length === 0 ? (
                      <p className="text-center text-slate-500 text-sm py-8 font-mono">No messages received.</p>
                    ) : (
                      messages.map((m) => (
                        <div 
                          key={m.id}
                          onClick={() => setViewingMessage(m)}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${viewingMessage?.id === m.id ? 'bg-blue-600/10 border-blue-500/40 text-white' : m.read ? 'bg-white/2 border-white/5 hover:bg-white/5 text-slate-400' : 'bg-blue-500/5 border-blue-500/10 hover:bg-blue-500/10 text-slate-200 font-semibold'}`}
                        >
                          {!m.read && (
                            <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          )}
                          <div className="text-sm font-bold pr-4 truncate">{m.name}</div>
                          <div className="text-xs font-mono text-slate-500 mt-0.5 truncate">{m.email}</div>
                          <div className="text-xs mt-2 line-clamp-1">{m.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Message Viewer Details */}
                <div className="lg:col-span-2 bg-slate-900/30 border border-white/5 rounded-3xl p-8 min-h-[400px] flex flex-col">
                  {viewingMessage ? (
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="flex justify-between items-start gap-4 pb-6 border-b border-white/5">
                          <div>
                            <h3 className="text-2xl font-bold text-white">{viewingMessage.name}</h3>
                            <p className="text-sm text-slate-400 mt-1">Email: <a href={`mailto:${viewingMessage.email}`} className="text-blue-400 hover:underline">{viewingMessage.email}</a></p>
                            {viewingMessage.subject && (
                              <p className="text-sm text-slate-400 mt-1">Subject: <span className="text-slate-200 font-semibold">{viewingMessage.subject}</span></p>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 font-mono bg-white/5 px-3.5 py-1.5 rounded-full border border-white/5">
                            {new Date(viewingMessage.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-3">Message Body</h4>
                          <div className="p-6 bg-slate-950/50 border border-white/5 rounded-2xl text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                            {viewingMessage.message}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-8">
                        <button
                          onClick={() => handleToggleRead(viewingMessage)}
                          className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold transition-all text-slate-350 hover:text-white hover:bg-white/10"
                        >
                          {viewingMessage.read ? (
                            <>
                              <EyeOff size={14} /> Mark Unread
                            </>
                          ) : (
                            <>
                              <Eye size={14} /> Mark Read
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(viewingMessage.id)}
                          className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-red-950/20 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 text-xs font-bold transition-all text-red-400"
                        >
                          <Trash2 size={14} /> Delete Inquiry
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center py-20 font-mono">
                      <Folder size={48} className="mb-4 text-slate-700" />
                      Select a message from the left to view contents.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Project Form Modal Overlay */}
      {isProjectFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsProjectFormOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-2xl font-bold mb-2">
              {editingProject ? 'Modify Project' : 'Register New Project'}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Populate card attributes visible in portfolio listings.
            </p>

            <form onSubmit={handleProjectSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">Project Title *</label>
                  <input 
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 text-white"
                    placeholder="E.g., Brand Identity Portal"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">Order Position *</label>
                  <input 
                    type="number"
                    required
                    value={formOrder}
                    onChange={(e) => setFormOrder(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 text-white"
                    placeholder="E.g., 1 (for sorting)"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 mb-1 block">Description *</label>
                <textarea 
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 text-white resize-none"
                  placeholder="Summarize product functionality, features, stack integrations, etc."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 mb-1 block">Image URL</label>
                <input 
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 text-white"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">GitHub Link</label>
                  <input 
                    type="url"
                    value={formGithubUrl}
                    onChange={(e) => setFormGithubUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 text-white"
                    placeholder="https://github.com/your-username/repo"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">Live Project Link</label>
                  <input 
                    type="url"
                    value={formLiveUrl}
                    onChange={(e) => setFormLiveUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 text-white"
                    placeholder="https://live-domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 mb-1 block">Tags (comma-separated)</label>
                <input 
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 text-white"
                  placeholder="Next.js, TypeScript, Tailwinds (separated by comma)"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsProjectFormOpen(false)}
                  className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-slate-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm text-white transition-all"
                >
                  {editingProject ? 'Save Changes' : 'Submit Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

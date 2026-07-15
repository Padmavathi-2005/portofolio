"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Mail, 
  Shield, 
  ChevronRight
} from 'lucide-react';
import { api } from './admin/api';

// Custom, version-independent SVG components to replace Lucide package exports
const GithubIcon = ({ size = 22, className = "" }: { size?: number; className?: string }) => (
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

const ExternalLinkIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
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
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
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
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [activeSection, setActiveSection] = useState('about');

  // Mouse coordinates for spotlight effect
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Fetch projects from MongoDB
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.getProjects();
        if (res.success && res.data) {
          setProjects(res.data);
        } else {
          setProjects(getFallbackProjects());
        }
      } catch (err) {
        setProjects(getFallbackProjects());
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const getFallbackProjects = (): Project[] => [
    {
      id: '1',
      title: "LancerFlow - Freelance Management System",
      description: "A premium system for project bids, dispute handling, and direct invoicing designed for developers and agencies. Integrates secure API nodes and an interactive dashboard interface.",
      tags: "Next.js, TailwindCSS, Express, MongoDB",
      githubUrl: "https://github.com",
      liveUrl: "https://example.com"
    },
    {
      id: '2',
      title: "Apex Analytics Dashboard UI",
      description: "Clean analytics surface designed for fast scanning, repeated workflows, and heavy data visualization loads. Custom charts built with raw SVG canvas nodes.",
      tags: "React, Vite, D3.js, CSS variables",
      githubUrl: "https://github.com",
      liveUrl: "https://example.com"
    },
    {
      id: '3',
      title: "Zenith Brand Headless Portal",
      description: "Premium headless Shopify web presence combining high Web Vitals performance, a fluid WebGL responsive header, and fully decoupled layouts.",
      tags: "Next.js, Shopify API, Three.js, Tailwind v4",
      githubUrl: "https://github.com",
      liveUrl: "https://example.com"
    }
  ];

  // Mouse Move listener to update spotlight CSS variables
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      containerRef.current.style.setProperty('--mouse-x', `${x}px`);
      containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // ScrollSpy logic to detect active section in viewport (md-based)
  useEffect(() => {
    const sections = ['about', 'projects', 'contact'];
    const observers = sections.map((secId) => {
      const el = document.getElementById(secId);
      if (!el) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(secId);
            }
          });
        },
        { 
          rootMargin: '-20% 0px -55% 0px', // Trigger when section occupies center third
          threshold: 0
        }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, [loadingProjects]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await api.submitContactMessage({ name, email, subject, message });
      if (res.success) {
        setSubmitStatus({ success: true, message: 'Message sent successfully! I will get back to you soon.' });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setSubmitStatus({ success: false, message: res.message || 'Failed to send message.' });
      }
    } catch (err) {
      setSubmitStatus({ success: false, message: 'Connection to backend failed. Please try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#0f172a] text-[#94a3b8] font-sans relative overflow-x-hidden selection:bg-teal-350/20 selection:text-teal-200"
    >
      {/* Background Spotlight Layer */}
      <div className="absolute inset-0 pointer-events-none z-30 spotlight-bg hidden md:block" />

      {/* Main Container - Switched to md: split layout */}
      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
        <div className="md:flex md:justify-between md:gap-4">
          
          {/* LEFT SIDEBAR - Sticky Pane (md: sticky) */}
          <header className="md:sticky md:top-0 md:flex md:max-h-screen md:w-1/2 md:flex-col md:justify-between md:py-24">
            <div>
              {/* Profile Meta (Increased Font Sizes) */}
              <h1 className="text-5xl font-black tracking-tight text-slate-200 sm:text-6xl">
                <Link href="/">Padmavathi</Link>
              </h1>
              <h2 className="mt-4 text-xl font-bold text-slate-200 sm:text-2xl tracking-tight">
                Full-Stack Developer & Designer
              </h2>
              <p className="mt-5 max-w-sm leading-relaxed text-slate-450 text-base">
                I build accessible, pixel-perfect digital experiences that merge clean, high-performance architecture with modern aesthetic direction.
              </p>

              {/* Navigation scroll-spy menu (md: active) */}
              <nav className="nav hidden md:block mt-20">
                <ul className="w-fit">
                  {['about', 'projects', 'contact'].map((section) => {
                    const isActive = activeSection === section;
                    return (
                      <li key={section} className="mb-4">
                        <button
                          onClick={() => scrollToSection(section)}
                          className="group flex items-center py-3 text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-200 focus-visible:text-slate-200 text-left cursor-pointer"
                        >
                          <span className={`mr-4 h-px transition-all-custom ${isActive ? 'w-16 bg-slate-200' : 'w-8 bg-slate-600 group-hover:w-16 group-hover:bg-slate-200'}`} />
                          <span className={`text-sm uppercase tracking-widest transition-all-custom ${isActive ? 'text-slate-200' : 'text-slate-500 group-hover:text-slate-200'}`}>
                            {section}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Social & Admin Access */}
            <div className="mt-12 flex items-center gap-6">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-slate-400 hover:text-slate-200 transition-colors"
                title="GitHub Profile"
              >
                <GithubIcon size={24} />
              </a>
              <a 
                href="mailto:hello@example.com" 
                className="text-slate-400 hover:text-slate-200 transition-colors"
                title="Email Address"
              >
                <Mail size={24} />
              </a>
              <div className="w-[1px] h-6 bg-slate-800" />
              <Link 
                href="/admin" 
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-teal-350 transition-colors uppercase tracking-wider bg-white/5 border border-white/10 px-4 py-2 rounded-full"
              >
                <Shield size={14} />
                Admin
              </Link>
            </div>
          </header>

          {/* RIGHT SIDE - Scrollable Pane */}
          <main className="pt-24 md:w-1/2 md:py-24 space-y-24 md:space-y-36">
            
            {/* ABOUT SECTION (Increased Font Sizes) */}
            <section id="about" className="scroll-mt-16 md:scroll-mt-24" aria-label="About me">
              <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-[#0f172a]/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 md:sr-only md:relative md:top-auto md:mx-0 md:w-auto md:px-0 md:py-0 md:opacity-0">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 md:sr-only">About</h2>
              </div>
              <div className="space-y-5 text-base leading-relaxed text-slate-400">
                <p>
                  I am a software engineer specialized in crafting frontends that look exceptional and backend architectures that scale. Back in 2020, I started exploring styling conventions, which hooked me to build products where code quality matches design fidelity.
                </p>
                <p>
                  Today, I lead project deliveries under <span className="text-slate-200 font-semibold">LancerFlow</span>, building web apps for global clients. My main focus is building robust, accessible products that balance performant API networks with fluid client transitions.
                </p>
                <p>
                  Here are a few technologies I&apos;ve been working with recently:
                </p>
                
                {/* Tech Grid */}
                <ul className="grid grid-cols-2 gap-3 font-mono text-sm text-slate-200 pt-2">
                  {['React (v19)', 'Next.js (App Router)', 'TypeScript', 'Node.js / Express', 'MongoDB Atlas', 'Prisma ORM'].map((tech) => (
                    <li key={tech} className="flex items-center gap-2">
                      <ChevronRight size={14} className="text-teal-300" />
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* PROJECTS SECTION */}
            <section id="projects" className="scroll-mt-16 md:scroll-mt-24" aria-label="Selected projects">
              <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-[#0f172a]/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 md:sr-only md:relative md:top-auto md:mx-0 md:w-auto md:px-0 md:py-0 md:opacity-0">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 md:sr-only">Projects</h2>
              </div>

              {loadingProjects ? (
                <div className="py-8 font-mono text-sm text-slate-500">Loading cases...</div>
              ) : (
                <div className="space-y-12">
                  {projects.map((project) => (
                    <article 
                      key={project.id} 
                      className="group relative grid gap-4 transition-all sm:grid-cols-8 sm:gap-8 lg:hover:!opacity-100 lg:group-hover/list:opacity-50"
                    >
                      {/* Hover Overlay Background */}
                      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-2xl transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-900/40 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] lg:group-hover:drop-shadow-lg" />
                      
                      {/* Image Thumbnail Column */}
                      <div className="z-10 sm:col-span-2">
                        {project.imageUrl ? (
                          <div 
                            className="aspect-video w-full rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30 bg-cover bg-center sm:translate-y-1"
                            style={{ backgroundImage: `url(${project.imageUrl})` }}
                          />
                        ) : (
                          <div className="aspect-video w-full rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30 bg-gradient-to-br from-blue-900/20 to-teal-900/20 sm:translate-y-1" />
                        )}
                      </div>

                      {/* Content Details Column (Increased Font Sizes) */}
                      <div className="z-10 sm:col-span-6">
                        <h3 className="font-semibold leading-snug text-slate-200">
                          <div>
                            <a 
                              href={project.liveUrl || project.githubUrl || "#"} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-baseline font-bold leading-tight text-slate-200 hover:text-teal-300 focus-visible:text-teal-300 text-base group/link"
                            >
                              <span className="absolute -inset-x-4 -inset-y-4 z-20 rounded-2xl sm:inset-x-6 hidden lg:block" />
                              <span>
                                {project.title}
                                <span className="inline-block">
                                  <ExternalLinkIcon className="inline-block ml-1.5 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none" />
                                </span>
                              </span>
                            </a>
                          </div>
                        </h3>
                        
                        <p className="mt-2 text-sm leading-relaxed text-slate-400">
                          {project.description}
                        </p>

                        {/* Tag Pills */}
                        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies used">
                          {project.tags.split(',').map((tag) => (
                            <li key={tag}>
                              <span className="flex items-center rounded-full bg-teal-400/10 px-3.5 py-1 text-xs font-semibold leading-5 text-teal-300">
                                {tag.trim()}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {/* Github Extra Link */}
                        {project.githubUrl && project.liveUrl && (
                          <div className="mt-4 flex gap-4">
                            <a 
                              href={project.githubUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="relative z-30 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-200 font-bold"
                            >
                              <GithubIcon size={14} /> Source Code
                            </a>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" className="scroll-mt-16 md:scroll-mt-24" aria-label="Contact form">
              <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-[#0f172a]/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 md:sr-only md:relative md:top-auto md:mx-0 md:w-auto md:px-0 md:py-0 md:opacity-0">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 md:sr-only">Contact</h2>
              </div>

              {/* Enhanced Form Spacing & Font Sizes */}
              <div className="bg-slate-900/35 border border-white/5 rounded-3xl p-6 sm:p-10 relative">
                <h3 className="text-xl font-bold text-slate-200 mb-2">Send an Inquiry</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Fill out the fields below to submit directly to my project dashboard.
                </p>

                {submitStatus && (
                  <div className={`mb-6 p-4 rounded-2xl text-sm border font-medium ${submitStatus.success ? 'bg-green-950/20 border-green-500/20 text-green-400' : 'bg-red-950/20 border-red-500/20 text-red-400'}`}>
                    {submitStatus.message}
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-1.5 block">Your Name</label>
                      <input 
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#0b1329]/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-400/50"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-1.5 block">Email Address</label>
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0b1329]/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-400/50"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-1.5 block">Subject</label>
                    <input 
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#0b1329]/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-400/50"
                      placeholder="Project Collaboration"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-1.5 block">Your Message</label>
                    <textarea 
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#0b1329]/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-400/50 resize-none"
                      placeholder="Describe your design or development specifications..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-teal-400/10 hover:bg-teal-400/20 border border-teal-400/20 text-teal-300 font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest"
                  >
                    {submitting ? 'Transmitting...' : 'Transmit Inquiry'}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>

              {/* Credit Footer */}
              <footer className="mt-24 text-xs text-slate-500 leading-relaxed">
                <p>
                  Coded in <span className="text-slate-400">Visual Studio Code</span>. Built with <span className="text-slate-400">Next.js</span> and <span className="text-slate-400">Tailwind CSS</span>. Decoupled MVC backend runs on <span className="text-slate-400">Express</span>, query-mapped with <span className="text-slate-400">Prisma</span>, and hosted on <span className="text-slate-400">MongoDB Atlas</span>.
                </p>
                <p className="mt-1.5">
                  Design system inspired by <a href="https://brittanychiang.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-teal-350 transition-colors font-medium">Brittany Chiang</a>.
                </p>
              </footer>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { User, Shield, Briefcase, Zap, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform">
              P
            </div>
            <span className="text-xl font-bold tracking-tighter">PADMAVATHI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Projects</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-5 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-sm font-semibold flex items-center gap-2"
            >
              <User size={16} />
              Login
            </Link>
            <Link 
              href="/padmavathi" 
              className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black transition-all text-sm font-bold flex items-center gap-2"
            >
              <Shield size={16} />
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
              <Zap size={14} />
              Open for Collaboration
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[0.9]">
              DESIGNING <br />
              <span className="text-gradient">FUTURE</span> <br />
              EXPERIENCES
            </h1>
            
            <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
              I'm a full-stack developer and designer specializing in building premium digital products that blend aesthetics with high-performance code.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-3 group">
                View My Work
                <Briefcase size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                GitHub
              </button>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-slate-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Trusted by <span className="text-white font-bold">50+</span> global clients
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-[40px] blur-3xl group-hover:bg-primary/30 transition-all" />
            <div className="relative glass rounded-[40px] border-white/10 p-2 overflow-hidden aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20" />
              <div className="z-10 text-center p-12">
                <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mb-8 mx-auto border border-white/20">
                  <Globe size={48} className="text-primary animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Building Globally</h3>
                <p className="text-slate-400">Crafting seamless experiences for users across the world with modern technology.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-8">
          <p className="text-slate-500 text-sm">© 2026 Padmavathi Portfolio. All rights reserved.</p>
          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors text-sm">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

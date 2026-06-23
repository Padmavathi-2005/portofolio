"use client";

import React from 'react';
import { Shield, Lock, Terminal, ArrowRight, Key } from 'lucide-react';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>

      {/* Amber/Gold Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="w-full max-w-lg z-10">
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-[40px] p-12 border border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.1)] relative">
          {/* Admin Badge */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-6 py-2 rounded-full font-bold text-xs tracking-widest uppercase flex items-center gap-2 shadow-lg shadow-amber-500/30">
            <Shield size={14} />
            Secure Admin Access
          </div>

          <div className="text-center mb-12 mt-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 mb-6 group transition-all hover:scale-110">
              <Terminal className="text-amber-500 group-hover:animate-bounce" size={32} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-3">
              SYSTEM <span className="text-amber-500">OVERRIDE</span>
            </h1>
            <p className="text-zinc-500 font-mono text-sm">Enter administrative credentials to proceed</p>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-5">
              <div className="relative group">
                <label className="text-[10px] uppercase tracking-widest text-amber-500/60 ml-4 mb-1 block font-bold">Admin ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-amber-500 transition-colors">
                    <Key size={18} />
                  </div>
                  <input
                    type="text"
                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl py-5 pl-14 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all font-mono text-sm placeholder:text-zinc-700"
                    placeholder="Enter ID"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="text-[10px] uppercase tracking-widest text-amber-500/60 ml-4 mb-1 block font-bold">Security Token</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-amber-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl py-5 pl-14 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all font-mono text-sm placeholder:text-zinc-700"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold px-2">
              <div className="flex items-center gap-2 text-zinc-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Auth Server Active
              </div>
              <a href="#" className="text-amber-500/60 hover:text-amber-500 transition-colors">Emergency Reset</a>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-5 rounded-2xl shadow-xl shadow-amber-500/10 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-3 uppercase tracking-tighter text-lg group"
            >
              Initialize Session
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-zinc-800/50 text-center">
            <p className="text-zinc-600 text-xs font-mono">
              Authorized personnel only. All access attempts are logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

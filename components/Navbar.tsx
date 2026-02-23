'use client';

import Link from 'next/link';
import { Music, Github, BookOpen, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              GOH <span className="text-blue-500">MUSIC</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/docs" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Documentation
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-full transition-all glow-blue"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

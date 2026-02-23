'use client';

import Navbar from '@/components/Navbar';
import { motion } from 'motion/react';
import { Music, Zap, Shield, Code, ArrowRight, Play, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/LanguageContext';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden">
      <Navbar />
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 blur-[120px] -z-10 rounded-full" />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6"
            >
              <Sparkles className="w-3 h-3" />
              {t.hero.badge}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-8 leading-[0.9]"
            >
              {t.hero.title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                {t.hero.subtitle}
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed"
            >
              {t.hero.description}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link 
                href="/dashboard"
                className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all flex items-center gap-2 glow-blue"
              >
                {t.hero.ctaPrimary}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/docs"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all flex items-center gap-2"
              >
                {t.hero.ctaSecondary}
              </Link>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {[
              {
                icon: Zap,
                title: t.features.fast.title,
                desc: t.features.fast.desc
              },
              {
                icon: Shield,
                title: t.features.reliable.title,
                desc: t.features.reliable.desc
              },
              {
                icon: Code,
                title: t.features.devFriendly.title,
                desc: t.features.devFriendly.desc
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Effects Showcase */}
          <div className="rounded-[40px] bg-gradient-to-b from-blue-600/10 to-transparent border border-blue-500/20 p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] -z-10" />
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t.effects.title}</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-12">
              {t.effects.desc}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {['Slowed + Reverb', 'Nightcore', 'Bass Boost', '8D Audio', 'Lo-Fi'].map((effect, i) => (
                <div key={i} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-semibold">
                  {effect}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6 text-blue-500" />
            <span className="font-display font-bold text-lg">GOH MUSIC API</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 GOH MUSIC. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-slate-500 hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="text-slate-500 hover:text-white transition-colors">Discord</Link>
            <Link href="#" className="text-slate-500 hover:text-white transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

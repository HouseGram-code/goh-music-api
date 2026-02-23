'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'motion/react';
import { Key, Wallet, RefreshCw, Copy, Check, Music, Upload, Play, Download, AlertCircle, Sparkles } from 'lucide-react';
import { User } from '@/lib/db';
import { useTranslation } from '@/lib/LanguageContext';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [testFile, setTestFile] = useState<File | null>(null);
  const [testEffect, setTestEffect] = useState('slowed');
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const storedKey = typeof window !== 'undefined' ? localStorage.getItem('goh_api_key') : null;
      let url = storedKey ? `/api/user?apiKey=${storedKey}` : '/api/user';
      let res = await fetch(url);
      
      if (res.status === 404 && storedKey) {
        // Stale key, clear and get a new one
        localStorage.removeItem('goh_api_key');
        res = await fetch('/api/user');
      }

      const data = await res.json();
      
      if (data.apiKey) {
        setUser(data);
        localStorage.setItem('goh_api_key', data.apiKey);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTest = async () => {
    if (!testFile || !user) return;
    
    setProcessing(true);
    setError(null);
    setResultUrl(null);

    const formData = new FormData();
    formData.append('file', testFile);
    formData.append('effect', testEffect);

    try {
      const res = await fetch('/api/audio/process', {
        method: 'POST',
        headers: {
          'x-api-key': user.apiKey,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Processing failed');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      
      // Refresh user balance
      fetchUser();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2">{t.dashboard.title}</h1>
              <p className="text-slate-400 text-lg">{t.dashboard.subtitle}</p>
            </div>
            <button 
              onClick={fetchUser}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* API Key Card */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold">{t.dashboard.apiKey}</h3>
              </div>
              
              <div className="flex items-center gap-2 p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-sm">
                <span className="flex-1 truncate text-slate-300">{user?.apiKey}</span>
                <button 
                  onClick={() => copyToClipboard(user?.apiKey || '')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                {t.dashboard.apiKeyHint}
              </p>
            </div>

            {/* Balance Card */}
            <div className="p-8 rounded-3xl bg-blue-600/10 border border-blue-500/20 glow-blue">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold">{t.dashboard.balance}</h3>
              </div>
              
              <div className="mb-2">
                <span className="text-4xl font-bold text-white">{user?.balance.toLocaleString()}</span>
                <span className="ml-2 text-slate-400 font-medium">{t.dashboard.tokens}</span>
              </div>
              <p className="text-sm text-slate-400 mb-6">
                {user?.totalProcessed} {t.dashboard.processed}
              </p>
              
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all">
                {t.dashboard.topUp}
              </button>
            </div>
          </div>

          {/* API Tester */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold">{t.dashboard.playground}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">{t.dashboard.uploadLabel}</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="audio/mpeg"
                      onChange={(e) => setTestFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="p-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center group-hover:border-blue-500/50 transition-colors">
                      <Upload className="w-8 h-8 text-slate-500 mb-2 group-hover:text-blue-500 transition-colors" />
                      <span className="text-sm text-slate-400">
                        {testFile ? testFile.name : t.dashboard.uploadHint}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">{t.dashboard.effectLabel}</label>
                  <select 
                    value={testEffect}
                    onChange={(e) => setTestEffect(e.target.value)}
                    className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="slowed">Slowed + Reverb</option>
                    <option value="nightcore">Nightcore (Speed Up)</option>
                    <option value="bassboost">Bass Boost</option>
                    <option value="8d">8D Audio</option>
                    <option value="lofi">Lo-Fi</option>
                  </select>
                </div>

                <button 
                  onClick={handleTest}
                  disabled={!testFile || processing}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      {t.dashboard.processing}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      {t.dashboard.processBtn}
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-3xl border border-white/5">
                {error && (
                  <div className="flex items-center gap-2 text-red-400 mb-4 bg-red-400/10 p-4 rounded-xl w-full">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {resultUrl ? (
                  <div className="w-full space-y-6 text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Music className="w-10 h-10 text-green-500" />
                    </div>
                    <h4 className="text-xl font-bold">{t.dashboard.complete}</h4>
                    <audio src={resultUrl} controls className="w-full" />
                    <a 
                      href={resultUrl} 
                      download={`goh_music_${testEffect}.mp3`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      {t.dashboard.download}
                    </a>
                  </div>
                ) : (
                  <div className="text-center text-slate-500">
                    <Music className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>{t.dashboard.emptyResult}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

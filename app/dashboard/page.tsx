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
  const [showLogin, setShowLogin] = useState(false);
  const [loginKey, setLoginKey] = useState('');
  
  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('goh_api_key');
    if (storedKey) {
      fetchUser(storedKey);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (keyToUse: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `/api/user?apiKey=${keyToUse}`;
      let res = await fetch(url);
      
      if (res.status === 404) {
        setError('Invalid API Key. Account not found.');
        localStorage.removeItem('goh_api_key');
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      
      if (data.apiKey) {
        setUser(data);
        localStorage.setItem('goh_api_key', data.apiKey);
        setShowLogin(false);
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;

    setRegistering(true);
    setError(null);

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail }),
      });

      const data = await res.json();

      if (res.ok && data.apiKey) {
        setUser(data);
        localStorage.setItem('goh_api_key', data.apiKey);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginKey.trim()) {
      fetchUser(loginKey.trim());
    }
  };

  const logout = () => {
    localStorage.removeItem('goh_api_key');
    setUser(null);
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
      fetchUser(user.apiKey);
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
          {!user ? (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Welcome to GOH MUSIC</h1>
                <p className="text-slate-400">Register to get your API key and start processing audio.</p>
              </div>

              <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                    <input 
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                    <input 
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={registering}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    {registering ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    Create Account
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                  <button 
                    onClick={() => setShowLogin(!showLogin)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    {showLogin ? 'Back to Registration' : 'Already have an API Key? Restore Account'}
                  </button>
                </div>

                {showLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t border-white/5"
                  >
                    <form onSubmit={handleLogin} className="space-y-4">
                      <input 
                        type="text"
                        required
                        placeholder="Enter your API Key (goh_...)"
                        value={loginKey}
                        onChange={(e) => setLoginKey(e.target.value)}
                        className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 transition-colors font-mono text-sm"
                      />
                      <button 
                        type="submit"
                        className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                      >
                        Restore Account
                      </button>
                    </form>
                  </motion.div>
                )}
              </div>

              {error && (
                <div className="mt-6 flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Hello, {user.name}!</h1>
                  <p className="text-slate-400 text-lg">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={logout}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors text-sm font-medium"
                  >
                    Logout
                  </button>
                  <button 
                    onClick={() => fetchUser(user.apiKey)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-8 flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

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
        </>
      )}
    </div>
  </main>
</div>
);
}

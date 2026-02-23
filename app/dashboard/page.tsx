'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { RefreshCw, Music, Upload, Play, Download, AlertCircle, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/LanguageContext';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [testFile, setTestFile] = useState<File | null>(null);
  const [testEffect, setTestEffect] = useState('slowed');
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    if (!testFile) return;
    
    setProcessing(true);
    setError(null);
    setResultUrl(null);

    const formData = new FormData();
    formData.append('file', testFile);
    formData.append('effect', testEffect);

    try {
      const res = await fetch('/api/audio/process', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Processing failed');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">GOH MUSIC Playground</h1>
            <p className="text-slate-400">Upload your music and apply professional effects instantly.</p>
          </div>

          {error && (
            <div className="mb-8 flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

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
        </div>
      </main>
    </div>
  );
}

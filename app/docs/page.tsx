'use client';

import Navbar from '@/components/Navbar';
import { motion } from 'motion/react';
import { Code, Terminal, Book, Cpu, Globe, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const PYTHON_EXAMPLE = `import requests

API_KEY = "YOUR_API_KEY"
API_URL = "https://goh-music-api.run.app/api/audio/process"

def apply_effect(file_path, effect="slowed"):
    with open(file_path, "rb") as f:
        files = {"file": f}
        data = {"effect": effect}
        headers = {"x-api-key": API_KEY}
        
        response = requests.post(API_URL, headers=headers, files=files, data=data)
        
        if response.status_code == 200:
            with open(f"processed_{effect}.mp3", "wb") as out:
                out.write(response.content)
            print("Success! Saved as processed.mp3")
        else:
            print(f"Error: {response.json()}")

# Example usage
apply_effect("song.mp3", "nightcore")`;

const TELEGRAM_BOT_EXAMPLE = `import telebot
import requests
import io

bot = telebot.TeleBot("YOUR_TELEGRAM_BOT_TOKEN")
API_KEY = "YOUR_GOH_API_KEY"
API_URL = "https://goh-music-api.run.app/api/audio/process"

@bot.message_handler(content_types=['audio'])
def handle_audio(message):
    bot.reply_to(message, "Processing your music... 🎧")
    
    # Get file info
    file_info = bot.get_file(message.audio.file_id)
    downloaded_file = bot.download_file(file_info.file_path)
    
    # Send to GOH MUSIC API
    files = {'file': ('audio.mp3', downloaded_file, 'audio/mpeg')}
    data = {'effect': 'slowed'} # You can add buttons to choose effect
    headers = {'x-api-key': API_KEY}
    
    response = requests.post(API_URL, headers=headers, files=files, data=data)
    
    if response.status_code == 200:
        bot.send_audio(message.chat.id, response.content, caption="Processed by GOH MUSIC API")
    else:
        bot.reply_to(message, f"Error: {response.json().get('error')}")

bot.polling()`;

export default function DocsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h1 className="text-5xl font-bold mb-6">Documentation</h1>
            <p className="text-xl text-slate-400">Learn how to integrate GOH MUSIC API into your applications.</p>
          </div>

          {/* Quick Start */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-3xl font-bold">API Reference</h2>
            </div>

            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">POST</span>
                  <code className="text-blue-400">/api/audio/process</code>
                </div>
                <p className="text-slate-400 mb-6">Process an audio file with a specific effect.</p>
                
                <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-500">Headers</h4>
                <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="font-mono text-sm">x-api-key</span>
                    <span className="text-slate-500 text-sm">Your API Key</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-mono text-sm">Content-Type</span>
                    <span className="text-slate-500 text-sm">multipart/form-data</span>
                  </div>
                </div>

                <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-500">Body Parameters</h4>
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="font-mono text-sm">file</span>
                    <span className="text-slate-500 text-sm">Audio file (MP3)</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-mono text-sm">effect</span>
                    <span className="text-slate-500 text-sm">slowed, nightcore, bassboost, 8d, lofi</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Python Example */}
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-yellow-500" />
                </div>
                <h2 className="text-3xl font-bold">Python Example</h2>
              </div>
              <button 
                onClick={() => copy(PYTHON_EXAMPLE, 'py')}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors"
              >
                {copied === 'py' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                Copy Code
              </button>
            </div>
            <div className="bg-black/60 rounded-3xl p-8 border border-white/10 overflow-x-auto font-mono text-sm leading-relaxed text-blue-300">
              <pre>{PYTHON_EXAMPLE}</pre>
            </div>
          </section>

          {/* Telegram Bot Example */}
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold">Telegram Bot (pyTelegramBotAPI)</h2>
              </div>
              <button 
                onClick={() => copy(TELEGRAM_BOT_EXAMPLE, 'tg')}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors"
              >
                {copied === 'tg' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                Copy Code
              </button>
            </div>
            <div className="bg-black/60 rounded-3xl p-8 border border-white/10 overflow-x-auto font-mono text-sm leading-relaxed text-blue-300">
              <pre>{TELEGRAM_BOT_EXAMPLE}</pre>
            </div>
          </section>

          {/* Pricing/Tokens */}
          <section className="p-12 rounded-[40px] bg-blue-600/10 border border-blue-500/20">
            <h2 className="text-3xl font-bold mb-6">Token Usage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-slate-400 mb-6">
                  Every processing request consumes tokens from your balance. 
                  Standard processing costs are fixed regardless of file size (up to 20MB).
                </p>
                <div className="flex items-center gap-4 p-6 bg-black/40 rounded-2xl border border-white/5">
                  <div className="text-3xl font-bold text-blue-500">25</div>
                  <div className="text-slate-400 font-medium uppercase tracking-wider text-xs">Tokens per request</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Initial balance: 200,000 tokens
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Real-time balance updates
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Auto-rejection on zero balance
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

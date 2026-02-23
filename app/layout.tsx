import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'GOH MUSIC API | Professional Audio Processing',
  description: 'The ultimate API for audio effects. Slowed, Reverb, Nightcore, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-slate-950 text-slate-50 min-h-screen selection:bg-blue-500/30" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

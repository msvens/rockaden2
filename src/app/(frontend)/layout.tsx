import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';

import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import NavbarConfig from '@/components/NavbarConfig';
import { Footer } from '@/components/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SK Rockaden',
  description: 'SK Rockaden - Schackklubb i Stockholm',
};

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <ThemeProvider>
          <LanguageProvider>
            <NavbarConfig />
            <main className="pt-16 min-h-screen">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

/* ============================================================
   FONT CONFIGURATION
   ============================================================
   - Inter: Body/UI text (Google Fonts — reliable)
   - IBM Plex Mono: Technical labels (Google Fonts — reliable)
   - General Sans: Loaded via Fontshare CDN <link> below.
     Fallback chain: "General Sans" → "Inter" → system-ui → sans-serif
     If General Sans fails to load, Inter provides a clean fallback
     while preserving all weight/size/spacing specs.
   ============================================================ */

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
});

export const metadata: Metadata = {
  title: 'Khushi Solutions — Engineered Software for Real Businesses',
  description:
    'Khushi Solutions builds production-grade software platforms — from multi-store delivery systems to AI-powered school management. Real products. Real users. Proven results.',
  keywords: [
    'Khushi Solutions',
    'Bites delivery platform',
    'Khushi SMS',
    'School ERP',
    'multi-store delivery',
    'school management system',
    'Pakistan software company',
    'FastAPI',
    'React Native',
    'AI facial recognition attendance',
  ],
  authors: [{ name: 'Khushi Solutions' }],
  openGraph: {
    title: 'Khushi Solutions — Engineered Software for Real Businesses',
    description:
      'Production-grade software platforms for delivery operations and educational institutions.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://khushisolutions.com',
    siteName: 'Khushi Solutions',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khushi Solutions — Engineered Software for Real Businesses',
    description:
      'Production-grade software platforms for delivery operations and educational institutions.',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://khushisolutions.com'
  ),
};

import CustomCursor from '@/components/ui/CustomCursor';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        {/* General Sans from Fontshare (free, production-safe) */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
        />
        <link
          rel="icon"
          href="/images/company/logo.png"
          type="image/png"
        />
      </head>
      <body className={inter.className}>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}

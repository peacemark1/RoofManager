import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'RoofManager - AI-Powered Roofing Business Management for Ghana',
  description: 'Complete CRM and business management platform for roofing contractors in Ghana. AI estimates, crew scheduling, invoicing, and revenue analytics. Start your free 14-day trial today.',
  keywords: [
    'roofing software',
    'roofing CRM',
    'roofing business management',
    'roofing estimates',
    'Ghana roofing',
    'roofing scheduling',
    'roofing app',
    'contractor management',
    'construction management',
  ],
  metadataBase: new URL('https://roofmanager.com'),
  authors: [{ name: 'RoofManager' }],
  creator: 'RoofManager',
  publisher: 'RoofManager Inc.',
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    url: 'https://roofmanager.com',
    siteName: 'RoofManager',
    title: 'RoofManager - AI-Powered Roofing Business Management',
    description: 'Transform your roofing business with intelligent CRM software built for Ghana. Estimate, schedule, manage crew, and track revenue.',
    images: [
      {
        url: 'https://roofmanager.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RoofManager - Roofing Business Management Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoofManager - AI-Powered Roofing Business Management',
    description: 'Complete roofing business management software built for Ghana.',
    creator: '@RoofManager',
    images: ['https://roofmanager.com/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://roofmanager.com',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'dark',
};

// Structured Data for SEO
export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'RoofManager',
  applicationCategory: 'BusinessApplication',
  description: 'AI-powered CRM and business management platform for roofing contractors',
  url: 'https://roofmanager.com',
  potentialAction: {
    '@type': 'TradeAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://roofmanager.com/register',
    },
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'GHS',
    url: 'https://roofmanager.com/pricing',
  },
};

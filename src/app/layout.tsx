import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { CodeProvider } from '@/context/CodeContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DrasticSite',
  description: 'A single-page HTML site hoster free for all',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <CodeProvider>{children}</CodeProvider>
      </body>
    </html>
  );
}

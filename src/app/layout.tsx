import type { Metadata } from 'next';
import { CodeProvider } from '@/context/CodeContext';

export const metadata: Metadata = {
  title: 'DrasticSite | AI HTML Website Builder & Host',
  description:
    'Build websites with Gemini AI and publish them instantly with one click.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CodeProvider>{children}</CodeProvider>
      </body>
    </html>
  );
}

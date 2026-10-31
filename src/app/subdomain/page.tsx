import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getSitePage } from '@/lib/storage';

export default async function SubdomainPage() {
  const headersList = await headers();
  const site =
    headersList.get('x-site') || headersList.get('host')?.split('.')[0];

  if (!site) {
    notFound();
  }

  const page = await getSitePage(site);

  if (!page) notFound();

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: page.code,
      }}
    />
  );
}

import { Metadata } from 'next';

interface PageProps {
  params: { name: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: `${params.name} | DrasticSite`,
  };
}

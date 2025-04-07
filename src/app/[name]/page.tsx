import { MongoClient } from 'mongodb';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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

export default async function Page({ params }: PageProps) {
  const client = new MongoClient(process.env.MONGO_URI!);
  await client.connect();
  const db = client.db('htmlpublisher');

  const page = await db.collection('pages').findOne({ name: params.name });

  if (!page) notFound();

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: page.code,
      }}
    />
  );
}

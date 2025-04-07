import { MongoClient } from 'mongodb';
import { notFound } from 'next/navigation';

interface PageParams {
  name: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function Page({ params }: PageProps) {
  const { name } = await params;

  const client = new MongoClient(process.env.MONGO_URI!);
  await client.connect();
  const db = client.db('htmlpublisher');

  const page = await db.collection('pages').findOne({ name });

  if (!page) notFound();

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: page.code,
      }}
    />
  );
}

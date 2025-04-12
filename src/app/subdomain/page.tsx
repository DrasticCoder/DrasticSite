import { headers } from 'next/headers';
import { MongoClient } from 'mongodb';
import { notFound } from 'next/navigation';

export default async function SubdomainPage() {
  const headersList = await headers();
  const site =
    headersList.get('x-site') || headersList.get('host')?.split('.')[0];

  const client = new MongoClient(process.env.MONGO_URI!);
  await client.connect();
  const db = client.db('htmlpublisher');

  const page = await db.collection('pages').findOne({ name: site });

  if (!page) notFound();

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: page.code,
      }}
    />
  );
}

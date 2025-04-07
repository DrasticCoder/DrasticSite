import { MongoClient } from 'mongodb';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { name: string } }) {
  const client = new MongoClient(process.env.MONGO_URI!);
  await client.connect();
  const db = client.db('htmlpublisher');

  const page = await db.collection('pages').findOne({ name: params.name });

  if (!page) {
    return notFound();
  }

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: page.code,
      }}
    />
  );
}

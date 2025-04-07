import { MongoClient } from 'mongodb';

export default async function Page({ params }: { params: { name: string } }) {
  const client = new MongoClient(process.env.MONGO_URI!);
  await client.connect();
  const db = client.db('htmlpublisher');

  const page = await db.collection('pages').findOne({ name: params.name });

  if (!page) {
    return <h1>Not Found</h1>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: page.code,
      }}
    />
  );
}

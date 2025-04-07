import { Db, MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGO_URI!;
const client = new MongoClient(uri);
let conn: Db;

export async function POST(req: Request) {
  const { name, code } = await req.json();

  if (!name || !code) {
    return NextResponse.json(
      { message: 'Missing name or code' },
      { status: 400 },
    );
  }

  try {
    if (!conn) {
      await client.connect();
      conn = client.db('htmlpublisher');
    }

    await conn
      .collection('pages')
      .updateOne({ name }, { $set: { name, code } }, { upsert: true });

    return NextResponse.json({ message: 'Saved!' });
  } catch (err: any) {
    return NextResponse.json(
      { message: 'DB error', error: err.message },
      { status: 500 },
    );
  }
}

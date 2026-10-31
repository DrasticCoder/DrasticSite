import { MongoClient, Db } from 'mongodb';
import fs from 'fs';
import path from 'path';

// In-memory fallback for environments without MongoDB configured
const fallbackStore = new Map<string, { name: string; code: string; updatedAt: string }>();

// Optional file backing for local fallback
const fallbackFileDir = path.join(process.cwd(), '.data');
const fallbackFilePath = path.join(fallbackFileDir, 'pages.json');

function initLocalStore() {
  try {
    if (fs.existsSync(fallbackFilePath)) {
      const data = JSON.parse(fs.readFileSync(fallbackFilePath, 'utf-8'));
      for (const [key, val] of Object.entries(data)) {
        fallbackStore.set(key, val as { name: string; code: string; updatedAt: string });
      }
    }
  } catch (err) {
    console.warn('Could not read fallback storage:', err);
  }
}

function persistLocalStore() {
  try {
    if (!fs.existsSync(fallbackFileDir)) {
      fs.mkdirSync(fallbackFileDir, { recursive: true });
    }
    const obj: Record<string, unknown> = {};
    for (const [key, val] of fallbackStore.entries()) {
      obj[key] = val;
    }
    fs.writeFileSync(fallbackFilePath, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist fallback storage:', err);
  }
}

initLocalStore();

let client: MongoClient | null = null;
let conn: Db | null = null;

async function getMongoDb(): Promise<Db | null> {
  const uri = process.env.MONGO_URI;
  if (!uri) return null;

  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    conn = client.db('htmlpublisher');
  }
  return conn;
}

export async function saveSitePage(name: string, code: string): Promise<void> {
  const db = await getMongoDb().catch((err) => {
    console.warn('MongoDB connection failed, falling back to local store:', err.message);
    return null;
  });

  if (db) {
    await db.collection('pages').updateOne(
      { name },
      { $set: { name, code, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
  } else {
    // Local / In-memory fallback
    fallbackStore.set(name, { name, code, updatedAt: new Date().toISOString() });
    persistLocalStore();
  }
}

export async function getSitePage(name: string): Promise<{ name: string; code: string } | null> {
  const db = await getMongoDb().catch((err) => {
    console.warn('MongoDB connection failed, falling back to local store:', err.message);
    return null;
  });

  if (db) {
    const page = await db.collection('pages').findOne({ name });
    if (page) {
      return { name: page.name, code: page.code };
    }
    return null;
  }

  // Check fallback store
  const localPage = fallbackStore.get(name);
  if (localPage) {
    return { name: localPage.name, code: localPage.code };
  }
  return null;
}

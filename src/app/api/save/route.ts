import { NextResponse } from 'next/server';
import { saveSitePage } from '@/lib/storage';

export async function POST(req: Request) {
  try {
    const { name, code } = await req.json();

    if (!name || !code) {
      return NextResponse.json(
        { message: 'Missing name or code' },
        { status: 400 },
      );
    }

    const cleanSlug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!cleanSlug) {
      return NextResponse.json(
        { message: 'Invalid site name' },
        { status: 400 }
      );
    }

    await saveSitePage(cleanSlug, code);

    return NextResponse.json({
      message: 'Saved!',
      slug: cleanSlug,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Failed to save page', error: errorMessage },
      { status: 500 },
    );
  }
}

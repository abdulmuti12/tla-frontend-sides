import { readdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

const BASE_DIR = join(process.cwd(), '360');

function stripExt(name: string): string {
  const ext = name.toLowerCase().match(/\.(webp|jpg|jpeg|png)$/);
  return ext ? name.slice(0, -ext[0].length) : name;
}

async function scanFolder(folder: string) {
  try {
    const entries = await readdir(join(BASE_DIR, folder));
    return entries.filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f)).sort();
  } catch {
    return [];
  }
}

export async function GET() {
  const [desktopFiles, mobileFiles] = await Promise.all([
    scanFolder('desktop'),
    scanFolder('mobile'),
  ]);

  if (desktopFiles.length === 0 && mobileFiles.length === 0) {
    return NextResponse.json({ data: [] });
  }

  // Build unique list by basename — no duplicates
  const basenames = new Set<string>();
  for (const f of desktopFiles) basenames.add(stripExt(f));
  for (const f of mobileFiles) basenames.add(stripExt(f));
  const sorted = Array.from(basenames).sort();

  // Map basename -> URLs
  const data = sorted.map((name) => ({
    id: name,
    name: name.replace(/_/g, ' '),
    // Default to desktop if available, else mobile
    url: desktopFiles.some((f) => stripExt(f) === name)
      ? `/360/desktop/${name}.webp`
      : `/360/mobile/${name}.webp`,
    desktopUrl: desktopFiles.some((f) => stripExt(f) === name) ? `/360/desktop/${name}.webp` : '',
    mobileUrl: mobileFiles.some((f) => stripExt(f) === name) ? `/360/mobile/${name}.webp` : '',
  }));

  return NextResponse.json({ data });
}

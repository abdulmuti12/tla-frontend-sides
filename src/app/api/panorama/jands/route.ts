import { readdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

const BASE_DIR = join(process.cwd(), '360', 'jands');

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

  const basenames = new Set<string>();
  for (const f of desktopFiles) basenames.add(stripExt(f));
  for (const f of mobileFiles) basenames.add(stripExt(f));
  const sorted = Array.from(basenames).sort();

  const data = sorted.map((name) => ({
    id: name,
    name: name.replace(/_/g, ' '),
    url: desktopFiles.some((f) => stripExt(f) === name)
      ? `/360/jands/desktop/${name}.webp`
      : `/360/jands/mobile/${name}.webp`,
    desktopUrl: desktopFiles.some((f) => stripExt(f) === name) ? `/360/jands/desktop/${name}.webp` : '',
    mobileUrl: mobileFiles.some((f) => stripExt(f) === name) ? `/360/jands/mobile/${name}.webp` : '',
  }));

  return NextResponse.json({ data });
}

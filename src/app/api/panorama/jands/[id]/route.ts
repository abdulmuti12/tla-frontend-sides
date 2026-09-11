import { stat } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

const BASE_DIR = join(process.cwd(), '360', 'jands');

function stripExt(name: string): string {
  const ext = name.toLowerCase().match(/\.(webp|jpg|jpeg|png)$/);
  return ext ? name.slice(0, -ext[0].length) : name;
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const baseName = stripExt(decodeURIComponent(params.id));
  const desktopPath = join(BASE_DIR, 'desktop', `${baseName}.webp`);
  const mobilePath = join(BASE_DIR, 'mobile', `${baseName}.webp`);

  let desktopExists = false;
  let mobileExists = false;
  try { await stat(desktopPath); desktopExists = true; } catch { /* skip */ }
  try { await stat(mobilePath); mobileExists = true; } catch { /* skip */ }

  if (!desktopExists && !mobileExists) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      id: baseName,
      name: baseName.replace(/_/g, ' '),
      url: desktopExists ? `/360/jands/desktop/${baseName}.webp` : `/360/jands/mobile/${baseName}.webp`,
      desktopUrl: desktopExists ? `/360/jands/desktop/${baseName}.webp` : '',
      mobileUrl: mobileExists ? `/360/jands/mobile/${baseName}.webp` : '',
    },
  });
}

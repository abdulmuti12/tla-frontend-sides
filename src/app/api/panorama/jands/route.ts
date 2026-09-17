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

// Room name mapping
const ROOM_NAMES: Record<string, string> = {
  'IMG_20181006_210140_00_011': 'Bedroom',
  'IMG_20181006_210341_00_012': 'Hallway',
  'IMG_20181006_210507_00_013': 'Kitchen',
  'IMG_20181006_210617_00_014': 'Study',
  'IMG_20181006_214238_00_015': 'Living Room',
  'IMG_20181006_214633_00_016': 'Bathroom',
  'IMG_20181006_214801_00_017': 'Dining Area',
  'IMG_20181006_214911_00_018': 'Garage',
  'IMG_20181006_214950_00_019': 'Patio',
  'IMG_20181006_215043_00_020': 'Garden',
  'IMG_20181006_215350_00_021': 'Office',
  'IMG_20181006_231323_00_022': 'Mini Bar',
};

// Define connections between rooms: yaw (horizontal angle) and pitch (vertical angle)
// yaw: 0 = facing forward, ±π/2 = left/right, ±π = behind
// pitch: 0 = level, ±π/2 = up/down
const CONNECTIONS: Record<string, Array<{ targetId: string; yaw: number; pitch: number; label: string }>> = {
  'IMG_20181006_210140_00_011': [
    { targetId: 'IMG_20181006_210341_00_012', yaw: Math.PI / 2, pitch: 0, label: 'Hallway →' },
  ],
  'IMG_20181006_210341_00_012': [
    { targetId: 'IMG_20181006_210140_00_011', yaw: -Math.PI / 2, pitch: 0, label: '← Bedroom' },
    { targetId: 'IMG_20181006_210507_00_013', yaw: Math.PI / 2, pitch: 0, label: 'Kitchen →' },
  ],
  'IMG_20181006_210507_00_013': [
    { targetId: 'IMG_20181006_210341_00_012', yaw: -Math.PI / 2, pitch: 0, label: '← Hallway' },
    { targetId: 'IMG_20181006_210617_00_014', yaw: Math.PI, pitch: 0, label: 'Study →' },
  ],
  'IMG_20181006_210617_00_014': [
    { targetId: 'IMG_20181006_210507_00_013', yaw: 0, pitch: 0, label: '← Kitchen' },
  ],
  'IMG_20181006_214238_00_015': [
    { targetId: 'IMG_20181006_214633_00_016', yaw: Math.PI / 2, pitch: 0, label: 'Bathroom →' },
  ],
  'IMG_20181006_214633_00_016': [
    { targetId: 'IMG_20181006_214238_00_015', yaw: -Math.PI / 2, pitch: 0, label: '← Living Room' },
  ],
  'IMG_20181006_214801_00_017': [
    { targetId: 'IMG_20181006_214911_00_018', yaw: Math.PI, pitch: 0, label: 'Garage →' },
  ],
  'IMG_20181006_214911_00_018': [
    { targetId: 'IMG_20181006_214801_00_017', yaw: 0, pitch: 0, label: '← Dining Area' },
  ],
  'IMG_20181006_214950_00_019': [
    { targetId: 'IMG_20181006_215043_00_020', yaw: Math.PI / 2, pitch: -Math.PI / 6, label: 'Garden →' },
  ],
  'IMG_20181006_215043_00_020': [
    { targetId: 'IMG_20181006_214950_00_019', yaw: -Math.PI / 2, pitch: Math.PI / 6, label: '← Patio' },
  ],
  'IMG_20181006_215350_00_021': [
    { targetId: 'IMG_20181006_231323_00_022', yaw: Math.PI, pitch: 0, label: 'Mini Bar →' },
  ],
  'IMG_20181006_231323_00_022': [
    { targetId: 'IMG_20181006_215350_00_021', yaw: 0, pitch: 0, label: '← ' },
  ],
};

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

  const data = sorted
    .map((name) => ({
      id: name,
      name: ROOM_NAMES[name] ?? name.replace(/_/g, ' '),
      url: desktopFiles.some((f) => stripExt(f) === name)
        ? `/360/jands/desktop/${name}.webp`
        : `/360/jands/mobile/${name}.webp`,
      desktopUrl: desktopFiles.some((f) => stripExt(f) === name) ? `/360/jands/desktop/${name}.webp` : '',
      mobileUrl: mobileFiles.some((f) => stripExt(f) === name) ? `/360/jands/mobile/${name}.webp` : '',
      connections: CONNECTIONS[name] ?? [],
    }))
    .filter((item) => item.id !== 'IMG_20181006_205736_00_010');

  return NextResponse.json({ data });
}

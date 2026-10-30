import path from 'node:path';
import sharp from 'sharp';

const cache = new Map<string, Promise<string>>();

const EMPTY =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221%22 height=%221%22%3E%3C/svg%3E';

export function getLqip(publicPath: string): Promise<string> {
  let pending = cache.get(publicPath);
  if (!pending) {
    pending = generateLqip(publicPath).catch(() => EMPTY);
    cache.set(publicPath, pending);
  }
  return pending;
}

async function generateLqip(publicPath: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'public', publicPath.replace(/^\/+/, ''));
  const buffer = await sharp(filePath)
    .rotate()
    .resize({ width: 32 })
    .blur(10)
    .webp({ quality: 50 })
    .toBuffer();

  return `data:image/webp;base64,${buffer.toString('base64')}`;
}

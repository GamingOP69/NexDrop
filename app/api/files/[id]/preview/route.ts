import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Readable } from 'stream';
import { getReadableStream } from '@/lib/storage';

export const runtime = 'nodejs';

export async function GET(req: NextRequest, ctx: any) {
  const params = await (ctx?.params ?? {});
  const { id } = params as { id: string };
  const file = await prisma.file.findUnique({ where: { id } });
  if (!file) return new Response('Not found', { status: 404 });

  const rangeHeader = req.headers.get('range');
  const size = Number(file.size ?? 0n);
  if (rangeHeader) {
    const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
    if (!match) return new Response('Invalid range', { status: 416 });
    const start = match[1] ? Number(match[1]) : 0;
    const end = match[2] ? Number(match[2]) : size - 1;
    if (start > end || start >= size) return new Response('Range Not Satisfiable', { status: 416 });

    const stream = await getReadableStream(file.storagePath, { start, end });
    const headers: Record<string, string> = {
      'Content-Type': file.mimeType,
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': String(end - start + 1)
    };
    return new Response(Readable.toWeb(stream as any) as any, { status: 206, headers });
  }

  const stream = await getReadableStream(file.storagePath);
  return new Response(Readable.toWeb(stream as any) as any, {
    headers: { 'Content-Type': file.mimeType }
  });
}

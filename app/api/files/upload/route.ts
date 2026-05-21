import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { assembleChunks, cleanupChunks, finalFilePath, ensureStorage, userDir, writeChunk } from '@/lib/storage';
import { safeFileName } from '@/lib/utils';
import fs from 'fs/promises';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  await ensureStorage();
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const chunk = form.get('chunk');
  const fileId = String(form.get('fileId') || '');
  const fileName = String(form.get('fileName') || 'file');
  const mimeType = String(form.get('mimeType') || 'application/octet-stream');
  const chunkIndex = Number(form.get('chunkIndex') || '0');
  const totalChunks = Number(form.get('totalChunks') || '1');

  if (!(chunk instanceof File)) {
    return NextResponse.json({ error: 'Missing chunk' }, { status: 400 });
  }

  const arrayBuffer = await chunk.arrayBuffer();
  const chunkPath = await writeChunk(fileId, chunkIndex, arrayBuffer);

  if (chunkIndex === 0) {
    await prisma.file.upsert({
      where: { id: fileId },
      update: {},
      create: {
        id: fileId,
        userId: user.id,
        fileName: safeFileName(fileName),
        originalName: fileName,
        mimeType,
        size: 0n,
        storagePath: finalFilePath(user.id, fileId, fileName)
      }
    });
    await fs.mkdir(userDir(user.id), { recursive: true });
  }

  await prisma.uploadChunk.upsert({
    where: { fileId_chunkIndex: { fileId, chunkIndex } },
    update: { size: BigInt(arrayBuffer.byteLength), chunkPath },
    create: {
      fileId,
      chunkIndex,
      chunkPath,
      size: BigInt(arrayBuffer.byteLength)
    }
  });

  const chunks = await prisma.uploadChunk.count({ where: { fileId } });
  if (chunks >= totalChunks) {
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file) return NextResponse.json({ error: 'Upload record missing' }, { status: 400 });

    await assembleChunks(fileId, totalChunks, file.storagePath);
    const stat = await fs.stat(file.storagePath);
    await prisma.$transaction([
      prisma.file.update({ where: { id: fileId }, data: { size: BigInt(stat.size) } }),
      prisma.user.update({ where: { id: user.id }, data: { storageUsed: { increment: BigInt(stat.size) } } }),
      prisma.uploadChunk.deleteMany({ where: { fileId } })
    ]);
    await cleanupChunks(fileId);

    return NextResponse.json({ ok: true, complete: true, fileId });
  }

  return NextResponse.json({ ok: true, complete: false, fileId });
}

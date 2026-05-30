import { NextRequest, NextResponse } from 'next/server';
import { currentUser as getUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { assembleChunks, cleanupChunks, finalFilePath, ensureStorage, userDir, writeChunk, uploadLocalToStore } from '@/lib/storage';
import { env } from '@/lib/env';
import utils from '@/lib/utils.js';
import { uploadInitSanity } from '@/lib/validation';
import { uploads } from '@/lib/metrics';
import { rateLimitUpload } from '@/lib/rate-limit';
import fs from 'fs/promises';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    await ensureStorage();

    // Basic CSRF protection: double-submit cookie
    const csrfHeader = req.headers.get('x-csrf-token') || '';
    const csrfCookie = req.cookies.get('nd_csrf')?.value || '';
    if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
      return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 });
    }

    // Get authenticated user
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Rate limit uploads per user
    const rateLimit = await rateLimitUpload(user.id);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Upload limit exceeded. Try again later.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } }
      );
    }

    // Parse form data
    const form = await req.formData();
    const chunk = form.get('chunk');
    const fileId = String(form.get('fileId') || '');
    const fileName = String(form.get('fileName') || 'file');
    const mimeType = String(form.get('mimeType') || 'application/octet-stream');
    const chunkIndex = Number(form.get('chunkIndex') || '0');
    const totalChunks = Number(form.get('totalChunks') || '1');
    const totalSize = Number(form.get('totalSize') || '0');

    // Validate form data
    if (!(chunk instanceof File)) {
      return NextResponse.json({ error: 'Missing chunk file' }, { status: 400 });
    }

    const validation = uploadInitSanity.safeParse({
      fileId,
      fileName,
      mimeType,
      chunkIndex,
      totalChunks,
      chunkSize: chunk.size,
      totalSize
    });

    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || 'Invalid upload parameters';
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Convert chunk to buffer
    const arrayBuffer = await chunk.arrayBuffer();
    const chunkSize = arrayBuffer.byteLength;

    // Validate chunk size
    if (chunkSize > env.CHUNK_SIZE) {
      return NextResponse.json(
        { error: 'Chunk too large (max 5MB)' },
        { status: 413 }
      );
    }

    const expectedChunkSize = chunkIndex === totalChunks - 1
      ? totalSize - (chunkIndex * env.CHUNK_SIZE)
      : env.CHUNK_SIZE;

    if (chunkIndex < totalChunks - 1 && chunkSize !== env.CHUNK_SIZE) {
      return NextResponse.json({ error: 'Invalid chunk size' }, { status: 400 });
    }

    if (chunkIndex === totalChunks - 1 && chunkSize > expectedChunkSize) {
      return NextResponse.json({ error: 'Final chunk is larger than expected' }, { status: 400 });
    }

    const existingFile = await prisma.file.findUnique({ where: { id: fileId }, select: { userId: true } });
    if (existingFile && existingFile.userId !== user.id) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    if (chunkIndex === 0 && !existingFile) {
      await prisma.file.create({
        data: {
          id: fileId,
          userId: user.id,
          fileName: utils.safeFileName(fileName),
          originalName: fileName,
          mimeType: mimeType,
          size: 0n,
          storagePath: finalFilePath(user.id, fileId, fileName)
        }
      });
      await fs.mkdir(userDir(user.id), { recursive: true });
    }

    // Check storage quota BEFORE adding file
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { storageUsed: true, storageLimit: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const projectedUsage = Number(currentUser.storageUsed) + totalSize;
    const limit = Number(currentUser.storageLimit);

    if (projectedUsage > limit) {
      return NextResponse.json(
        {
          error: `Storage quota exceeded. Need ${Math.ceil(projectedUsage / 1024 / 1024 / 1024)}GB but have ${Math.ceil(limit / 1024 / 1024 / 1024)}GB available.`,
          quotaExceeded: true,
          current: Number(currentUser.storageUsed),
          limit: limit,
          projected: projectedUsage
        },
        { status: 413 }
      );
    }

    // Write chunk to disk
    const chunkPath = await writeChunk(fileId, chunkIndex, arrayBuffer);

    // Store chunk metadata
    await prisma.uploadChunk.upsert({
      where: { fileId_chunkIndex: { fileId, chunkIndex } },
      update: { size: BigInt(chunkSize), chunkPath },
      create: {
        fileId,
        chunkIndex,
        chunkPath,
        size: BigInt(chunkSize)
      }
    });

    // Check if upload is complete
    const uploadedChunks = await prisma.uploadChunk.count({ where: { fileId } });

    if (uploadedChunks >= totalChunks) {
      // Get file record
      const file = await prisma.file.findUnique({ where: { id: fileId } });
      if (!file) {
        return NextResponse.json(
          { error: 'Upload record lost' },
          { status: 500 }
        );
      }

      // Assemble chunks into final file
      await assembleChunks(fileId, totalChunks, file.storagePath);

      // Get final file size
      const stat = await fs.stat(file.storagePath);
      const finalSize = BigInt(stat.size);

      if (finalSize !== BigInt(totalSize)) {
        await cleanupChunks(fileId);
        await prisma.uploadChunk.deleteMany({ where: { fileId } });
        await prisma.file.delete({ where: { id: fileId } }).catch(() => {});
        return NextResponse.json({ error: 'Uploaded size mismatch' }, { status: 400 });
      }

      // If S3 is enabled, upload final file to S3 and update storagePath
      let newStoragePath = file.storagePath;
      if (env.S3_ENABLED) {
        const key = `${user.id}/${fileId}-${utils.safeFileName(file.originalName)}`;
        try {
          await uploadLocalToStore(file.storagePath, key);
          newStoragePath = key;
        } catch (e) {
          console.error('S3 upload failed, keeping local path', e);
        }
      }

      // Update file with final size and user storage quota
      await prisma.$transaction([
        prisma.file.update({
          where: { id: fileId },
          data: { size: finalSize, storagePath: newStoragePath }
        }),
        prisma.user.update({
          where: { id: user.id },
          data: { storageUsed: { increment: finalSize } }
        }),
        prisma.uploadChunk.deleteMany({ where: { fileId } })
      ]);

      // Clean up temp chunks
      await cleanupChunks(fileId);

      // Log analytics
      try {
        await prisma.analyticsEvent.create({
          data: {
            userId: user.id,
            eventType: 'FILE_UPLOADED',
            metadata: {
              fileId,
              fileName: file.originalName,
              fileSize: finalSize.toString(),
              mimeType
            }
          }
        });
        try { uploads.inc(); } catch (e) {}
      } catch (error) {
        console.error('Analytics error:', error);
      }

      return NextResponse.json({
        ok: true,
        complete: true,
        fileId,
        fileSize: finalSize.toString()
      });
    }

    return NextResponse.json({
      ok: true,
      complete: false,
      fileId,
      chunkIndex,
      uploadedChunks,
      totalChunks
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

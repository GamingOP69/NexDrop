import fs from 'fs/promises';
import path from 'path';
import { env } from './env';
import { safeFileName } from './utils';

export async function ensureStorage() {
  await fs.mkdir(env.STORAGE_PATH, { recursive: true });
  await fs.mkdir(env.TEMP_UPLOAD_PATH, { recursive: true });
}

export function userDir(userId: string) {
  return path.join(env.STORAGE_PATH, 'users', userId);
}

export function tempDir(fileId: string) {
  return path.join(env.TEMP_UPLOAD_PATH, fileId);
}

export function finalFilePath(userId: string, fileId: string, originalName: string) {
  return path.join(userDir(userId), `${fileId}-${safeFileName(originalName)}`);
}

export async function writeChunk(fileId: string, index: number, data: ArrayBuffer) {
  const dir = tempDir(fileId);
  await fs.mkdir(dir, { recursive: true });
  const chunkPath = path.join(dir, `chunk-${String(index).padStart(6, '0')}`);
  await fs.writeFile(chunkPath, Buffer.from(data));
  return chunkPath;
}

export async function assembleChunks(fileId: string, chunkCount: number, destPath: string) {
  const dir = tempDir(fileId);
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  const out = await fs.open(destPath, 'w');

  try {
    for (let i = 0; i < chunkCount; i++) {
      const chunkPath = path.join(dir, `chunk-${String(i).padStart(6, '0')}`);
      const chunk = await fs.readFile(chunkPath);
      await out.write(chunk);
    }
  } finally {
    await out.close();
  }
}

export async function cleanupChunks(fileId: string) {
  await fs.rm(tempDir(fileId), { recursive: true, force: true });
}

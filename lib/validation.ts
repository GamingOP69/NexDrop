import { z } from 'zod';

// Auth schemas
export const emailSchema = z.string().email('Invalid email address').toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)');

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z.string().min(2, 'Full name too short').max(100, 'Full name too long')
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password required')
});

export const forgotPasswordSchema = z.object({
  email: emailSchema
});

export const resetPasswordSchema = z.object({
  token: z.string().uuid('Invalid token format'),
  password: passwordSchema
});

// File schemas
export const fileIdSchema = z.string().uuid('Invalid file ID');

export const uploadChunkSchema = z.object({
  fileId: fileIdSchema,
  chunkIndex: z.number().int().min(0, 'Chunk index must be non-negative'),
  totalChunks: z.number().int().min(1, 'Total chunks must be at least 1'),
  chunkSize: z.number().int().min(1).max(10 * 1024 * 1024, 'Chunk too large (max 10MB)'),
  totalSize: z.number().int().min(1).max(10 * 1024 * 1024 * 1024, 'File too large (max 10GB)')
});

// Allowed MIME types for security
const ALLOWED_MIMES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'text/plain',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-rar-compressed',
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'audio/wav',
  'application/json'
];

export const mimeTypeSchema = z
  .string()
  .refine(
    (mime) => ALLOWED_MIMES.includes(mime),
    `Unsupported file type: ${ALLOWED_MIMES.join(', ')}`
  );

export const fileMetadataSchema = z.object({
  originalName: z.string().min(1).max(255).refine(
    (name) => !name.includes('../') && !name.includes('..\\'),
    'Invalid filename'
  ),
  mimeType: mimeTypeSchema,
  totalSize: z.number().int().min(1).max(10 * 1024 * 1024 * 1024, 'File too large')
});

// Share link schemas
export const createShareSchema = z.object({
  fileId: fileIdSchema,
  expiresInDays: z.number().int().min(1).max(365, 'Expiry must be 1-365 days').optional().default(7),
  password: z.string().min(6, 'Password too short').max(128).optional().nullable(),
  maxDownloads: z.number().int().min(1).max(1000000).optional().nullable()
});

export const downloadShareSchema = z.object({
  password: z.string().optional()
});

// Admin schemas
export const updateStorageQuotaSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  quotaGB: z.number().int().min(1).max(1000, 'Quota too large')
});

export type Register = z.infer<typeof registerSchema>;
export type Login = z.infer<typeof loginSchema>;
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
export type UploadChunk = z.infer<typeof uploadChunkSchema>;
export type FileMetadata = z.infer<typeof fileMetadataSchema>;
export type CreateShare = z.infer<typeof createShareSchema>;
export type DownloadShare = z.infer<typeof downloadShareSchema>;
export type UpdateStorageQuota = z.infer<typeof updateStorageQuotaSchema>;

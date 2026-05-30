"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PreviewModal } from './preview-modal';
import { Download, Eye, Link2, File as FileIcon, FileText, Film, Image as ImageIcon, Archive } from 'lucide-react';

type FileItem = {
  id: string;
  originalName: string;
  mimeType: string;
  size: string;
  createdAt: string;
  shareToken?: string | null;
};

export function FileGrid({ files, onShare }: { files: FileItem[]; onShare?: (id: string) => void }) {
  const [preview, setPreview] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  if (!files.length) return <div className="section-card empty-state">No files yet. Upload your first item to start sharing.</div>;

  function getIcon(mimeType: string) {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-5 w-5" aria-hidden />;
    if (mimeType.startsWith('video/')) return <Film className="h-5 w-5" aria-hidden />;
    if (mimeType.includes('pdf') || mimeType.includes('text/')) return <FileText className="h-5 w-5" aria-hidden />;
    if (mimeType.includes('zip') || mimeType.includes('compressed') || mimeType.includes('archive')) return <Archive className="h-5 w-5" aria-hidden />;
    return <FileIcon className="h-5 w-5" aria-hidden />;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {files.map((file) => (
        <motion.div
          key={file.id}
          className="file-card overflow-hidden p-0"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <div className="flex flex-col gap-4 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--accent)_10%,var(--panel-strong))] text-[color:var(--accent-strong)] shadow-[4px_4px_0_rgba(30,36,48,0.08)]">
                  {getIcon(file.mimeType)}
                </div>
                <div className="min-w-0 space-y-1">
                  <h3 className="truncate title-sm font-semibold">{file.originalName}</h3>
                  <p className="truncate detail text-sm">{file.mimeType}</p>
                  <p className="meta text-xs">Uploaded {new Date(file.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <span className="pill shrink-0">{file.size}</span>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-[color:var(--border)] pt-4">
              <a aria-label={`Download ${file.originalName}`} className="btn btn-secondary btn-sm" href={`/api/files/${file.id}/download`}>
                <Download className="h-4 w-4" />
                Download
              </a>
              <button aria-label={`Preview ${file.originalName}`} className="btn btn-secondary btn-sm" onClick={() => { setPreview(file); setOpen(true); }} type="button">
                <Eye className="h-4 w-4" />
                Preview
              </button>
              {file.shareToken ? (
                <a aria-label={`Open share for ${file.originalName}`} className="btn btn-secondary btn-sm" href={`/share/${file.shareToken}`}>
                  <Link2 className="h-4 w-4" />
                  Share
                </a>
              ) : null}
              {onShare ? (
                <button aria-label={`Create share for ${file.originalName}`} className="btn btn-primary btn-sm" onClick={() => onShare(file.id)} type="button">
                  <Link2 className="h-4 w-4" />
                  Create share
                </button>
              ) : null}
            </div>
          </div>
        </motion.div>
      ))}
      <PreviewModal file={preview} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

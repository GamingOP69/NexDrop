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
    <div className="section-card overflow-hidden p-0">
      <div className="hidden border-b border-[color:var(--border)] px-4 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)] md:grid md:grid-cols-[minmax(0,1fr)_132px_108px_116px] md:items-center md:gap-3">
        <div>File</div>
        <div>Size</div>
        <div>Date</div>
        <div className="text-right">Actions</div>
      </div>
      <div>
        {files.map((file) => (
          <motion.div
            key={file.id}
            className="file-row"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24 }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[color:var(--border)] bg-[color:var(--panel-strong)] text-[color:var(--accent-strong)]">
                {getIcon(file.mimeType)}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-[0.82rem] font-semibold text-white">{file.originalName}</h3>
                <p className="file-row__meta truncate">{file.mimeType} · Uploaded {new Date(file.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="hidden text-[0.8rem] text-white md:block">{file.size}</div>
            <div className="hidden text-[0.8rem] text-[color:var(--muted)] md:block">{new Date(file.createdAt).toLocaleDateString()}</div>
            <div className="file-row__actions justify-self-end">
              <a aria-label={`Download ${file.originalName}`} className="btn btn-secondary btn-sm px-3" href={`/api/files/${file.id}/download`}>
                <Download className="h-3.5 w-3.5" />
              </a>
              <button aria-label={`Preview ${file.originalName}`} className="btn btn-secondary btn-sm px-3" onClick={() => { setPreview(file); setOpen(true); }} type="button">
                <Eye className="h-3.5 w-3.5" />
              </button>
              {file.shareToken ? (
                <a aria-label={`Open share for ${file.originalName}`} className="btn btn-secondary btn-sm px-3" href={`/share/${file.shareToken}`}>
                  <Link2 className="h-3.5 w-3.5" />
                </a>
              ) : null}
              {onShare ? (
                <button aria-label={`Create share for ${file.originalName}`} className="btn btn-primary btn-sm px-3" onClick={() => onShare(file.id)} type="button">
                  <Link2 className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>
      <PreviewModal file={preview} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PreviewModal } from './preview-modal';

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

  if (!files.length) return <div className="card p-5 text-slate-300">No files yet.</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {files.map((file) => (
        <motion.div
          key={file.id}
          className="card space-y-3 p-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <div>
            <h3 className="font-medium">{file.originalName}</h3>
            <p className="text-sm text-slate-300">{file.mimeType}</p>
            <p className="text-xs text-slate-400">{file.size} • {new Date(file.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a aria-label={`Download ${file.originalName}`} className="btn btn-ghost py-2" href={`/api/files/${file.id}/download`}>Download</a>
            <button aria-label={`Preview ${file.originalName}`} className="btn btn-ghost py-2" onClick={() => { setPreview(file); setOpen(true); }}>Preview</button>
            {file.shareToken ? <a aria-label={`Open share for ${file.originalName}`} className="btn btn-ghost py-2" href={`/share/${file.shareToken}`}>Open share</a> : null}
            {onShare ? <button aria-label={`Create share for ${file.originalName}`} className="btn btn-primary py-2" onClick={() => onShare(file.id)}>Create share</button> : null}
          </div>
        </motion.div>
      ))}
      <PreviewModal file={preview} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

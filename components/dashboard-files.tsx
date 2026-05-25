'use client';

import { useState } from 'react';
import { FileGrid } from './file-grid';

type FileItem = {
  id: string;
  originalName: string;
  mimeType: string;
  size: string;
  createdAt: string;
  shareToken?: string | null;
};

export function DashboardFiles({ files }: { files: FileItem[] }) {
  const [shareMessage, setShareMessage] = useState('');

  async function createShare(fileId: string) {
    setShareMessage('');
    const res = await fetch('/api/shares', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId, expiresInDays: 3 })
    });
    const data = await res.json();

    if (!res.ok) {
      setShareMessage(data.error || 'Could not create share link.');
      return;
    }

    const shareUrl = `${window.location.origin}${data.url}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage('Share link created and copied to clipboard.');
    } catch {
      setShareMessage(`Share link created: ${shareUrl}`);
    }
  }

  return (
    <div className="stack-4">
      <FileGrid files={files} onShare={createShare} />
      {shareMessage ? <p className="detail text-sm">{shareMessage}</p> : null}
    </div>
  );
}
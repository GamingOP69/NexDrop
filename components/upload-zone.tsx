'use client';

import { useState } from 'react';

export function UploadZone({ onUploaded }: { onUploaded?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  async function uploadSelected() {
    if (!file) return;
    setBusy(true);
    setStatus('');
    const chunkSize = 5 * 1024 * 1024;
    const totalChunks = Math.ceil(file.size / chunkSize);
    const fileId = crypto.randomUUID();

    for (let index = 0; index < totalChunks; index++) {
      const start = index * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      const form = new FormData();
      form.append('chunk', chunk);
      form.append('fileId', fileId);
      form.append('fileName', file.name);
      form.append('mimeType', file.type || 'application/octet-stream');
      form.append('fileSize', String(file.size));
      form.append('chunkIndex', String(index));
      form.append('totalChunks', String(totalChunks));

      const res = await fetch('/api/files/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) {
        setBusy(false);
        setStatus(data.error || 'Upload failed');
        return;
      }
      setProgress(Math.round(((index + 1) / totalChunks) * 100));
    }

    setBusy(false);
    setStatus('Upload complete');
    setFile(null);
    setProgress(0);
    onUploaded?.();
  }

  return (
    <div className="card space-y-4 p-5">
      <div>
        <h2 className="text-lg font-semibold">Upload files</h2>
        <p className="text-sm text-slate-300">Chunked upload in one app, no separate backend required.</p>
      </div>
      <input className="field" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <div className="flex flex-wrap items-center gap-3">
        <button disabled={!file || busy} className="btn btn-primary" onClick={uploadSelected} type="button">
          {busy ? 'Uploading...' : 'Upload'}
        </button>
        <span className="text-sm text-slate-300">{progress ? `${progress}%` : status}</span>
      </div>
    </div>
  );
}

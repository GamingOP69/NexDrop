'use client';

import { useState } from 'react';

export function UploadZone({ onUploaded }: { onUploaded?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [phase, setPhase] = useState('Ready to upload');

  function uploadChunk(form: FormData, onProgress: (percent: number) => void) {
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/files/upload');

      const csrf = document.cookie.split('; ').find((c) => c.startsWith('nd_csrf='))?.split('=')[1] || '';
      if (csrf) xhr.setRequestHeader('x-csrf-token', csrf);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress((event.loaded / event.total) * 100);
        }
      };

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText || '{}');
          if (xhr.status >= 200 && xhr.status < 300) resolve(data);
          else reject(data?.error || 'Upload failed');
        } catch {
          reject('Upload failed');
        }
      };

      xhr.onerror = () => reject('Network error while uploading');
      xhr.send(form);
    });
  }

  async function uploadSelected() {
    if (!file) return;
    setBusy(true);
    setStatus('');
    setPhase('Preparing upload');
    const chunkSize = 5 * 1024 * 1024;
    const totalChunks = Math.ceil(file.size / chunkSize);
    const fileId = crypto.randomUUID();

    for (let index = 0; index < totalChunks; index++) {
      setPhase(`Uploading chunk ${index + 1} of ${totalChunks}`);
      const start = index * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      const form = new FormData();
      form.append('chunk', chunk);
      form.append('fileId', fileId);
      form.append('fileName', file.name);
      form.append('mimeType', file.type || 'application/octet-stream');
      form.append('totalSize', String(file.size));
      form.append('chunkIndex', String(index));
      form.append('totalChunks', String(totalChunks));

      try {
        await uploadChunk(form, (chunkProgress) => {
          const completedBefore = index / totalChunks;
          const currentChunkShare = chunkProgress / 100 / totalChunks;
          setProgress(Math.min(99, Math.round((completedBefore + currentChunkShare) * 100)));
        });
      } catch (error: any) {
        setBusy(false);
        setPhase('Upload failed');
        setStatus(error?.error || error?.message || String(error) || 'Upload failed');
        return;
      }
      setProgress(Math.round(((index + 1) / totalChunks) * 100));
    }

    setBusy(false);
    setPhase('Upload complete');
    setStatus('Upload complete');
    setFile(null);
    setProgress(0);
    onUploaded?.();
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  return (
    <div className="section-card overflow-hidden p-0">
      <div className="border-b border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--panel)_92%,white)] px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="pill inline-flex w-fit">Media library upload</p>
            <h2 className="title-md font-semibold">Upload files fast and track every chunk.</h2>
            <p className="detail max-w-2xl text-sm leading-6">Drag a file in, or click to browse. Files are uploaded in chunks with live progress, quota checks, and CSRF protection.</p>
          </div>
          <div className="rounded-full border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--accent)_12%,var(--panel))] px-3 py-2 text-sm font-medium text-[color:var(--text)] shadow-[var(--shadow)]">{busy ? phase : 'Ready'}</div>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          role="button"
          tabIndex={0}
          onClick={() => document.getElementById('file-input')?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              document.getElementById('file-input')?.click();
            }
          }}
          aria-label="File upload dropzone"
          className="upload-dropzone border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--surface)_80%,white)] p-5 shadow-[var(--shadow)] transition-transform duration-200 hover:-translate-y-0.5 sm:p-6"
          aria-busy={busy}
        >
          <input id="file-input" aria-label="Choose a file to upload" className="sr-only" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="title-sm font-semibold">Drop your file here</p>
                <p className="detail mt-1 text-sm leading-6">Large uploads are chunked automatically and continue until the final file is assembled.</p>
              </div>
              <span className="pill hidden sm:inline-flex">Max {Math.round(file ? file.size / 1024 / 1024 : 10)}MB chunked</span>
            </div>

            <div className="rounded-[var(--radius-md)] border border-dashed border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--accent)_6%,transparent)] px-4 py-5 text-center">
              {file ? (
                <div className="space-y-1">
                  <p className="text-base font-semibold text-[color:var(--text)]">{file.name}</p>
                  <p className="text-sm text-[color:var(--muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || 'application/octet-stream'}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-base font-semibold text-[color:var(--text)]">Browse or drag-and-drop</p>
                  <p className="text-sm text-[color:var(--muted)]">A clean upload flow with live progress, chunking, and quota checks.</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[color:var(--muted)]">Upload progress</span>
                <span className="font-medium text-[color:var(--text)]">{busy ? `${progress}%` : progress ? `${progress}%` : '0%'}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--surface)_90%,white)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),color-mix(in_oklab,var(--accent)_70%,black))] transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button disabled={!file || busy} className="btn btn-primary" onClick={uploadSelected} type="button">
            {busy ? 'Uploading...' : 'Upload'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={!file || busy}
            onClick={() => {
              setFile(null);
              setProgress(0);
              setStatus('');
              setPhase('Ready to upload');
            }}
          >
            Clear
          </button>
          <span className="text-sm text-[color:var(--muted)]">{status || phase}</span>
        </div>
      </div>
    </div>
  );
}

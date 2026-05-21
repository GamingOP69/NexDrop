'use client';

import Link from 'next/link';

type FileItem = {
  id: string;
  originalName: string;
  mimeType: string;
  size: string;
  createdAt: string;
  shareToken?: string | null;
};

export function FileGrid({ files, onShare }: { files: FileItem[]; onShare?: (id: string) => void }) {
  if (!files.length) return <div className="card p-5 text-slate-300">No files yet.</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {files.map((file) => (
        <div key={file.id} className="card space-y-3 p-5">
          <div>
            <h3 className="font-medium">{file.originalName}</h3>
            <p className="text-sm text-slate-300">{file.mimeType}</p>
            <p className="text-xs text-slate-400">{file.size} • {new Date(file.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="btn btn-ghost py-2" href={`/api/files/${file.id}/download`}>Download</Link>
            {file.shareToken ? <Link className="btn btn-ghost py-2" href={`/share/${file.shareToken}`}>Open share</Link> : null}
            {onShare ? <button className="btn btn-primary py-2" onClick={() => onShare(file.id)}>Create share</button> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

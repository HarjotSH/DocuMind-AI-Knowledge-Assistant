import React, { useState } from 'react';

const DocumentUploader = ({ onUpload, error: parentError, loading }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setError(null);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploading && !loading) setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (uploading || loading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
      setError(null);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    setProgress(0);
    setError(null);
    // Simulate upload progress
    for (let i = 1; i <= 100; i += 10) {
      setTimeout(() => setProgress(i), i * 10);
    }
    if (onUpload) {
      try {
        await onUpload(files);
      } catch (err) {
        setError(err?.error || 'Upload failed');
      }
    }
    setTimeout(() => {
      setUploading(false);
      setProgress(100);
    }, 1200);
  };

  return (
    <div
      className={`bg-white p-6 rounded-3xl shadow-sm border ${dragActive ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200'} w-full transition-all`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3 className="text-lg font-bold mb-4 text-slate-900 tracking-tight flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
        Upload Documents
      </h3>
      <div
        className={`mb-4 w-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-8 cursor-pointer transition-all duration-200 ${dragActive ? 'border-slate-800 bg-slate-50 shadow-inner' : 'border-slate-200 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'}`}
        onClick={() => !uploading && !loading && document.getElementById('fileInput').click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={0}
        role="button"
        aria-label="Drag and drop files here or click to select"
      >
        <input
          id="fileInput"
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading || loading}
        />
        <div className="bg-white p-3 rounded-full shadow-sm mb-3 border border-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <span className="text-sm font-medium text-slate-700 text-center leading-relaxed">
          <span className="block">Drag &amp; drop files here</span>
          <span className="block mt-1 text-xs font-normal text-slate-500">or <span className="text-slate-900 underline underline-offset-2 font-semibold">browse files</span></span>
        </span>
        {files.length > 0 && (
          <div className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium max-w-xs truncate shadow-sm">
            {files.map(f => f.name).join(', ')}
          </div>
        )}
      </div>
      {(error || parentError) && <div className="text-red-500 mb-3 text-center text-sm font-medium w-full bg-red-50 p-2 rounded-lg">{error || parentError}</div>}
      <button
        className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:bg-slate-800 transition-all disabled:opacity-50 w-full flex items-center justify-center gap-2"
        onClick={handleUpload}
        disabled={uploading || loading || files.length === 0}
      >
        {uploading ? (
           <>
             <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
             Uploading...
           </>
        ) : 'Upload'}
      </button>
      {(uploading) && (
        <div className="mt-4 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-slate-900 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;

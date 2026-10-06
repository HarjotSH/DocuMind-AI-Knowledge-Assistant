import React from 'react';

const DocumentLibrary = ({ documents, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 w-full overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
          Uploaded Documents
        </h2>
        <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">{documents.length} files</span>
      </div>
      
      {documents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 mb-3"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          <p className="text-slate-500 font-medium">No documents uploaded yet</p>
          <p className="text-slate-400 text-sm mt-1">Upload a document to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 flex-1">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold tracking-wide">Filename</th>
                <th className="py-3 px-4 font-semibold tracking-wide w-24">Size</th>
                <th className="py-3 px-4 font-semibold tracking-wide w-32">Upload Date</th>
                <th className="py-3 px-4 font-semibold tracking-wide w-20 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span className="font-medium text-slate-700 max-w-[200px] lg:max-w-[300px] truncate">{doc.filename}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{doc.size} MB</td>
                  <td className="py-3 px-4 text-slate-500">{doc.uploadDate}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors focus:outline-none"
                      onClick={() => onDelete(doc.id)}
                      title="Delete Document"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DocumentLibrary;

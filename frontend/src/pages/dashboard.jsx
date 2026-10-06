import React, { useState, useEffect, useRef } from 'react';
import DocumentUploader from '../components/DocumentUploader';
import DocumentLibrary from '../components/DocumentLibrary';
import ChatInterface from '../components/ChatInterface';
import { endpoints, apiFetch, uploadFile, BASE_URL } from '../config/api';

const endpointsChat = {
  createSession: endpoints.createChatSession || `${BASE_URL}/chat/sessions`,
  sendMessage: (sessionId) => `${BASE_URL}/chat/sessions/${sessionId}/messages`,
};

/* ── Small reusable inline-modal component ───────────────────────── */
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-sm mx-4 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <p className="text-slate-700 text-sm font-medium leading-snug">{message}</p>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
        >Cancel</button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all"
        >Delete</button>
      </div>
    </div>
  </div>
);

const RenameModal = ({ defaultValue, onConfirm, onCancel }) => {
  const [value, setValue] = useState(defaultValue || '');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-sm mx-4 p-6 flex flex-col gap-4">
        <h3 className="text-slate-900 font-semibold text-base">Rename Chat</h3>
        <input
          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition-all"
          value={value}
          onChange={e => setValue(e.target.value)}
          autoFocus
          onKeyDown={e => e.key === 'Enter' && value.trim() && onConfirm(value.trim())}
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >Cancel</button>
          <button
            onClick={() => value.trim() && onConfirm(value.trim())}
            disabled={!value.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all disabled:opacity-50"
          >Save</button>
        </div>
      </div>
    </div>
  );
};
/* ─────────────────────────────────────────────────────────────────── */

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('documents');
  const [chatSessionId, setChatSessionId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);

  // Modal state
  const [confirmModal, setConfirmModal] = useState(null); // { message, onConfirm }
  const [renameModal, setRenameModal] = useState(null);   // { sessionId, title }

  const menuRef = useRef();
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(endpoints.getDocuments, {}, token);
      setDocuments(
        (res.documents || []).map(doc => ({
          id: doc._id,
          filename: doc.filename,
          size: (doc.metadata?.fileSize / 1024 / 1024).toFixed(2),
          uploadDate: doc.createdAt?.slice(0, 10),
          previewUrl: '#',
        }))
      );
    } catch (err) {
      setError(err.error || 'Failed to fetch documents');
    }
    setLoading(false);
  };

  const fetchChatSessions = async () => {
    try {
      const res = await apiFetch(endpoints.getChatSessions, {}, token);
      setChatSessions(res.sessions || []);
    } catch (err) {
      setError(err.error || 'Failed to fetch chat sessions');
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchChatSessions();
  }, []);

  const handleDeleteSession = async (sessionId) => {
    setConfirmModal({
      message: 'Are you sure you want to delete this chat session? This cannot be undone.',
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await apiFetch(endpoints.deleteChatSession(sessionId), { method: 'DELETE' }, token);
          if (chatSessionId === sessionId) {
            setChatSessionId(null);
            setChatMessages([]);
          }
          await fetchChatSessions();
        } catch (err) {
          setError(err.error || 'Failed to delete chat session');
        }
      },
    });
  };

  const handleEditSessionTitle = (sessionId, oldTitle) => {
    setRenameModal({ sessionId, title: oldTitle });
  };

  const handleRenameConfirm = async (newTitle) => {
    const { sessionId, title } = renameModal;
    setRenameModal(null);
    if (!newTitle || newTitle === title) return;
    try {
      await apiFetch(`${endpoints.getChatSessions}/${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: newTitle }),
        headers: { 'Content-Type': 'application/json' }
      }, token);
      await fetchChatSessions();
    } catch (err) {
      setError(err.error || 'Failed to rename chat');
    }
  };

  const loadChatHistory = async (sessionId) => {
    setChatLoading(true);
    try {
      const res = await apiFetch(endpoints.getChatHistory(sessionId), {}, token);
      setChatSessionId(res._id || res.id);
      setChatMessages(res.messages || []);
    } catch (err) {
      setError(err.error || 'Failed to load chat history');
    }
    setChatLoading(false);
  };

  const handleUpload = async (files) => {
    setLoading(true);
    setError(null);
    try {
      for (const file of files) {
        await uploadFile(endpoints.uploadDocument, file, token);
      }
      await fetchDocuments();
    } catch (err) {
      setError(err.error || 'Upload failed');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setConfirmModal({
      message: 'Delete this document? This action cannot be undone.',
      onConfirm: async () => {
        setConfirmModal(null);
        setLoading(true);
        setError(null);
        try {
          await apiFetch(endpoints.deleteDocument(id), { method: 'DELETE' }, token);
          await fetchDocuments();
        } catch (err) {
          setError(err.error || 'Delete failed');
        }
        setLoading(false);
      },
    });
  };

  const createChatSession = async () => {
    setChatLoading(true);
    try {
      const res = await apiFetch(endpointsChat.createSession, { method: 'POST' }, token);
      setChatSessionId(res._id || res.id);
      setChatMessages([]);
      await fetchChatSessions();
    } catch (err) {
      setError(err.error || 'Failed to start chat session');
    }
    setChatLoading(false);
  };

  const handleSendMessage = async (message) => {
    if (!chatSessionId) return;
    setChatLoading(true);
    try {
      const res = await apiFetch(
        endpointsChat.sendMessage(chatSessionId),
        { method: 'POST', body: JSON.stringify({ message }) },
        token
      );
      setChatMessages((prev) => [
        ...prev,
        { role: 'user', content: message },
        { role: 'assistant', content: res.message, citation: res.sources?.map(s => s.filename).join(', ') }
      ]);
    } catch (err) {
      setError(err.error || 'Failed to send message');
    }
    setChatLoading(false);
  };

  const sidebarItems = [
    { key: 'documents', label: 'Documents' },
    { key: 'chat', label: 'Chat' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Modals */}
      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
      {renameModal && (
        <RenameModal
          defaultValue={renameModal.title}
          onConfirm={handleRenameConfirm}
          onCancel={() => setRenameModal(null)}
        />
      )}

      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col py-6 px-4 h-full min-h-screen sticky top-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="bg-slate-900 p-2 rounded-lg shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">DocuMind</h1>
        </div>

        <nav className="flex flex-col gap-1 mb-8">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Menu</div>
          {sidebarItems.map(item => (
            <button
              key={item.key}
              className={`flex items-center gap-3 text-left px-3 py-2.5 rounded-xl font-medium transition-all ${activeTab === item.key ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              onClick={() => setActiveTab(item.key)}
            >
              {item.key === 'documents' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              )}
              {item.key === 'chat' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
              )}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Chat session list */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Past Chats</div>
              <button
                className="text-slate-500 hover:text-slate-900 transition-colors p-1 rounded-md hover:bg-slate-100"
                onClick={createChatSession}
                disabled={chatLoading}
                title="New Chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1">
              {chatSessions.length === 0 && <div className="text-sm text-slate-400 px-2 italic">No past chats</div>}
              {chatSessions.map(session => (
                <div key={session._id} className="relative flex items-center group">
                  <button
                    className={`flex-1 text-left px-3 py-2 rounded-lg text-sm font-medium transition-all w-full truncate ${chatSessionId === session._id ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                    onClick={() => loadChatHistory(session._id)}
                  >
                    {session.title}
                  </button>
                  <button
                    className={`ml-1 text-slate-400 hover:text-slate-700 p-1.5 rounded-md focus:outline-none transition-opacity ${chatSessionId === session._id || menuOpenId === session._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    onClick={() => setMenuOpenId(menuOpenId === session._id ? null : session._id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </button>
                  {menuOpenId === session._id && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-slate-100 flex flex-col py-1.5 w-36"
                    >
                      <button
                        className="flex items-center gap-2 px-3 py-1.5 text-slate-700 text-sm hover:bg-slate-50 transition-colors"
                        onClick={() => { setMenuOpenId(null); handleEditSessionTitle(session._id, session.title); }}
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.862 5.487l1.65 1.65a2.25 2.25 0 010 3.182l-8.25 8.25a2.25 2.25 0 01-1.591.659H5.25v-3.421a2.25 2.25 0 01.659-1.591l8.25-8.25a2.25 2.25 0 013.182 0z"></path></svg>
                        Rename
                      </button>
                      <div className="border-t border-slate-100 my-1 mx-2" />
                      <button
                        className="flex items-center gap-2 px-3 py-1.5 text-red-600 text-sm hover:bg-red-50 transition-colors"
                        onClick={() => { setMenuOpenId(null); handleDeleteSession(session._id); }}
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 7h12M9 7V5a3 3 0 016 0v2m-7 0h8m-9 4v7a2 2 0 002 2h6a2 2 0 002-2v-7"></path></svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={activeTab !== 'chat' ? 'flex-1' : 'mt-4'} />
        <div className="pt-4 mt-auto border-t border-slate-100">
          <button
            className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all font-medium text-sm"
            onClick={handleLogout}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">

        {/* Global error banner */}
        {error && (
          <div className="mx-6 mt-4 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-red-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="flex-1 overflow-y-auto p-8 lg:px-12">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Document Library</h2>
              <p className="text-slate-500 mt-1">Upload and manage your business documents.</p>
            </header>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3 w-full">
                <DocumentUploader onUpload={handleUpload} error={null} loading={loading} />
              </div>
              <div className="lg:w-2/3 w-full">
                {loading && (
                  <div className="text-slate-500 text-sm mb-4 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
                    Loading...
                  </div>
                )}
                <DocumentLibrary documents={documents} onDelete={handleDelete} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {!chatSessionId ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full">
                  <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">DocuMind Chat</h2>
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed">Ask questions about your uploaded documents. Start a new session or select a past chat from the sidebar.</p>
                  <button
                    onClick={createChatSession}
                    disabled={chatLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    {chatLoading ? 'Starting...' : 'Start New Chat'}
                  </button>
                </div>
              </div>
            ) : (
              /* Full width — no max-w constraint */
              <div className="flex-1 overflow-hidden flex flex-col w-full">
                <ChatInterface
                  onSend={handleSendMessage}
                  messages={chatMessages}
                  loading={chatLoading}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

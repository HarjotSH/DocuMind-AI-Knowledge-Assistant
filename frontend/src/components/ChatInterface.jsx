import React, { useState, useRef, useEffect } from 'react';

const ChatInterface = ({ onSend, messages, loading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() && onSend && !loading) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    // Auto-resize textarea
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    }
  };

  const isEmpty = messages.length === 0 && !loading;

  return (
    <div className="flex flex-col h-full w-full bg-slate-50">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full text-center select-none">
            <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Ask DocuMind anything</h3>
            <p className="text-sm text-slate-400 max-w-xs">Ask questions about your uploaded documents and get intelligent answers instantly.</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* AI avatar */}
            {msg.role !== 'user' && (
              <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm mb-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                </svg>
              </div>
            )}

            <div className={`flex flex-col gap-1 max-w-[72%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-br-sm'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
              {msg.citation && (
                <div className="flex items-center gap-1 text-xs text-slate-400 px-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  Source: {msg.citation}
                </div>
              )}
            </div>

            {/* User avatar */}
            {msg.role === 'user' && (
              <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center shadow-sm mb-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-end gap-3 justify-start">
            <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
              </svg>
            </div>
            <div className="bg-white border border-slate-200 text-slate-500 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 sm:px-8 py-4 bg-white border-t border-slate-200">
        <form
          onSubmit={handleSend}
          className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-400 transition-all"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none leading-relaxed py-0.5"
            placeholder="Ask a question about your documents…"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={loading}
            style={{ maxHeight: '160px', overflowY: 'auto' }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            title="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
        <p className="text-xs text-slate-400 text-center mt-2">Press <kbd className="bg-slate-100 px-1 py-0.5 rounded text-slate-500 font-mono text-xs">Enter</kbd> to send · <kbd className="bg-slate-100 px-1 py-0.5 rounded text-slate-500 font-mono text-xs">Shift+Enter</kbd> for new line</p>
      </div>
    </div>
  );
};

export default ChatInterface;

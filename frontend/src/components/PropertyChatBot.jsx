import React, { useEffect, useRef, useState } from 'react';
import api, { authAPI } from '../services/api';

/* ── Scoped CSS ─────────────────────────────────────────────── */
const CSS = `
  @keyframes chatBtnPop {
    0%   { transform: scale(0); opacity: 0; }
    80%  { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1);  opacity: 1; }
  }
  @keyframes chatPanelIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes dot {
    0%, 80%, 100% { transform: translateY(0); opacity: .4; }
    40%           { transform: translateY(-5px); opacity: 1; }
  }

  .hq-cb-trigger {
    position: fixed; bottom: 28px; right: 28px; z-index: 100;
    width: 56px; height: 56px; border-radius: 50%; border: none;
    background: var(--hq-red, #FF5A5F);
    box-shadow: 0 8px 24px rgba(255,90,95,.4);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    animation: chatBtnPop .4s cubic-bezier(.34,1.56,.64,1) 1s both;
    transition: transform .2s ease, box-shadow .2s ease;
  }
  .hq-cb-trigger:hover {
    transform: scale(1.08);
    box-shadow: 0 12px 32px rgba(255,90,95,.5);
  }

  .hq-cb-panel {
    position: fixed; bottom: 96px; right: 28px; z-index: 100;
    width: 360px; max-height: 520px;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 24px 64px rgba(0,0,0,.18);
    overflow: hidden;
    display: flex; flex-direction: column;
    animation: chatPanelIn .3s ease forwards;
  }
  .dark .hq-cb-panel { background: #1e1e1e; }

  .hq-cb-header {
    background: #222; padding: 16px 20px;
    display: flex; align-items: center; gap: 12px; flex-shrink: 0;
  }

  .hq-cb-msgs {
    flex: 1; overflow-y: auto; padding: 16px;
    display: flex; flex-direction: column; gap: 12px;
    scroll-behavior: smooth;
  }
  .hq-cb-msgs::-webkit-scrollbar { width: 4px; }
  .hq-cb-msgs::-webkit-scrollbar-thumb { background: #ddd; border-radius: 99px; }

  .hq-cb-msg {
    max-width: 85%;
    font-family: 'Inter', system-ui, sans-serif; font-size: 14px; line-height: 1.5;
    padding: 10px 14px;
    animation: msgIn .2s ease forwards;
  }
  .hq-cb-msg--user {
    align-self: flex-end;
    background: var(--hq-red, #FF5A5F); color: #fff;
    border-radius: 18px 18px 4px 18px;
  }
  .hq-cb-msg--bot {
    align-self: flex-start;
    background: #f5f5f5; color: var(--hq-dark, #222);
    border-radius: 18px 18px 18px 4px;
  }
  .dark .hq-cb-msg--bot { background: #2a2a2a; color: #f5f5f5; }

  .hq-cb-typing { display: flex; gap: 5px; align-items: center; padding: 12px 16px; }
  .hq-cb-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--hq-muted, #aaa);
    animation: dot 1.2s ease infinite;
  }
  .hq-cb-dot:nth-child(2) { animation-delay: .15s; }
  .hq-cb-dot:nth-child(3) { animation-delay: .30s; }

  .hq-cb-input-row {
    border-top: 1px solid #ebebeb; padding: 12px 16px;
    display: flex; gap: 8px; align-items: center; flex-shrink: 0;
  }
  .dark .hq-cb-input-row { border-color: #2a2a2a; }

  .hq-cb-input {
    flex: 1; border: 1px solid #ddd; border-radius: 99px;
    padding: 8px 16px; font-size: 14px; font-family: 'Inter', system-ui, sans-serif;
    outline: none; background: #fff; color: #222;
    transition: border-color .2s ease, box-shadow .2s ease;
  }
  .hq-cb-input:focus { border-color: var(--hq-red, #FF5A5F); box-shadow: 0 0 0 3px rgba(255,90,95,.12); }
  .dark .hq-cb-input { background: #2a2a2a; color: #f5f5f5; border-color: #444; }

  .hq-cb-send {
    width: 36px; height: 36px; border-radius: 50%; border: none; flex-shrink: 0;
    background: var(--hq-red, #FF5A5F); color: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: transform .2s ease;
  }
  .hq-cb-send:hover:not(:disabled) { transform: scale(1.05); }
  .hq-cb-send:disabled { opacity: .6; cursor: not-allowed; }

  .hq-cb-deal-btn {
    flex-shrink: 0; padding: 6px 12px; border-radius: 99px; border: 1px solid #00A699;
    background: transparent; color: var(--hq-teal, #00A699);
    font-family: 'Inter', system-ui, sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: background .2s ease;
  }
  .hq-cb-deal-btn:hover { background: rgba(0,166,153,.08); }

  @media (max-width: 480px) {
    .hq-cb-panel { width: calc(100vw - 32px); right: 16px; }
    .hq-cb-trigger { right: 16px; }
  }
`;

/* ── Icons (inline SVG, no extra dep) ─────────────────────── */
const ChatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const HouseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);

/* ── Component ──────────────────────────────────────────────── */
export default function PropertyChatBot({ property, isOpen: controlledOpen, onClose, onDealClosed }) {
  /* ── All original state (unchanged) ── */
  const [internalOpen, setInternalOpen] = useState(false);
  const open = typeof controlledOpen === 'boolean' ? controlledOpen : internalOpen;
  const [messages, setMessages] = useState([]);
  const [text,     setText]     = useState('');
  const [loading,  setLoading]  = useState(false);
  const listRef = useRef(null);

  /* ── Original effects (unchanged) ── */
  useEffect(() => { setMessages([]); setText(''); }, [property?.id]);
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages.length]);

  /* ── sendMessage (unchanged) ── */
  const sendMessage = async () => {
    if (!text.trim() || !property) return;
    const userMsg = { id: `u_${Date.now()}`, sender: 'user', text: text.trim(), createdAt: new Date() };
    setMessages((m) => [...m, userMsg]);
    setText('');
    setLoading(true);
    try {
      const res = await api.post('/api/llm/property-chat', { property, message: userMsg.text });
      const botText = res?.data?.data?.text || 'I can only answer questions about this property.';
      setMessages((m) => [...m, { id: `b_${Date.now()}`, sender: 'bot', text: botText, createdAt: new Date() }]);
    } catch (err) {
      console.error('LLM error', err);
      setMessages((m) => [...m, { id: `b_${Date.now()}`, sender: 'bot', text: 'Sorry, I could not process your request right now.', createdAt: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  /* ── closeDeal (unchanged logic) ── */
  const closeDeal = async () => {
    if (!property) return;
    const buyerName = authAPI.getCurrentUser()?.name || authAPI.getCurrentUser()?.email || 'Guest';
    try {
      const res = await api.post('/api/deals/guest', { propertyId: property.id, buyerName, price: property.price || property.pricePerUnit || 'Negotiated' });
      const deal = res?.data?.data || res?.data;
      setMessages((m) => [...m, { id: `b_${Date.now()}`, sender: 'bot', text: 'Deal created successfully. I will follow up with the agent.' }]);
      if (typeof onDealClosed === 'function') onDealClosed(deal);
      if (typeof onClose === 'function') onClose();
      if (typeof controlledOpen === 'undefined') setInternalOpen(false);
    } catch (err) {
      console.error('LLM deal error', err);
      setMessages((m) => [...m, { id: `b_${Date.now()}`, sender: 'bot', text: 'Failed to create deal. Please try again later.' }]);
    }
  };

  const handleClose = () => {
    if (typeof onClose === 'function') onClose();
    if (typeof controlledOpen === 'undefined') setInternalOpen(false);
  };

  return (
    <>
      <style>{CSS}</style>

      {/* ── Floating trigger button ── */}
      {typeof controlledOpen === 'undefined' && (
        <button
          className="hq-cb-trigger"
          onClick={() => setInternalOpen((o) => !o)}
          aria-label="Open property assistant"
          aria-expanded={open}
        >
          {open ? <CloseIcon /> : <ChatIcon />}
        </button>
      )}

      {/* ── Chat panel ── */}
      {open && (
        <div className="hq-cb-panel" role="dialog" aria-label="Property Assistant">

          {/* Header */}
          <div className="hq-cb-header">
            <HouseIcon />
            <span style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:14, fontWeight:500, color:'#fff', flex:1 }}>
              Property Assistant
            </span>
            <button onClick={handleClose} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', padding:2 }} aria-label="Close">
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="hq-cb-msgs" ref={listRef}>
            {messages.length === 0 && (
              <div style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:13, color:'var(--hq-muted,#aaa)', textAlign:'center', margin:'auto 0', padding:'24px 0' }}>
                Ask me about price, location, area,<br />builder, amenities &amp; more.
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`hq-cb-msg hq-cb-msg--${m.sender}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="hq-cb-typing hq-cb-msg--bot" style={{ alignSelf:'flex-start', borderRadius:'18px 18px 18px 4px', padding:'10px 14px' }}>
                <div className="hq-cb-dot" />
                <div className="hq-cb-dot" />
                <div className="hq-cb-dot" />
              </div>
            )}
          </div>

          {/* Input row */}
          <div className="hq-cb-input-row">
            <input
              className="hq-cb-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask about this property…"
              disabled={loading}
            />
            <button
              className="hq-cb-send"
              onClick={sendMessage}
              disabled={loading || !text.trim()}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
            <button className="hq-cb-deal-btn" onClick={closeDeal} title="Initiate a deal">
              Deal
            </button>
          </div>
        </div>
      )}
    </>
  );
}

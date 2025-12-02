import React, { useEffect, useRef, useState } from 'react';
import api, { authAPI } from '../services/api';
import { User, Bot } from 'lucide-react';


export default function PropertyChatBot({ property, isOpen: controlledOpen, onClose, onDealClosed }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = typeof controlledOpen === 'boolean' ? controlledOpen : internalOpen;
  const [messages, setMessages] = useState([]); 
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    
    setMessages([]);
    setText('');
  }, [property?.id]);

  useEffect(() => {
    
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length]);

  const sendMessage = async () => {
    if (!text.trim() || !property) return;
    const userMsg = { id: `u_${Date.now()}`, sender: 'user', text: text.trim(), createdAt: new Date() };
    setMessages((m) => [...m, userMsg]);
    setText('');
    setLoading(true);
    try {
      const res = await api.post('/api/llm/property-chat', { property, message: userMsg.text });
      const botText = res?.data?.data?.text || 'I can only answer questions about this property.';
      const botMsg = { id: `b_${Date.now()}`, sender: 'bot', text: botText, createdAt: new Date() };
      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      console.error('LLM error', err);
      const botMsg = { id: `b_${Date.now()}`, sender: 'bot', text: 'Sorry, I could not process your request right now.', createdAt: new Date() };
      setMessages((m) => [...m, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {typeof controlledOpen === 'undefined' && (
        <button
          onClick={() => setInternalOpen((o) => !o)}
        className="px-3 py-2 rounded-md bg-slate-800 text-white flex items-center gap-2 text-sm"
          aria-expanded={open}
      >
        <Bot className="w-4 h-4" /> Chat with Assistant
        </button>
      )}

      {open && (
        <div className="absolute right-0 top-12 w-[320px] shadow-lg bg-white dark:bg-slate-800 rounded-md border border-neutral-200 dark:border-slate-700 z-50">
            <div className="px-3 py-2 border-b dark:border-slate-700 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <div className="text-sm font-semibold">Property Assistant</div>
            <div className="ml-auto text-xs text-neutral-400">Only uses property data</div>
          </div>

          <div className="p-3 h-56 overflow-auto" ref={listRef}>
            {messages.length === 0 && (
              <div className="text-sm text-neutral-500">Ask me about price, location, area, builder, amenities & more.</div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2 mb-3 ${m.sender === 'bot' ? 'items-start' : 'items-end justify-end'}`}>
                {m.sender === 'bot' ? (
                  <div className="flex items-start gap-2">
                    <div className="flex-none w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center"><Bot className="w-4 h-4 text-slate-600" /></div>
                    <div className="rounded-md bg-neutral-100 dark:bg-slate-700 p-2 text-sm max-w-[230px]">{m.text}</div>
                  </div>
                ) : (
                  <div className="flex items-end gap-2 ml-auto">
                    <div className="rounded-md bg-blue-600 text-white p-2 text-sm max-w-[230px]">{m.text}</div>
                    <div className="flex-none w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center"><User className="w-4 h-4 text-blue-700" /></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-2 border-t dark:border-slate-700 flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
              placeholder="Ask about this property..."
              className="flex-1 px-3 py-2 rounded-md border dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
            <button onClick={sendMessage} disabled={loading} className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm">
              Send
            </button>
            <button
              onClick={async () => {
                if (property) {
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
                }
              }}
              className="px-3 py-2 rounded-md bg-green-600 text-white text-sm ml-2"
            >
              Close the deal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

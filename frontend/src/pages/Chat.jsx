import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { authAPI } from '../services/api';
import { io } from 'socket.io-client';
import { Send } from 'lucide-react';

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [deal, setDeal] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);

  const fetchChat = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/chats/${id}`);
      if (res.data && res.data.success) {
        setChat(res.data.data);
        setMessages(res.data.data.messages || []);
      }
    } catch (err) {
      console.warn('Failed to fetch chat', err.message);
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 3000); 
    return () => clearInterval(interval);
  }, [fetchChat]);

  useEffect(() => {
    
    try {
      const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001');
      socket.on('connect', () => {
        socket.emit('join', `chat:${id}`);
      });
      socket.on('message', (payload) => {
        if (payload && payload.chatId === id && payload.message) {
          setMessages(prev => [...prev, payload.message]);
        }
      });
      socket.on('dealClosed', (d) => {
        setDeal(d);
      });

      return () => {
        try { socket.emit('leave', `chat:${id}`); socket.disconnect(); } catch (err) {}
      };
    } catch (err) {
      
      console.warn('Socket connection failed', err.message);
    }
  }, [id]);

  

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const res = await api.post(`/api/chats/${id}/messages`, { text });
      if (res.data && res.data.success) {
        setMessages(prev => [...prev, res.data.data]);
        setText('');
      }
    } catch (err) {
      console.error('Send message failed', err.message);
    }
  };

  const handleCloseDeal = async () => {
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }
    if (!window.confirm('Are you sure you want to close the deal? This will finalize the purchase.')) return;
    try {
      const res = await api.post(`/api/chats/${id}/close`, { price: chat && chat.propertyId ? 'Negotiated' : 'Negotiated' });
      if (res?.data?.success) {
        
        setDeal(res.data.data);
      }
    } catch (err) {
      console.error('Close deal failed', err.message);
      alert('Failed to close the deal');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 font-ui">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Chat</h2>
        <div className="flex gap-2">
          <button onClick={handleCloseDeal} className="px-3 py-1 rounded-md bg-hm-red text-white">Close the deal</button>
        </div>
      </div>

      <div className="bg-white border rounded p-4 h-[60vh] overflow-auto" ref={listRef}>
        {loading && <div>Loading chat...</div>}
        {!loading && messages.length === 0 && (
          <div className="text-sm text-muted">No messages yet. Start the conversation.</div>
        )}

        {messages.map(m => (
          <div key={m.id} className="mb-3">
            <div className="text-xs text-muted">{m.senderId || 'You'}</div>
            <div className="mt-1 bg-neutral-100 p-2 rounded">{m.text}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input className="flex-1 px-3 py-2 border rounded" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message" />
        <button onClick={sendMessage} className="px-3 py-2 bg-blue-600 text-white rounded flex items-center gap-2"><Send className="w-4 h-4"/>Send</button>
      </div>
      {deal && (
        <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded-md">
          <div className="flex items-start gap-4">
            <div className="font-semibold">Deal Created</div>
            <div className="ml-auto text-sm text-neutral-500">{deal.id}</div>
          </div>
          <div className="text-sm mt-2">Property: {deal.propertyId}</div>
          <div className="text-sm">Buyer: {deal.buyerName}</div>
          <div className="text-sm">Price: {deal.price}</div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => navigate('/deals')} className="px-3 py-1 bg-blue-600 text-white rounded">View all deals</button>
          </div>
        </div>
      )}
    </div>
  );
}

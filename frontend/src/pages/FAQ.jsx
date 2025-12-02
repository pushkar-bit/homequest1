import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_ITEM = ({ q, a, open, onToggle }) => (
  <div className="border-b py-3">
    <button onClick={onToggle} className="w-full text-left flex items-center justify-between">
      <div>
        <div className="font-semibold">{q}</div>
      </div>
      <div>{open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</div>
    </button>
    {open && <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{a}</div>}
  </div>
);

export default function FAQ() {
  const [openId, setOpenId] = useState(null);

  const faqs = [
    { id: 1, q: 'What is HomeQuest?', a: 'HomeQuest is a simple property discovery platform to help buyers find homes.' },
    { id: 2, q: 'How do I contact an agent?', a: 'Use the Contact Agent chat on a property or the contact page to reach agents.' },
    { id: 3, q: 'Is the information verified?', a: 'We strive to list accurate information but always verify with the agent before purchase.' },
    { id: 4, q: 'Can I shortlist properties?', a: 'Yes — use the heart button on a property to add to your shortlist.' },
    { id: 5, q: 'Is HomeQuest free to use?', a: 'Yes, HomeQuest is free for buyers.' },
    { id: 6, q: 'How do I report an issue?', a: 'Email support@homequest.com with details and we will investigate.' },
  ];

  return (
    <div className="min-h-screen py-12 bg-neutral-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
        <h1 className="text-2xl font-semibold mb-4" style={{ color: '#DC143C' }}>FAQ</h1>
        <div className="space-y-2">
          {faqs.map(item => (
            <FAQ_ITEM key={item.id} q={item.q} a={item.a} open={openId === item.id} onToggle={() => setOpenId(openId === item.id ? null : item.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

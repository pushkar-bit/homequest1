import React, { useEffect, useState } from 'react';
import api, { authAPI } from '../services/api';

const Deals = () => {
  const [tab, setTab] = useState('deals');
  const [deals, setDeals] = useState([]);
  const [offers, setOffers] = useState([]);
  const user = authAPI.getCurrentUser();
  const isAgent = user?.role === 'agent';

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tab === 'deals') {
          const res = await api.get('/api/deals');
          setDeals(res.data.data || res.data);
        } else {
          const res = await api.get('/api/deals/offers');
          setOffers(res.data.data || res.data);
        }
      } catch (err) {
        console.warn('Failed to fetch deals/offers', err.message);
      }
    };
    fetchData();
  }, [tab]);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-4">Deals</h2>

      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setTab('deals')} 
          className={`px-4 py-2 rounded ${
            tab === 'deals' 
              ? 'bg-blue-600 text-white' 
              : isAgent ? 'bg-black text-white' : 'bg-gray-100'
          }`}
        >
          Deals Made
        </button>
        <button 
          onClick={() => setTab('offers')} 
          className={`px-4 py-2 rounded ${
            tab === 'offers' 
              ? 'bg-blue-600 text-white' 
              : isAgent ? 'bg-black text-white' : 'bg-gray-100'
          }`}
        >
          Offers
        </button>
      </div>

      {tab === 'deals' && (
        <div className="space-y-4">
          {deals.length === 0 && <p className="text-gray-600">No deals yet.</p>}
          {deals.map(d => (
            <div
              key={d.id}
              className={`p-4 rounded-lg shadow-lg ${isAgent ? 'bg-white text-black border border-gray-200' : 'bg-gradient-to-r from-slate-800 to-slate-900 text-white'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className={`text-lg font-semibold ${isAgent ? 'text-gray-900' : ''}`}>Deal: {d.id}</div>
                  <div className={`text-sm ${isAgent ? 'text-gray-700' : 'text-slate-300'}`}>Property: {d.propertyId} • Buyer: {d.buyerName}</div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${isAgent ? 'text-gray-900' : ''}`}>₹{d.price}</div>
                  <div className={`text-xs ${isAgent ? 'text-gray-600' : 'text-slate-300'}`}>{new Date(d.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'offers' && (
        <div className="space-y-4">
          {offers.length === 0 && <p className="text-gray-600">No offers yet.</p>}
          {offers.map(o => (
            <div
              key={o.id}
              className={`p-4 rounded-lg ${isAgent ? 'bg-white text-black border border-gray-200 shadow-sm' : 'bg-white/5 text-slate-100 backdrop-blur-sm border border-white/5'}`}
            >
              <div className="flex justify-between">
                <div>
                  <div className={`font-semibold ${isAgent ? 'text-gray-900' : ''}`}>Offer: {o.id}</div>
                  <div className={`text-sm ${isAgent ? 'text-gray-700' : 'text-slate-300'}`}>Property: {o.propertyId} • Buyer: {o.buyerName}</div>
                  <div className={`mt-2 text-sm ${isAgent ? 'text-gray-800' : 'text-slate-200'}`}>Message: {o.message}</div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${isAgent ? 'text-gray-900' : ''}`}>₹{o.offerPrice}</div>
                  <div className={`text-xs ${isAgent ? 'text-gray-600' : 'text-slate-400'}`}>{new Date(o.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Deals;

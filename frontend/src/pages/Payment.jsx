import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { authAPI } from '../services/api';

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [propertyId, setPropertyId] = useState(state?.propertyId || '');
  const [amount, setAmount] = useState(state?.amount || '');
  const [payerName, setPayerName] = useState('');
  const [payerAccount, setPayerAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const user = authAPI.getCurrentUser();
    if (user) setPayerName(user.name || user.email || '');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!propertyId || !amount) {
      alert('Please provide property and amount');
      return;
    }

    try {
      setLoading(true);
      const payload = { propertyId, amount, payerName, payerAccount };
      const res = await api.post('/api/payments/transfer', payload);
      setResult(res?.data || { success: false, error: 'No response' });
    } catch (err) {
      console.error('Payment API error', err);
      setResult({ success: false, error: err.message || 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-neutral-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
        <h2 className="text-2xl font-semibold mb-4" style={{color: '#DC143C'}}>Bank Transfer Payment</h2>

        {!result && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600">Property ID</label>
              <input value={propertyId} onChange={(e) => setPropertyId(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Amount (₹)</label>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Payer Name</label>
              <input value={payerName} onChange={(e) => setPayerName(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Payer Account (optional)</label>
              <input value={payerAccount} onChange={(e) => setPayerAccount(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
                {loading ? 'Initiating...' : 'Initiate Bank Transfer'}
              </button>
              <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Back</button>
            </div>
          </form>
        )}

        {result && (
          <div className="mt-4">
            {result.success ? (
              <div>
                <h3 className="font-semibold">Transaction Created</h3>
                <p className="mt-2">Transaction ID: <span className="font-mono">{result.data.transactionId}</span></p>
                <p className="mt-2">Status: {result.data.status}</p>
                <div className="mt-3 p-3 bg-gray-50 rounded border">
                  <div className="text-sm whitespace-pre-wrap">{result.data.instructions}</div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => navigate(`/property/${propertyId}`)} className="px-4 py-2 bg-hm-red text-white rounded">Back to Property</button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold">Payment failed</h3>
                <p className="text-sm mt-2">{result.error || 'Unknown error'}</p>
                <div className="mt-3">
                  <button onClick={() => setResult(null)} className="px-4 py-2 bg-blue-600 text-white rounded">Try again</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

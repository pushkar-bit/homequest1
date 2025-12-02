import React, { useState, useEffect } from 'react';
import { RotateCcw, Clock, User, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { authAPI } from '../services/api';

export default function AdminInsightsHistory() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState(null);

  const currentUser = authAPI.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  const fetchHistory = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/insights/${type}/${id}/history`);
      setHistory(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  }, [type, id]);

  const fetchInsight = React.useCallback(async () => {
    try {
      const endpoint = type === 'city' ? '/api/insights/city' : '/api/insights/locality';
      const res = await api.get(endpoint);
      const insights = res.data.data || [];
      const found = insights.find(i => i.id === parseInt(id));
      setInsight(found);
    } catch (err) {
      console.error('Failed to fetch insight:', err);
    }
  }, [type, id]);

  useEffect(() => {
    if (isAdmin && type && id) {
      fetchHistory();
      fetchInsight();
    }
  }, [type, id, isAdmin, fetchHistory, fetchInsight]);

  const handleUndo = async () => {
    if (!window.confirm('Are you sure you want to undo the last change?')) return;

    try {
      await api.post(`/api/insights/${type}/${id}/undo`);
      alert('Change undone successfully!');
      fetchHistory();
      fetchInsight();
    } catch (err) {
      alert('Failed to undo change: ' + (err.response?.data?.error || err.message));
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Access denied. Admin only.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {type === 'city' ? 'City' : 'Locality'} Insight History
        </h1>
        {insight && (
          <p className="text-gray-600">
            {type === 'city' ? insight.city : `${insight.city} - ${insight.locality}`}
          </p>
        )}
      </div>

      {}
      {insight && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Avg Price/SqFt</p>
              <p className="text-lg font-semibold">₹{insight.avgPriceSqFt}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">1-Year Growth</p>
              <p className="text-lg font-semibold">{insight.oneYearGrowth}%</p>
            </div>
            {type === 'city' && insight.demandIndex !== undefined && (
              <div>
                <p className="text-sm text-gray-600">Demand Index</p>
                <p className="text-lg font-semibold">{insight.demandIndex}</p>
              </div>
            )}
            {type === 'locality' && insight.trendComment && (
              <div className="col-span-2 md:col-span-3">
                <p className="text-sm text-gray-600">Trend Comment</p>
                <p className="text-sm">{insight.trendComment}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {}
      {history.length > 0 && (
        <div className="mb-6">
          <button
            onClick={handleUndo}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Undo Last Change
          </button>
        </div>
      )}

      {}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No edit history found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Change History</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {history.map((entry, index) => (
              <div key={entry.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {entry.fieldName}
                      </span>
                      {index === 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Latest
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Old:</span>{' '}
                        <span className="font-medium text-red-600 line-through">{entry.oldValue}</span>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div>
                        <span className="text-gray-500">New:</span>{' '}
                        <span className="font-medium text-green-600">{entry.newValue}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 text-right">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <User className="w-4 h-4 mr-1" />
                      {entry.changedByUser?.name || entry.changedByUser?.email || 'Unknown'}
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(entry.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

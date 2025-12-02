import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Edit2, RotateCcw, Save, X } from 'lucide-react';
import { authAPI } from '../services/api';


const MOCK_CITY_INSIGHTS = {
  'Mumbai': { id: 1, city: 'Mumbai', avgPriceSqFt: 18000, oneYearGrowth: 8.5, demandIndex: 95 },
  'Delhi': { id: 2, city: 'Delhi', avgPriceSqFt: 15000, oneYearGrowth: 6.2, demandIndex: 88 },
  'Bangalore': { id: 3, city: 'Bangalore', avgPriceSqFt: 12000, oneYearGrowth: 9.1, demandIndex: 92 },
  'Pune': { id: 4, city: 'Pune', avgPriceSqFt: 10000, oneYearGrowth: 7.8, demandIndex: 85 },
  'Hyderabad': { id: 5, city: 'Hyderabad', avgPriceSqFt: 9000, oneYearGrowth: 10.2, demandIndex: 90 },
  'Chennai': { id: 6, city: 'Chennai', avgPriceSqFt: 8500, oneYearGrowth: 5.5, demandIndex: 82 },
};

const MOCK_LOCALITY_INSIGHTS = [
  { id: 1, city: 'Mumbai', locality: 'Bandra', avgPriceSqFt: 22000, oneYearGrowth: 9.5, trendComment: 'High demand area' },
  { id: 2, city: 'Mumbai', locality: 'Andheri', avgPriceSqFt: 15000, oneYearGrowth: 7.2, trendComment: 'Growing commercial hub' },
  { id: 3, city: 'Bangalore', locality: 'Koramangala', avgPriceSqFt: 15000, oneYearGrowth: 10.5, trendComment: 'IT hub' },
  { id: 4, city: 'Bangalore', locality: 'Indiranagar', avgPriceSqFt: 13000, oneYearGrowth: 8.8, trendComment: 'Rapidly developing' },
  { id: 5, city: 'Delhi', locality: 'South Delhi', avgPriceSqFt: 18000, oneYearGrowth: 6.8, trendComment: 'Premium location' },
  { id: 6, city: 'Pune', locality: 'Hinjewadi', avgPriceSqFt: 12000, oneYearGrowth: 9.2, trendComment: 'Tech district' },
  { id: 7, city: 'Hyderabad', locality: 'Jubilee Hills', avgPriceSqFt: 11000, oneYearGrowth: 11.3, trendComment: 'Best investment spot' },
  { id: 8, city: 'Bangalore', locality: 'Whitefield', avgPriceSqFt: 14000, oneYearGrowth: 9.8, trendComment: 'Corporate hub' },
];

export default function Insights() {
  const [searchQuery, setSearchQuery] = useState('');
  const [insights, setInsights] = useState(null);
  const [insightType, setInsightType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [originalInsights, setOriginalInsights] = useState({}); 
  
  const currentUser = authAPI.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    setInsights(null);

    
    await new Promise(resolve => setTimeout(resolve, 500));

    const query = searchQuery.trim();
    const queryLower = query.toLowerCase();

    
    for (const [city, data] of Object.entries(MOCK_CITY_INSIGHTS)) {
      if (city.toLowerCase() === queryLower) {
        setInsights([data]);
        setInsightType('city');
        setLoading(false);
        return;
      }
    }

    
    const localityResults = MOCK_LOCALITY_INSIGHTS.filter(item =>
      item.city.toLowerCase().includes(queryLower) ||
      item.locality.toLowerCase().includes(queryLower)
    );

    if (localityResults.length > 0) {
      setInsights(localityResults);
      setInsightType('locality');
      setLoading(false);
      return;
    }

    setError(`No insights found for "${query}". Try: Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai`);
    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    
    if (!originalInsights[item.id]) {
      setOriginalInsights(prev => ({
        ...prev,
        [item.id]: { ...item }
      }));
    }
    setEditForm({
      avgPriceSqFt: item.avgPriceSqFt,
      oneYearGrowth: item.oneYearGrowth,
      demandIndex: item.demandIndex,
      trendComment: item.trendComment
    });
  };

  const handleSaveEdit = async (item) => {
    try {
      
      const updatedInsights = insights.map(i => 
        i.id === item.id ? { ...i, ...editForm } : i
      );
      setInsights(updatedInsights);
      setEditingId(null);
      alert('Insight updated successfully!');
    } catch (err) {
      alert('Failed to update insight: ' + err.message);
    }
  };

  const handleUndo = async (item) => {
    if (!window.confirm('Reset this insight to default values?')) return;

    try {
      
      const defaultValue = originalInsights[item.id];
      
      if (defaultValue) {
        
        const updatedInsights = insights.map(i => 
          i.id === item.id ? { ...defaultValue } : i
        );
        setInsights(updatedInsights);
        
        setOriginalInsights(prev => {
          const newOriginals = { ...prev };
          delete newOriginals[item.id];
          return newOriginals;
        });
        alert('Insight reset to default values!');
      } else {
        alert('No changes to undo for this insight.');
      }
    } catch (err) {
      alert('Failed to reset insight: ' + err.message);
    }
  };

  const isPositiveGrowth = (growth) => growth >= 0;

  const renderInsightCard = (item, idx) => {
    const isEditing = editingId === item.id;

    return (
      <div key={idx} className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {item.locality || item.city}
            </h3>
            {item.locality && (
              <p className="text-gray-500 text-sm">{item.city}</p>
            )}
          </div>
          
          {isAdmin && (
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleUndo(item)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                    title="Undo Last Change"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleSaveEdit(item)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Save"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-gray-600 text-xs uppercase tracking-wide">Avg Price/sqft</p>
            {isEditing ? (
              <input
                type="number"
                value={editForm.avgPriceSqFt}
                onChange={(e) => setEditForm({...editForm, avgPriceSqFt: parseFloat(e.target.value)})}
                className="text-2xl font-bold text-blue-600 border-b-2 border-blue-300 focus:outline-none focus:border-blue-600 w-full"
              />
            ) : (
              <p className="text-2xl font-bold text-blue-600">₹{item.avgPriceSqFt?.toLocaleString()}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-600 text-xs uppercase tracking-wide">1-Year Growth</p>
              {isEditing ? (
                <input
                  type="number"
                  step="0.1"
                  value={editForm.oneYearGrowth}
                  onChange={(e) => setEditForm({...editForm, oneYearGrowth: parseFloat(e.target.value)})}
                  className="text-lg font-bold text-green-600 border-b-2 border-green-300 focus:outline-none focus:border-green-600 w-24"
                />
              ) : (
                <p className={`text-lg font-bold ${isPositiveGrowth(item.oneYearGrowth) ? 'text-green-600' : 'text-red-600'}`}>
                  {item.oneYearGrowth > 0 ? '+' : ''}{item.oneYearGrowth.toFixed(1)}%
                </p>
              )}
            </div>
            <div>
              {isPositiveGrowth(item.oneYearGrowth) ? (
                <TrendingUp className="w-8 h-8 text-green-600" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600" />
              )}
            </div>
          </div>

          {(item.trendComment || isEditing) && (
            <div className="bg-blue-50 p-3 rounded">
              {isEditing ? (
                <textarea
                  value={editForm.trendComment || ''}
                  onChange={(e) => setEditForm({...editForm, trendComment: e.target.value})}
                  className="text-sm text-blue-900 w-full bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-600"
                  rows="2"
                />
              ) : (
                <p className="text-sm text-blue-900">{item.trendComment}</p>
              )}
            </div>
          )}

          {item.demandIndex && (
            <div>
              <p className="text-gray-600 text-xs uppercase tracking-wide mb-2">Demand Index</p>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editForm.demandIndex}
                  onChange={(e) => setEditForm({...editForm, demandIndex: parseInt(e.target.value)})}
                  className="text-sm font-bold text-purple-600 border-b-2 border-purple-300 focus:outline-none focus:border-purple-600 w-20"
                />
              ) : (
                <>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${item.demandIndex}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{item.demandIndex}/100</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Market Insights</h1>
          <p className="text-gray-600 text-lg">Search for city, locality, or society insights</p>
          {insightType && (
            <p className="mt-2 text-sm text-gray-500">Showing {insightType === 'city' ? 'city' : 'locality'} insights</p>
          )}
        </div>

        {}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter any city, locality or society..."
              className="w-full px-6 py-3 pr-14 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              <Search className="w-6 h-6" />
            </button>
          </div>
        </form>

        {}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {}
        {!loading && insights && Array.isArray(insights) && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.map((item, idx) => renderInsightCard(item, idx))}
            </div>
          </div>
        )}

        {}
        {!loading && !insights && !error && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Markets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(MOCK_CITY_INSIGHTS).map(([city, data]) => (
                <button
                  key={city}
                  onClick={() => {
                    setSearchQuery(city);
                    setInsights([data]);
                    setInsightType('city');
                  }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg hover:shadow-lg transition text-left"
                >
                  <h3 className="font-bold text-blue-900 mb-2 text-lg">{city}</h3>
                  <p className="text-sm text-blue-700 mb-3">₹{data.avgPriceSqFt?.toLocaleString()}/sqft</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${data.oneYearGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.oneYearGrowth > 0 ? '+' : ''}{data.oneYearGrowth.toFixed(1)}%
                    </p>
                    {data.oneYearGrowth >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

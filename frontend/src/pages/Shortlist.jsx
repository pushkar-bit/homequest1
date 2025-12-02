import React, { useState, useEffect } from 'react';
import { favoritesAPI, getPropertyById, authAPI } from '../services/api';
import { favoritesStorage } from '../services/favoritesStorage';
import PropertyCard from '../components/PropertyCard';
import { Trash2 } from 'lucide-react';

export default function Shortlist() {
  const [favorites, setFavorites] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode ? savedMode === 'dark' : true;
  });

  useEffect(() => {
    fetchFavorites();
    
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError('');
      
      let favoritesList = [];
      const isAuthenticated = authAPI.isAuthenticated();

      
      if (isAuthenticated) {
        try {
          const result = await favoritesAPI.getFavorites();
          if (result.success && result.data) {
            favoritesList = result.data;
          }
        } catch (err) {
          console.warn('API fetch failed, falling back to localStorage:', err);
          
          favoritesList = favoritesStorage.getFavorites();
        }
      } else {
        
        favoritesList = favoritesStorage.getFavorites();
      }

      setFavorites(favoritesList);

      
      const propertyPromises = favoritesList.map((fav) => {
        const propertyId = fav.propertyId || fav.id;
        return getPropertyById(propertyId).catch(() => null);
      });

      const propertyResults = await Promise.all(propertyPromises);
      const validProperties = propertyResults
        .map((res, idx) => {
          if (res && res.success && res.data) {
            return {
              ...res.data,
              favoriteId: favoritesList[idx].id,
            };
          }
          return null;
        })
        .filter((p) => p !== null);

      setProperties(validProperties);
    } catch (err) {
      setError('Failed to load favorites');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (propertyId, favoriteId) => {
    try {
      const isAuthenticated = authAPI.isAuthenticated();

      
      if (isAuthenticated) {
        try {
          const result = await favoritesAPI.removeFavorite(favoriteId);
          if (result.success) {
            setProperties(properties.filter((p) => p.id !== propertyId));
            setFavorites(favorites.filter((f) => f.id !== favoriteId));
            return;
          }
        } catch (err) {
          console.warn('API remove failed, falling back to localStorage:', err);
        }
      }

      
      favoritesStorage.removeFavorite(propertyId);
      setProperties(properties.filter((p) => p.id !== propertyId && p.favoriteId !== favoriteId));
      setFavorites(favorites.filter((f) => f.id !== favoriteId));
    } catch (err) {
      setError('Error removing favorite');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-white'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 ${isDarkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-neutral-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <div className="mb-8">
          <h1 className={`text-4xl font-display font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-primary-text'}`}>My Shortlist</h1>
          <p className={`font-ui ${isDarkMode ? 'text-slate-400' : 'text-muted'}`}>
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>

        {}
        {error && (
          <div className={`border rounded-lg mb-6 px-4 py-3 ${isDarkMode ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {error}
          </div>
        )}

        {}
        {properties.length === 0 ? (
          <div className={`rounded-lg shadow p-12 text-center ${isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white'}`}>
            <div className="mb-4">
              <Trash2 className={`w-16 h-16 mx-auto ${isDarkMode ? 'text-slate-600' : 'text-gray-300'}`} />
            </div>
            <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No Shortlisted Properties Yet</h2>
            {authAPI.isAuthenticated() ? (
              <>
                <p className={`mb-6 font-ui ${isDarkMode ? 'text-slate-400' : 'text-muted'}`}>Start exploring properties and add your favorites to your shortlist.</p>
                <a
                  href="/home"
                  className={`inline-block px-6 py-2 rounded-md transition bg-hm-red text-white font-ui font-semibold`}
                >
                  Browse Properties
                </a>
              </>
            ) : (
              <>
                <p className={`mb-6 font-ui ${isDarkMode ? 'text-slate-400' : 'text-muted'}`}>Create an account to save favorites and build your shortlist.</p>
                <div className="flex items-center justify-center gap-4">
                  <a href="/login" className={`px-6 py-2 rounded-md ${isDarkMode ? 'bg-white text-primary-text hover:bg-neutral-50' : 'bg-white border border-neutral-200 text-primary-text hover:bg-neutral-50'}`}>Login</a>
                  <a href="/signup" className="px-6 py-2 bg-hm-red text-white rounded-md hover:opacity-95 font-ui font-semibold">Sign Up</a>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.favoriteId || property.id} className="relative">
                <PropertyCard
                  property={property}
                  isDarkMode={isDarkMode}
                  onAddToFavorites={() => {}}
                />
                <button
                  onClick={() => handleRemoveFavorite(property.id || property.title, property.favoriteId || property.id)}
                  className={`absolute top-6 right-14 p-2 rounded-full shadow transition ${isDarkMode ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                  title="Remove from shortlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

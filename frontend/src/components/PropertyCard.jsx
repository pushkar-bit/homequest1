import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Share2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI, favoritesAPI } from '../services/api';
import { favoritesStorage } from '../services/favoritesStorage';
import { sessionStorage } from '../services/sessionStorage';

export default function PropertyCard({ property, onAddToFavorites, onDelete, isDarkMode = true }) {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const isAuthenticated = authAPI.isAuthenticated();
  const currentUser = authAPI.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const isDeleted = isAdmin && sessionStorage.isPropertyDeleted(property.id);

  
  useEffect(() => {
    const propertyId = property.id || property.title;
    setIsFavorited(favoritesStorage.isFavorited(propertyId));
  }, [property]);

  
  const getPropertyField = (field, fallback = 'N/A') => {
    return property[field] || property[field.toLowerCase()] || fallback;
  };

  const propertyImage = property.image || property.images?.[0] || property.photo || null;
  const propertyPrice = getPropertyField('price', property.pricePerUnit);
  const propertyTitle = getPropertyField('title', property.name);
  const propertyLocation = getPropertyField('location', property.address);
  const propertyArea = getPropertyField('area', property.size);
  const propertyType = getPropertyField('type', '');

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      
      alert('You have not logged in yet. Please login to add properties to favorites.');
      navigate('/login', { state: { from: window.location.pathname, message: 'Please login to add properties to favorites' } });
      return;
    }
    
    try {
      if (isFavorited) {
        
        const favorites = await favoritesAPI.getFavorites();
        const favorite = favorites.find(f => f.propertyId === (property.id || property.title));
        if (favorite) {
          await favoritesAPI.removeFavorite(favorite.id);
          setIsFavorited(false);
        }
      } else {
        
        await favoritesAPI.addFavorite(property.id || property.title);
        setIsFavorited(true);
      }
      if (onAddToFavorites) {
        onAddToFavorites(property);
      }
    } catch (err) {
      console.warn('API favorite failed:', err);
      alert('Failed to add to favorites. Please try again.');
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Mark this property as deleted? (This is temporary and will reset on logout)')) return;

    try {
      
      sessionStorage.addDeletedProperty(property.id);
      alert('Property marked as deleted! (Will reset on logout)');
      
      
      window.location.reload();
    } catch (err) {
      alert('Failed to mark property as deleted: ' + err.message);
    }
  };

  const handleCardClick = () => {
    
    if (isDeleted) {
      alert('Property has been deleted by the admin');
      return;
    }
    navigate(`/property/${property.id || property.title}`, { state: { property } });
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group relative rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-red-400 dark:hover:border-red-500 hover:shadow-xl hover:-translate-y-1 ${isDeleted ? 'opacity-60' : ''}`}
      style={{boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'}}
    >
      {}
      {isDeleted && (
        <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
            Deleted (Temporary)
          </div>
        </div>
      )}
      
      {}
      <div className="relative h-56 md:h-64 overflow-hidden bg-gray-100 dark:bg-gray-900">
        {propertyImage ? (
          <img 
            src={propertyImage} 
            alt={propertyTitle}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Property+Image';
            }}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-neutral-100'}`}>
            <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-muted'}`}>No Image Available</span>
          </div>
        )}

        {}
        {propertyType && (
          <div className="absolute top-4 left-4 bg-neutral-200 text-primary-text px-3 py-1 rounded-full text-xs font-medium border border-neutral-200">
            {propertyType}
          </div>
        )}

        {}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 rounded-full p-2 transition border ${isDarkMode ? 'bg-slate-900/60 hover:bg-slate-900/80 border-slate-700/40' : 'bg-white border-neutral-200 hover:bg-neutral-100'}`}
        >
          <Heart
            className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${isFavorited ? 'fill-red-500 text-red-500' : isDarkMode ? 'text-slate-300 hover:text-red-400' : 'text-gray-600 hover:text-red-500'}`}
          />
        </button>

        {}
        {propertyPrice && (
          <div className={`absolute bottom-4 left-4 px-3 py-2 rounded text-primary-text bg-white border ${isDarkMode ? 'bg-slate-900/70 text-white border-slate-700' : 'bg-white border-neutral-200 text-primary-text'}`}>
            <p className="font-semibold text-sm md:text-base">
              {typeof propertyPrice === 'number' ? `₹${propertyPrice.toLocaleString()}` : propertyPrice}
            </p>
          </div>
        )}
      </div>

      {}
      <div className="p-6 md:p-7 font-ui">
        {}
        <h3 className="text-base md:text-lg font-medium mb-2 line-clamp-2" style={{color: '#DC143C'}}>
          {propertyTitle}
        </h3>

        {}
        <div className={`flex items-center text-xs md:text-sm mb-4 ${isDarkMode ? 'text-slate-300' : 'text-muted'}`}>
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" style={{color: '#DC143C'}} />
          <p className="line-clamp-1">{propertyLocation}</p>
        </div>

        {}
        <div className={`grid grid-cols-3 gap-3 mb-5 py-4 border-t border-b ${isDarkMode ? 'border-slate-700/50' : 'border-neutral-200'}`}>
          {}
          {propertyType && (
            <div className="text-center">
              <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Type</p>
              <p className={`font-semibold text-sm mt-1 ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{propertyType}</p>
            </div>
          )}

          {}
          {propertyArea && (
            <div className="text-center">
              <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Area</p>
              <p className={`font-semibold text-sm mt-1 ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                {typeof propertyArea === 'number' ? `${propertyArea} sqft` : propertyArea}
              </p>
            </div>
          )}

          {}
          {(property.beds || property.bedrooms) && (
            <div className="text-center">
              <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Beds</p>
              <p className={`font-semibold text-sm mt-1 ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{property.beds || property.bedrooms}</p>
            </div>
          )}
        </div>

        {}
        {property.description && (
          <p className={`text-sm mb-5 line-clamp-2 font-light ${isDarkMode ? 'text-slate-300' : 'text-muted'}`}>
            {property.description}
          </p>
        )}

        {}
        <div className={`flex items-center justify-between gap-2 pt-4 border-t ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200'}`}>
          <button 
            onClick={handleCardClick}
            className="flex-1 px-5 py-2.5 rounded-xl font-ui font-medium text-sm text-white bg-hm-red hover:shadow-md transition-all hover:-translate-y-0.5"
            style={{boxShadow: '0 2px 6px rgba(220, 20, 60, 0.2)'}}
          >
            View Details
          </button>
          {isAdmin && (
            <button
              onClick={handleDelete}
              className="px-3 py-2.5 border border-red-500 text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center gap-1"
              title="Delete Property"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              
            }}
            className="p-2.5 border border-slate-700/50 rounded-lg hover:bg-slate-700/30 transition-colors backdrop-blur-sm hover:border-cyan-500/50"
          >
            <Share2 className="w-5 h-5 text-black dark:text-white" style={{color: '#DC143C'}} />
          </button>
        </div>
      </div>
    </div>
  );
}

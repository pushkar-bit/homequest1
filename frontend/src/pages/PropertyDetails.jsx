import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Home, Maximize2, Bed, ArrowLeft, Share2, Loader } from 'lucide-react';
import { getPropertyById, authAPI, favoritesAPI } from '../services/api';
import { favoritesStorage } from '../services/favoritesStorage';
import PropertyChatBot from '../components/PropertyChatBot';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPaying] = useState(false);
  const [isDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode ? savedMode === 'dark' : true;
  });
  const isAuthenticated = authAPI.isAuthenticated();
  const [showAssistant, setShowAssistant] = useState(false);

  const fetchPropertyDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getPropertyById(id);
      
      if (!result.success) {
        
        if (result.deleted) {
          setError('Property has been deleted by the admin');
        } else {
          setError(result.error || 'Property not found');
        }
        return;
      }

      setProperty(result.data);
      
      
      if (isAuthenticated) {
        try {
          const favResult = await favoritesAPI.getFavorites();
          if (favResult.success) {
            const isFav = favResult.data.some(fav => fav.propertyId === id);
            setIsFavorite(isFav);
          }
        } catch (err) {
          
          setIsFavorite(favoritesStorage.isFavorited(id));
        }
      } else {
        
        setIsFavorite(favoritesStorage.isFavorited(id));
      }
    } catch (err) {
      setError('Failed to load property details');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    fetchPropertyDetails();
  }, [fetchPropertyDetails]);

  const handleContactAgentClick = async () => {
    
    setShowAssistant(true);
  };

  const handleMakePayment = async () => {
    
    if (!property) return;
    const defaultAmount = property.price || property.pricePerUnit || '';
    navigate('/payment', { state: { propertyId: property.id || property.propertyId || id, amount: defaultAmount } });
  };

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      
      alert('You have not logged in yet. Please login to add properties to favorites.');
      navigate('/login', { state: { from: window.location.pathname, message: 'Please login to add properties to favorites' } });
      return;
    }

    try {
      setIsSaving(true);
      const result = await favoritesAPI.addFavorite(id);
      
      if (result.success) {
        setIsFavorite(true);
      } else {
        alert('Failed to add to favorites. Please try again.');
      }
    } catch (err) {
      console.warn('API add failed:', err);
      alert('Failed to add to favorites. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveFromFavorites = async () => {
    try {
      setIsSaving(true);
      
      if (isAuthenticated) {
        try {
          
          const favResult = await favoritesAPI.getFavorites();
          const favorite = favResult.data.find(fav => fav.propertyId === id);
          
          if (favorite) {
            const result = await favoritesAPI.removeFavorite(favorite.id);
            if (result.success) {
              setIsFavorite(false);
              return;
            }
          }
        } catch (err) {
          console.warn('API remove failed, falling back to localStorage:', err);
        }
      }

      
      favoritesStorage.removeFavorite(id);
      setIsFavorite(false);
    } finally {
      setIsSaving(false);
    }
  };

  const getPropertyField = (field) => {
    if (!property) return '';
    return property[field] || '';
  };

  const getImageUrl = () => {
    if (!property) return 'https://via.placeholder.com/600x400?text=Property+Image';
    return property.image || property.images?.[0] || property.photo || 'https://via.placeholder.com/600x400?text=Property+Image';
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-neutral-100'}`}>
        <div className="text-center">
          <Loader className={`w-12 h-12 animate-spin mx-auto mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-white'}`}>
        <div className="text-center">
          <Home className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`} />
          <h2 className={`text-2xl font-display font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-primary-text'}`}>{error || 'Property Not Found'}</h2>
          <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>This property is no longer available</p>
          <button
            onClick={() => navigate('/home')}
            className={`px-6 py-2 rounded-lg transition bg-hm-red text-white font-ui`}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-white'}>
      {}
      <div className={`shadow-sm border-b ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-neutral-200'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex gap-2">
            <button
              className="p-2 text-muted hover:bg-neutral-100 rounded-lg transition"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={isFavorite ? handleRemoveFromFavorites : handleAddToFavorites}
              disabled={isSaving}
              className={`p-2 rounded-lg transition ${
                  isFavorite
                    ? 'bg-red-50 text-red-600'
                    : 'text-muted hover:bg-neutral-100'
                }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {}
          <div className="lg:col-span-2">
            {}
            <div className="mb-8">
              <img
                src={getImageUrl()}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=Property+Image';
                }}
                alt={getPropertyField('title') || 'Property'}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            </div>

            {}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getPropertyField('title') || getPropertyField('name') || 'Property'}
              </h1>
              
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin className="w-5 h-5" />
                <p>{getPropertyField('location') || getPropertyField('address') || 'Location not available'}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b">
                <div className="text-center">
                  <Bed className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="text-lg font-bold">{getPropertyField('beds') || 'N/A'}</p>
                </div>
                <div className="text-center">
                  <Maximize2 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Area</p>
                  <p className="text-lg font-bold">{getPropertyField('area') || 'N/A'}</p>
                </div>
                <div className="text-center">
                  <Home className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="text-lg font-bold">{getPropertyField('type') || 'N/A'}</p>
                </div>
              </div>

              {}
              <div className="mb-8">
                <p className="text-sm text-gray-600 mb-2">Price</p>
                <p className="text-3xl font-bold text-blue-600">
                  {getPropertyField('price') || getPropertyField('pricePerUnit') || 'Contact for price'}
                </p>
              </div>

              {}
              {(getPropertyField('description') || getPropertyField('desc')) && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {getPropertyField('description') || getPropertyField('desc')}
                  </p>
                </div>
              )}
            </div>

            {}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.type && (
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold text-gray-900">{property.type}</p>
                  </div>
                )}
                {property.beds && (
                  <div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="font-semibold text-gray-900">{property.beds}</p>
                  </div>
                )}
                {property.area && (
                  <div>
                    <p className="text-sm text-gray-600">Area</p>
                    <p className="font-semibold text-gray-900">{property.area}</p>
                  </div>
                )}
                {property.location && (
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{property.location}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {}
          <div>
            {}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              
              <button
                onClick={isFavorite ? handleRemoveFromFavorites : handleAddToFavorites}
                disabled={isSaving}
                className={`w-full py-3 rounded-lg font-semibold transition mb-3 flex items-center justify-center gap-2 ${
                  isFavorite
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>

              <button
                onClick={handleContactAgentClick}
                className="w-full py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition mb-3"
              >
                Chat with Assistant
              </button>

              <button
                onClick={handleMakePayment}
                disabled={isPaying}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition mb-3"
              >
                {isPaying ? 'Initiating Payment...' : 'Make Payment'}
              </button>

              {}
              <PropertyChatBot property={property} isOpen={showAssistant} onClose={() => setShowAssistant(false)} onDealClosed={(deal) => {
                console.log('Deal closed via assistant', deal);
                setShowAssistant(false);
              }} />

              {}
              <div className="mt-8 pt-8 border-t">
                <h4 className="font-bold text-gray-900 mb-4">Summary</h4>
                <div className="space-y-3 text-sm">
                  {property.price && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold">{property.price}</span>
                    </div>
                  )}
                  {property.type && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-semibold">{property.type}</span>
                    </div>
                  )}
                  {property.beds && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="font-semibold">{property.beds}</span>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span className="font-semibold">{property.area}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

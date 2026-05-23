import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Home, ArrowLeft, Share2 } from 'lucide-react';
import { getPropertyById, authAPI, favoritesAPI } from '../services/api';
import { favoritesStorage } from '../services/favoritesStorage';
import PropertyChatBot from '../components/PropertyChatBot';
import { GooeyLoader } from '../components/GooeyLoader';

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23f5f5f5'/%3E%3Cg fill='none' stroke='%23dddddd' stroke-width='9' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M240 275 L240 215 L300 165 L360 215 L360 275 Z'/%3E%3Crect x='272' y='232' width='56' height='43' rx='3'/%3E%3C/g%3E%3Ctext x='300' y='315' text-anchor='middle' fill='%23cccccc' font-family='sans-serif' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";

const PD_CSS = `
  .hq-pd-wrapper { background: #fdfdfd; transition: background 0.3s ease; }
  .dark .hq-pd-wrapper { background: #0a0a0a; }

  .hq-pd-nav { padding:16px 24px; border-bottom:1px solid #f0f0f0; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; z-index:100; background:rgba(253,253,253,0.9); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); }
  .dark .hq-pd-nav { border-bottom-color:#222; background:rgba(10,10,10,0.9); }
  
  .hq-pd-btn-icon { background:none; border:none; color:#374151; cursor:pointer; display:flex; align-items:center; gap:8px; font-family:'Inter',sans-serif; font-size:14px; font-weight:500; }
  .dark .hq-pd-btn-icon { color:#d1d5db; }
  .hq-pd-btn-icon--fav { color:var(--hq-red,#FF5A5F) !important; }

  .hq-pd-section { opacity:0; transform:translateY(20px); transition:opacity 0.5s ease, transform 0.5s ease; }
  .hq-pd-visible  { opacity:1; transform:translateY(0); }
  .hq-pd-header   { width:100%; height:480px; overflow:hidden; border-radius:16px; display:grid; grid-template-columns:1fr 1fr; gap:8px;
                    opacity:0; transform:scale(1.02); transition:opacity 0.6s ease-out, transform 0.6s ease-out; }
  .hq-pd-header.hq-pd-header--in { opacity:1; transform:scale(1); }
  .hq-pd-header--single { grid-template-columns:1fr; }
  .hq-pd-photo { width:100%; height:100%; object-fit:cover; cursor:pointer; display:block; }
  .hq-pd-thumbs { display:grid; grid-template-rows:1fr 1fr; gap:8px; height:100%; overflow:hidden; }
  .hq-pd-price { font-family:'DM Mono','Courier New',monospace; font-size:28px; font-weight:500; color:var(--hq-red,#FF5A5F); margin:0 0 4px; }
  .hq-pd-title { font-family:'DM Serif Display',serif; font-size:32px; font-weight:400; color:var(--hq-dark,#222); margin:0; line-height:1.2; }
  .dark .hq-pd-title { color:var(--hq-dark,#f5f5f5); }
  .hq-pd-divider { border:none; border-top:1px solid #ebebeb; margin:24px 0; }
  .dark .hq-pd-divider { border-top-color:#2a2a2a; }
  .hq-pd-card { border:1px solid #dddddd; border-radius:16px; padding:28px; background:#fff; position:sticky; top:100px; }
  .dark .hq-pd-card { background:#1e1e1e; border-color:#333; }
  .hq-pd-cta { width:100%; padding:14px; background:var(--hq-red,#FF5A5F); color:#fff; border:none; border-radius:10px;
               font-family:'Inter',system-ui,sans-serif; font-size:16px; font-weight:600; cursor:pointer;
               transition:background 0.2s ease,transform 0.2s ease,box-shadow 0.2s ease; }
  .hq-pd-cta:hover { background:#e0494e; transform:translateY(-1px); box-shadow:0 6px 20px rgba(255,90,95,.35); }
  .hq-pd-cta:disabled { opacity:.6; cursor:not-allowed; }
  .hq-pd-outline { width:100%; margin-top:10px; padding:12px; background:transparent;
                   border:1px solid #222; border-radius:10px; font-family:'Inter',system-ui,sans-serif;
                   font-size:14px; font-weight:500; cursor:pointer; color:#222;
                   transition:background 0.2s ease,color 0.2s ease; }
  .dark .hq-pd-outline { border-color:#aaa; color:#ddd; }
  .hq-pd-outline:hover { background:#222; color:#fff; }
  .dark .hq-pd-outline:hover { background:#fff; color:#111; }
  .hq-pd-outline:disabled { opacity:.6; }
  .hq-pd-stat { text-align:center; padding:16px 8px; background:var(--hq-surface,#f7f7f7); border-radius:12px; }
  .dark .hq-pd-stat { background:#2a2a2a; }
  .hq-pd-stat-label { font-size:11px; text-transform:uppercase; letter-spacing:.06em; color:var(--hq-muted,#717171); font-family:'Inter',system-ui,sans-serif; margin:0 0 4px; }
  .hq-pd-stat-val { font-size:16px; font-weight:600; color:var(--hq-dark,#222); font-family:'Inter',system-ui,sans-serif; margin:0; }
  .dark .hq-pd-stat-val { color:#f5f5f5; }
  .hq-pd-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #f0f0f0; font-family:'Inter',system-ui,sans-serif; font-size:14px; }
  .dark .hq-pd-row { border-bottom-color:#2a2a2a; }
  .hq-pd-row-label { color:var(--hq-muted,#717171); }
  .hq-pd-row-val { font-weight:600; color:var(--hq-dark,#222); }
  .dark .hq-pd-row-val { color:#f5f5f5; }
  @media(max-width:768px){
    .hq-pd-header { height:260px; grid-template-columns:1fr; }
    .hq-pd-thumbs { display:none; }
    .hq-pd-layout { grid-template-columns:1fr !important; }
    .hq-pd-card   { position:static; }
    .hq-pd-title  { font-size:24px; }
  }
`;

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
  const [imgVisible, setImgVisible] = useState(false);
  const descRef   = useRef(null);
  const detailRef = useRef(null);
  const mapRef    = useRef(null);

  // Scroll-reveal via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('hq-pd-visible'); observer.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    [descRef, detailRef, mapRef].forEach((r) => { if (r.current) observer.observe(r.current); });
    return () => observer.disconnect();
  }, [property]);

  // Image header entrance
  useEffect(() => { if (property) { requestAnimationFrame(() => setImgVisible(true)); } }, [property]);

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


  if (loading) {
    return (
      <div className="hq-pd-wrapper" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <style>{PD_CSS}</style>
        <div className="text-center">
          <GooeyLoader message="Loading property details..." />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="hq-pd-wrapper" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <style>{PD_CSS}</style>
        <div className="text-center">
          <Home className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <h2 className="text-2xl font-display font-semibold mb-2 text-[#111] dark:text-white">{error || 'Property Not Found'}</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">This property is no longer available</p>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-2 rounded-lg transition bg-[#FF5A5F] text-white font-ui"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const allImages = property
    ? [property.image, ...(Array.isArray(property.images) ? property.images : [])].filter(Boolean)
    : [];
  const mainImg = allImages[0] || FALLBACK_IMG;
  const thumb1  = allImages[1] || null;
  const thumb2  = allImages[2] || null;



  return (
    <div className="hq-pd-wrapper" style={{ minHeight:'100vh' }}>
      <style>{PD_CSS}</style>

      {/* ── Top bar ──────────────────────────────────────────── */}
      <div className="hq-pd-nav" style={{ top:64 }}>
        <button onClick={() => navigate('/home')} className="hq-pd-btn-icon">
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display:'flex', gap:8 }}>
          <button className="hq-pd-btn-icon" style={{ padding: '8px' }} title="Share"><Share2 size={18} /></button>
          <button 
            onClick={isFavorite ? handleRemoveFromFavorites : handleAddToFavorites} 
            disabled={isSaving}
            className={`hq-pd-btn-icon ${isFavorite ? 'hq-pd-btn-icon--fav' : ''}`}
            style={{ padding: '8px', background: isFavorite?'rgba(255,90,95,.12)':'transparent', cursor: isSaving ? 'not-allowed' : 'pointer' }}>
            <Heart size={18} fill={isFavorite?'#FF5A5F':'none'} color={isFavorite?'#FF5A5F':undefined} />
          </button>
        </div>
      </div>

      {/* ── Photo header ─────────────────────────────────────── */}
      <div style={{ maxWidth:1120, margin:'0 auto', padding:'32px 24px 0' }}>
        <div className={`hq-pd-header${thumb1 ? '' : ' hq-pd-header--single'}${imgVisible ? ' hq-pd-header--in' : ''}`}>
          <img src={mainImg} alt={getPropertyField('title') || 'Property'} className="hq-pd-photo"
            onError={(e) => { e.target.src=FALLBACK_IMG; }} />
          {thumb1 && (
            <div className="hq-pd-thumbs">
              <img src={thumb1} alt="View 2" className="hq-pd-photo" onError={(e) => { e.target.src=FALLBACK_IMG; }} />
              {thumb2 && <img src={thumb2} alt="View 3" className="hq-pd-photo" onError={(e) => { e.target.src=FALLBACK_IMG; }} />}
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="hq-pd-layout" style={{ maxWidth:1120, margin:'0 auto', padding:'40px 24px', display:'grid', gridTemplateColumns:'1fr 380px', gap:48, alignItems:'start' }}>

        {/* ── LEFT COLUMN ── */}
        <div>
          {/* Title & location */}
          <div ref={descRef} className="hq-pd-section">
            <h1 className="hq-pd-title">{getPropertyField('title') || getPropertyField('name') || 'Property'}</h1>
            <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:16, color:'var(--hq-muted,#717171)', marginTop:6 }}>
              <MapPin size={14} style={{ display:'inline', marginRight:4, verticalAlign:'middle' }} />
              {getPropertyField('locality') || getPropertyField('location') || getPropertyField('address') || ''}
              {property.city ? ` · ${property.city}` : ''}
            </p>
            <hr className="hq-pd-divider" />

            {/* Stats row */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24 }}>
              <div className="hq-pd-stat"><p className="hq-pd-stat-label">Bedrooms</p><p className="hq-pd-stat-val">{getPropertyField('beds') || '—'}</p></div>
              <div className="hq-pd-stat"><p className="hq-pd-stat-label">Area</p><p className="hq-pd-stat-val">{getPropertyField('area') || '—'}</p></div>
              <div className="hq-pd-stat"><p className="hq-pd-stat-label">Type</p><p className="hq-pd-stat-val">{getPropertyField('type') || '—'}</p></div>
            </div>

            {/* Description */}
            {(getPropertyField('description') || getPropertyField('desc')) && (
              <div style={{ marginBottom:24 }}>
                <h2 style={{ fontFamily:'DM Serif Display,serif', fontSize:22, fontWeight:400, color:'var(--hq-dark,#222)', margin:'0 0 12px' }}>About this property</h2>
                <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:15, lineHeight:1.7, color:'var(--hq-muted,#717171)' }}>
                  {getPropertyField('description') || getPropertyField('desc')}
                </p>
              </div>
            )}
          </div>

          <hr className="hq-pd-divider" />

          {/* Details grid */}
          <div ref={detailRef} className="hq-pd-section" style={{ marginBottom:24 }}>
            <h2 style={{ fontFamily:'DM Serif Display,serif', fontSize:22, fontWeight:400, color:'var(--hq-dark,#222)', margin:'0 0 16px' }}>Property Details</h2>
            {[['Type', property.type], ['Location', property.location], ['City', property.city], ['Locality', property.locality], ['Bedrooms', property.beds], ['Area', property.area], ['Price per unit', property.pricePerUnit], ['Demand score', property.demand]]
              .filter(([, v]) => v)
              .map(([label, val]) => (
                <div key={label} className="hq-pd-row">
                  <span className="hq-pd-row-label">{label}</span>
                  <span className="hq-pd-row-val">{val}</span>
                </div>
              ))}
          </div>

          {/* Empty Map Section for scroll-reveal target if needed */}
          <div ref={mapRef} className="hq-pd-section"></div>
        </div>

        {/* ── RIGHT COLUMN — sticky card ── */}
        <div>
          <div className="hq-pd-card">
            {/* Price */}
            <p className="hq-pd-price">{getPropertyField('price') || getPropertyField('pricePerUnit') || 'Contact for price'}</p>
            <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:13, color:'var(--hq-muted,#717171)', marginBottom:20 }}>
              {property.type}{property.area ? ` · ${property.area}` : ''}
            </p>

            {/* Primary CTA */}
            <button onClick={handleMakePayment} disabled={isPaying} className="hq-pd-cta">
              {isPaying ? 'Initiating…' : 'Make Payment'}
            </button>

            {/* Chat CTA */}
            <button onClick={handleContactAgentClick} className="hq-pd-outline">
              Chat with Assistant
            </button>

            {/* Shortlist */}
            <button onClick={isFavorite ? handleRemoveFromFavorites : handleAddToFavorites}
              disabled={isSaving} className="hq-pd-outline"
              style={{ marginTop:10, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <Heart size={15} fill={isFavorite?'currentColor':'none'} />
              {isFavorite ? 'Remove from Shortlist' : 'Save to Shortlist'}
            </button>

            {/* Summary rows */}
            <div style={{ marginTop:24, paddingTop:20, borderTop:`1px solid ${isDarkMode?'#2a2a2a':'#ebebeb'}` }}>
              {[['Price', property.price], ['Type', property.type], ['Bedrooms', property.beds], ['Area', property.area]]
                .filter(([, v]) => v)
                .map(([label, val]) => (
                  <div key={label} className="hq-pd-row">
                    <span className="hq-pd-row-label">{label}</span>
                    <span className="hq-pd-row-val">{val}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Popup (Global to this page) */}
      <PropertyChatBot 
        property={property} 
        isOpen={showAssistant} 
        onClose={() => setShowAssistant(false)}
        onDealClosed={(deal) => { console.log('Deal closed via assistant', deal); setShowAssistant(false); }} 
      />
    </div>
  );
}

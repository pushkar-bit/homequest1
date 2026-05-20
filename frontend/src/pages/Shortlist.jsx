import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoritesAPI, getPropertyById, authAPI } from '../services/api';
import { favoritesStorage } from '../services/favoritesStorage';
import PropertyCard from '../components/PropertyCard';

/* ── Scoped CSS ─────────────────────────────────────────────── */
const CSS = `
  .sl-wrapper { background: #fdfdfd; transition: background 0.3s ease; }
  .dark .sl-wrapper { background: #0a0a0a; }

  .sl-hero { padding:60px 24px; text-align:center; }
  
  .sl-title { font-family:'DM Serif Display',serif; font-size:clamp(28px,5vw,42px); color:#111111; font-weight:400; margin:0 0 8px; }
  .dark .sl-title { color:#fff; }
  
  .sl-sub   { font-family:'Inter',system-ui,sans-serif; font-size:16px; color:rgba(0,0,0,0.65); margin:0; }
  .dark .sl-sub { color:rgba(255,255,255,.65); }
  
  .sl-empty-title { font-family:'DM Serif Display',serif; font-size:28px; font-weight:400; color:#111111; margin:0 0 12px; }
  .dark .sl-empty-title { color:#ffffff; }
  
  .sl-empty-sub { font-family:'Inter',system-ui,sans-serif; font-size:16px; color:rgba(0,0,0,0.65); margin:0 0 28px; line-height:1.6; }
  .dark .sl-empty-sub { color:rgba(255,255,255,0.65); }
  
  .sl-grid  { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:24px; }
  .sl-empty { animation:fadeInUp .6s ease forwards; text-align:center; margin:80px auto; max-width:480px; }
  .sl-cta {
    display:inline-block; background:var(--hq-red,#FF5A5F); color:#fff;
    border-radius:99px; padding:14px 32px; font-size:15px; font-weight:600;
    font-family:'Inter',system-ui,sans-serif; border:none; cursor:pointer;
    text-decoration:none; transition:transform .2s ease,box-shadow .2s ease;
  }
  .sl-cta:hover { transform:scale(1.03) translateY(-1px); box-shadow:0 8px 24px rgba(255,90,95,.35); }
  .sl-rm-btn {
    position:absolute; top:10px; right:46px; z-index:5;
    width:30px; height:30px; border-radius:50%; border:none; cursor:pointer;
    background:rgba(255,90,95,.9); color:#fff;
    display:flex; align-items:center; justify-content:center;
    transition:transform .2s ease,background .2s ease;
    box-shadow:0 2px 8px rgba(0,0,0,.2);
  }
  .sl-rm-btn:hover { transform:scale(1.1); background:var(--hq-red,#FF5A5F); }
  .sl-spin {
    width:40px; height:40px; border-radius:50%;
    border:3px solid #eee; border-top-color:var(--hq-red,#FF5A5F);
    animation:spin .8s linear infinite; margin:0 auto;
  }
  @keyframes spin { to{transform:rotate(360deg)} }
`;

/* ── Empty-state house SVG ──────────────────────────────────── */
const HouseSVG = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom:20 }}>
    <path d="M10 38L40 12L70 38" stroke="#dddddd" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 33V64H64V33" stroke="#dddddd" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="30" y="46" width="20" height="18" rx="2" stroke="#dddddd" strokeWidth="3" strokeLinecap="round"/>
    <path d="M55 22V14H63V30" stroke="#dddddd" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Shortlist() {
  /* ── All original state (unchanged) ── */
  const [favorites,  setFavorites]  = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [isDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode ? savedMode === 'dark' : true;
  });
  const navigate = useNavigate();

  useEffect(() => { fetchFavorites(); }, []);

  /* ── fetchFavorites (unchanged logic) ── */
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError('');
      let favoritesList = [];
      const isAuthenticated = authAPI.isAuthenticated();

      if (isAuthenticated) {
        try {
          const result = await favoritesAPI.getFavorites();
          if (result.success && result.data) favoritesList = result.data;
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
            return { ...res.data, favoriteId: favoritesList[idx].id };
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

  /* ── handleRemoveFavorite (unchanged logic) ── */
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

  /* ── Loading state ── */
  if (loading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <style>{CSS}</style>
        <div className="sl-spin" />
      </div>
    );
  }

  return (
    <div className="sl-wrapper" style={{ minHeight:'100vh' }}>
      <style>{CSS}</style>

      {/* ── Hero header ── */}
      <div className="sl-hero">
        <h1 className="sl-title">Your shortlist</h1>
        <p className="sl-sub">
          {properties.length > 0
            ? `${properties.length} saved ${properties.length === 1 ? 'property' : 'properties'}`
            : 'Homes you love, saved in one place'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{ maxWidth:1200, margin:'24px auto', padding:'0 24px' }}>
          <div style={{ background:'rgba(255,90,95,.08)', border:'1px solid rgba(255,90,95,.3)', borderRadius:12, padding:'12px 18px', color:'var(--hq-red,#FF5A5F)', fontFamily:'Inter,system-ui,sans-serif', fontSize:14 }}>
            {error}
          </div>
        </div>
      )}

      {/* ── Grid or empty state ── */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'40px 24px' }}>
        {properties.length === 0 ? (
          <div className="sl-empty">
            <HouseSVG />
            <h2 className="sl-empty-title">
              No saved properties yet
            </h2>
            <p className="sl-empty-sub">
              {authAPI.isAuthenticated()
                ? 'Start exploring and shortlist homes you love.'
                : 'Create an account to save favourites across devices.'}
            </p>
            {authAPI.isAuthenticated() ? (
              <button className="sl-cta" onClick={() => navigate('/home')}>Browse Properties</button>
            ) : (
              <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                <button className="sl-cta" style={{ background:'#222' }} onClick={() => navigate('/login')}>Login</button>
                <button className="sl-cta" onClick={() => navigate('/signup')}>Sign Up</button>
              </div>
            )}
          </div>
        ) : (
          <div className="sl-grid">
            {properties.map((property, index) => (
              <div key={property.favoriteId || property.id} style={{ position:'relative' }}>
                <PropertyCard
                  property={property}
                  isDarkMode={isDarkMode}
                  onAddToFavorites={() => {}}
                  style={{
                    opacity: 0,
                    animation: 'fadeInUp 0.5s ease forwards',
                    animationDelay: `${index * 0.07}s`,
                  }}
                />
                {/* Remove button */}
                <button
                  className="sl-rm-btn"
                  onClick={() => handleRemoveFavorite(property.id || property.title, property.favoriteId || property.id)}
                  title="Remove from shortlist"
                  aria-label="Remove from shortlist"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

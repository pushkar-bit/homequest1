import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Share2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI, favoritesAPI } from '../services/api';
import { favoritesStorage } from '../services/favoritesStorage';
import { sessionStorage } from '../services/sessionStorage';
import { GooeyLoader } from './GooeyLoader';

/* Inline SVG fallback — no network dependency */
const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f5f5f5'/%3E%3Cg fill='none' stroke='%23dddddd' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M160 185 L160 145 L200 112 L240 145 L240 185 Z'/%3E%3Crect x='183' y='158' width='34' height='27' rx='2'/%3E%3C/g%3E%3Ctext x='200' y='215' text-anchor='middle' fill='%23cccccc' font-family='sans-serif' font-size='13'%3ENo Image%3C/text%3E%3C/svg%3E";

/* ─── Scoped styles ─────────────────────────────────────────────────────── */
const CSS = `
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }

  /* ── Card shell ─────────────────────────────────────────────── */
  .hq-card {
    width: 100%;
    border-radius: 16px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: none;
    cursor: pointer;
    position: relative;
    transition:
      transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      box-shadow 0.3s ease;
  }

  .dark .hq-card {
    background: #1e1e1e;
  }

  .hq-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.13);
  }

  .dark .hq-card:hover {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  }

  .hq-card--deleted {
    opacity: 0.6;
    pointer-events: none;
  }

  /* ── Image area ─────────────────────────────────────────────── */
  .hq-card__img-wrap {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: #f0f0f0;
  }

  .dark .hq-card__img-wrap {
    background: #2a2a2a;
  }

  .hq-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }

  .hq-card:hover .hq-card__img {
    transform: scale(1.06);
  }

  /* Shimmer skeleton */
  .hq-card__shimmer {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 800px 100%;
    animation: shimmer 1.4s infinite linear;
  }

  .dark .hq-card__shimmer {
    background: linear-gradient(
      90deg,
      #2a2a2a 25%,
      #333333 50%,
      #2a2a2a 75%
    );
    background-size: 800px 100%;
  }

  /* No-image placeholder */
  .hq-card__no-img {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    color: #b0b0b0;
  }

  /* ── Type badge (top-left) ──────────────────────────────────── */
  .hq-card__type-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(0, 0, 0, 0.50);
    color: #ffffff;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 11px;
    font-weight: 500;
    border-radius: 6px;
    padding: 4px 10px;
    letter-spacing: 0.02em;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    pointer-events: none;
    z-index: 2;
  }

  /* ── Favourite button (top-right) ───────────────────────────── */
  .hq-card__fav-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
    transition: transform 0.2s ease, background 0.2s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }

  .hq-card__fav-btn:hover {
    transform: scale(1.1);
  }

  .dark .hq-card__fav-btn {
    background: rgba(30, 30, 30, 0.85);
  }

  /* ── Deleted overlay ────────────────────────────────────────── */
  .hq-card__deleted-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.40);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hq-card__deleted-label {
    background: #FF5A5F;
    color: #fff;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 6px 16px;
    border-radius: 8px;
  }

  /* ── Details area ───────────────────────────────────────────── */
  .hq-card__body {
    padding: 14px 16px 16px;
  }

  /* Price */
  .hq-card__price {
    font-family: 'DM Mono', 'Courier New', monospace;
    font-size: 18px;
    font-weight: 500;
    color: var(--hq-red, #FF5A5F);
    line-height: 1.2;
    margin: 0;
  }

  /* Title / locality */
  .hq-card__title {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--hq-dark, #222222);
    margin: 4px 0 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
  }

  .dark .hq-card__title {
    color: var(--hq-dark, #f5f5f5);
  }

  /* City + area */
  .hq-card__location {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 12px;
    color: var(--hq-muted, #717171);
  }

  /* ── Bottom badges row ──────────────────────────────────────── */
  .hq-card__badges {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(0,0,0,0.06);
  }

  .dark .hq-card__badges {
    border-top-color: rgba(255,255,255,0.07);
  }

  .hq-card__badge {
    background: #f7f7f7;
    color: #555;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 11px;
    font-weight: 500;
    border-radius: 99px;
    padding: 3px 10px;
    line-height: 1.6;
    white-space: nowrap;
  }

  .dark .hq-card__badge {
    background: #2a2a2a;
    color: #aaa;
  }

  /* ── Action row ─────────────────────────────────────────────── */
  .hq-card__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
  }

  .hq-card__view-btn {
    flex: 1;
    padding: 9px 16px;
    border-radius: 10px;
    border: none;
    background: var(--hq-red, #FF5A5F);
    color: #fff;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--hq-transition, all 0.3s ease);
    box-shadow: 0 2px 8px rgba(255, 90, 95, 0.28);
  }

  .hq-card__view-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(255, 90, 95, 0.38);
  }

  .hq-card__icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    border: 1px solid rgba(0,0,0,0.1);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease;
    color: var(--hq-muted, #717171);
    flex-shrink: 0;
  }

  .dark .hq-card__icon-btn {
    border-color: rgba(255,255,255,0.1);
    color: #aaa;
  }

  .hq-card__icon-btn:hover {
    background: rgba(255, 90, 95, 0.06);
    border-color: rgba(255, 90, 95, 0.3);
    color: var(--hq-red, #FF5A5F);
  }
`;

export default function PropertyCard({ property, onAddToFavorites, onDelete, isDarkMode = true, style }) {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const isAuthenticated = authAPI.isAuthenticated();
  const currentUser = authAPI.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const isDeleted = isAdmin && sessionStorage.isPropertyDeleted(property.id);

  /* ── Favourite init (unchanged) ── */
  useEffect(() => {
    const propertyId = property.id || property.title;
    setIsFavorited(favoritesStorage.isFavorited(propertyId));
  }, [property]);

  /* ── Field helpers (unchanged) ── */
  const getPropertyField = (field, fallback = 'N/A') =>
    property[field] || property[field.toLowerCase()] || fallback;

  let propertyImage    = property.image || property.images?.[0] || property.photo || null;
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  if (propertyImage && propertyImage.startsWith('uploads/')) {
    propertyImage = `${API_BASE_URL}/${propertyImage}`;
  } else if (propertyImage && propertyImage.startsWith('/uploads')) {
    propertyImage = `${API_BASE_URL}${propertyImage}`;
  }
  
  const propertyPrice    = getPropertyField('price', property.pricePerUnit);
  const propertyTitle    = getPropertyField('title', getPropertyField('name', property.type && property.locality ? `${property.type} in ${property.locality}` : 'Property Listed'));
  const propertyLocation = getPropertyField('location', getPropertyField('address', property.locality || property.city || 'N/A'));
  const propertyArea     = getPropertyField('area', property.size);
  const propertyType     = getPropertyField('type', '');
  const propertyCity     = property.city || '';

  /* ── Handlers (unchanged logic) ── */
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
        const favorite = favorites.find((f) => f.propertyId === (property.id || property.title));
        if (favorite) {
          await favoritesAPI.removeFavorite(favorite.id);
          setIsFavorited(false);
        }
      } else {
        await favoritesAPI.addFavorite(property.id || property.title);
        setIsFavorited(true);
      }
      if (onAddToFavorites) onAddToFavorites(property);
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

  const formattedPrice =
    typeof propertyPrice === 'number'
      ? `₹${propertyPrice.toLocaleString()}`
      : propertyPrice;

  const formattedArea =
    typeof propertyArea === 'number' ? `${propertyArea} sqft` : propertyArea;

  return (
    <>
      <style>{CSS}</style>

      <div
        onClick={handleCardClick}
        className={`hq-card${isDeleted ? ' hq-card--deleted' : ''}`}
        style={style}
      >
        {/* ── Deleted overlay ── */}
        {isDeleted && (
          <div className="hq-card__deleted-overlay">
            <span className="hq-card__deleted-label">Deleted (Temporary)</span>
          </div>
        )}

        {/* ── Image area ── */}
        <div className="hq-card__img-wrap">
          {/* Loader until image loads */}
          {!imgLoaded && propertyImage && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, background: isDarkMode ? '#2a2a2a' : '#f0f0f0' }}>
              <GooeyLoader />
            </div>
          )}
          {!imgLoaded && !propertyImage && <div className="hq-card__shimmer" />}

          {propertyImage ? (
            <img
              src={propertyImage}
              alt={propertyTitle}
              className="hq-card__img"
              style={{ display: imgLoaded ? 'block' : 'none' }}
              onLoad={() => setImgLoaded(true)}
              onError={(e) => {
                e.target.src = FALLBACK_IMG;
                setImgLoaded(true);
              }}
            />
          ) : (
            <div className="hq-card__no-img">No Image Available</div>
          )}

          {/* Type badge */}
          {propertyType && (
            <span className="hq-card__type-badge">{propertyType}</span>
          )}

          {/* Favourite button */}
          <button
            onClick={handleFavoriteClick}
            className="hq-card__fav-btn"
            aria-label={isFavorited ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Heart
              size={16}
              strokeWidth={2}
              style={{
                color: isFavorited ? '#FF5A5F' : '#888',
                fill: isFavorited ? '#FF5A5F' : 'none',
                transition: 'color 0.2s ease, fill 0.2s ease',
              }}
            />
          </button>
        </div>

        {/* ── Details area ── */}
        <div className="hq-card__body">
          {/* Price */}
          {propertyPrice && propertyPrice !== 'N/A' && (
            <p className="hq-card__price">{formattedPrice}</p>
          )}

          {/* Title / locality */}
          <p className="hq-card__title" title={propertyTitle}>
            {propertyTitle !== 'N/A' ? propertyTitle : propertyLocation}
          </p>

          {/* City + area */}
          {(propertyCity || propertyLocation) && (
            <div className="hq-card__location">
              <MapPin size={11} strokeWidth={2} style={{ flexShrink: 0, color: 'var(--hq-muted,#717171)' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {[propertyCity, propertyLocation !== 'N/A' ? propertyLocation : null].filter(Boolean).join(' · ')}
              </span>
            </div>
          )}

          {/* Pill badges */}
          <div className="hq-card__badges">
            {propertyType && <span className="hq-card__badge">{propertyType}</span>}
            {formattedArea && formattedArea !== 'N/A' && (
              <span className="hq-card__badge">{formattedArea}</span>
            )}
            {(property.beds || property.bedrooms) && (
              <span className="hq-card__badge">{property.beds || property.bedrooms} Beds</span>
            )}
            {property.demand > 0 && (
              <span className="hq-card__badge" style={{ color: 'var(--hq-red,#FF5A5F)', background: 'rgba(255,90,95,0.1)' }}>
                🔥 {property.demand}% demand
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="hq-card__actions">
            <button onClick={handleCardClick} className="hq-card__view-btn">
              View Details
            </button>

            {isAdmin && (
              <button
                onClick={handleDelete}
                className="hq-card__icon-btn"
                title="Delete Property"
                aria-label="Delete property"
              >
                <Trash2 size={15} strokeWidth={2} />
              </button>
            )}

            <button
              onClick={(e) => { e.stopPropagation(); }}
              className="hq-card__icon-btn"
              aria-label="Share property"
            >
              <Share2 size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { fetchProperties, fetchAllProperties } from '../services/propertyAPI';
import Pagination from '../components/Pagination';
import { Calculator, TrendingUp, DollarSign, Ruler, Navigation } from 'lucide-react';

const HERO_CSS = `
  @keyframes heroReveal {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hq-hero {
    position: relative;
    height: 100vh;
    margin-top: -64px;
    background: url('/hero-bg-light.png') center/cover no-repeat;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .hq-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(253, 253, 253, 0.95) 0%, rgba(253, 253, 253, 0.6) 50%, transparent 100%);
    z-index: 1;
  }
  .dark .hq-hero { 
    background: url('/hero-bg-dark.png') center/cover no-repeat; 
  }
  .dark .hq-hero::before {
    background: linear-gradient(to right, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.6) 50%, transparent 100%);
  }

  .hq-hero__body {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 48px;
  }
  .hq-hero__eyebrow,
  .hq-hero__headline-line1,
  .hq-hero__headline-accent,
  .hq-hero__sub,
  .hq-hero__search { opacity: 0; }
  .hq-hero__body--visible .hq-hero__eyebrow         { animation: heroReveal 0.6s ease 0.10s forwards; }
  .hq-hero__body--visible .hq-hero__headline-line1  { animation: heroReveal 0.6s ease 0.25s forwards; }
  .hq-hero__body--visible .hq-hero__headline-accent { animation: heroReveal 0.6s ease 0.40s forwards; }
  .hq-hero__body--visible .hq-hero__sub             { animation: heroReveal 0.6s ease 0.55s forwards; }
  .hq-hero__body--visible .hq-hero__search          { animation: heroReveal 0.6s ease 0.70s forwards; }
  
  .hq-hero__eyebrow {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(0,0,0,0.4);
    margin-bottom: 24px;
  }
  .dark .hq-hero__eyebrow { color: rgba(255,255,255,0.4); }

  .hq-hero__headline { display: block; margin: 0; }
  
  .hq-hero__headline-line1 {
    display: block;
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(56px, 9vw, 110px);
    line-height: 0.95;
    font-weight: 400;
    color: #111111;
  }
  .dark .hq-hero__headline-line1 { color: #ffffff; }

  .hq-hero__headline-accent {
    display: block;
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(56px, 9vw, 110px);
    line-height: 0.95;
    font-weight: 400;
    color: #FF5A5F;
    font-style: italic;
  }
  
  .hq-hero__sub {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 18px;
    color: rgba(0,0,0,0.65);
    margin: 16px 0 0;
    font-weight: 400;
    line-height: 1.5;
    max-width: 520px;
  }
  .dark .hq-hero__sub { color: rgba(255,255,255,0.55); }

  .hq-hero__search { margin-top: 48px; }
  
  .hq-hero__loc-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.85rem;
    padding: 0.5rem 1.2rem;
    border-radius: 8px;
    background: rgba(0,0,0,0.04);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(0,0,0,0.1);
    color: #333;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.25s ease, transform 0.25s ease;
  }
  .dark .hq-hero__loc-btn {
    background: rgba(255,255,255,0.14);
    border: 1px solid rgba(255,255,255,0.28);
    color: #fff;
  }
  .hq-hero__loc-btn:hover:not(:disabled) {
    background: rgba(0,0,0,0.08);
    transform: translateY(-1px);
  }
  .dark .hq-hero__loc-btn:hover:not(:disabled) { background: rgba(255,255,255,0.24); }
  .hq-hero__loc-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  
  .hq-hero__error {
    margin-top: 0.6rem;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    color: rgba(200,0,0,0.95);
    font-weight: 500;
  }
  .dark .hq-hero__error { color: rgba(255,190,190,0.95); }
  
  @media (max-width: 768px) {
    .hq-hero__body { padding: 0 24px; }
  }
`;

export default function Home() {
  const navigate = useNavigate();
  const [trendingProperties, setTrendingProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchParams, setSearchParams] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [geoLoading, setGeoLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode ? savedMode === 'dark' : true;
  });
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    window.addEventListener('storage', handleThemeChange);
    return () => window.removeEventListener('storage', handleThemeChange);
  }, []);

  // Trigger hero entrance animations on first mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setHeroVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  
  

  
  const handleSearch = async (searchData) => {
    try {
      setLoading(true);
      setError('');
      setPage(1);
      setSearchParams({ city: searchData.city, type: searchData.type, priceRange: searchData.priceRange });
      
      const res = await fetchProperties({ city: searchData.city, type: searchData.type, page: 1, pageSize, sortBy });
      if (res.success) {
        setTrendingProperties(res.data || []);
        setTotal(res.total || 0);
      } else {
        setTrendingProperties([]);
        setTotal(0);
        setError('No properties found');
      }
    } catch (err) {
      setError('Failed to process search results');
      console.error('Error:', err);
      setTrendingProperties([]);
    } finally { setLoading(false); }
  };

  
  const handleUseMyLocation = () => {
    setGeoLoading(true);
    setError('');

    // Shared: given lat/lon, reverse geocode and fetch properties
    const resolveCity = async (latitude, longitude) => {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
      const resp = await fetch(url, { headers: { 'Accept': 'application/json', 'Accept-Language': 'en' } });
      if (!resp.ok) throw new Error(`Reverse geocode failed (${resp.status})`);
      const data = await resp.json();
      const address = data.address || {};
      return address.city || address.town || address.village || address.municipality ||
             address.county || address.city_district || address.state_district ||
             address.state || address.region || null;
    };

    // Shared: given a city string, update search state
    const applyCity = async (city) => {
      if (!city) {
        setError('Could not determine your city. Showing all properties.');
        const all = await fetchAllProperties(1, pageSize, sortBy);
        if (all.success) { setTrendingProperties(all.data || []); setTotal(all.total || 0); }
        return;
      }
      setSearchParams({ city, type: '', priceRange: null });
      setPage(1);
      try {
        const res = await fetchProperties({ city, page: 1, pageSize, sortBy });
        if (res.success) { setTrendingProperties(res.data || []); setTotal(res.total || 0); }
        else {
          const all = await fetchAllProperties(1, pageSize, sortBy);
          if (all.success) { setTrendingProperties(all.data || []); setTotal(all.total || 0); }
        }
      } catch {
        const all = await fetchAllProperties(1, pageSize, sortBy);
        if (all.success) { setTrendingProperties(all.data || []); setTotal(all.total || 0); }
      }
    };

    // IP-geolocation fallback — tries ip-api.com first, then freeipapi.com
    const ipFallback = async () => {
      try {
        // Primary: ip-api.com (CORS-enabled, no key, generous free tier)
        let city = null;
        try {
          const r = await fetch('https://ip-api.com/json/?fields=city,regionName,status');
          if (r.ok) {
            const d = await r.json();
            if (d.status === 'success') city = d.city || d.regionName || null;
          }
        } catch { /* try next */ }

        // Secondary fallback: freeipapi.com
        if (!city) {
          try {
            const r2 = await fetch('https://freeipapi.com/api/json');
            if (r2.ok) {
              const d2 = await r2.json();
              city = d2.cityName || d2.regionName || null;
            }
          } catch { /* give up */ }
        }

        await applyCity(city);
      } catch {
        setError('Could not detect location. Please enter your city manually.');
      } finally {
        setGeoLoading(false);
      }
    };

    // Try browser geolocation first
    if (!navigator?.geolocation) {
      // No browser geo support — go straight to IP fallback
      ipFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const city = await resolveCity(latitude, longitude);
          await applyCity(city);
        } catch (err) {
          console.error('Reverse geocode error', err);
          // Reverse geocode failed — try IP fallback before giving up
          await ipFallback();
          return;
        }
        setGeoLoading(false);
      },
      async (err) => {
        console.warn('Browser geolocation error', err.code, err.message);
        if (err.code === 1) {
          // User explicitly denied — don't silently fall back
          setError('Location permission denied. Please allow access or enter your city manually.');
          setGeoLoading(false);
        } else {
          // Code 2 (unavailable) or 3 (timeout) — use IP fallback silently
          await ipFallback();
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  };

  
  // Properties are already sorted by backend, no need for client-side sorting

  
  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      try {
        if (searchParams) {
          
          const res = await fetchProperties({ city: searchParams.city, type: searchParams.type, page, pageSize, sortBy });
          if (res.success) {
            setTrendingProperties(res.data || []);
            setTotal(res.total || 0);
          }
        } else {
          
          const response = await fetchAllProperties(page, pageSize, sortBy);
          if (response.success) {
            setTrendingProperties(response.data || []);
            setTotal(response.total || 0);
          }
        }
      } catch (err) {
        console.error('Error loading page:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortBy, searchParams?.city, searchParams?.type]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <style>{HERO_CSS}</style>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="hq-hero">
        <div className={`hq-hero__body${heroVisible ? ' hq-hero__body--visible' : ''}`}>
          {/* Eyebrow */}
          <div className="hq-hero__eyebrow">01 — FIND YOUR HOME</div>
          {/* Giant headline — split for staggered reveal */}
          <div className="hq-hero__headline">
            <span className="hq-hero__headline-line1">Find your perfect</span>
            <span className="hq-hero__headline-accent">home.</span>
          </div>
          {/* Subheadline */}
          <p className="hq-hero__sub">
            Explore thousands of verified listings across India's top cities.
          </p>
          {/* Search + location — all logic unchanged */}
          <div className="hq-hero__search">
            <SearchBar onSearch={handleSearch} />
            <div>
              <button
                onClick={handleUseMyLocation}
                disabled={geoLoading}
                className="hq-hero__loc-btn"
                title="Find properties near me"
              >
                <Navigation size={15} />
                {geoLoading ? 'Detecting…' : 'Use my location'}
              </button>
            </div>
            {error && <div className="hq-hero__error">{error}</div>}
          </div>
        </div>
      </section>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 pt-16">
        <button 
          onClick={() => navigate('/tools/budget-calculator')}
          className="group p-8 bg-white dark:bg-gray-900 rounded-2xl hover:shadow-lg transition-all duration-300 text-left border border-gray-200 dark:border-gray-800 hover:border-red-400 dark:hover:border-red-500 hover:-translate-y-1"
          style={{boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'}}
        >
          <DollarSign className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" style={{color: '#DC143C'}} />
          <h3 className="font-semibold text-lg mb-2" style={{color: '#DC143C'}}>Budget Calculator</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Calculate your home budget</p>
        </button>

        <button 
          onClick={() => navigate('/tools/emi-calculator')}
          className="group p-8 bg-white dark:bg-gray-900 rounded-2xl hover:shadow-lg transition-all duration-300 text-left border border-gray-200 dark:border-gray-800 hover:border-red-400 dark:hover:border-red-500 hover:-translate-y-1"
          style={{boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'}}
        >
          <Calculator className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" style={{color: '#DC143C'}} />
          <h3 className="font-semibold text-lg mb-2" style={{color: '#DC143C'}}>EMI Calculator</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Calculate monthly EMI</p>
        </button>
        <button 
          onClick={() => navigate('/tools/loan-eligibility')}
          className="group p-8 bg-white dark:bg-gray-900 rounded-2xl hover:shadow-lg transition-all duration-300 text-left border border-gray-200 dark:border-gray-800 hover:border-red-400 dark:hover:border-red-500 hover:-translate-y-1"
          style={{boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'}}
        >
          <TrendingUp className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" style={{color: '#DC143C'}} />
          <h3 className="font-semibold text-lg mb-2" style={{color: '#DC143C'}}>Loan Eligibility</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Check loan eligibility</p>
        </button>

        <button 
          onClick={() => navigate('/tools/area-converter')}
          className="group p-8 bg-white dark:bg-gray-900 rounded-2xl hover:shadow-lg transition-all duration-300 text-left border border-gray-200 dark:border-gray-800 hover:border-red-400 dark:hover:border-red-500 hover:-translate-y-1"
          style={{boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'}}
        >
          <Ruler className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" style={{color: '#DC143C'}} />
          <h3 className="font-semibold text-lg mb-2" style={{color: '#DC143C'}}>Area Converter</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Convert area units</p>
        </button>
      </div>
      </div>

      {/* Properties Section */}
      <div className="relative z-10 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 md:mb-12 bg-white/90 dark:bg-gray-900/90 p-6 rounded-xl shadow-lg backdrop-blur-sm">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-red-600 dark:text-red-500">
                {searchParams ? (
                  <>
                    Properties in {searchParams.city}
                    {searchParams.type && ` - ${searchParams.type}`}
                  </>
                ) : (
                  'Trending Properties'
                )}
              </h2>
              <p className="text-sm md:text-base text-gray-900 dark:text-gray-100 font-medium">
                {searchParams 
                  ? `Found ${trendingProperties.length} properties on this page` 
                  : 'Most sought-after properties across major cities'}
              </p>
            </div>
            
            {}
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold hidden md:inline text-gray-900 dark:text-gray-100">
                Sort by:
              </label>
              <select 
                value={sortBy} 
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1); // Reset to page 1 when sort changes
                }}
                className="px-4 py-2.5 rounded-lg outline-none text-sm cursor-pointer font-medium bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 shadow-md hover:shadow-lg transition"
              >
                <option value="newest">Newest</option>
                <option value="highDemand">High Demand</option>
                <option value="priceLowHigh">Price: Low to High</option>
              </select>
            </div>
          </div>

          {}
          {error && (
            <div className="mb-8 p-4 md:p-5 border border-red-500 rounded-lg flex items-start gap-3 bg-white dark:bg-black" style={{color: '#DC143C'}}>
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm md:text-base">{error}</span>
            </div>
          )}

          {}
          {loading && (
            <div className="flex justify-center items-center py-16 md:py-20">
              <div className="w-12 h-12 rounded-full animate-spin border-2 border-gray-300 dark:border-gray-700" style={{borderTopColor: '#DC143C'}} />
            </div>
          )}

          {}
          {!loading && trendingProperties.length > 0 ? (
            <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}>
              {trendingProperties.map((property, index) => (
                <PropertyCard 
                  key={property.id || property.title} 
                  property={property}
                  isDarkMode={isDarkMode}
                  onAddToFavorites={() => console.log('Added to favorites:', property.id)}
                  style={{
                    opacity: 0,
                    animation: `fadeInUp 0.6s ease forwards`,
                    animationDelay: `${index * 0.07}s`,
                  }}
                />
              ))}
            </div>
              <div className="mt-6">
                <Pagination page={page} setPage={setPage} total={total} pageSize={pageSize} />
              </div>
            </>
          ) : (
            !loading && (
              <div className={`text-center py-16 md:py-20 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                <div className={`inline-flex p-4 rounded-full mb-4 ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
                  <svg className={`w-8 h-8 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-lg font-light">
                  No properties found. Try adjusting your search filters.
                </p>
              </div>
            )
          )}

          {}
          {!loading && trendingProperties.length > 0 && (
            <div className={`text-center mt-10 md:mt-12 pt-8 md:pt-10 ${isDarkMode ? 'border-t border-slate-800' : 'border-t border-gray-200'}`}>
              <p className={`text-sm md:text-base ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Showing <span className="font-semibold" style={{color: '#DC143C'}}>{trendingProperties.length}</span> of <span className="font-semibold" style={{color: '#DC143C'}}>{total}</span> properties
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { fetchProperties, fetchAllProperties } from '../services/propertyAPI';
import Pagination from '../components/Pagination';
import { Calculator, TrendingUp, DollarSign, Ruler, Navigation } from 'lucide-react';
import DottedSurface from '../components/DottedSurface';

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

  
  useEffect(() => {
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    window.addEventListener('storage', handleThemeChange);
    return () => window.removeEventListener('storage', handleThemeChange);
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
    if (!navigator?.geolocation) {
      setError('Geolocation not supported in this browser');
      return;
    }

    setGeoLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;

        
        
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
        const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!resp.ok) throw new Error(`Reverse geocode failed (${resp.status})`);
        const data = await resp.json();

        const address = data.address || {};
        
        const city = address.city || address.town || address.village || address.municipality || address.county || address.city_district || address.state_district || address.state || address.region;
        

        if (city) {
          
          setSearchParams({ city, type: '', priceRange: null });
          setPage(1);
          try {
            const res = await fetchProperties({ city, page: 1, pageSize, sortBy });
            if (res.success) {
              setTrendingProperties(res.data || []);
              setTotal(res.total || 0);
            } else {
              
              const all = await fetchAllProperties(1, pageSize, sortBy);
              if (all.success) {
                setTrendingProperties(all.data || []);
                setTotal(all.total || 0);
              }
            }
          } catch (err) {
            console.error('Error fetching properties for detected city', err);
            const all = await fetchAllProperties(1, pageSize, sortBy);
            if (all.success) {
              setTrendingProperties(all.data || []);
              setTotal(all.total || 0);
            }
          }
        } else {
          
          const display = data.display_name || '';
          console.warn('City not found in address fields, display_name:', display);
          setError('Could not determine your city from location. Showing all properties.');
          const all = await fetchAllProperties(1, pageSize, sortBy);
          if (all.success) {
            setTrendingProperties(all.data || []);
            setTotal(all.total || 0);
          }
        }
      } catch (err) {
        console.error('Reverse geocode error', err);
        setError('Failed to detect location. Please try again.');
      } finally {
        setGeoLoading(false);
      }
    }, (err) => {
      console.warn('Geolocation error', err);
      setGeoLoading(false);
      if (err.code === 1) setError('Location permission denied');
      else setError('Failed to get location');
    }, { enableHighAccuracy: true, timeout: 10000 });
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
    <div 
      className="relative min-h-screen pt-24 pb-8"
      style={{
        backgroundImage: 'url(https://i.pinimg.com/736x/23/54/28/235428edab13bf6073c973c15a88bf03.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {}
      <DottedSurface isDarkMode={isDarkMode} />
      
      {}
      <div className="absolute inset-0 bg-white/80 dark:bg-black/70"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <div className="text-center mb-16">
          <div className="max-w-3xl mx-auto px-4">
            {}
            <div className="mb-4">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            {}
            <div className="flex justify-center">
              <button
                onClick={handleUseMyLocation}
                disabled={geoLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-hm-red text-white hover:bg-red-600 transition shadow-md hover:shadow-lg"
                title="Find properties near me"
              >
                <Navigation className="w-5 h-5" />
                <span className="text-sm font-medium">{geoLoading ? 'Detecting...' : 'Use my location'}</span>
              </button>
            </div>
            
            {error && <div className="mt-3 text-sm text-red-600 dark:text-red-400 font-medium">{error}</div>}
          </div>
        </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {trendingProperties.map((property) => (
                <PropertyCard 
                  key={property.id || property.title} 
                  property={property}
                  isDarkMode={isDarkMode}
                  onAddToFavorites={() => console.log('Added to favorites:', property.id)}
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


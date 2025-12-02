import React, { useState } from 'react';
import { Search } from 'lucide-react';

const PROPERTY_TYPES = ['1BHK', '2BHK', '3BHK', 'Villa', 'Plot', 'Commercial'];
const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai',
  'Gurgaon', 'Noida', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Chandigarh', 'Bhubaneswar', 'Vadodara', 'Visakhapatnam'
];

export default function SearchBar({ onSearch }) {
  
  const [propertyType, setPropertyType] = useState('');
  const [city, setCity] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  
  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);
    
    if (value.trim()) {
      const filtered = INDIAN_CITIES.filter(c =>
        c.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredCities([]);
      setShowSuggestions(false);
    }
  };

  
  const handleCitySuggestion = (selectedCity) => {
    setCity(selectedCity);
    setShowSuggestions(false);
    setFilteredCities([]);
  };

  
  const handlePropertyTypeChange = (e) => {
    setPropertyType(e.target.value);
  };

  
  const handlePriceRangeChange = (e) => {
    setPriceRange(e.target.value);
  };

  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) {
      alert('Please enter a city name');
      return;
    }
    setIsLoading(true);
    try {
      if (onSearch) {
        
        await onSearch({ city: city.trim(), type: propertyType || null, priceRange: priceRange || null, page: 1 });
      }
    } catch (err) {
      console.error('Search handler error:', err);
      alert('Error performing search.');
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleSuggestionClick = (e, selectedCity) => {
    e.preventDefault();
    e.stopPropagation();
    handleCitySuggestion(selectedCity);
  };

  
  const handleCityFocus = () => {
    if (city.trim() && filteredCities.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative bg-white border border-neutral-200 rounded-xl p-6 md:p-8 shadow-sm font-ui">
      {}
      <div className="absolute inset-0 rounded-xl bg-transparent pointer-events-none" />
      
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 items-end">
        {}
        <div className="group">
          <label className="block text-sm font-semibold text-muted mb-3">
            Property Type
          </label>
          <select
            value={propertyType}
            onChange={handlePropertyTypeChange}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-slate-100 text-sm hover:bg-slate-800/70 transition-all duration-200 cursor-pointer backdrop-blur-sm"
          >
            <option value="" className="bg-slate-800 text-slate-100">All Types</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type} className="bg-slate-800 text-slate-100">
                {type}
              </option>
            ))}
          </select>
        </div>

        {}
        <div className="relative z-40 group">
          <label className="block text-sm font-semibold text-muted mb-3">
            City
          </label>
            <input
            type="text"
            value={city}
            onChange={handleCityChange}
            onFocus={handleCityFocus}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Enter Indian city"
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-offset-0 focus:ring-hm-red outline-none text-primary-text placeholder-muted text-sm hover:bg-neutral-50 transition-all duration-200"
            autoComplete="off"
          />
          
          {}
          {showSuggestions && filteredCities.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-neutral-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
              {filteredCities.map((suggestion, index) => (
                  <button
                  key={suggestion}
                  type="button"
                  onMouseDown={(e) => handleSuggestionClick(e, suggestion)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 text-gray-900 dark:text-white text-sm font-medium cursor-pointer ${
                    index !== filteredCities.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                  } first:rounded-t-xl last:rounded-b-xl`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {}
        <div className="group">
          <label className="block text-sm font-semibold text-muted mb-3">
            Price Range
          </label>
          <select
            value={priceRange}
            onChange={handlePriceRangeChange}
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-hm-red outline-none text-primary-text text-sm hover:bg-neutral-50 transition-all duration-200 cursor-pointer"
          >
            <option value="" className="bg-slate-800 text-slate-100">Any Price</option>
            <option value="0-25" className="bg-slate-800 text-slate-100">Below ₹25 L</option>
            <option value="25-50" className="bg-slate-800 text-slate-100">₹25 L - ₹50 L</option>
            <option value="50-100" className="bg-slate-800 text-slate-100">₹50 L - ₹1 Cr</option>
            <option value="100" className="bg-slate-800 text-slate-100">Above ₹1 Cr</option>
          </select>
        </div>

        {}
        <button
          type="submit"
          disabled={isLoading}
          className="relative w-full h-12 rounded-md font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer overflow-hidden bg-hm-red text-white hover:opacity-95"
        >
          {}
          <div className="absolute inset-0 opacity-10 bg-black/5" />
          
          {}
          <div className="relative flex items-center justify-center gap-2 text-white text-sm md:text-base">
            <Search className="w-5 h-5" />
            <span>{isLoading ? 'Searching...' : 'Search'}</span>
          </div>
          
          {}
          {isLoading && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center" />
          )}
        </button>
      </div>
    </form>
  );
}

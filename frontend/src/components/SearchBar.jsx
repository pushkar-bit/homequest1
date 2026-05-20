import React, { useState } from 'react';
import { Search } from 'lucide-react';

/* ─── Static data (unchanged) ───────────────────────────────────────────── */
const PROPERTY_TYPES = ['1BHK', '2BHK', '3BHK', 'Villa', 'Plot', 'Commercial'];
const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai',
  'Gurgaon', 'Noida', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Chandigarh', 'Bhubaneswar', 'Vadodara', 'Visakhapatnam',
];

/* ─── Scoped styles ─────────────────────────────────────────────────────── */
const CSS = `
  /* ── Outer pill ─────────────────────────────────────────────── */
  .hq-sb {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0;
    max-width: 720px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.97);
    border-radius: 99px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
    padding: 6px 6px 6px 24px;
    transition: box-shadow 0.25s ease, transform 0.25s ease;
  }

  .dark .hq-sb {
    background: #111111;
    border: 1px solid rgba(255,255,255,0.08);
  }

  /* focused state on the pill */
  .hq-sb--focused {
    box-shadow: 0 8px 48px rgba(0, 0, 0, 0.28);
    transform: scale(1.01);
  }

  /* ── Shared field wrapper ────────────────────────────────────── */
  .hq-sb__field {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    padding: 4px 16px 4px 0;
  }

  .hq-sb__field + .hq-sb__field {
    border-left: 1px solid rgba(0, 0, 0, 0.12);
    padding-left: 16px;
  }

  .dark .hq-sb__field + .hq-sb__field {
    border-left-color: rgba(255, 255, 255, 0.12);
  }

  /* ── Field label ─────────────────────────────────────────────── */
  .hq-sb__label {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #717171;
    margin-bottom: 2px;
    white-space: nowrap;
  }

  .dark .hq-sb__label {
    color: rgba(255, 255, 255, 0.45);
  }

  /* ── Inputs & selects ────────────────────────────────────────── */
  .hq-sb__input,
  .hq-sb__select {
    border: none;
    outline: none;
    background: transparent;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #222222;
    width: 100%;
    padding: 0;
    cursor: pointer;
  }

  .dark .hq-sb__input,
  .dark .hq-sb__select {
    color: #f5f5f5;
  }

  .hq-sb__input::placeholder {
    color: #b0b0b0;
  }

  .dark .hq-sb__input::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  /* Remove default select arrow in favour of a cleaner look */
  .hq-sb__select {
    appearance: none;
    -webkit-appearance: none;
  }

  /* ── Search button ───────────────────────────────────────────── */
  .hq-sb__btn {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: var(--hq-red, #FF5A5F);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    box-shadow: 0 4px 14px rgba(255, 90, 95, 0.38);
    margin-left: 8px;
  }

  .hq-sb__btn:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(255, 90, 95, 0.48);
  }

  .hq-sb__btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  /* ── City autocomplete dropdown ──────────────────────────────── */
  .hq-sb__suggestions {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    right: 0;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.16);
    overflow: hidden;
    z-index: 999;
  }

  .dark .hq-sb__suggestions {
    background: #1e1e1e;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  }

  .hq-sb__suggestion-item {
    width: 100%;
    text-align: left;
    padding: 11px 20px;
    border: none;
    background: transparent;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #222222;
    cursor: pointer;
    transition: background 0.15s ease;
    display: block;
  }

  .dark .hq-sb__suggestion-item {
    color: #f5f5f5;
  }

  .hq-sb__suggestion-item + .hq-sb__suggestion-item {
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }

  .dark .hq-sb__suggestion-item + .hq-sb__suggestion-item {
    border-top-color: rgba(255, 255, 255, 0.07);
  }

  .hq-sb__suggestion-item:hover {
    background: rgba(255, 90, 95, 0.06);
    color: var(--hq-red, #FF5A5F);
  }

  /* ── Mobile: stack vertically below md ───────────────────────── */
  @media (max-width: 640px) {
    .hq-sb {
      flex-direction: column;
      border-radius: 20px;
      padding: 16px;
      gap: 12px;
      align-items: stretch;
    }

    .hq-sb__field {
      padding: 0;
      border-left: none !important;
    }

    .hq-sb__field + .hq-sb__field {
      border-left: none;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      padding-top: 12px;
    }

    .dark .hq-sb__field + .hq-sb__field {
      border-top-color: rgba(255, 255, 255, 0.08);
    }

    .hq-sb__btn {
      width: 100%;
      height: 44px;
      border-radius: 12px;
      margin-left: 0;
      margin-top: 4px;
      gap: 8px;
      font-size: 14px;
      font-family: 'Inter', system-ui, sans-serif;
      font-weight: 600;
    }
  }
`;

export default function SearchBar({ onSearch }) {
  /* ── Filter state (unchanged) ── */
  const [propertyType, setPropertyType] = useState('');
  const [city, setCity] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  /* ── Pill focus state (visual only) ── */
  const [isFocused, setIsFocused] = useState(false);

  /* ── Handlers (unchanged logic) ── */
  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);
    if (value.trim()) {
      const filtered = INDIAN_CITIES.filter((c) =>
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

  const handlePropertyTypeChange = (e) => setPropertyType(e.target.value);
  const handlePriceRangeChange = (e) => setPriceRange(e.target.value);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) {
      alert('Please enter a city name');
      return;
    }
    setIsLoading(true);
    try {
      if (onSearch) {
        await onSearch({
          city: city.trim(),
          type: propertyType || null,
          priceRange: priceRange || null,
          page: 1,
        });
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
    setIsFocused(true);
    if (city.trim() && filteredCities.length > 0) setShowSuggestions(true);
  };

  return (
    <>
      <style>{CSS}</style>

      <form
        onSubmit={handleSearch}
        className={`hq-sb${isFocused ? ' hq-sb--focused' : ''}`}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          // Only unfocus if focus left the entire form
          if (!e.currentTarget.contains(e.relatedTarget)) setIsFocused(false);
        }}
      >
        {/* ── City input ─────────────────────────────────────────── */}
        <div className="hq-sb__field" style={{ position: 'relative', zIndex: 40, flex: '1.4' }}>
          <span className="hq-sb__label">Where to?</span>
          <input
            type="text"
            value={city}
            onChange={handleCityChange}
            onFocus={handleCityFocus}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Enter city"
            className="hq-sb__input"
            autoComplete="off"
          />

          {/* Autocomplete dropdown */}
          {showSuggestions && filteredCities.length > 0 && (
            <div className="hq-sb__suggestions">
              {filteredCities.map((suggestion, index) => (
                <button
                  key={suggestion}
                  type="button"
                  onMouseDown={(e) => handleSuggestionClick(e, suggestion)}
                  className="hq-sb__suggestion-item"
                  style={index === 0 ? { borderRadius: '16px 16px 0 0' } : index === filteredCities.length - 1 ? { borderRadius: '0 0 16px 16px' } : {}}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Property type ───────────────────────────────────────── */}
        <div className="hq-sb__field">
          <span className="hq-sb__label">Type</span>
          <select
            value={propertyType}
            onChange={handlePropertyTypeChange}
            className="hq-sb__select"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* ── Budget ─────────────────────────────────────────────── */}
        <div className="hq-sb__field">
          <span className="hq-sb__label">Budget</span>
          <select
            value={priceRange}
            onChange={handlePriceRangeChange}
            className="hq-sb__select"
          >
            <option value="">Any Price</option>
            <option value="0-25">Below ₹25 L</option>
            <option value="25-50">₹25 L – ₹50 L</option>
            <option value="50-100">₹50 L – ₹1 Cr</option>
            <option value="100">Above ₹1 Cr</option>
          </select>
        </div>

        {/* ── Search button ───────────────────────────────────────── */}
        <button
          type="submit"
          disabled={isLoading}
          className="hq-sb__btn"
          aria-label={isLoading ? 'Searching…' : 'Search properties'}
        >
          <Search size={18} strokeWidth={2.5} />
        </button>
      </form>
    </>
  );
}

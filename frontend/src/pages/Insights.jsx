import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, TrendingDown, Edit2, RotateCcw, Save, X } from 'lucide-react';
import { GooeyLoader } from '../components/GooeyLoader';
import { authAPI } from '../services/api';

const MOCK_CITY_INSIGHTS = {
  'Mumbai':    { id:1, city:'Mumbai',    avgPriceSqFt:18000, oneYearGrowth:8.5,  demandIndex:95 },
  'Delhi':     { id:2, city:'Delhi',     avgPriceSqFt:15000, oneYearGrowth:6.2,  demandIndex:88 },
  'Bangalore': { id:3, city:'Bangalore', avgPriceSqFt:12000, oneYearGrowth:9.1,  demandIndex:92 },
  'Pune':      { id:4, city:'Pune',      avgPriceSqFt:10000, oneYearGrowth:7.8,  demandIndex:85 },
  'Hyderabad': { id:5, city:'Hyderabad', avgPriceSqFt:9000,  oneYearGrowth:10.2, demandIndex:90 },
  'Chennai':   { id:6, city:'Chennai',   avgPriceSqFt:8500,  oneYearGrowth:5.5,  demandIndex:82 },
};

const MOCK_LOCALITY_INSIGHTS = [
  { id:1, city:'Mumbai',    locality:'Bandra',       avgPriceSqFt:22000, oneYearGrowth:9.5,  trendComment:'High demand area' },
  { id:2, city:'Mumbai',    locality:'Andheri',      avgPriceSqFt:15000, oneYearGrowth:7.2,  trendComment:'Growing commercial hub' },
  { id:3, city:'Bangalore', locality:'Koramangala',  avgPriceSqFt:15000, oneYearGrowth:10.5, trendComment:'IT hub' },
  { id:4, city:'Bangalore', locality:'Indiranagar',  avgPriceSqFt:13000, oneYearGrowth:8.8,  trendComment:'Rapidly developing' },
  { id:5, city:'Delhi',     locality:'South Delhi',  avgPriceSqFt:18000, oneYearGrowth:6.8,  trendComment:'Premium location' },
  { id:6, city:'Pune',      locality:'Hinjewadi',    avgPriceSqFt:12000, oneYearGrowth:9.2,  trendComment:'Tech district' },
  { id:7, city:'Hyderabad', locality:'Jubilee Hills', avgPriceSqFt:11000, oneYearGrowth:11.3, trendComment:'Best investment spot' },
  { id:8, city:'Bangalore', locality:'Whitefield',   avgPriceSqFt:14000, oneYearGrowth:9.8,  trendComment:'Corporate hub' },
];

const CSS = `
  .hq-ins-wrapper { background: #f7f7f7; }
  .dark .hq-ins-wrapper { background: #0a0a0a; }

  .hq-ins-hero{background:#fdfdfd;padding:60px 24px 48px;text-align:center;opacity:0;transform:translateY(-12px);transition:opacity .6s ease,transform .6s ease}
  .dark .hq-ins-hero{background:#0a0a0a;}
  .hq-ins-hero--in{opacity:1;transform:none}
  
  .hq-ins-title{font-family:'DM Serif Display',serif;font-size:clamp(28px,5vw,42px);color:#111111;margin:0 0 8px;font-weight:400;line-height:1.15}
  .dark .hq-ins-title{color:#ffffff}
  .hq-ins-title em{font-style:italic}
  
  .hq-ins-sub{font-family:'Inter',system-ui,sans-serif;font-size:16px;color:rgba(0,0,0,.65);margin:0 0 32px}
  .dark .hq-ins-sub{color:rgba(255,255,255,.65)}
  
  .hq-ins-pills{display:flex;justify-content:center;flex-wrap:wrap;gap:10px}
  .hq-ins-pill{font-family:'Inter',system-ui,sans-serif;font-size:13px;font-weight:500;padding:7px 18px;border-radius:99px;border:1px solid rgba(0,0,0,.2);color:rgba(0,0,0,.7);background:transparent;cursor:pointer;transition:background .2s,color .2s,border-color .2s}
  .dark .hq-ins-pill{border:1px solid rgba(255,255,255,.25);color:rgba(255,255,255,.7);}
  
  .hq-ins-pill:hover{background:rgba(0,0,0,.06);color:#111}
  .dark .hq-ins-pill:hover{background:rgba(255,255,255,.1);color:#fff}
  
  .hq-ins-pill--active{background:var(--hq-red,#FF5A5F);color:#fff;border-color:var(--hq-red,#FF5A5F)}
  .dark .hq-ins-pill--active{background:var(--hq-red,#FF5A5F);color:#fff;border-color:var(--hq-red,#FF5A5F)}
  .hq-ins-card{background:#fff;border:1px solid #ebebeb;border-radius:16px;padding:24px;transition:box-shadow .3s ease,transform .3s ease}
  .dark .hq-ins-card{background:#1e1e1e;border-color:#2a2a2a}
  .hq-ins-card:hover{box-shadow:0 12px 40px rgba(0,0,0,.10);transform:translateY(-4px)}
  .hq-ins-stat-num{font-family:'DM Mono','Courier New',monospace;font-size:32px;font-weight:500;margin:0 0 4px}
  .hq-ins-stat-label{font-family:'Inter',system-ui,sans-serif;font-size:12px;color:var(--hq-muted,#717171);text-transform:uppercase;letter-spacing:.08em;margin:0}
  .hq-ins-chart-title{font-family:'DM Serif Display',serif;font-size:20px;font-weight:400;color:var(--hq-dark,#222);margin:0 0 16px}
  .dark .hq-ins-chart-title{color:#f5f5f5}
  .hq-ins-row{opacity:0;transform:translateY(10px);transition:opacity .4s ease,transform .4s ease}
  .hq-ins-row.hq-vis{opacity:1;transform:none}
  .hq-ins-search-wrap{max-width:560px;margin:0 auto 32px;position:relative}
  .hq-ins-search-wrap input{width:100%;padding:14px 52px 14px 20px;border:2px solid #e0e0e0;border-radius:99px;font-family:'Inter',system-ui,sans-serif;font-size:15px;outline:none;transition:border-color .2s,box-shadow .2s;box-sizing:border-box;background:#fff;color:#222}
  .dark .hq-ins-search-wrap input{background:#1e1e1e;color:#f5f5f5;border-color:#333}
  .hq-ins-search-wrap input:focus{border-color:var(--hq-red,#FF5A5F);box-shadow:0 0 0 3px rgba(255,90,95,.12)}
  .hq-ins-search-wrap button{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--hq-red,#FF5A5F)}
  @media(max-width:640px){.hq-ins-stat-grid{grid-template-columns:1fr !important}}
`;

export default function Insights() {
  const [searchQuery,      setSearchQuery]      = useState('');
  const [insights,         setInsights]         = useState(null);
  const [insightType,      setInsightType]      = useState(null);
  const [loading,          setLoading]          = useState(false);
  const [error,            setError]            = useState('');
  const [editingId,        setEditingId]        = useState(null);
  const [editForm,         setEditForm]         = useState({});
  const [originalInsights, setOriginalInsights] = useState({});
  const [heroVisible,      setHeroVisible]      = useState(false);
  const [countedUp,        setCountedUp]        = useState(false);
  const statRef  = useRef(null);
  const rowsRef  = useRef([]);

  const currentUser = authAPI.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => { requestAnimationFrame(() => setHeroVisible(true)); }, []);

  useEffect(() => {
    if (!statRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setCountedUp(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(statRef.current);
    return () => obs.disconnect();
  }, [insights]);

  useEffect(() => {
    if (!insights) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('hq-vis'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    rowsRef.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [insights]);

  /* ── Handlers (unchanged) ── */
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) { setError('Please enter a search term'); return; }
    setLoading(true); setError(''); setInsights(null);
    await new Promise(r => setTimeout(r, 500));
    const q = searchQuery.trim().toLowerCase();
    for (const [city, data] of Object.entries(MOCK_CITY_INSIGHTS)) {
      if (city.toLowerCase() === q) { setInsights([data]); setInsightType('city'); setLoading(false); return; }
    }
    const loc = MOCK_LOCALITY_INSIGHTS.filter(i => i.city.toLowerCase().includes(q) || i.locality.toLowerCase().includes(q));
    if (loc.length > 0) { setInsights(loc); setInsightType('locality'); setLoading(false); return; }
    setError(`No insights found for "${searchQuery.trim()}". Try: Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai`);
    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    if (!originalInsights[item.id]) setOriginalInsights(p => ({ ...p, [item.id]: { ...item } }));
    setEditForm({ avgPriceSqFt:item.avgPriceSqFt, oneYearGrowth:item.oneYearGrowth, demandIndex:item.demandIndex, trendComment:item.trendComment });
  };
  const handleSaveEdit = async (item) => {
    try { setInsights(insights.map(i => i.id === item.id ? { ...i, ...editForm } : i)); setEditingId(null); alert('Insight updated successfully!'); }
    catch(err) { alert('Failed to update insight: ' + err.message); }
  };
  const handleUndo = async (item) => {
    if (!window.confirm('Reset this insight to default values?')) return;
    try {
      const def = originalInsights[item.id];
      if (def) { setInsights(insights.map(i => i.id === item.id ? { ...def } : i)); setOriginalInsights(p => { const n={...p}; delete n[item.id]; return n; }); alert('Insight reset!'); }
      else alert('No changes to undo.');
    } catch(err) { alert('Failed to reset: ' + err.message); }
  };

  const isPositive = (g) => g >= 0;

  const renderInsightCard = (item, idx) => {
    const isEditing = editingId === item.id;
    return (
      <div key={idx} ref={el => rowsRef.current[idx] = el}
        className="hq-ins-card hq-ins-row" style={{ animationDelay:`${idx*0.05}s` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
          <div>
            <h3 style={{ fontFamily:'DM Serif Display,serif', fontSize:20, fontWeight:400, color:'var(--hq-dark,#222)', margin:'0 0 2px' }}>{item.locality || item.city}</h3>
            {item.locality && <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:12, color:'var(--hq-muted,#717171)', margin:0 }}>{item.city}</p>}
          </div>
          {isAdmin && (
            <div style={{ display:'flex', gap:6 }}>
              {!isEditing ? (<>
                <button onClick={() => handleEdit(item)} style={{ padding:6, borderRadius:8, border:'none', background:'transparent', cursor:'pointer', color:'#3b82f6' }} title="Edit"><Edit2 size={15} /></button>
                <button onClick={() => handleUndo(item)} style={{ padding:6, borderRadius:8, border:'none', background:'transparent', cursor:'pointer', color:'#f97316' }} title="Undo"><RotateCcw size={15} /></button>
              </>) : (<>
                <button onClick={() => handleSaveEdit(item)} style={{ padding:6, borderRadius:8, border:'none', background:'transparent', cursor:'pointer', color:'#22c55e' }} title="Save"><Save size={15} /></button>
                <button onClick={() => setEditingId(null)} style={{ padding:6, borderRadius:8, border:'none', background:'transparent', cursor:'pointer', color:'var(--hq-red,#FF5A5F)' }} title="Cancel"><X size={15} /></button>
              </>)}
            </div>
          )}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div>
            <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--hq-muted,#717171)', margin:'0 0 4px' }}>Avg Price/sqft</p>
            {isEditing ? (
              <input type="number" value={editForm.avgPriceSqFt} onChange={e => setEditForm({...editForm, avgPriceSqFt:parseFloat(e.target.value)})}
                style={{ fontFamily:'DM Mono,monospace', fontSize:22, color:'var(--hq-teal,#00A699)', border:'none', borderBottom:'2px solid var(--hq-teal,#00A699)', outline:'none', background:'transparent', width:'100%' }} />
            ) : (
              <p style={{ fontFamily:'DM Mono,monospace', fontSize:22, fontWeight:500, color:'var(--hq-teal,#00A699)', margin:0 }}>₹{item.avgPriceSqFt?.toLocaleString()}</p>
            )}
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--hq-muted,#717171)', margin:'0 0 4px' }}>1-Year Growth</p>
              {isEditing ? (
                <input type="number" step="0.1" value={editForm.oneYearGrowth} onChange={e => setEditForm({...editForm, oneYearGrowth:parseFloat(e.target.value)})}
                  style={{ fontFamily:'DM Mono,monospace', fontSize:18, fontWeight:600, border:'none', borderBottom:'2px solid #22c55e', outline:'none', background:'transparent', width:80, color:'#22c55e' }} />
              ) : (
                <p style={{ fontFamily:'DM Mono,monospace', fontSize:18, fontWeight:600, color: isPositive(item.oneYearGrowth)?'var(--hq-teal,#00A699)':'var(--hq-red,#FF5A5F)', margin:0 }}>
                  {item.oneYearGrowth>0?'+':''}{item.oneYearGrowth.toFixed(1)}%
                </p>
              )}
            </div>
            {isPositive(item.oneYearGrowth) ? <TrendingUp size={22} style={{ color:'var(--hq-teal,#00A699)' }} /> : <TrendingDown size={22} style={{ color:'var(--hq-red,#FF5A5F)' }} />}
          </div>
          {(item.trendComment || isEditing) && (
            <div style={{ background:'rgba(0,166,153,.07)', borderRadius:8, padding:'10px 12px' }}>
              {isEditing ? (
                <textarea value={editForm.trendComment||''} onChange={e => setEditForm({...editForm, trendComment:e.target.value})}
                  style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:13, color:'var(--hq-dark,#222)', width:'100%', background:'transparent', border:'none', outline:'none', resize:'none' }} rows={2} />
              ) : (
                <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:13, color:'var(--hq-dark,#222)', margin:0 }}>{item.trendComment}</p>
              )}
            </div>
          )}
          {item.demandIndex && (
            <div>
              <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--hq-muted,#717171)', margin:'0 0 8px' }}>Demand Index</p>
              {isEditing ? (
                <input type="number" min="0" max="100" value={editForm.demandIndex} onChange={e => setEditForm({...editForm, demandIndex:parseInt(e.target.value)})}
                  style={{ fontFamily:'DM Mono,monospace', fontSize:14, color:'#7c3aed', border:'none', borderBottom:'2px solid #7c3aed', outline:'none', background:'transparent', width:60 }} />
              ) : (<>
                <div style={{ background:'#e5e7eb', borderRadius:99, height:6, overflow:'hidden' }}>
                  <div style={{ width:`${item.demandIndex}%`, height:'100%', background:'#7c3aed', borderRadius:99, transition:'width .8s ease' }} />
                </div>
                <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:12, color:'var(--hq-muted,#717171)', margin:'4px 0 0' }}>{item.demandIndex}/100</p>
              </>)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const CITIES = Object.keys(MOCK_CITY_INSIGHTS);
  const activeCity = insights && insightType==='city' ? searchQuery : null;
  const activeCityData = activeCity ? MOCK_CITY_INSIGHTS[activeCity] : null;

  return (
    <div className="hq-ins-wrapper" style={{ minHeight: '100vh' }}><style>{CSS}</style>

      {/* Hero */}
      <div className={`hq-ins-hero${heroVisible?' hq-ins-hero--in':''}`}>
        <h1 className="hq-ins-title">Market <em>Insights</em></h1>
        <p className="hq-ins-sub">Real-time price trends, growth rates, and demand data across India's top cities.</p>
        <div className="hq-ins-pills">
          {CITIES.map(city => (
            <button key={city} className={`hq-ins-pill${activeCity===city?' hq-ins-pill--active':''}`}
              onClick={() => { setSearchQuery(city); setInsights([MOCK_CITY_INSIGHTS[city]]); setInsightType('city'); }}>
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth:1120, margin:'0 auto', padding:'48px 24px' }}>

        {/* Search */}
        <div className="hq-ins-search-wrap">
          <form onSubmit={handleSearch}>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Enter city or locality…" />
            <button type="submit" disabled={loading}><Search size={18} /></button>
          </form>
        </div>

        {insightType && <p style={{ textAlign:'center', fontFamily:'Inter,system-ui,sans-serif', fontSize:13, color:'var(--hq-muted,#717171)', marginBottom:24 }}>Showing {insightType} insights</p>}

        {error && <div style={{ background:'rgba(255,90,95,.08)', border:'1px solid rgba(255,90,95,.3)', borderRadius:12, padding:'12px 18px', color:'var(--hq-red,#FF5A5F)', fontFamily:'Inter,system-ui,sans-serif', fontSize:14, marginBottom:24 }}>{error}</div>}

        {loading && <div style={{ textAlign:'center', padding:'48px 0', minHeight:'300px', display:'flex', alignItems:'center', justifyContent:'center' }}><GooeyLoader message="Loading insights..." /></div>}

        {/* Stat cards */}
        {!loading && activeCityData && (
          <div ref={statRef} className="hq-ins-stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:40 }}>
            {[
              { label:'Avg Price / sqft', value:`₹${activeCityData.avgPriceSqFt.toLocaleString()}`, color:'var(--hq-teal,#00A699)' },
              { label:'YoY Growth',       value:`${activeCityData.oneYearGrowth>0?'+':''}${activeCityData.oneYearGrowth.toFixed(1)}%`, color:activeCityData.oneYearGrowth>=0?'var(--hq-teal,#00A699)':'var(--hq-red,#FF5A5F)' },
              { label:'Demand Index',     value:`${activeCityData.demandIndex}/100`, color:'#7c3aed' },
            ].map(({ label, value, color }) => (
              <div key={label} className="hq-ins-card" style={{ textAlign:'center' }}>
                <p className="hq-ins-stat-num" style={{ color, opacity: countedUp?1:0, transition:'opacity .8s ease' }}>{value}</p>
                <p className="hq-ins-stat-label">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Insight cards */}
        {!loading && insights && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
            {insights.map((item, idx) => renderInsightCard(item, idx))}
          </div>
        )}

        {/* Default city grid */}
        {!loading && !insights && !error && (
          <>
            <h2 style={{ fontFamily:'DM Serif Display,serif', fontSize:26, fontWeight:400, color:'var(--hq-dark,#222)', marginBottom:20 }}>Trending Markets</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
              {Object.entries(MOCK_CITY_INSIGHTS).map(([city, data], idx) => (
                <button key={city} onClick={() => { setSearchQuery(city); setInsights([data]); setInsightType('city'); }}
                  className="hq-ins-card"
                  style={{ textAlign:'left', border:'none', cursor:'pointer', opacity:0, animation:`fadeInUp .5s ease ${idx*0.07}s forwards` }}>
                  <h3 style={{ fontFamily:'DM Serif Display,serif', fontSize:20, fontWeight:400, color:'var(--hq-dark,#222)', margin:'0 0 6px' }}>{city}</h3>
                  <p style={{ fontFamily:'DM Mono,monospace', fontSize:15, color:'var(--hq-teal,#00A699)', margin:'0 0 8px' }}>₹{data.avgPriceSqFt.toLocaleString()}/sqft</p>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:13, fontWeight:600, color:data.oneYearGrowth>=0?'var(--hq-teal,#00A699)':'var(--hq-red,#FF5A5F)', margin:0 }}>
                      {data.oneYearGrowth>0?'+':''}{data.oneYearGrowth.toFixed(1)}%
                    </p>
                    {data.oneYearGrowth>=0 ? <TrendingUp size={14} style={{color:'var(--hq-teal,#00A699)'}} /> : <TrendingDown size={14} style={{color:'var(--hq-red,#FF5A5F)'}} />}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

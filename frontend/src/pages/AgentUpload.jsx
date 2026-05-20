import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Upload, ImagePlus, Pencil, Trash2, CheckCircle } from 'lucide-react';
import api, { authAPI } from '../services/api';

/* ── Scoped CSS ─────────────────────────────────────────────── */
const CSS = `
  @keyframes auFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .au-card { opacity:0; transform:translateY(20px); transition:opacity .5s ease,transform .5s ease; }
  .au-card.au-vis { opacity:1; transform:none; }
  .au-input {
    width:100%; padding:12px 16px; border:1px solid #dddddd;
    border-radius:10px; font-family:'Inter',system-ui,sans-serif;
    font-size:15px; color:#222; background:#fff; outline:none;
    transition:border-color .2s ease, box-shadow .2s ease;
    box-sizing:border-box;
  }
  .au-input:focus { border-color:var(--hq-red,#FF5A5F); box-shadow:0 0 0 3px rgba(255,90,95,.12); }
  .dark .au-input { background:#2a2a2a; border-color:#444; color:#f5f5f5; }
  .au-label { font-family:'Inter',system-ui,sans-serif; font-size:13px; font-weight:500; color:var(--hq-dark,#222); margin-bottom:6px; display:block; }
  .dark .au-label { color:#e0e0e0; }
  .au-drop {
    border:2px dashed #dddddd; border-radius:16px; padding:48px 24px;
    text-align:center; background:#fafafa; cursor:pointer;
    transition:border-color .2s ease,background .2s ease;
  }
  .dark .au-drop { background:#1a1a1a; border-color:#444; }
  .au-drop.au-drag { border-color:var(--hq-red,#FF5A5F); background:rgba(255,90,95,.04); }
  .au-submit {
    width:100%; padding:16px; background:var(--hq-red,#FF5A5F); color:#fff;
    border:none; border-radius:12px; font-family:'Inter',system-ui,sans-serif;
    font-size:16px; font-weight:600; cursor:pointer;
    transition:transform .2s ease, box-shadow .2s ease;
  }
  .au-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 24px rgba(255,90,95,.35); }
  .au-submit:disabled { opacity:.65; cursor:not-allowed; }
  .au-spin { width:20px;height:20px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:spin .7s linear infinite;display:inline-block;vertical-align:middle; }
  @keyframes spin { to{transform:rotate(360deg)} }
  .au-card-heading { font-family:'Inter',system-ui,sans-serif; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--hq-muted,#717171); margin:0 0 20px; }
  .au-listing-card { border:1px solid #ebebeb; border-radius:12px; padding:16px 18px; display:flex; justify-content:space-between; align-items:flex-start; background:#fff; }
  .dark .au-listing-card { background:#1e1e1e; border-color:#2a2a2a; }
  .au-icon-btn { padding:7px 14px; border-radius:8px; border:none; font-family:'Inter',system-ui,sans-serif; font-size:13px; font-weight:500; cursor:pointer; display:flex; align-items:center; gap:5px; transition:opacity .15s; }
  .au-icon-btn:hover { opacity:.82; }
`;

const CARD_STYLE = {
  border:'1px solid #ebebeb', borderRadius:16, padding:28,
  marginBottom:20, background:'#fff',
};
const DARK_CARD_STYLE = { background:'#1e1e1e', borderColor:'#2a2a2a' };

const AgentUpload = () => {
  /* ── All original state (unchanged) ── */
  const [form, setForm] = useState({ city:'', locality:'', type:'', price:'', pricePerUnit:'', area:'', image:'', description:'' });
  const [status,        setStatus]        = useState(null);
  const [listings,      setListings]      = useState([]);
  const [editingId,     setEditingId]     = useState(null);
  const [uploadedUrls,  setUploadedUrls]  = useState([]);
  const [uploadingFiles,setUploadingFiles]= useState(false);
  const [dragOver,      setDragOver]      = useState(false);

  /* ── Visual-only ── */
  const cardRefs = useRef([]);
  const isDark = document.documentElement.classList.contains('dark');

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('au-vis'); obs.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    cardRefs.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const currentUser = authAPI.getCurrentUser();

  const fetchListings = useCallback(async () => {
    try {
      const res = await api.get('/api/properties', { params: { sellerId: currentUser?.id } });
      setListings(res.data.data || res.data);
    } catch (err) { console.warn('Failed to fetch listings', err.message); }
  }, [currentUser]);

  useEffect(() => { if (currentUser) fetchListings(); }, [currentUser, fetchListings]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingFiles(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      const res = await api.post('/api/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const urls = res.data.data || [];
      setUploadedUrls(urls);
      if (urls.length > 0) setForm(prev => ({ ...prev, image: urls[0], images: urls }));
    } catch (err) {
      console.error('File upload failed', err.message);
      setStatus({ error: 'File upload failed' });
    } finally { setUploadingFiles(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true });
    try {
      let response;
      if (editingId) response = await api.put(`/api/properties/${editingId}`, form);
      else           response = await api.post('/api/properties', form);
      setStatus({ success: true, data: response.data });
      setForm({ city:'', locality:'', type:'', price:'', pricePerUnit:'', area:'', image:'', description:'' });
      setEditingId(null);
      fetchListings();
    } catch (err) { setStatus({ error: err.response?.data?.error || err.message }); }
  };

  const handleEdit = (prop) => {
    setEditingId(prop.id);
    setForm({ city:prop.city||'', locality:prop.locality||'', type:prop.type||'', price:prop.price||'', pricePerUnit:prop.pricePerUnit||'', area:prop.area||'', image:prop.image||'', description:prop.description||'' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await api.delete(`/api/properties/${id}`);
      fetchListings();
    } catch (err) { alert('Delete failed: ' + (err.response?.data?.error || err.message)); }
  };

  /* ── Drag-and-drop handlers ── */
  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) handleFileChange({ target: { files } });
  };

  const fieldRow = (label, name, type='text', required=false, extra={}) => (
    <div style={{ marginBottom:18 }}>
      <label className="au-label">{label}</label>
      {name === 'description'
        ? <textarea name={name} value={form[name]} onChange={handleChange} className="au-input" rows={4} style={{ resize:'vertical', fontFamily:'Inter,system-ui,sans-serif' }} />
        : <input name={name} value={form[name]} onChange={handleChange} type={type} required={required} className="au-input" {...extra} />
      }
    </div>
  );

  const cardStyle = isDark ? { ...CARD_STYLE, ...DARK_CARD_STYLE } : CARD_STYLE;

  return (
    <div style={{ minHeight:'100vh', paddingTop:96, paddingBottom:64, background:'var(--hq-surface,#f7f7f7)' }}>
      <style>{CSS}</style>
      <div style={{ maxWidth:720, margin:'0 auto', padding:'0 24px' }}>

        {/* Page header */}
        <div style={{ marginBottom:40 }}>
          <h1 style={{ fontFamily:'DM Serif Display,serif', fontSize:36, fontWeight:400, color:'var(--hq-dark,#222)', margin:'0 0 8px', lineHeight:1.2 }}>
            List a <em style={{ fontStyle:'italic' }}>property</em>
          </h1>
          <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:16, color:'var(--hq-muted,#717171)', margin:0 }}>
            Fill in the details below to publish your listing on HomeQuest.
          </p>
        </div>

        {/* Status messages */}
        {status?.error && (
          <div style={{ background:'rgba(255,90,95,.08)', border:'1px solid rgba(255,90,95,.3)', borderRadius:12, padding:'12px 16px', color:'var(--hq-red,#FF5A5F)', fontFamily:'Inter,system-ui,sans-serif', fontSize:14, marginBottom:20 }}>
            {status.error}
          </div>
        )}
        {status?.success && (
          <div style={{ background:'rgba(0,166,153,.08)', border:'1px solid rgba(0,166,153,.3)', borderRadius:12, padding:'14px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
            <CheckCircle size={18} color="var(--hq-teal,#00A699)" />
            <span style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:14, color:'var(--hq-teal,#00A699)', fontWeight:500 }}>Property {editingId ? 'updated' : 'listed'} successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Card 1 — Location */}
          <div ref={el => cardRefs.current[0] = el} className="au-card" style={cardStyle}>
            <p className="au-card-heading">📍 Location</p>
            {fieldRow('City', 'city', 'text', true)}
            {fieldRow('Locality', 'locality', 'text', true)}
          </div>

          {/* Card 2 — Property Info */}
          <div ref={el => cardRefs.current[1] = el} className="au-card" style={cardStyle}>
            <p className="au-card-heading">🏠 Property Details</p>
            {fieldRow('Type (e.g. 2BHK, Villa)', 'type', 'text', true)}
            {fieldRow('Area (e.g. 1200 sqft)', 'area')}
          </div>

          {/* Card 3 — Pricing */}
          <div ref={el => cardRefs.current[2] = el} className="au-card" style={cardStyle}>
            <p className="au-card-heading">💰 Pricing</p>
            {fieldRow('Display Price (e.g. ₹1.2 Cr)', 'price', 'text', true)}
            {fieldRow('Price per unit (numeric)', 'pricePerUnit', 'number')}
          </div>

          {/* Card 4 — Images */}
          <div ref={el => cardRefs.current[3] = el} className="au-card" style={cardStyle}>
            <p className="au-card-heading">📸 Photos</p>
            <div className={`au-drop${dragOver?' au-drag':''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('au-file-input').click()}
            >
              <ImagePlus size={40} color="var(--hq-muted,#717171)" style={{ marginBottom:10 }} />
              <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:14, color:'var(--hq-muted,#717171)', margin:'0 0 6px' }}>
                Drag photos here or <span style={{ color:'var(--hq-red,#FF5A5F)', fontWeight:500 }}>click to upload</span>
              </p>
              <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:12, color:'#aaa', margin:0 }}>PNG, JPG up to 10MB each</p>
            </div>
            <input id="au-file-input" type="file" multiple accept="image/*" onChange={handleFileChange} style={{ display:'none' }} />
            {uploadingFiles && (
              <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:13, color:'var(--hq-muted,#717171)', marginTop:12 }}>Uploading images…</p>
            )}
            {uploadedUrls.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginTop:14 }}>
                {uploadedUrls.map(u => (
                  <img key={u} src={u} alt="thumb" style={{ width:72, height:72, objectFit:'cover', borderRadius:8, border:'1px solid #ebebeb' }} />
                ))}
              </div>
            )}
          </div>

          {/* Card 5 — Description */}
          <div ref={el => cardRefs.current[4] = el} className="au-card" style={cardStyle}>
            <p className="au-card-heading">📝 Description</p>
            {fieldRow('Tell buyers about this property', 'description')}
          </div>

          {/* Submit */}
          <button type="submit" disabled={status?.loading} className="au-submit">
            {status?.loading
              ? <span className="au-spin" />
              : <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}><Upload size={18} />{editingId ? 'Update Property' : 'Publish Listing'}</span>
            }
          </button>
        </form>

        {/* Your Listings */}
        {listings.length > 0 && (
          <div style={{ marginTop:48 }}>
            <h2 style={{ fontFamily:'DM Serif Display,serif', fontSize:24, fontWeight:400, color:'var(--hq-dark,#222)', margin:'0 0 20px' }}>Your Listings</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {listings.map(p => (
                <div key={p.id} className="au-listing-card">
                  <div>
                    <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:15, fontWeight:600, color:'var(--hq-dark,#222)', margin:'0 0 4px' }}>{p.city} · {p.locality} <span style={{ fontWeight:400, color:'var(--hq-muted,#717171)' }}>({p.type})</span></p>
                    <p style={{ fontFamily:'DM Mono,monospace', fontSize:13, color:'var(--hq-teal,#00A699)', margin:'0 0 2px' }}>{p.price}</p>
                    <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:12, color:'var(--hq-muted,#717171)', margin:0 }}>{p.area} · ID {p.id}</p>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => handleEdit(p)} className="au-icon-btn" style={{ background:'rgba(234,179,8,.12)', color:'#92400e' }}>
                      <Pencil size={13} /> Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="au-icon-btn" style={{ background:'rgba(255,90,95,.1)', color:'var(--hq-red,#FF5A5F)' }}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentUpload;

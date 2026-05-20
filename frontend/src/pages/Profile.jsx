import React, { useState, useEffect, useRef } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { LogOut, Heart, BarChart2, Home, Pencil, X, Check } from 'lucide-react';
import api from '../services/api';

/* ── Scoped CSS ─────────────────────────────────────────────── */
const CSS = `
  @keyframes avatarPop { 0%{transform:scale(0)} 70%{transform:scale(1.12)} 100%{transform:scale(1)} }
  @keyframes infoUp    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

  .pr-avatar { animation: avatarPop .4s ease forwards; }
  .pr-info   { opacity:0; animation: infoUp .4s ease .1s forwards; }

  .pr-card-container { opacity:0; transform:translateY(18px); transition:opacity .45s ease, transform .45s ease; border:1px solid #ebebeb; border-radius:16px; padding:28px; margin-bottom:20px; background:#fff; }
  .dark .pr-card-container { background:#1e1e1e; border-color:#333; }
  .pr-card-container.pr-vis { opacity:1; transform:none; }

  .pr-input {
    width:100%; padding:12px 16px;
    border:1px solid #dddddd; border-radius:10px;
    font-family:'Inter',system-ui,sans-serif; font-size:15px;
    color:#222; background:#fff; outline:none;
    transition:border-color .2s ease, box-shadow .2s ease;
    box-sizing:border-box;
  }
  .pr-input:focus { border-color:var(--hq-red,#FF5A5F); box-shadow:0 0 0 3px rgba(255,90,95,.12); }
  .dark .pr-input { background:#2a2a2a; border-color:#444; color:#f5f5f5; }

  .pr-label { font-family:'Inter',system-ui,sans-serif; font-size:13px; font-weight:500; color:var(--hq-dark,#222); margin-bottom:6px; display:block; }
  .dark .pr-label { color:#e0e0e0; }

  .pr-section-head { font-family:'Inter',system-ui,sans-serif; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--hq-muted,#717171); margin:0 0 20px; }
  .dark .pr-section-head { color:#999; }

  .pr-save-btn {
    background:var(--hq-red,#FF5A5F); color:#fff;
    border:none; border-radius:10px; padding:12px 28px;
    font-family:'Inter',system-ui,sans-serif; font-size:15px; font-weight:600;
    cursor:pointer; transition:transform .2s ease, box-shadow .2s ease;
  }
  .pr-save-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 24px rgba(255,90,95,.35); }
  .pr-save-btn:disabled { opacity:.6; cursor:not-allowed; }

  .pr-quick-btn {
    display:flex; flex-direction:column; align-items:flex-start; gap:8px;
    background:#fff; border:1px solid #ebebeb; border-radius:14px; padding:20px;
    cursor:pointer; transition:box-shadow .25s ease, transform .25s ease; text-align:left;
  }
  .dark .pr-quick-btn { background:#222; border-color:#333; }
  .pr-quick-btn:hover { box-shadow:0 8px 28px rgba(0,0,0,.09); transform:translateY(-3px); }
  .dark .pr-quick-btn:hover { box-shadow:0 8px 28px rgba(0,0,0,.4); }

  .pr-logout-btn {
    width:100%; display:flex; align-items:center; justify-content:center; gap:8px;
    padding:13px; background:rgba(255,90,95,.06); color:var(--hq-red,#FF5A5F);
    border:1px solid rgba(255,90,95,.2); border-radius:10px;
    font-family:'Inter',system-ui,sans-serif; font-size:15px; font-weight:600;
    cursor:pointer; transition:background .2s ease;
  }
  .pr-logout-btn:hover { background:rgba(255,90,95,.12); }
  .dark .pr-logout-btn { border-color: rgba(255,90,95,.3); }

  .pr-wrapper { background: #f7f7f7; }
  .dark .pr-wrapper { background: #0a0a0a; }
`;

const roleLabel = (role) =>
  role === 'user' ? 'Homebuyer' : role === 'agent' ? 'Real Estate Agent' : 'Administrator';

const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');

/* ── Not-logged-in screen ────────────────────────────────────── */
function NotLoggedIn({ navigate }) {
  return (
    <div className="pr-wrapper" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{CSS}</style>
      <div className="pr-card-container" style={{ maxWidth:400, width:'100%', textAlign:'center', opacity:1, transform:'none' }}>
        <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--hq-red,#FF5A5F)', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Home size={32} color="#fff" />
        </div>
        <h2 style={{ fontFamily:'DM Serif Display,serif', fontSize:26, fontWeight:400, color: 'inherit', margin:'0 0 10px' }}>Not logged in</h2>
        <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:15, color:'var(--hq-muted,#717171)', margin:'0 0 28px' }}>Sign in to access your profile.</p>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={() => navigate('/login')} className="pr-save-btn" style={{ width:'100%', borderRadius:10 }}>Login</button>
          <button onClick={() => navigate('/signup')} style={{ width:'100%', padding:12, borderRadius:10, border:'1px solid #ddd', background:'transparent', fontFamily:'Inter,system-ui,sans-serif', fontSize:15, fontWeight:500, cursor:'pointer', color:'inherit' }}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const user = authAPI.getCurrentUser();
  const isAuthenticated = authAPI.isAuthenticated();

  /* ── All original state (unchanged) ── */
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState({ name: user?.name || '', email: user?.email || '' });
  const [saving,  setSaving]  = useState(false);

  /* ── Visual-only ── */
  const cardRefs = useRef([]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('pr-vis'); obs.unobserve(e.target); } }),
      { threshold: 0.06 }
    );
    cardRefs.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  /* ── handleLogout (unchanged) ── */
  const handleLogout = () => { authAPI.logout(); navigate('/login'); };

  /* ── handleSave (unchanged) ── */
  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api.patch('/api/profile', { name: form.name, email: form.email });
      if (res?.data?.success) {
        const updated = res.data.data;
        const stored  = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...stored, name: updated.name, email: updated.email }));
        window.location.reload();
      } else {
        alert(res?.data?.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile save error', err);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || !user) return <NotLoggedIn navigate={navigate} />;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month:'long', year:'numeric' })
    : 'HomeQuest Member';

  return (
    <div className="pr-wrapper" style={{ minHeight:'100vh', paddingTop:96, paddingBottom:64 }}>
      <style>{CSS}</style>

      <div style={{ maxWidth:800, margin:'0 auto', padding:'0 24px' }}>

        {/* ── Profile header card ── */}
        <div className="pr-card-container pr-vis" style={{ display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
          {/* Avatar */}
          <div className="pr-avatar"
            style={{ width:72, height:72, borderRadius:'50%', background:'var(--hq-red,#FF5A5F)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontFamily:'DM Serif Display,serif', fontSize:28, color:'#fff', fontWeight:400, userSelect:'none' }}>
              {initials(user.name)}
            </span>
          </div>

          {/* Info */}
          <div className="pr-info" style={{ flex:1, minWidth:200 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', marginBottom:4 }}>
              <h1 style={{ fontFamily:'DM Serif Display,serif', fontSize:26, fontWeight:400, color:'inherit', margin:0 }}>{user.name}</h1>
              <span style={{ background:'rgba(255,90,95,0.1)', color:'var(--hq-red,#FF5A5F)', borderRadius:99, padding:'4px 12px', fontSize:12, fontFamily:'Inter,system-ui,sans-serif', fontWeight:500 }}>
                {roleLabel(user.role)}
              </span>
            </div>
            <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:13, color:'var(--hq-muted,#717171)', margin:'2px 0 0' }}>
              {user.email} · {memberSince}
            </p>
          </div>

          {/* Edit toggle */}
          {!editing ? (
            <button onClick={() => setEditing(true)}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:8, border:'1px solid #ddd', background:'transparent', fontFamily:'Inter,system-ui,sans-serif', fontSize:13, fontWeight:500, cursor:'pointer', color:'var(--hq-dark,#222)' }}>
              <Pencil size={13} /> Edit
            </button>
          ) : (
            <button onClick={() => { setEditing(false); setForm({ name: user.name, email: user.email }); }}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:8, border:'1px solid #ddd', background:'transparent', fontFamily:'Inter,system-ui,sans-serif', fontSize:13, fontWeight:500, cursor:'pointer', color:'var(--hq-muted,#717171)' }}>
              <X size={13} /> Cancel
            </button>
          )}
        </div>

        {/* ── Profile information card ── */}
        <div ref={el => cardRefs.current[0] = el} className="pr-card-container">
          <p className="pr-section-head">👤 Profile Information</p>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <div>
              <label className="pr-label">Full Name</label>
              {editing
                ? <input className="pr-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                : <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:15, color:'var(--hq-dark,#222)', margin:0, paddingTop:4 }}>{user.name}</p>
              }
            </div>
            <div>
              <label className="pr-label">Email Address</label>
              {editing
                ? <input className="pr-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                : <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:15, color:'var(--hq-dark,#222)', margin:0, paddingTop:4 }}>{user.email}</p>
              }
            </div>
            <div>
              <label className="pr-label">Account Type</label>
              <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:15, color:'var(--hq-dark,#222)', margin:0, paddingTop:4 }}>{roleLabel(user.role)}</p>
            </div>
            <div>
              <label className="pr-label">User ID</label>
              <p style={{ fontFamily:'DM Mono,monospace', fontSize:14, color:'var(--hq-muted,#717171)', margin:0, paddingTop:4 }}>#{user.id}</p>
            </div>
          </div>

          {editing && (
            <div style={{ marginTop:24, display:'flex', gap:10 }}>
              <button onClick={handleSave} disabled={saving} className="pr-save-btn">
                {saving
                  ? <span style={{ display:'flex', alignItems:'center', gap:6 }}><span style={{ width:14,height:14,borderRadius:'50%',border:'2px solid rgba(255,255,255,.4)',borderTopColor:'#fff',animation:'spin .7s linear infinite',display:'inline-block' }} /> Saving…</span>
                  : <span style={{ display:'flex', alignItems:'center', gap:6 }}><Check size={15} /> Save changes</span>
                }
              </button>
            </div>
          )}
        </div>

        {/* ── Quick actions ── */}
        <div ref={el => cardRefs.current[1] = el} className="pr-card-container">
          <p className="pr-section-head">⚡ Quick Actions</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:14 }}>
            <button className="pr-quick-btn" onClick={() => navigate('/shortlist')}>
              <Heart size={22} color="var(--hq-red,#FF5A5F)" />
              <span style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:14, fontWeight:600, color:'inherit' }}>My Shortlist</span>
              <span style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:12, color:'var(--hq-muted,#717171)' }}>Saved properties</span>
            </button>
            <button className="pr-quick-btn" onClick={() => navigate('/insights')}>
              <BarChart2 size={22} color="var(--hq-red,#FF5A5F)" />
              <span style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:14, fontWeight:600, color:'inherit' }}>Market Insights</span>
              <span style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:12, color:'var(--hq-muted,#717171)' }}>Trends & data</span>
            </button>
            {(user.role === 'agent' || user.role === 'admin') && (
              <button className="pr-quick-btn" onClick={() => navigate('/manage-listings')}>
                <Home size={22} color="var(--hq-red,#FF5A5F)" />
                <span style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:14, fontWeight:600, color:'inherit' }}>Manage Listings</span>
                <span style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:12, color:'var(--hq-muted,#717171)' }}>Your properties</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Account settings ── */}
        <div ref={el => cardRefs.current[2] = el} className="pr-card-container">
          <p className="pr-section-head">⚙️ Account Settings</p>
          <button className="pr-logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Sign out
          </button>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Scoped CSS ─────────────────────────────────────────────────────────── */
const CSS = `
  @keyframes emiIn  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes emiOut { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-12px); } }
  @keyframes valPop { 0%{transform:scale(1)} 50%{transform:scale(1.12)} 100%{transform:scale(1)} }
  @keyframes pageUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }

  .emi-page { animation: pageUp .6s ease forwards; }

  /* Sliders */
  .emi-range {
    -webkit-appearance: none; appearance: none;
    width: 100%; height: 5px;
    border-radius: 99px;
    background: linear-gradient(to right, var(--hq-red,#FF5A5F) var(--pct,50%), #e0e0e0 var(--pct,50%));
    outline: none; cursor: pointer;
  }
  .emi-range::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 22px; height: 22px;
    border-radius: 50%;
    background: var(--hq-red,#FF5A5F);
    cursor: grab; border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(255,90,95,.35);
    transition: transform .15s ease;
  }
  .emi-range::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.15); }
  .emi-range::-moz-range-thumb {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: var(--hq-red,#FF5A5F);
    cursor: grab; border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(255,90,95,.35);
  }

  /* Value pop animation */
  .val-pop { animation: valPop .2s ease; }

  /* EMI value swap animation */
  .emi-val-enter { animation: emiIn .25s ease forwards; }
  .emi-val-exit  { animation: emiOut .25s ease forwards; }

  /* Donut chart */
  .donut-ring { transition: stroke-dasharray .6s ease, stroke-dashoffset .6s ease; }

  @media(max-width: 700px) {
    .emi-grid { grid-template-columns: 1fr !important; }
  }
`;

export default function EMICalculator() {
  const navigate = useNavigate();

  /* ── All original state (unchanged) ── */
  const [loanAmount,     setLoanAmount]     = useState(5000000);
  const [rateOfInterest, setRateOfInterest] = useState(8.5);
  const [loanTenure,     setLoanTenure]     = useState(20);
  const [emi,            setEmi]            = useState(null);
  const [totalAmount,    setTotalAmount]    = useState(null);
  const [totalInterest,  setTotalInterest]  = useState(null);

  /* ── Visual-only state ── */
  const [animKey,   setAnimKey]   = useState(0);
  const [popField,  setPopField]  = useState(null);
  const prevEmi = useRef(null);

  /* ── EMI formula (unchanged) ── */
  useEffect(() => {
    const principal = parseFloat(loanAmount);
    const rate      = parseFloat(rateOfInterest) / 12 / 100;
    const months    = parseFloat(loanTenure) * 12;
    if (principal <= 0 || rateOfInterest < 0 || loanTenure <= 0) return;
    const emiVal  = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const totAmt  = emiVal * months;
    const totInt  = totAmt - principal;
    if (prevEmi.current !== null) setAnimKey(k => k + 1);
    prevEmi.current = emiVal;
    setEmi(emiVal.toFixed(2));
    setTotalAmount(totAmt.toFixed(2));
    setTotalInterest(totInt.toFixed(2));
  }, [loanAmount, rateOfInterest, loanTenure]);

  /* ── formatCurrency (unchanged) ── */
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', minimumFractionDigits:0, maximumFractionDigits:0 }).format(value);

  /* ── Slider pct helper (for gradient fill) ── */
  const pct = (val, min, max) => `${Math.round(((val - min) / (max - min)) * 100)}%`;

  /* ── Donut chart data ── */
  const principal    = parseFloat(loanAmount) || 0;
  const interest     = parseFloat(totalInterest) || 0;
  const total        = principal + interest;
  const principalPct = total > 0 ? (principal / total) * 100 : 50;

  const R = 56;
  const circ = 2 * Math.PI * R;
  const dash = (principalPct / 100) * circ;

  /* ── Slider change with pop animation ── */
  const change = (setter, field) => (e) => {
    setter(parseFloat(e.target.value));
    setPopField(field);
    setTimeout(() => setPopField(null), 220);
  };

  return (
    <div className="emi-page" style={{ minHeight:'100vh', background:'var(--hq-surface,#f7f7f7)', paddingTop:96 }}>
      <style>{CSS}</style>

      <div style={{ maxWidth:960, margin:'0 auto', padding:'0 24px 64px' }}>

        {/* Back + title */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:40 }}>
          <button onClick={() => navigate('/')}
            style={{ width:38, height:38, borderRadius:10, border:'1px solid #e0e0e0', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            <ArrowLeft size={18} color="#555" />
          </button>
          <div>
            <h1 style={{ fontFamily:'DM Serif Display,serif', fontSize:32, fontWeight:400, color:'var(--hq-dark,#222)', margin:0 }}>EMI Calculator</h1>
            <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:14, color:'var(--hq-muted,#717171)', margin:'2px 0 0' }}>Plan your home loan repayments</p>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="emi-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'start' }}>

          {/* ── LEFT — inputs ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
            <h2 style={{ fontFamily:'DM Serif Display,serif', fontSize:28, fontWeight:400, color:'var(--hq-dark,#222)', margin:0 }}>Loan Details</h2>

            {/* Loan Amount */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <span style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:13, fontWeight:500, color:'var(--hq-muted,#717171)' }}>Loan Amount</span>
                <span className={popField==='loan' ? 'val-pop' : ''}
                  style={{ fontFamily:'DM Mono,monospace', fontSize:16, fontWeight:500, color:'var(--hq-teal,#00A699)', display:'inline-block' }}>
                  {formatCurrency(loanAmount)}
                </span>
              </div>
              <input type="range" min="500000" max="50000000" step="100000"
                value={loanAmount} onChange={change(setLoanAmount, 'loan')}
                className="emi-range"
                style={{ '--pct': pct(loanAmount, 500000, 50000000) }}
              />
              <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'Inter,system-ui,sans-serif', fontSize:11, color:'var(--hq-muted,#717171)', marginTop:6 }}>
                <span>₹5 L</span><span>₹5 Cr</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <span style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:13, fontWeight:500, color:'var(--hq-muted,#717171)' }}>Interest Rate (p.a.)</span>
                <span className={popField==='rate' ? 'val-pop' : ''}
                  style={{ fontFamily:'DM Mono,monospace', fontSize:16, fontWeight:500, color:'var(--hq-teal,#00A699)', display:'inline-block' }}>
                  {parseFloat(rateOfInterest).toFixed(1)}%
                </span>
              </div>
              <input type="range" min="3" max="15" step="0.1"
                value={rateOfInterest} onChange={change(setRateOfInterest, 'rate')}
                className="emi-range"
                style={{ '--pct': pct(rateOfInterest, 3, 15) }}
              />
              <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'Inter,system-ui,sans-serif', fontSize:11, color:'var(--hq-muted,#717171)', marginTop:6 }}>
                <span>3%</span><span>15%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <span style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:13, fontWeight:500, color:'var(--hq-muted,#717171)' }}>Loan Tenure</span>
                <span className={popField==='tenure' ? 'val-pop' : ''}
                  style={{ fontFamily:'DM Mono,monospace', fontSize:16, fontWeight:500, color:'var(--hq-teal,#00A699)', display:'inline-block' }}>
                  {loanTenure} yrs
                </span>
              </div>
              <input type="range" min="1" max="30" step="1"
                value={loanTenure} onChange={change(setLoanTenure, 'tenure')}
                className="emi-range"
                style={{ '--pct': pct(loanTenure, 1, 30) }}
              />
              <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'Inter,system-ui,sans-serif', fontSize:11, color:'var(--hq-muted,#717171)', marginTop:6 }}>
                <span>1 yr</span><span>30 yrs</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT — result card ── */}
          {emi && (
            <div style={{ borderRadius:20, background:'linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%)', padding:36, boxShadow:'0 24px 64px rgba(0,0,0,0.22)' }}>

              {/* Monthly EMI */}
              <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.1em', color:'rgba(255,255,255,.5)', margin:'0 0 6px' }}>
                Monthly EMI
              </p>
              <p key={animKey} className="emi-val-enter"
                style={{ fontFamily:'DM Mono,monospace', fontSize:'clamp(32px,5vw,48px)', fontWeight:500, color:'var(--hq-teal,#00A699)', margin:'0 0 28px', lineHeight:1 }}>
                {formatCurrency(emi)}
              </p>

              {/* Two smaller stats */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:28 }}>
                {[
                  { label:'Total Interest', value: formatCurrency(totalInterest) },
                  { label:'Total Amount',   value: formatCurrency(totalAmount) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background:'rgba(255,255,255,.06)', borderRadius:12, padding:'14px 16px' }}>
                    <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em', color:'rgba(255,255,255,.45)', margin:'0 0 4px' }}>{label}</p>
                    <p style={{ fontFamily:'DM Mono,monospace', fontSize:20, fontWeight:500, color:'#fff', margin:0 }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ borderTop:'1px solid rgba(255,255,255,.1)', marginBottom:24 }} />

              {/* Donut chart */}
              <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em', color:'rgba(255,255,255,.45)', margin:'0 0 16px' }}>
                Principal vs Interest
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:24 }}>
                <svg width={140} height={140} viewBox="0 0 140 140" style={{ flexShrink:0 }}>
                  <circle cx="70" cy="70" r={R} fill="none" stroke="var(--hq-red,#FF5A5F)" strokeWidth="18" />
                  <circle cx="70" cy="70" r={R} fill="none" stroke="var(--hq-teal,#00A699)" strokeWidth="18"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeDashoffset={circ * 0.25}
                    strokeLinecap="round"
                    className="donut-ring"
                  />
                  <text x="70" y="66" textAnchor="middle" fill="#fff" fontSize="13" fontFamily="Inter,system-ui,sans-serif" fontWeight="600">{principalPct.toFixed(0)}%</text>
                  <text x="70" y="82" textAnchor="middle" fill="rgba(255,255,255,.5)" fontSize="9" fontFamily="Inter,system-ui,sans-serif">Principal</text>
                </svg>
                <div style={{ display:'flex', flexDirection:'column', gap:10, flex:1 }}>
                  {[
                    { color:'var(--hq-teal,#00A699)', label:'Principal', value:formatCurrency(loanAmount) },
                    { color:'var(--hq-red,#FF5A5F)',  label:'Interest',  value:formatCurrency(totalInterest) },
                  ].map(({ color, label, value }) => (
                    <div key={label} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:color, flexShrink:0 }} />
                      <div>
                        <p style={{ fontFamily:'Inter,system-ui,sans-serif', fontSize:11, color:'rgba(255,255,255,.5)', margin:0 }}>{label}</p>
                        <p style={{ fontFamily:'DM Mono,monospace', fontSize:13, color:'#fff', margin:0 }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

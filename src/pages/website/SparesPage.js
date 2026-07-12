import { useState, useEffect } from 'react';
import '../../website.css';
import { Search, Package, Filter, X } from 'lucide-react';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}
import api from '../../services/api';

const CATS = ['ALL','FILTER','MEMBRANE','ELECTRICAL','PLUMBING','HARDWARE','HOUSING'];

const CAT_COLORS = {
  FILTER:     { bg:'#e0f9e0', color:'#009B00' },
  MEMBRANE:   { bg:'#dbeafe', color:'#1e40af' },
  ELECTRICAL: { bg:'#fef3c7', color:'#92400e' },
  PLUMBING:   { bg:'#ede9fe', color:'#5b21b6' },
  HARDWARE:   { bg:'#fee2e2', color:'#991b1b' },
  HOUSING:    { bg:'#f0fdf4', color:'#065f46' },
};

const FALLBACK_SPARES = [
  { id:1, name:'EAU Per Carbon Filter', category:'FILTER', brand:'EAU', description:'Pre-carbon activated carbon block filter for chlorine and chemical removal. 10-inch standard size.', imageUrl:'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop&q=85', currentStock:50 },
  { id:2, name:'Merit 80 GPD Membrane', category:'MEMBRANE', brand:'MERIT', description:'Merit brand 80 GPD RO membrane. High rejection rate 99%. Compatible with most domestic purifiers.', imageUrl:'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop&q=85', currentStock:20 },
  { id:3, name:'Shine SMPS 24V 1.5A', category:'ELECTRICAL', brand:'SHINE', description:'24V 1.5A SMPS power adapter for domestic RO purifiers.', imageUrl:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&q=85', currentStock:15 },
  { id:4, name:'Elbow 1/4 Inch', category:'PLUMBING', brand:'GENERIC', description:'Standard 1/4 inch push-fit elbow for RO water line routing.', imageUrl:'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop&q=85', currentStock:60 },
];

export default function SparesPage() {
  const [items, setItems] = useState(FALLBACK_SPARES);
  const [cat, setCat] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  useReveal();

  useEffect(() => {
    api.get('/stock')
      .then(r => { const d = r.data.data?.content || r.data.data || []; if (d.length) setItems(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(i => {
    const matchCat = cat === 'ALL' || i.category === cat;
    const q = search.toLowerCase();
    const matchSearch = !search || i.name?.toLowerCase().includes(q) || i.brand?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#009B00,#007A00)', padding: '60px 0 40px', textAlign: 'center' }}>
        <div className="site-max">
          <span className="section-tag" style={{ background: 'rgba(127,232,197,.2)', color: '#7fff7f' }}>Spare Parts</span>
          <h1 className="poppins" style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 900, color: '#fff', marginTop: 12, marginBottom: 12 }}>
            Genuine RO Spare Parts
          </h1>
          <p style={{ color: '#a0ffa0', fontSize: 15, maxWidth: 520, margin: '0 auto 28px' }}>
            Filters, membranes, solenoid valves, SMPS, fittings and more — all genuine parts for all major brands.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto' }}>
            <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9aa0a6' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search filters, membranes, valves, pipes…"
              style={{ width: '100%', padding: '13px 16px 13px 44px', borderRadius: 16, border: 'none', fontSize: 14, outline: 'none', color: '#1E293B', fontFamily: 'inherit' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9aa0a6' }}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="site-max" style={{ padding: '36px 20px 80px' }}>
        {/* Category filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32, justifyContent: 'center' }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '8px 20px', borderRadius: 999, fontSize: 12, fontWeight: 700,
              border: '1.5px solid', cursor: 'pointer', transition: 'all .15s',
              background: cat === c ? '#009B00' : '#fff',
              color: cat === c ? '#fff' : '#64748B',
              borderColor: cat === c ? '#009B00' : '#e2e8f0',
              boxShadow: cat === c ? '0 4px 14px rgba(0,155,0,.25)' : 'none',
            }}>{c}</button>
          ))}
        </div>

        {/* Results count */}
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24, textAlign: 'center' }}>
          {loading ? 'Loading…' : `${filtered.length} part${filtered.length !== 1 ? 's' : ''} found${search ? ` for "${search}"` : ''}`}
        </p>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
          {filtered.map((item, i) => {
            const c = CAT_COLORS[item.category] || { bg: '#f1f5f9', color: '#475569' };
            return (
              <div key={item.id} className="reveal" style={{
                background: '#fff', borderRadius: 20, overflow: 'hidden',
                border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,.04)',
                transition: 'all .25s', transitionDelay: `${(i % 12) * 0.04}s`,
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,155,0,.12)'; e.currentTarget.style.borderColor = '#a0ffa0'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.04)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
              >
                {/* Image */}
                <div style={{ height: 180, overflow: 'hidden', position: 'relative', background: '#f8fafc' }}>
                  <img src={item.imageUrl || 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop&q=85'}
                    alt={item.name}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop&q=85'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.target.style.transform = 'none'}
                  />
                  <div style={{ position: 'absolute', top: 10, left: 10, padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: c.bg, color: c.color }}>
                    {item.category}
                  </div>
                  {item.brand && item.brand !== 'GENERIC' && (
                    <div style={{ position: 'absolute', top: 10, right: 10, padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: 'rgba(0,155,0,.85)', color: '#7fff7f' }}>
                      {item.brand}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: '16px' }}>
                  <div className="poppins" style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 6, lineHeight: 1.3 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6, marginBottom: 14 }}>{item.description?.slice(0, 85)}{item.description?.length > 85 ? '…' : ''}</div>

                  {/* Stock indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.currentStock > 10 ? '#009B00' : item.currentStock > 0 ? '#F59E0B' : '#EF4444' }} />
                      <span style={{ color: item.currentStock > 10 ? '#065f46' : item.currentStock > 0 ? '#92400e' : '#991b1b' }}>
                        {item.currentStock > 10 ? 'In Stock' : item.currentStock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    {item.unit && <span style={{ fontSize: 10, color: '#9aa0a6', background: '#f1f5f9', padding: '2px 8px', borderRadius: 6 }}>per {item.unit}</span>}
                  </div>

                  <a href="tel:09952828740" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: '9px', borderRadius: 12, background: '#009B00', color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none', transition: 'all .2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#007A00'}
                    onMouseLeave={e => e.currentTarget.style.background = '#009B00'}
                  >
                    📞 Call for Price
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div className="poppins" style={{ fontSize: 18, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>No parts found</div>
            <div style={{ color: '#64748B', fontSize: 14 }}>Try a different search or category filter.</div>
            <button onClick={() => { setSearch(''); setCat('ALL'); }} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 12, background: '#009B00', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

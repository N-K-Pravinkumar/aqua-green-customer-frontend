import { useState, useEffect } from 'react';
import '../../website.css';
import { Link } from 'react-router-dom';
import { Grid2X2, Images, Camera, X, ChevronLeft, ChevronRight, ZoomIn, Phone, MessageSquare, FileText } from 'lucide-react';
import { galleryAPI } from '../../services/api';
import EnquiryModal from '../../components/website/EnquiryModal';

const CATS = [
  { key:'ALL',          label:'All Photos',    emoji:'🖼️' },
  { key:'INSTALLATION', label:'Installations', emoji:'📐' },
  { key:'SERVICE',      label:'Service',       emoji:'🔧' },
  { key:'PRODUCT',      label:'Products',      emoji:'💧' },
  { key:'TEAM',         label:'Our Team',      emoji:'👷' },
  { key:'COMMERCIAL',   label:'Commercial',    emoji:'🏢' },
];
const FALLBACK = 'https://images.unsplash.com/photo-1581092162384-8987c1d64926?w=400&h=300&fit=crop&q=80';

export default function GalleryPage() {
  const [items,     setItems]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [cat,       setCat]       = useState('ALL');
  const [lightbox,  setLightbox]  = useState(null);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const filtered = cat==='ALL' ? items : items.filter(i=>i.category===cat);
  const lbIdx = lightbox !== null ? filtered.findIndex(i=>i.id===lightbox) : -1;

  useEffect(()=>{ galleryAPI.getAll().then(r=>setItems(r.data.data||[])).catch(()=>{}).finally(()=>setLoading(false)); },[]);
  useEffect(()=>{ const fn=e=>{if(e.key==='Escape')setLightbox(null);if(e.key==='ArrowRight')navLb(1);if(e.key==='ArrowLeft')navLb(-1);}; window.addEventListener('keydown',fn); return()=>window.removeEventListener('keydown',fn); },[lbIdx, filtered.length]);

  const navLb = (dir) => {
    if (lbIdx < 0) return;
    setLightbox(filtered[(lbIdx+dir+filtered.length)%filtered.length].id);
  };

  return (
    <div>
      {/* Header */}
      <div className="pw-page-hero" style={{ background:'linear-gradient(135deg,#0F9D58,#065F46)', padding:'clamp(40px,5vw,60px) 0 clamp(32px,4vw,44px)' }}>
        <div className="site-max" style={{ textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,.1)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,.2)', color:'#a7f3d0', fontSize:12, fontWeight:700, padding:'6px 14px', borderRadius:20, marginBottom:16, letterSpacing:'1px', textTransform:'uppercase' }}>
            <Camera size={13}/>Our Gallery
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(28px,5vw,44px)', fontWeight:900, color:'#fff', marginBottom:8 }}>Work Speaks for Itself</h1>
          <p style={{ color:'rgba(255,255,255,.75)', fontSize:'clamp(13px,1.8vw,16px)', maxWidth:500, margin:'0 auto' }}>
            Real installations, service visits and happy customers across Coimbatore.
          </p>
        </div>
      </div>

      <div className="site-max" style={{ padding:'clamp(24px,3vw,40px) clamp(12px,4vw,32px)' }}>
        {/* Category filter */}
        <div className="filter-bar" style={{ justifyContent:'center', marginBottom:28 }}>
          {CATS.map(c => (
            <button key={c.key} className={`filter-btn${cat===c.key?' active':''}`} onClick={()=>setCat(c.key)} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span>{c.emoji}</span>{c.label}
              <span style={{ marginLeft:2, fontSize:10, opacity:.7 }}>
                ({c.key==='ALL' ? items.length : items.filter(i=>i.category===c.key).length})
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12 }}>
            {[...Array(9)].map((_,i)=><div key={i} className="skeleton" style={{ height:220, borderRadius:14 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Images size={48} style={{ marginBottom:14, opacity:.3 }}/>
            <p>No photos in this category yet</p>
          </div>
        ) : (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12, marginBottom:16 }}>
              {filtered.map((item, i) => (
                <div key={item.id} className="gallery-item"
                  style={{ borderRadius:14, aspectRatio:'4/3', overflow:'hidden', cursor:'pointer', animation:`scaleIn .4s ease ${i*30}ms both` }}
                  onClick={()=>setLightbox(item.id)}
                >
                  <img src={item.imageUrl} alt={item.imageAlt||`${item.title} - Aqua Green Agencies`}
                    style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                    onError={e=>e.target.src=FALLBACK} loading="lazy" />
                  <div className="gallery-overlay" style={{ borderRadius:14 }}>
                    <ZoomIn size={30} color="#fff" className="gallery-zoom" />
                  </div>
                  <div style={{ position:'absolute', top:8, left:8 }}>
                    <span style={{ background:'rgba(0,155,0,.85)', backdropFilter:'blur(4px)', color:'#a7f3d0', fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:10 }}>{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center', color:'#9ca3af', fontSize:13 }}>
              Showing {filtered.length} photos
            </div>
          </>
        )}

        {/* CTA */}
        <div style={{ textAlign:'center', marginTop:48, background:'linear-gradient(135deg,#0F9D58,#065F46)', borderRadius:20, padding:'clamp(28px,4vw,44px)' }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(20px,3vw,28px)', fontWeight:800, color:'#fff', marginBottom:8 }}>Want an Installation at Your Home?</h3>
          <p style={{ color:'rgba(255,255,255,.75)', marginBottom:24, fontSize:14 }}>Get a free site visit and water quality test today.</p>
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={()=>setEnquireOpen(true)} style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'12px 22px', background:'#fff', color:'#0F9D58', fontWeight:800, fontSize:14, borderRadius:10, border:'none', cursor:'pointer', transition:'all .2s' }}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}>
              <FileText size={15}/>Get Free Quote
            </button>
            <a href="tel:09952828740" style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'12px 22px', background:'transparent', border:'2px solid rgba(255,255,255,.7)', color:'#fff', fontWeight:700, fontSize:14, borderRadius:10, textDecoration:'none', transition:'all .2s' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.12)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <Phone size={15}/>Call Now
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && lbIdx >= 0 && (
        <div className="lightbox-overlay" onClick={()=>setLightbox(null)}>
          <button className="lightbox-close" onClick={()=>setLightbox(null)} aria-label="Close"><X size={20}/></button>
          <button className="lightbox-nav lightbox-prev" onClick={e=>{e.stopPropagation();navLb(-1);}} aria-label="Previous"><ChevronLeft size={24}/></button>
          <div onClick={e=>e.stopPropagation()} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
            <img src={filtered[lbIdx].imageUrl} alt={filtered[lbIdx].imageAlt||filtered[lbIdx].title}
              className="lightbox-img" onError={e=>e.target.src=FALLBACK} />
            <div style={{ background:'rgba(255,255,255,.1)', backdropFilter:'blur(8px)', borderRadius:12, padding:'10px 20px', textAlign:'center', maxWidth:'min(500px,90vw)' }}>
              <div style={{ color:'#fff', fontWeight:700, fontSize:15 }}>{filtered[lbIdx].title}</div>
              {filtered[lbIdx].description && <div style={{ color:'rgba(255,255,255,.65)', fontSize:12, marginTop:4 }}>{filtered[lbIdx].description}</div>}
            </div>
            <div style={{ color:'rgba(255,255,255,.45)', fontSize:12 }}>{lbIdx+1} / {filtered.length} · ← → keys to navigate</div>
          </div>
          <button className="lightbox-nav lightbox-next" onClick={e=>{e.stopPropagation();navLb(1);}} aria-label="Next"><ChevronRight size={24}/></button>
        </div>
      )}

      <EnquiryModal isOpen={enquireOpen} onClose={()=>setEnquireOpen(false)} product={null} />
      <a href="https://wa.me/919952828740" className="wa-float" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageSquare size={24} color="#fff"/></a>
    </div>
  );
}

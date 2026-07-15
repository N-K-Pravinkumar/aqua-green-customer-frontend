import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle, MessageSquare, Phone, MapPin, Clock,
  Star, ArrowRight, Droplets, Shield, Zap, BadgeCheck,
  Instagram, Facebook, Youtube, Twitter, Mail,
  ChevronRight, Heart, Award, Users
} from 'lucide-react';

// ══════════════════════════════════════════════════════════════
// PRICE DISPLAY
// ══════════════════════════════════════════════════════════════
export function PriceDisplay({ price, originalPrice, pricingMode, size = 'md', onEnquire }) {
  const fs = size === 'lg' ? 26 : size === 'sm' ? 14 : 20;
  const savings = originalPrice && price
    ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  // FREE service
  if (pricingMode === 'FREE' || ((!price || Number(price) === 0) && pricingMode !== 'CONTACT_FOR_PRICE'))
    return <span style={{ fontSize: fs, fontWeight: 900, color: '#008800' }}>FREE</span>;

  // Enquire for best price — no price shown
  if (pricingMode === 'HIDE_PRICE' || pricingMode === 'CONTACT_FOR_PRICE' || !price || Number(price) === 0)
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={e => { e.stopPropagation(); onEnquire && onEnquire(); }}
          style={{
            background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', color: '#fff',
            border: 'none', borderRadius: 8, padding: '8px 16px',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
          📩 Enquire for Best Price
        </button>
        <span style={{ fontSize: 10, background: '#e0f9e0', color: '#0F9D58', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>Best Price</span>
      </div>
    );

  // Show price
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ fontSize: fs, fontWeight: 900, color: '#0F9D58', letterSpacing: '-0.5px' }}>
        ₹{Number(price).toLocaleString('en-IN')}
      </span>
      {originalPrice && Number(originalPrice) > Number(price) && (
        <span style={{ fontSize: fs - 6, color: '#9ca3af', textDecoration: 'line-through' }}>
          ₹{Number(originalPrice).toLocaleString('en-IN')}
        </span>
      )}
      {savings > 0 && (
        <span style={{ fontSize: 11, background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>
          {savings}% OFF
        </span>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PRODUCT CARD
// ══════════════════════════════════════════════════════════════
export function ProductCard({ product, onEnquire }) {
  const [imgErr, setImgErr] = useState(false);
  const [hovered, setHovered] = useState(false);
  const fallback = 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=280&fit=crop&q=80';
  const features = product.features ? product.features.split(',').slice(0, 3) : [];
  const isEnquireOnly = !product.price || Number(product.price) === 0
    || product.pricingMode === 'HIDE_PRICE' || product.pricingMode === 'CONTACT_FOR_PRICE';
  const isFree = product.pricingMode === 'FREE';
  const savings = product.originalPrice && product.price && Number(product.originalPrice) > Number(product.price)
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onEnquire && onEnquire(product)}
      style={{ cursor: 'pointer' }}
    >
      {/* Image */}
      <div className="product-img" style={{ position: 'relative', height: 200 }}>
        <img
          src={imgErr ? fallback : (product.imageUrl || fallback)}
          alt={product.imageAlt || `${product.name} - RO Water Purifier Coimbatore`}
          onError={() => setImgErr(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease', transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
        />
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <span style={{ background: 'rgba(0,155,0,.85)', backdropFilter: 'blur(6px)', color: '#a7f3d0', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, letterSpacing: '0.5px' }}>
            {product.category || 'RO Purifier'}
          </span>
        </div>
        {/* Badge: % OFF or Best Price */}
        {!isEnquireOnly && savings > 0 && (
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <span style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 20 }}>
              {savings}% OFF
            </span>
          </div>
        )}
        {isEnquireOnly && !isFree && (
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <span style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 20 }}>
              Best Price
            </span>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,155,0,.5) 0%, transparent 60%)', opacity: hovered ? 1 : 0, transition: 'opacity .3s ease' }} />
      </div>

      {/* Content */}
      <div style={{ padding: '18px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.3, color: '#111827', margin: 0 }}>{product.name}</h3>
        <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.65, flex: 1, margin: 0 }}>
          {product.description?.slice(0, 90)}{product.description?.length > 90 ? '…' : ''}
        </p>
        {features.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#374151' }}>
                <CheckCircle size={12} color="#008800" style={{ flexShrink: 0 }} />
                <span>{f.trim()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price or "Enquire for Best Price" */}
        {isFree ? (
          <span style={{ fontSize: 20, fontWeight: 900, color: '#008800' }}>FREE</span>
        ) : isEnquireOnly ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', fontStyle: 'italic' }}>Enquire for Best Price</span>
            <span style={{ fontSize: 10, background: '#fff8e7', color: '#854F0B', padding: '2px 7px', borderRadius: 8, fontWeight: 700, border: '1px solid #EF9F27' }}>No hidden charges</span>
          </div>
        ) : (
          <PriceDisplay price={product.price} originalPrice={product.originalPrice} pricingMode={product.pricingMode} size="md" onEnquire={() => onEnquire && onEnquire(product)} />
        )}

        {/* CTA button */}
        <button
          onClick={e => { e.stopPropagation(); onEnquire && onEnquire(product); }}
          style={{
            width: '100%', padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: isEnquireOnly && !isFree
              ? 'linear-gradient(135deg,#f59e0b,#fbbf24)'
              : 'linear-gradient(135deg,#0F9D58,#065F46)',
            color: '#fff', fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            transition: 'all .2s', boxShadow: '0 2px 8px rgba(0,155,0,.25)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,155,0,.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,155,0,.25)'; }}
        >
          <MessageSquare size={15} />
          {isFree ? 'Book Free Service' : isEnquireOnly ? 'Get Best Price' : 'Enquire Now'}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// FLOATING BRAND LOGOS
// ══════════════════════════════════════════════════════════════
const BRAND_DATA = {
  'Kent':         { bg:'linear-gradient(145deg,#0d2060,#1a3a8c)', logo:'KENT',         tagline:'House of Purity',      badge:'💧', accent:'#4fc3f7', logoFont:"'Arial Black',sans-serif", logoSize:26, logoColor:'#fff', logoSpacing:'-1px' },
  'Aquaguard':    { bg:'linear-gradient(145deg,#005ab5,#0075e0)', logo:'aquaguard',     tagline:'Since 1984',           badge:'🌊', accent:'#80d8ff', logoFont:"'Arial',sans-serif",       logoSize:19, logoColor:'#fff', logoSpacing:'-0.5px' },
  'Livpure':      { bg:'linear-gradient(145deg,#007a3d,#00a651)', logo:'Livpure',       tagline:'Be 100% Sure',         badge:'✅', accent:'#69f0ae', logoFont:"'Arial',sans-serif",       logoSize:23, logoColor:'#fff', logoSpacing:'-0.5px' },
  'Pureit':       { bg:'linear-gradient(145deg,#002876,#003087)', logo:'Pureit',        tagline:'Hindustan Unilever',   badge:'⭐', accent:'#FFD700', logoFont:"'Arial Black',sans-serif", logoSize:24, logoColor:'#FFD700', logoSpacing:'0px' },
  'AO Smith':     { bg:'linear-gradient(145deg,#a50020,#c8102e)', logo:'A.O.Smith',     tagline:'Think Big. Think Blue.',badge:'🔵',accent:'#ef9a9a', logoFont:"'Georgia',serif",          logoSize:18, logoColor:'#fff', logoSpacing:'0.5px' },
  'Blue Star':    { bg:'linear-gradient(145deg,#002a5e,#003d7a)', logo:'Blue★Star',    tagline:'Cool Business Experts', badge:'❄️',accent:'#5bc8f5', logoFont:"'Arial',sans-serif",       logoSize:18, logoColor:'#5bc8f5', logoSpacing:'0.5px' },
  'Havells':      { bg:'linear-gradient(145deg,#b00010,#e31837)', logo:'HAVELLS',       tagline:'Cradle of Genius',     badge:'⚡', accent:'#ff8a80', logoFont:"'Arial Black',sans-serif", logoSize:18, logoColor:'#fff', logoSpacing:'2.5px' },
  'LG':           { bg:'linear-gradient(145deg,#820028,#a50034)', logo:'LG',            tagline:"Life's Good",          badge:'🏆', accent:'#ff8a80', logoFont:"'Arial Black',sans-serif", logoSize:36, logoColor:'#fff', logoSpacing:'-1px' },
  'V-Guard':      { bg:'linear-gradient(145deg,#002460,#003580)', logo:'V-Guard',       tagline:'Switchgear & Systems', badge:'🛡️',accent:'#ffcc00', logoFont:"'Arial',sans-serif",       logoSize:20, logoColor:'#ffcc00', logoSpacing:'0px' },
  'Eureka Forbes':{ bg:'linear-gradient(145deg,#990000,#cc0000)', logo:'Eureka Forbes', tagline:'Healthier Way to Live',badge:'💪', accent:'#ff8a80', logoFont:"'Arial',sans-serif",       logoSize:15, logoColor:'#fff', logoSpacing:'-0.3px' },
  'Aqua Fresh':   { bg:'linear-gradient(145deg,#0076a3,#0891b2)', logo:'Aqua Fresh',    tagline:'Pure & Fresh Water',   badge:'🌿', accent:'#a7f3d0', logoFont:"'Arial',sans-serif",       logoSize:18, logoColor:'#fff', logoSpacing:'0px' },
  'Aqua Grand':   { bg:'linear-gradient(145deg,#142870,#1d3a8a)', logo:'AQUA GRAND',   tagline:'Grand Quality Water',  badge:'👑', accent:'#fbbf24', logoFont:"'Arial Black',sans-serif", logoSize:13, logoColor:'#fbbf24', logoSpacing:'1.5px' },
  'Aqua Pearl':   { bg:'linear-gradient(145deg,#450f9e,#5b21b6)', logo:'Aqua Pearl',    tagline:'Pure as a Pearl',      badge:'💎', accent:'#ce93d8', logoFont:"'Georgia',serif",          logoSize:18, logoColor:'#e9d5ff', logoSpacing:'0px' },
  'Aqua Crystal': { bg:'linear-gradient(145deg,#0a5752,#0f766e)', logo:'AquaCrystal',  tagline:'Crystal Clear Water',  badge:'🔮', accent:'#99f6e4', logoFont:"'Arial',sans-serif",       logoSize:15, logoColor:'#99f6e4', logoSpacing:'0px' },
  'Aqua Supreme': { bg:'linear-gradient(145deg,#142040,#1e3a5f)', logo:'AQUA SUPREME', tagline:'Supreme Purity',       badge:'🌟', accent:'#f59e0b', logoFont:"'Arial Black',sans-serif", logoSize:12, logoColor:'#fff', logoSpacing:'2px' },
};

function FloatingBrandCard({ brand, index }) {
  const [hov, setHov] = useState(false);
  const d = BRAND_DATA[brand.name] || { bg:'linear-gradient(145deg,#0F9D58,#062e23)', logo:brand.name, tagline:'Water Purifier', badge:'💧', accent:'#a7f3d0', logoFont:"Arial", logoSize:16, logoColor:'#fff', logoSpacing:'0px' };
  const floatDelay = (index * 0.2).toFixed(1) + 's';
  const floatDur = (4.0 + (index % 4) * 0.3).toFixed(1) + 's';
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flexShrink: 0, width: 148, height: 92, borderRadius: 16,
        background: d.bg, cursor: 'pointer', overflow: 'hidden', userSelect: 'none', position: 'relative',
        transition: 'transform .28s cubic-bezier(.34,1.56,.64,1), box-shadow .28s ease',
        transform: hov ? 'translateY(-10px) scale(1.06)' : 'translateY(0) scale(1)',
        boxShadow: hov
          ? `0 20px 40px rgba(0,0,0,.35), 0 0 0 1.5px ${d.accent}55, inset 0 1px 0 rgba(255,255,255,.15)`
          : `0 4px 14px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.1)`,
        animation: `brandFloat ${floatDur} ease-in-out ${floatDelay} infinite`,
      }}
    >
      {/* Glass sheen */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,rgba(255,255,255,.12) 0%,rgba(255,255,255,0) 55%)', pointerEvents:'none' }} />
      {/* Glow orb */}
      <div style={{ position:'absolute', bottom:-20, right:-20, width:70, height:70, borderRadius:'50%', background:`radial-gradient(circle,${d.accent}28 0%,transparent 70%)`, pointerEvents:'none' }} />
      {/* Badge */}
      <div style={{ position:'absolute', top:8, right:8, background:'rgba(255,255,255,.14)', backdropFilter:'blur(4px)', borderRadius:14, padding:'2px 6px', fontSize:12, zIndex:3, border:`1px solid ${d.accent}25` }}>{d.badge}</div>
      {/* Content */}
      <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', padding:'10px 13px' }}>
        <div style={{ fontFamily:d.logoFont, fontSize:d.logoSize, fontWeight:900, color:d.logoColor, letterSpacing:d.logoSpacing, lineHeight:1.1, textShadow:`0 1px 8px rgba(0,0,0,.3), 0 0 20px ${d.accent}35`, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.logo}</div>
        <div style={{ width: hov ? 38 : 24, height:2, background:`linear-gradient(90deg,${d.accent},transparent)`, borderRadius:2, margin:'5px 0 4px', transition:'width .3s ease' }} />
        <div style={{ fontSize:9.5, color:'rgba(255,255,255,.65)', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.tagline}</div>
      </div>
    </div>
  );
}

export function BrandMarquee({ brands = [] }) {
  const styleRef = useRef(false);
  useEffect(() => {
    if (styleRef.current) return;
    styleRef.current = true;
    const s = document.createElement('style');
    s.textContent = `
      @keyframes brandFloat { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-6px) rotate(.4deg)} 66%{transform:translateY(-3px) rotate(-.3deg)} }
      @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    `;
    document.head.appendChild(s);
  }, []);

  if (!brands.length) return null;
  const doubled = [...brands, ...brands];
  return (
    <div style={{ overflow:'hidden', width:'100%', maskImage:'linear-gradient(to right,transparent,black 6%,black 94%,transparent)', WebkitMaskImage:'linear-gradient(to right,transparent,black 6%,black 94%,transparent)', padding:'14px 0' }}>
      <div
        style={{ display:'flex', gap:14, width:'max-content', animation:'marquee 36s linear infinite', willChange:'transform' }}
        onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
        onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
      >
        {doubled.map((b, i) => <FloatingBrandCard key={i} brand={b} index={i % brands.length} />)}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// FOOTER
// ══════════════════════════════════════════════════════════════
export function Footer() {
  const QUICK = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/services', label: 'Services' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact Us' },
  ];
  const SERVICES = ['RO Installation', 'Filter Replacement', 'Annual Service', 'Leakage Repair', 'Water TDS Test', 'Membrane Replacement'];

  return (
    <footer style={{ background: 'linear-gradient(180deg,#0a2e1e 0%,#061a10 100%)', color: '#fff', paddingTop: 'clamp(40px,6vw,72px)' }}>
      <div className="container">
        <div className="footer-grid">

          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <img src="/aga-logo.jpeg" alt="Aqua Green Agencies" style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid rgba(127,232,197,.4)', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px', lineHeight: 1.2 }}>Aqua Green Agencies</div>
                <div style={{ fontSize: 10, color: '#a7f3d0', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 2 }}>RO Water · Coimbatore</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.75, marginBottom: 20 }}>
              Coimbatore's most trusted RO water purifier dealer since 2011. Sales, service and repairs for all major brands.
            </p>
            {/* Rating badges */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              {[['⭐ 4.9', 'Google'], ['⭐ 4.8', 'Justdial']].map(([r, s]) => (
                <div key={s} style={{ background: 'rgba(127,232,197,.1)', border: '1px solid rgba(127,232,197,.2)', borderRadius: 8, padding: '6px 12px', fontSize: 12 }}>
                  <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: 13 }}>{r}</div>
                  <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 10 }}>{s} Rating</div>
                </div>
              ))}
            </div>
            {/* Social */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { icon: <Facebook size={16} />, color: '#1877f2', label: 'Facebook' },
                { icon: <Instagram size={16} />, color: '#e1306c', label: 'Instagram' },
                { icon: <Youtube size={16} />, color: '#ff0000', label: 'YouTube' },
                { icon: <Twitter size={16} />, color: '#1da1f2', label: 'Twitter' },
              ].map(s => (
                <a key={s.label} href="#" aria-label={s.label} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all .2s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = s.color; e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)'; e.currentTarget.style.transform = 'none'; }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#a7f3d0', marginBottom: 18 }}>Quick Links</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {QUICK.map(q => (
                <Link key={q.to} to={q.to} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'rgba(255,255,255,.65)', textDecoration: 'none', transition: 'all .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#a7f3d0'; e.currentTarget.style.paddingLeft = '4px'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.65)'; e.currentTarget.style.paddingLeft = '0'; }}>
                  <ChevronRight size={13} color="#a7f3d0" />
                  {q.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#a7f3d0', marginBottom: 18 }}>Our Services</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SERVICES.map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'rgba(255,255,255,.65)' }}>
                  <Droplets size={12} color="#a7f3d0" style={{ flexShrink: 0 }} />
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#a7f3d0', marginBottom: 18 }}>Contact Info</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: <MapPin size={15} />, lines: ['29, R.V.L. Nagar', 'ESI Hospital Opposite, Upilipalayam (PO), Coimbatore - 641015'] },
                { icon: <Phone size={15} />, lines: ['09952828740'], link: 'tel:09952828740' },
                { icon: <MessageSquare size={15} />, lines: ['+91 99528 28740'], link: 'https://wa.me/919952828740' },
                { icon: <Mail size={15} />, lines: ['pravinkathirneels24@gmail.com'], link: 'mailto:pravinkathirneels24@gmail.com' },
                { icon: <Clock size={15} />, lines: ['Mon – Sun: 9 AM – 8:45 PM'] },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(127,232,197,.1)', border: '1px solid rgba(127,232,197,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a7f3d0', flexShrink: 0 }}>
                    {c.icon}
                  </div>
                  <div>
                    {c.lines.map((l, j) => c.link
                      ? <a key={j} href={c.link} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,.7)', textDecoration: 'none', lineHeight: 1.6 }} onMouseEnter={e => e.target.style.color = '#a7f3d0'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.7)'}>{l}</a>
                      : <div key={j} style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', lineHeight: 1.6 }}>{l}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', marginTop: 'clamp(32px,4vw,48px)', padding: 'clamp(14px,2vw,20px) 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', display: 'flex', alignItems: 'center', gap: 6 }}>
            © {new Date().getFullYear()} Aqua Green Agencies. Made with <Heart size={12} color="#ef4444" fill="#ef4444" /> in Coimbatore.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Use', 'Sitemap'].map(t => (
              <a key={t} href="#" style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => e.target.style.color = '#a7f3d0'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.35)'}>
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════
// ANIMATED COUNTER (used in WebsitePages.js)
// ══════════════════════════════════════════════════════════════
export function AnimatedCounter({ end, suffix = '', prefix = '', label, icon }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSeen(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!seen) return;
    let s = 0;
    const steps = 55, dur = 2000;
    const isDecimal = end % 1 !== 0;
    const t = setInterval(() => {
      s += end / steps;
      if (s >= end) { setCount(end); clearInterval(t); }
      else setCount(isDecimal ? Math.round(s * 10) / 10 : Math.floor(s));
    }, dur / steps);
    return () => clearInterval(t);
  }, [seen, end]);

  const displayVal = end % 1 !== 0 ? count.toFixed(1) : count.toLocaleString('en-IN');

  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '16px 8px' }}>
      <div style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: '#a7f3d0', fontFamily: "'Playfair Display',serif", lineHeight: 1, letterSpacing: '-1px' }}>
        {prefix}{displayVal}{suffix}
      </div>
      {label && <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', marginTop: 6, fontWeight: 600 }}>{label}</div>}
    </div>
  );
}

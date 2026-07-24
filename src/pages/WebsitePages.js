import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Phone, MessageCircle, ChevronRight, ChevronDown,
  Droplets, Shield, Leaf, Sparkles, Check, Award,
  ArrowRight, ArrowUp, Menu, X, CalendarCheck, Send,
  BadgeCheck, Headphones, Zap, DollarSign, Wrench,
  RefreshCw, Filter, Package, FlaskConical, Plus, Minus,
  Users, Star, MapPin, Mail, Clock, FileText,
  CheckCircle2, Eye, Settings, Activity,
} from 'lucide-react';
import '../website.css';
import GalleryPageInner from './website/GalleryPage';
import SparesPageInner from './website/SparesPage';
import EnquiryModal from '../components/website/EnquiryModal';
import { productAPI, serviceAPI, galleryAPI, blogAPI, stockAPI } from '../services/api';
import { ProductCard, PriceDisplay } from '../components/website/WebsiteComponents';

// ── Reveal animation hook ─────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: '-30px' }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

// ── Animated counter ──────────────────────────────────────────
function Counter({ target, suffix = '', decimals = 0, duration = 2200 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1);
          const e = 1 - Math.pow(1 - p, 3);
          setCount(parseFloat((e * target).toFixed(decimals)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration, decimals]);
  return <span ref={ref}>{decimals ? count.toFixed(decimals) : Math.round(count)}{suffix}</span>;
}

// ── Water particles ───────────────────────────────────────────
function WaterParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i, size: Math.random() * 16 + 6,
    x: Math.random() * 100, y: Math.random() * 100,
    delay: Math.random() * 4, dur: Math.random() * 3 + 3,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map(p => (
        <div key={p.id} className="hero-particle" style={{
          width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`,
          animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SHARED NAVBAR — with full nav links (Home, Products, Services,
// Gallery, Contact) as requested
// ══════════════════════════════════════════════════════════════
function Navbar({ onEnquire }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const headerRef = useRef(null);

  const NAV_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/services', label: 'Services' },
    { to: '/spares', label: 'Spare Parts' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const setH = () => document.documentElement.style.setProperty('--nav-h', `${el.offsetHeight}px`);
    setH();
    const ro = new ResizeObserver(setH);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isActive = to => to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <header ref={headerRef} className={`pw-header${scrolled ? ' scrolled' : ''}`}>
      <div className="pw-header-inner">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <img src="/aga-logo.png" alt="Aqua Green Agencies logo" style={{ width: 42, height: 42, objectFit: 'contain', flexShrink: 0 }} />
          <div>
            <div className="outfit" style={{ color: scrolled ? '#0F9D58' : '#fff', fontSize: 15, fontWeight: 800, lineHeight: 1.15 }}>Aqua Green</div>
            <div style={{ color: scrolled ? '#64748B' : 'rgba(255,255,255,.75)', fontSize: 10, fontWeight: 600 }}>Agencies · Coimbatore</div>
          </div>
        </Link>

        <nav className="pw-nav-links">
          {NAV_LINKS.map(link => (
            <Link key={link.to} to={link.to} className="pw-nav-link"
              style={{ color: isActive(link.to) ? '#0F9D58' : (scrolled ? '#1E293B' : '#fff') }}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="pw-header-ctas">
          <a href="tel:09952828740" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: 'none', border: `1px solid ${scrolled ? 'rgba(15,157,88,.3)' : 'rgba(255,255,255,.4)'}`, color: scrolled ? '#0F9D58' : '#fff' }}>
            <Phone size={14} /> Call Now
          </a>
          <a href="https://wa.me/919952828740" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#fff', background: '#25D366', textDecoration: 'none', boxShadow: '0 6px 16px rgba(37,211,102,.3)' }}>
            <MessageCircle size={14} /> WhatsApp
          </a>
          <button onClick={onEnquire} className="pw-gold-btn" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer' }}>
            Free Quote
          </button>
        </div>

        <button className="pw-hamburger" onClick={() => setMenuOpen(m => !m)}>
          {menuOpen ? <X size={22} color={scrolled ? '#1E293B' : '#fff'} /> : <Menu size={22} color={scrolled ? '#1E293B' : '#fff'} />}
        </button>
      </div>

      {menuOpen && (
        <div className="pw-mobile-menu">
          {NAV_LINKS.map(link => (
            <Link key={link.to} to={link.to} style={{ display: 'block', padding: '12px 16px', borderRadius: 12, fontSize: 14, fontWeight: 600, color: isActive(link.to) ? '#0F9D58' : '#1E293B', textDecoration: 'none', background: isActive(link.to) ? '#ECFDF5' : 'transparent' }}>
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: 10, paddingTop: 12 }}>
            <a href="tel:09952828740" style={{ flex: 1, textAlign: 'center', padding: 12, borderRadius: 12, fontSize: 13, fontWeight: 700, border: '1px solid #d1fae5', color: '#0F9D58', textDecoration: 'none' }}>Call Now</a>
            <button onClick={() => { setMenuOpen(false); onEnquire(); }} className="pw-gold-btn" style={{ flex: 1, padding: 12, borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer' }}>Free Quote</button>
          </div>
        </div>
      )}
    </header>
  );
}

// ── Shared Footer ─────────────────────────────────────────────
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-wave-top">
        <svg viewBox="0 0 1440 80" style={{ position: 'absolute', bottom: 0, width: '100%' }} preserveAspectRatio="none">
          <path d="M0,20 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#0F9D58" />
        </svg>
      </div>
      <div className="footer-body" style={{ background: 'linear-gradient(135deg,#0F9D58,#065F46,#065F46)' }}>
        <div className="site-max">
          <div className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <img src="/aga-logo.png" alt="Aqua Green Agencies logo" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                <div>
                  <div className="poppins" style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>Aqua Green</div>
                  <div style={{ fontSize: 9, color: '#a7f3d0', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase' }}>Agencies</div>
                </div>
              </div>
              <p style={{ color: '#a0ffa0', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>Coimbatore's most trusted RO purifier sales and service since 2011. Pure water, healthy life.</p>
              <p style={{ color: '#a7f3d0', fontSize: 12 }}>📍 29, R.V.L. Nagar, ESI Hospital Opposite, Upilipalayam (PO), CBE-641015</p>
              <p style={{ color: '#a7f3d0', fontSize: 12, marginTop: 4 }}>📞 09952828740</p>
            </div>
            <div>
              <div className="footer-col-title poppins" style={{ color: '#fff', fontWeight: 700, marginBottom: 16 }}>Quick Links</div>
              {[['/', 'Home'], ['/products', 'Products'], ['/services', 'Services'], ['/gallery', 'Gallery'], ['/contact', 'Contact']].map(([to, label]) => (
                <Link key={to} to={to} className="footer-link" style={{ display: 'block', color: '#a7f3d0', fontSize: 13, marginBottom: 10, textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
            <div>
              <div className="footer-col-title poppins" style={{ color: '#fff', fontWeight: 700, marginBottom: 16 }}>Services</div>
              {['Installation', 'Annual Service', 'Repair & Service', 'Filter Replacement', 'Water Quality Testing'].map(i => (
                <Link key={i} to="/services" className="footer-link" style={{ display: 'block', color: '#a7f3d0', fontSize: 13, marginBottom: 10, textDecoration: 'none' }}>{i}</Link>
              ))}
            </div>
            <div>
              <div className="footer-col-title poppins" style={{ color: '#fff', fontWeight: 700, marginBottom: 16 }}>Contact</div>
              {[
                { icon: Phone,         val: '9952828740' },
                { icon: Phone,         val: '9791814959' },
                { icon: Phone,         val: '8220801088' },
                { icon: Phone,         val: '9487416636' },
                { icon: MessageCircle, val: '+91 99528 28740' },
                { icon: Mail,          val: 'aquagreen2017@gmail.com' },
                { icon: MapPin,        val: '29, R.V.L. Nagar, ESI Hospital Opposite, Upilipalayam (PO), Coimbatore - 641015' },
              ].map(c => (
                <div key={c.val} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#a0ffa0', marginBottom: 12 }}>
                  <c.icon size={13} color="#a7f3d0" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{c.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.15)', paddingTop: 28, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', textAlign: 'center' }}>
            <p style={{ color: '#a7f3d0', fontSize: 13 }}>© 2026 Aqua Green Agencies. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Floating buttons ──────────────────────────────────────────
function FloatingButtons({ onEnquire }) {
  const [showTop, setShowTop] = useState(false);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div className="float-btns">
      {expanded && (
        <>
          <a href="tel:09952828740" className="float-action blue"><Phone size={15} /> Call Now</a>
          <a href="https://wa.me/919952828740" className="float-action green" target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp</a>
          <button className="float-action teal" onClick={onEnquire} style={{ border: 'none', cursor: 'pointer' }}><CalendarCheck size={15} /> Book Service</button>
        </>
      )}
      <button className="float-toggle" onClick={() => setExpanded(e => !e)}>
        <div className="float-ping" />
        {expanded ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
      {showTop && (
        <button className="float-up" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ border: 'none' }}>
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}

function MobileSticky({ onEnquire }) {
  return (
    <div className="mobile-sticky">
      <a href="tel:09952828740" className="mobile-sticky-btn" style={{ color: '#0F9D58' }}><Phone size={20} /> Call</a>
      <a href="https://wa.me/919952828740" className="mobile-sticky-btn" style={{ color: '#25D366' }} target="_blank" rel="noreferrer"><MessageCircle size={20} /> WhatsApp</a>
      <button className="mobile-sticky-btn" style={{ color: '#0F9D58' }} onClick={onEnquire}><CalendarCheck size={20} /> Book Service</button>
    </div>
  );
}

function PageShell({ children, onEnquire }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',system-ui,sans-serif" }}>
      <Navbar onEnquire={onEnquire} />
      <div style={{ paddingTop: 'var(--nav-h, 66px)' }}>
        {children}
      </div>
      <Footer />
      <FloatingButtons onEnquire={onEnquire} />
      <MobileSticky onEnquire={onEnquire} />
      <div className="pb-mobile" />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════════════════════════════
const WHY = [
  'Genuine Products from Top Brands',
  'ISO Certified Trained Technicians',
  'Affordable Pricing, No Hidden Costs',
  'Same-Day Emergency Service',
  'Full Warranty & After-Sales Support',
  'Trusted by 15,000+ Families',
];

const REVIEWS = [
  { name: 'Rajesh Kumar',    area: 'RS Puram',        stars: 5, text: 'Absolutely fantastic service! The technician arrived within 2 hours, fixed my Kent purifier efficiently. Super professional team!', date: '2 weeks ago' },
  { name: 'Priya Sundaram',  area: 'Ganapathy',        stars: 5, text: 'Aqua Green installed my RO purifier flawlessly. The annual service they offer is excellent value. Highly recommended!', date: '1 month ago' },
  { name: 'M. Karthikeyan',  area: 'N.K. Palayam',    stars: 5, text: 'Best water purifier service in Coimbatore. Genuine spare parts, transparent pricing, and super fast response.', date: '3 weeks ago' },
  { name: 'Girish',          area: 'Uppilipalayam',   stars: 5, text: 'Professional work, completed same day. Exceptional service quality from Aqua Green Agencies!', date: '1 week ago' },
];

const STATS = [
  { value: 15000, suffix: '+', label: 'Happy Customers', icon: Users },
  { value: 15,    suffix: '+', label: 'Years Experience', icon: Award },
  { value: 100,   suffix: '%', label: 'Genuine Parts', icon: Shield },
  { value: 24,    suffix: 'hr', label: 'Service Response', icon: Clock },
];

const BRANDS = ['Kent','AO Smith','Pureit','Eureka Forbes','Livpure','Aquaguard','Havells','Blue Star','Whirlpool','V Guard'];

const FEATURED_SPARES = [
  { name: 'RO Membrane',     brand: 'Filmtec / Vontron', spec: '100 GPD TFC',      price: '₹1,200', icon: Droplets },
  { name: 'Sediment Filter', brand: 'All Brands',        spec: '5 Micron PP',      price: '₹80',    icon: Activity },
  { name: 'Carbon Filter',   brand: 'All Brands',        spec: 'Activated Block',  price: '₹120',   icon: Leaf },
  { name: 'Booster Pump',    brand: 'Universal',         spec: '24V DC 50GPD',     price: '₹900',   icon: Zap },
  { name: 'SMPS Adapter',    brand: 'Universal',         spec: '24V 2A Output',    price: '₹350',   icon: Settings },
  { name: 'UV Lamp',         brand: 'All Brands',        spec: '11W Sterilizer',   price: '₹450',   icon: Eye },
];

const GALLERY_FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1553564552-02656d6a2390?w=700&h=900&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1628767719221-fdf36470b997?w=700&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1542013936693-884638332954?w=700&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1588250674913-e28f0351f855?w=700&h=900&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1543503484-ba590cb1f903?w=700&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1676210133055-eab6ef033ce3?w=700&h=500&fit=crop&auto=format',
];

// ── Featured Products (homepage) ────────────────────────────────
function FeaturedProducts({ onEnquire }) {
  const [products, setProducts] = useState(PRODUCT_FALLBACK);
  useReveal();
  useEffect(() => {
    productAPI.getAll().then(r => {
      const d = r.data.data; const arr = d?.content || d || [];
      if (arr.length) setProducts(arr);
    }).catch(() => {});
  }, []);
  const featured = products.slice(0, 6);

  return (
    <section id="products" style={{ padding: 'clamp(56px,8vw,96px) 0', background: '#fff' }}>
      <div className="site-max">
        <div className="section-center reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="pw-eyebrow">Featured Products</span>
          <h2 className="pw-h2 outfit">Premium RO Purifiers</h2>
          <p className="pw-section-sub" style={{ margin: '0 auto' }}>Engineered for Indian water conditions. Every purifier backed by genuine parts and certified service.</p>
        </div>
        <div className="pw-products-grid">
          {featured.map((p, i) => {
            const features = p.features ? p.features.split(',').slice(0, 4) : ['Multi-stage Purification', 'Genuine Parts', 'Warranty Included'];
            return (
              <div key={p.id} className="pw-product-card pw-card-lift pw-img-zoom reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                <div className="pw-product-img">
                  <img src={p.imageUrl || PRODUCT_FALLBACK[0].imageUrl} alt={p.name} onError={e => { e.target.src = PRODUCT_FALLBACK[0].imageUrl; }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.6), rgba(0,0,0,.1) 55%, transparent)' }} />
                  {(p.badge || p.category) && (
                    <span style={{ position: 'absolute', top: 14, left: 14, padding: '5px 12px', borderRadius: 20, background: '#0F9D58', color: '#fff', fontSize: 11, fontWeight: 700 }}>{p.badge || p.category}</span>
                  )}
                  <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
                    <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 11, fontWeight: 600, marginBottom: 2 }}>{p.category || 'RO Purifier'}</div>
                    <div className="outfit" style={{ color: '#fff', fontWeight: 800, fontSize: 19, lineHeight: 1.2 }}>{p.name}</div>
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 2 }}>{[...Array(5)].map((_, j) => <Star key={j} size={12} fill="#FBBF24" color="#FBBF24" />)}</div>
                    <span style={{ fontSize: 12, color: '#64748B' }}>{p.stages || 'Multi-Stage'} · {p.flow || 'High Flow'}</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {features.map((f, fi) => (
                      <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B' }}>
                        <CheckCircle2 size={15} color="#0F9D58" style={{ flexShrink: 0 }} /> {f.trim()}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>Price</div>
                      {p.pricingMode === 'SHOW_PRICE' && p.price ? (
                        <div className="outfit" style={{ fontSize: 22, fontWeight: 900, color: '#0F9D58' }}>₹{Number(p.price).toLocaleString('en-IN')}</div>
                      ) : (
                        <div className="outfit" style={{ fontSize: 15, fontWeight: 800, color: '#92650a' }}>Enquire</div>
                      )}
                    </div>
                    <button className="pw-gold-btn" onClick={() => onEnquire(p)} style={{ padding: '10px 20px', borderRadius: 16, color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                      Enquire
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 56 }} className="reveal">
          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 40px', borderRadius: 16, background: '#0F9D58', color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 12px 30px rgba(15,157,88,.3)' }}>
            View All Products <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Services (homepage v2) ──────────────────────────────────────
const SERVICES_V2 = [
  { icon: Wrench,    title: 'Installation',        desc: 'Professional same-day setup by certified technicians at your home or office.', col: '#0F9D58' },
  { icon: Settings,  title: 'Repair & Service',    desc: 'Expert diagnosis and fast repair for all brands across Coimbatore.', col: '#3B82F6' },
  { icon: Shield,    title: 'Annual Maintenance',  desc: 'Complete AMC with filter replacements, membrane check & sanitization.', col: '#FBBF24' },
  { icon: Activity,  title: 'RO AMC Package',      desc: 'Full-year coverage from ₹999 — best value for peace of mind.', col: '#8B5CF6' },
  { icon: Droplets,  title: 'Water Testing',       desc: 'Free TDS and water quality analysis before we recommend a system.', col: '#06B6D4' },
  { icon: RefreshCw, title: 'Filter Replacement',  desc: 'Genuine filters for all brands delivered to your door.', col: '#0F9D58' },
];

function ServicesSection({ onEnquire }) {
  useReveal();
  return (
    <section id="services" className="pw-section-grad" style={{ padding: 'clamp(56px,8vw,96px) 0' }}>
      <div className="site-max">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="pw-eyebrow">Our Services</span>
          <h2 className="pw-h2 outfit">Complete Water Care</h2>
          <p className="pw-section-sub" style={{ margin: '0 auto' }}>From day-one installation to years of maintenance — we're with you every step.</p>
        </div>
        <div className="pw-services-grid">
          {SERVICES_V2.map((s, i) => (
            <div key={s.title} className="pw-service-card-v2 pw-card-lift reveal" style={{ border: '1px solid rgba(15,157,88,.15)', background: '#fff', transitionDelay: `${(i % 3) * 0.08}s` }}>
              <div style={{ width: 56, height: 56, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, background: `${s.col}18` }}>
                <s.icon size={26} color={s.col} />
              </div>
              <div className="outfit" style={{ fontWeight: 800, fontSize: 19, color: '#1E293B', marginBottom: 8 }}>{s.title}</div>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginBottom: 18 }}>{s.desc}</p>
              <button onClick={onEnquire} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#0F9D58', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                Book Now <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Why Choose (split, with illustration) ───────────────────────
function WhyChooseSection({ onEnquire }) {
  useReveal();
  return (
    <section style={{ padding: 'clamp(56px,8vw,96px) 0', background: '#fff', overflow: 'hidden' }}>
      <div className="site-max">
        <div className="pw-why-grid">
          <div className="reveal-left reveal">
            <span className="pw-eyebrow">Why Choose Us</span>
            <h2 className="pw-h2 outfit">Coimbatore's <span className="pw-text-gradient">Water Experts</span> Since 2011</h2>
            <p style={{ color: '#64748B', lineHeight: 1.8, marginBottom: 28, maxWidth: 440 }}>
              We don't just sell purifiers — we ensure every drop you drink is safe, healthy, and full of essential minerals.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {WHY.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#0F9D58', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle2 size={14} color="#fff" />
                  </div>
                  <span style={{ color: '#1E293B', fontWeight: 600, fontSize: 14 }}>{item}</span>
                </div>
              ))}
            </div>
            <button onClick={onEnquire} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 32, padding: '14px 28px', borderRadius: 16, background: '#0F9D58', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 12px 30px rgba(15,157,88,.3)' }}>
              Get Started Today <ArrowRight size={16} />
            </button>
          </div>
          <div className="reveal-right reveal" style={{ position: 'relative' }}>
            <div className="pw-why-img-wrap pw-img-zoom">
              <img src="https://images.unsplash.com/photo-1577896850715-ed0b7e3ece57?w=800&h=600&fit=crop&auto=format" alt="Happy family with clean water" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top right, rgba(15,157,88,.4), transparent)' }} />
            </div>
            <div className="pw-why-overlay-card pw-glass">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: '#0F9D58', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Users size={22} color="#fff" />
                </div>
                <div>
                  <div className="outfit" style={{ fontSize: 22, fontWeight: 900, color: '#1E293B' }}>15,000+</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Happy Families Served</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Featured Spare Parts (homepage v2) ──────────────────────────
function FeaturedSpares() {
  const [items, setItems] = useState(null); // null → curated fallback with pricing
  useReveal();
  useEffect(() => {
    stockAPI.getPublic().then(r => {
      const d = r.data.data?.content || r.data.data || [];
      if (d.length >= 6) setItems(d.slice(0, 6));
    }).catch(() => {});
  }, []);
  const display = items || FEATURED_SPARES;

  return (
    <section id="spare-parts" className="pw-section-grad" style={{ padding: 'clamp(56px,8vw,96px) 0' }}>
      <div className="site-max">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="pw-eyebrow">Spare Parts</span>
          <h2 className="pw-h2 outfit">Genuine Parts, Always In Stock</h2>
          <p className="pw-section-sub" style={{ margin: '0 auto' }}>100% genuine spare parts for all major brands. Same-day delivery available across Coimbatore.</p>
        </div>
        <div className="pw-spares-grid">
          {display.map((s, i) => {
            const Icon = s.icon || Package;
            return (
              <div key={s.id || s.name} className="pw-spare-card-v2 pw-card-lift reveal" style={{ background: '#fff', border: '1px solid rgba(15,157,88,.15)', transitionDelay: `${(i % 3) * 0.08}s` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color="#0F9D58" />
                  </div>
                  {s.price && <span className="outfit" style={{ fontSize: 19, fontWeight: 900, color: '#0F9D58' }}>{s.price}</span>}
                </div>
                <div className="outfit" style={{ fontWeight: 800, fontSize: 17, color: '#1E293B', marginBottom: 4 }}>{s.name}</div>
                {s.spec && <div style={{ fontSize: 12, fontWeight: 700, color: '#0F9D58', marginBottom: 2 }}>{s.spec}</div>}
                <div style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>{s.brand || s.category}</div>
                <a href="/spares" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0F9D58', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  Order Now <ArrowRight size={14} />
                </a>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }} className="reveal">
          <Link to="/spares" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 40px', borderRadius: 16, background: '#0F9D58', color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 12px 30px rgba(15,157,88,.3)' }}>
            View All Spare Parts <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Gallery Preview (homepage v2, with lightbox) ────────────────
function GalleryPreview() {
  const [items, setItems] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  useReveal();
  useEffect(() => {
    galleryAPI.getAll().then(r => setItems((r.data.data || []).slice(0, 6))).catch(() => {});
  }, []);
  const display = items.length ? items.map(g => g.imageUrl) : GALLERY_FALLBACK_IMGS;

  return (
    <section id="gallery" style={{ padding: 'clamp(56px,8vw,96px) 0', background: '#fff' }}>
      <div className="site-max">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="pw-eyebrow">Gallery</span>
          <h2 className="pw-h2 outfit">See Our Work</h2>
          <p className="pw-section-sub" style={{ margin: '0 auto' }}>From domestic installations to large commercial projects — quality in every drop.</p>
        </div>
        <div className="pw-gallery-grid reveal">
          {display.map((src, i) => (
            <div key={i} className={`pw-gallery-tile${i === 0 || i === 3 ? ' tall' : ''}`} onClick={() => setLightbox(i)}>
              <img src={src} alt={`Gallery ${i + 1}`} onError={e => { e.target.src = GALLERY_FALLBACK_IMGS[0]; }} />
              <div className="pw-gallery-tile-overlay">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: 13, fontWeight: 700 }}>
                  <Eye size={15} /> View Full Photo
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }} className="reveal">
          <Link to="/gallery" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 40px', borderRadius: 16, border: '2px solid #0F9D58', color: '#0F9D58', fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>
            View Full Gallery <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {lightbox !== null && (
        <div className="pw-lightbox" onClick={() => setLightbox(null)}>
          <button className="pw-lightbox-nav" style={{ position: 'absolute', top: 24, right: 24 }} onClick={() => setLightbox(null)}><X size={18} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="pw-lightbox-nav" onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + display.length) % display.length); }}><ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /></button>
            <img src={display[lightbox]} alt="Gallery view" style={{ maxWidth: '85vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: 20 }} onClick={e => e.stopPropagation()} />
            <button className="pw-lightbox-nav" onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % display.length); }}><ChevronRight size={18} /></button>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Reviews (homepage v2) ───────────────────────────────────────
function ReviewsSection() {
  useReveal();
  return (
    <section className="pw-section-grad" style={{ padding: 'clamp(56px,8vw,96px) 0' }}>
      <div className="site-max">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 44 }}>
          <span className="pw-eyebrow">Google Reviews</span>
          <h2 className="pw-h2 outfit">What Our Customers Say</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 2 }}>{[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#FBBF24" color="#FBBF24" />)}</div>
            <span style={{ fontWeight: 700, color: '#1E293B' }}>4.9</span>
            <span style={{ color: '#64748B', fontSize: 13 }}>· 500+ Google Reviews</span>
          </div>
        </div>
        <div className="pw-reviews-grid">
          {REVIEWS.map((r, i) => (
            <div key={r.name} className="pw-review-card-v2 pw-card-lift reveal" style={{ background: '#fff', border: '1px solid rgba(15,157,88,.15)', transitionDelay: `${i * 0.08}s` }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>{[...Array(r.stars)].map((_, j) => <Star key={j} size={14} fill="#FBBF24" color="#FBBF24" />)}</div>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 18 }}>"{r.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 14, borderTop: '1px solid #e2e8f0' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0F9D58', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{r.name[0]}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{r.area} · {r.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }} className="reveal">
          <a href="https://www.google.com/search?q=Aqua+Green+Agencies+Coimbatore+reviews" target="_blank" rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 36px', borderRadius: 16, background: '#fff', border: '2px solid #e2e8f0', color: '#1E293B', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
            <Star size={17} fill="#FBBF24" color="#FBBF24" /> View All Google Reviews
          </a>
        </div>
      </div>
    </section>
  );
}

// ── About Company (mission / vision / value) ────────────────────
const ABOUT_VALUES = [
  { emoji: '🎯', title: 'Mission', desc: 'Deliver the purest water to every home in Coimbatore' },
  { emoji: '👁️', title: 'Vision',  desc: 'A healthy Coimbatore through accessible water purification' },
  { emoji: '🏆', title: 'Value',   desc: 'Integrity, quality, and lifetime after-sales support' },
];

function AboutSection() {
  useReveal();
  return (
    <section style={{ padding: 'clamp(56px,8vw,96px) 0', background: '#fff', overflow: 'hidden' }}>
      <div className="site-max">
        <div className="pw-about-grid">
          <div className="reveal-left reveal" style={{ position: 'relative' }}>
            <div className="pw-about-img-wrap pw-img-zoom">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&auto=format" alt="Aqua Green Agencies team" />
            </div>
            <div className="pw-why-overlay-card pw-glass" style={{ left: 'auto', right: -12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(251,191,36,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={22} color="#D97706" />
                </div>
                <div>
                  <div className="outfit" style={{ fontWeight: 800, fontSize: 15, color: '#1E293B' }}>ISO Certified</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Quality Management</div>
                </div>
              </div>
            </div>
          </div>
          <div className="reveal-right reveal">
            <span className="pw-eyebrow">About Us</span>
            <h2 className="pw-h2 outfit">Our Story, Your <span className="pw-text-gradient">Pure Water</span></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, color: '#64748B', lineHeight: 1.8, fontSize: 14 }}>
              <p>Aqua Green Agencies has been serving Coimbatore families and businesses with genuine RO water purifiers, expert installation, and dependable after-sales service since 2011 — from a small shop near ESI Hospital to one of the city's most recommended names in water purification.</p>
              <p>We are authorised dealers for Kent, Aquaguard, Livpure, AO Smith, Pureit and more. Every product is backed by genuine parts and serviced by our in-house certified technicians.</p>
            </div>
            <div className="pw-value-grid">
              {ABOUT_VALUES.map(v => (
                <div key={v.title} className="pw-value-card">
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{v.emoji}</div>
                  <div className="outfit" style={{ fontSize: 12, fontWeight: 800, color: '#1E293B', marginBottom: 4 }}>{v.title}</div>
                  <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pw-map-wrap reveal">
          <iframe
            title="Aqua Green Agencies location"
            src="https://www.google.com/maps?q=Aqua+Green+Agencies,+29+R.V.L.+Nagar,+Upilipalayam,+Coimbatore+641015&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pw-map-info-card pw-glass">
            <div style={{ width: 48, height: 48, borderRadius: 16, background: '#0F9D58', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={22} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <div className="outfit" style={{ fontWeight: 800, fontSize: 14, color: '#1E293B' }}>Aqua Green Agencies</div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, fontWeight: 700, color: '#1E293B' }}><Star size={11} fill="#FBBF24" color="#FBBF24" /> 4.9</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>29, R.V.L. Nagar, ESI Hospital Opposite, Upilipalayam (PO), Coimbatore – 641015</div>
              <a href="https://www.google.com/maps/dir/?api=1&destination=Aqua+Green+Agencies+Coimbatore" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 12, fontWeight: 700, color: '#0F9D58', textDecoration: 'none' }}>
                Get Directions <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [enquireItem, setEnquireItem] = useState(null);
  useReveal();
  const openEnquire = (item = null) => { setEnquireItem(item); setEnquireOpen(true); };

  return (
    <PageShell onEnquire={openEnquire}>
      {/* Hero */}
      <section id="home" className="pw-hero">
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1534775635547-42a604a58f1a?w=1920&h=1080&fit=crop&auto=format" alt="Nature water" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="pw-hero-grad" style={{ position: 'absolute', inset: 0, opacity: 0.9 }} />
        </div>

        <div className="pw-blob" style={{ position: 'absolute', top: 80, left: '15%', width: 260, height: 260, background: 'rgba(255,255,255,.1)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div className="pw-blob" style={{ position: 'absolute', bottom: 100, right: '15%', width: 200, height: 200, background: 'rgba(251,191,36,.2)', filter: 'blur(40px)', pointerEvents: 'none', animationDelay: '-4s' }} />

        {[...Array(8)].map((_, i) => (
          <div key={i} className="pw-bubble" style={{
            width: 6 + (i % 4) * 4, height: 6 + (i % 4) * 4,
            left: `${10 + i * 11}%`, bottom: `${20 + (i % 3) * 10}%`,
            animation: `pwBubble ${3 + i * 0.5}s ease-in ${i * 0.8}s infinite`,
          }} />
        ))}

        <div className="pw-hero-inner">
          <div>
            <div className="pw-glass-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 999, color: 'rgba(255,255,255,.9)', fontSize: 12, fontWeight: 700, letterSpacing: '.05em', marginBottom: 28 }}>
              <Leaf size={14} color="#A7F3D0" /> Coimbatore's Most Trusted RO Purifier Service
            </div>

            <h1 className="pw-hero-h1 outfit">
              Pure Water.<br />
              <span className="pw-shimmer-text">Healthy Family.</span><br />
              Happy Life.
            </h1>

            <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 16, marginTop: 16, marginBottom: 4, fontWeight: 500 }}>Premium RO Water Purifiers</p>
            <p style={{ color: '#A7F3D0', fontWeight: 700, fontSize: 13, marginBottom: 28, letterSpacing: '.03em' }}>Sales &nbsp;|&nbsp; Service &nbsp;|&nbsp; Installation &nbsp;|&nbsp; Spare Parts</p>

            <div className="pw-hero-ctas">
              <a href="#products" className="pw-hero-cta" style={{ background: '#fff', color: '#0F9D58', boxShadow: '0 12px 30px rgba(0,0,0,.2)' }}>
                <Package size={16} /> Explore Products
              </a>
              <button onClick={openEnquire} className="pw-hero-cta pw-glass-dark" style={{ color: '#fff' }}>
                <Wrench size={16} /> Book Service
              </button>
              <a href="https://wa.me/919952828740" target="_blank" rel="noreferrer" className="pw-hero-cta" style={{ background: '#25D366', color: '#fff', boxShadow: '0 10px 24px rgba(37,211,102,.4)' }}>
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a href="tel:09952828740" className="pw-hero-cta pw-gold-btn" style={{ color: '#fff', boxShadow: '0 10px 24px rgba(245,158,11,.35)' }}>
                <Phone size={16} /> Call Now
              </a>
            </div>

            <div className="pw-hero-stats">
              {[['15,000+', 'Customers'], ['15+', 'Years'], ['100%', 'Genuine']].map(([v, l]) => (
                <div key={l}>
                  <div className="outfit" style={{ fontSize: 24, fontWeight: 900, color: '#FBBF24' }}>{v}</div>
                  <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 12 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pw-hero-visual">
            <div className="pw-spin" style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', border: '1px solid rgba(255,255,255,.15)' }} />
            <div className="pw-spin-rev" style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', border: '2px solid rgba(15,157,88,.3)' }} />
            <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'rgba(15,157,88,.3)', filter: 'blur(60px)' }} />

            <div className="pw-float pw-glow-green pw-img-zoom" style={{ position: 'relative', width: 240, height: 300, borderRadius: 26, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,.3)' }}>
              <img src="https://images.unsplash.com/photo-1656082352918-75e24cb6d06c?w=512&h=640&fit=crop&auto=format" alt="AquaGreen RO Purifier" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,157,88,.6), transparent)' }} />
              <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.75)' }}>AquaGreen Pro 7</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>7-Stage RO Purifier</div>
              </div>
            </div>

            <div className="pw-hero-badge-card pw-glass pw-float-alt" style={{ top: 30, left: -10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 12, background: 'rgba(15,157,88,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Droplets size={16} color="#0F9D58" /></div>
                <div><div style={{ fontSize: 12, fontWeight: 800, color: '#1E293B' }}>Pure Water</div><div style={{ fontSize: 10, color: '#94A3B8' }}>100% Filtered</div></div>
              </div>
            </div>

            <div className="pw-hero-badge-card pw-glass pw-float" style={{ top: 60, right: -20, animationDelay: '-2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 12, background: 'rgba(15,157,88,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award size={16} color="#0F9D58" /></div>
                <div><div style={{ fontSize: 12, fontWeight: 800, color: '#1E293B' }}>ISO Certified</div><div style={{ fontSize: 10, color: '#94A3B8' }}>Quality Assured</div></div>
              </div>
            </div>

            <div className="pw-hero-badge-card pw-float-alt" style={{ left: -30, bottom: 100, background: 'linear-gradient(135deg,#0F9D58,#065F46)', animationDelay: '-1s' }}>
              <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 10, fontWeight: 600 }}>Starting from</div>
              <div className="outfit" style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>₹4,200</div>
            </div>

            <div className="pw-hero-badge-card pw-glass pw-float" style={{ right: -10, bottom: 90, animationDelay: '-3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 12, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Leaf size={16} color="#0F9D58" /></div>
                <div><div style={{ fontSize: 12, fontWeight: 800, color: '#1E293B' }}>Eco Safe</div><div style={{ fontSize: 10, color: '#94A3B8' }}>Zero Waste</div></div>
              </div>
            </div>

            <div className="pw-hero-badge-card pw-glass" style={{ bottom: 10, left: '50%', transform: 'translateX(-50%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 1 }}>{[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#FBBF24" color="#FBBF24" />)}</div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#1E293B' }}>4.9 · Google Reviews</span>
              </div>
            </div>
          </div>
        </div>

        <a href="#trust" style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,.55)', textDecoration: 'none' }}>
          <span style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase' }}>Discover</span>
          <ChevronDown size={16} />
        </a>
      </section>

      {/* Trust Stats */}
      <section id="trust" className="pw-section-grad" style={{ padding: 'clamp(56px,8vw,80px) 0' }}>
        <div className="site-max">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 44 }}>
            <span className="pw-eyebrow">Why Coimbatore Trusts Us</span>
            <h2 className="pw-h2 outfit">Numbers That Speak</h2>
          </div>
          <div className="pw-stats-grid">
            {STATS.map(s => (
              <div key={s.label} className="pw-stat-card pw-glass pw-card-lift reveal" style={{ border: '1px solid rgba(15,157,88,.2)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 18, background: 'rgba(15,157,88,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <s.icon size={24} color="#0F9D58" />
                </div>
                <div className="outfit" style={{ fontSize: 34, fontWeight: 900, color: '#1E293B', marginBottom: 4 }}><Counter target={s.value} suffix={s.suffix} decimals={0} /></div>
                <p style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Marquee */}
      <section style={{ padding: '48px 0', background: '#fff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '.2em', textTransform: 'uppercase' }}>Authorised Dealer For</p>
        </div>
        <div className="pw-marquee-wrap">
          <div className="pw-marquee-track">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <div key={i} className="pw-marquee-pill">
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F9D58' }} />
                <span className="outfit" style={{ fontSize: 16, fontWeight: 800, color: '#1E293B99' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts onEnquire={openEnquire} />

      {/* Services */}
      <ServicesSection onEnquire={openEnquire} />

      {/* Why Choose */}
      <WhyChooseSection onEnquire={openEnquire} />

      {/* Featured Spare Parts */}
      <FeaturedSpares />

      {/* Gallery Preview */}
      <GalleryPreview />

      {/* Google Reviews */}
      <ReviewsSection />

      {/* About Company */}
      <AboutSection />

      {/* CTA banner */}
      <section className="pw-dark-section" style={{ padding: 'clamp(64px,8vw,96px) 0', position: 'relative', overflow: 'hidden' }}>
        <div className="pw-blob" style={{ position: 'absolute', top: 0, left: '20%', width: 340, height: 340, background: 'rgba(15,157,88,.2)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div className="pw-blob" style={{ position: 'absolute', bottom: 0, right: '20%', width: 260, height: 260, background: 'rgba(251,191,36,.15)', filter: 'blur(60px)', pointerEvents: 'none', animationDelay: '-4s' }} />
        <div className="site-max reveal" style={{ position: 'relative', textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          <div className="pw-glass-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 999, color: 'rgba(255,255,255,.8)', fontSize: 12, fontWeight: 700, marginBottom: 28 }}>
            <Zap size={14} color="#FBBF24" /> Limited Time · Free Installation on Select Models
          </div>
          <h2 className="outfit" style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 900, color: '#fff', marginBottom: 16, lineHeight: 1.15 }}>
            Need Pure Water?<br /><span className="pw-text-gradient">Call Our Experts Today</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 16, marginBottom: 36 }}>
            Free water quality test · Same-day response · No obligation quote
          </p>
          <div className="pw-cta-btns">
            <a href="tel:09952828740" className="pw-cta-btn" style={{ background: '#fff', color: '#0F9D58', boxShadow: '0 16px 36px rgba(0,0,0,.25)' }}>
              <Phone size={17} /> Call +91 99528 28740
            </a>
            <a href="https://wa.me/919952828740" target="_blank" rel="noreferrer" className="pw-cta-btn" style={{ background: '#25D366', color: '#fff', boxShadow: '0 16px 36px rgba(37,211,102,.3)' }}>
              <MessageCircle size={17} /> WhatsApp Us
            </a>
            <button onClick={openEnquire} className="pw-cta-btn pw-gold-btn" style={{ color: '#fff', boxShadow: '0 16px 36px rgba(245,158,11,.3)' }}>
              <Zap size={17} /> Book Service
            </button>
          </div>
        </div>
      </section>

      {enquireOpen && <EnquiryModal onClose={() => setEnquireOpen(false)} product={enquireItem} />}
    </PageShell>
  );
}

// ══════════════════════════════════════════════════════════════
// PRODUCTS PAGE
// ══════════════════════════════════════════════════════════════
const PRODUCT_FALLBACK = [
  { id:1, name:'Kent Grand Plus 11L', category:'DOMESTIC', description:'Multi-stage RO+UV+UF+TDS purification. 20L/hr output. Wall mountable.', imageUrl:'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&h=350&fit=crop&q=85', pricingMode:'CONTACT_FOR_PRICE', badge:'Bestseller' },
  { id:2, name:'AO Smith X4+ 8L', category:'DOMESTIC', description:'Green water-saving technology. Min-wastage dual purification system.', imageUrl:'https://images.unsplash.com/photo-1626863905121-3b0c0ed7b94c?w=500&h=350&fit=crop&q=85', pricingMode:'SHOW_PRICE', price:'14999', originalPrice:'18999', badge:'Top Rated' },
  { id:3, name:'Commercial RO 500 LPH', category:'COMMERCIAL', description:'Heavy-duty commercial purification for offices, factories and institutions.', imageUrl:'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=500&h=350&fit=crop&q=85', pricingMode:'CONTACT_FOR_PRICE', badge:'Commercial' },
  { id:4, name:'Industrial Water Softener', category:'INDUSTRIAL', description:'High-capacity ion exchange for scale-free industrial water supply.', imageUrl:'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&h=350&fit=crop&q=85', pricingMode:'CONTACT_FOR_PRICE', badge:'Industrial' },
  { id:5, name:'Pureit Ultima G2 10L', category:'DOMESTIC', description:'7-stage purification with FiltraTrap and auto-cleaning filter.', imageUrl:'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500&h=350&fit=crop&q=85', pricingMode:'SHOW_PRICE', price:'19999', badge:'Premium' },
  { id:6, name:'Dolphin RO Purifier', category:'DOMESTIC', description:'AGA\'s own brand. Trusted by 2000+ Coimbatore families since 2012.', imageUrl:'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=350&fit=crop&q=85', pricingMode:'CONTACT_FOR_PRICE', badge:'AGA Brand' },
];

export function ProductsPage() {
  const [products, setProducts] = useState(PRODUCT_FALLBACK);
  const [cat, setCat] = useState('ALL');
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [enquireItem, setEnquireItem] = useState(null);
  useReveal();
  useEffect(() => { productAPI.getAll().then(r => { const d = r.data.data; const arr = d?.content || d || []; if (arr.length) setProducts(arr); }).catch(() => {}); }, []);

  useReveal(); // retrigger after products load
  const cats = ['ALL', ...new Set(products.map(p => p.category))];
  const filtered = cat === 'ALL' ? products : products.filter(p => p.category === cat);
  const openEnquire = (item = null) => { setEnquireItem(item); setEnquireOpen(true); };

  return (
    <PageShell onEnquire={openEnquire}>
      {/* Page hero */}
      <div className="pw-page-hero" style={{ background: 'linear-gradient(135deg,#0F9D58,#065F46)', padding: '60px 0 40px', textAlign: 'center' }}>
        <div className="site-max">
          <span className="section-tag" style={{ background: 'rgba(127,232,197,.2)', color: '#a7f3d0' }}>Our Products</span>
          <h1 className="poppins" style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: '#fff', marginTop: 12, marginBottom: 12 }}>
            Premium Water Purifiers
          </h1>
          <p style={{ color: '#a0ffa0', fontSize: 15, maxWidth: 520, margin: '0 auto' }}>
            Latest models from leading brands with genuine warranties and expert installation.
          </p>
        </div>
      </div>

      <section style={{ padding: '48px 0 80px', background: '#F8FAFC' }}>
        <div className="site-max">
          {/* Filter tabs */}
          <div className="product-filters reveal" style={{ justifyContent: 'center', marginBottom: 40 }}>
            {cats.map(c => (
              <button key={c} className={`product-filter-btn${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="products-grid">
            {filtered.map((p, i) => (
              <div key={p.id} className="product-card-new reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="product-card-img">
                  <img src={p.imageUrl || PRODUCT_FALLBACK[0].imageUrl} alt={p.name} onError={e => { e.target.src = PRODUCT_FALLBACK[0].imageUrl; }} />
                  <div className="product-badge-primary">{p.badge || p.category}</div>
                  <div className="product-badge-cat">{p.category}</div>
                </div>
                <div className="product-card-body">
                  <div className="product-card-name poppins">{p.name}</div>
                  <div className="product-card-desc">{p.description?.slice(0, 100)}</div>
                  {p.pricingMode === 'SHOW_PRICE' && p.price ? (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 20, fontWeight: 900, color: '#0F9D58', fontFamily: 'Poppins,sans-serif' }}>₹{Number(p.price).toLocaleString('en-IN')}</span>
                      {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                        <span style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'line-through' }}>₹{Number(p.originalPrice).toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', marginBottom: 14 }}>📩 Enquire for Best Price</div>
                  )}
                  <div className="product-card-btns">
                    <button className="product-btn-primary" onClick={() => openEnquire(p)}>Enquire Now</button>
                    <button className="product-btn-outline" onClick={() => openEnquire(p)}>Get Quote</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {enquireOpen && <EnquiryModal onClose={() => setEnquireOpen(false)} product={enquireItem} />}
    </PageShell>
  );
}

// ══════════════════════════════════════════════════════════════
// SERVICES PAGE
// ══════════════════════════════════════════════════════════════
const SERVICES_FALLBACK = [
  { icon: Wrench,       title: 'Installation',           desc: 'Expert installation of all water purifier brands at your doorstep with same-day service.', gradient: 'linear-gradient(135deg,#0F9D58,#0d7a5c)', price: 'Starting ₹499' },
  { icon: RefreshCw,    title: 'Repair & Maintenance',   desc: 'Fast diagnosis and repair for all types of water purifier faults and issues.', gradient: 'linear-gradient(135deg,#065F46,#065F46)', price: 'Starting ₹299' },
  { icon: CalendarCheck,title: 'Annual Service',         desc: 'Comprehensive Annual Service with scheduled preventive maintenance visits.', gradient: 'linear-gradient(135deg,#0F9D58,#065F46)', price: 'Starting ₹999/yr' },
  { icon: Filter,       title: 'Filter Replacement',     desc: 'Genuine filter and membrane replacement using original OEM spare parts only.', gradient: 'linear-gradient(135deg,#0d7a5c,#0F9D58)', price: 'Starting ₹399' },
  { icon: FlaskConical, title: 'Water Quality Testing',  desc: 'Free water quality testing to recommend the right purification system.', gradient: 'linear-gradient(135deg,#065F46,#0F9D58)', price: 'FREE' },
  { icon: Package,      title: 'Spare Parts Supply',     desc: 'Original spare parts for all major brands at the most competitive prices.', gradient: 'linear-gradient(135deg,#0F9D58,#065F46)', price: 'Market Best Price' },
];
const SERVICE_GRADIENTS = [
  'linear-gradient(135deg,#0F9D58,#0d7a5c)', 'linear-gradient(135deg,#065F46,#065F46)',
  'linear-gradient(135deg,#0F9D58,#065F46)', 'linear-gradient(135deg,#0d7a5c,#0F9D58)',
  'linear-gradient(135deg,#065F46,#0F9D58)', 'linear-gradient(135deg,#0F9D58,#065F46)',
];
function iconForService(name = '') {
  const n = name.toLowerCase();
  if (n.includes('install')) return Wrench;
  if (n.includes('repair') || n.includes('maint')) return RefreshCw;
  if (n.includes('annual') || n.includes('amc')) return CalendarCheck;
  if (n.includes('filter') || n.includes('membrane')) return Filter;
  if (n.includes('test') || n.includes('quality')) return FlaskConical;
  if (n.includes('spare') || n.includes('part')) return Package;
  return Wrench;
}
function priceLabelForService(s) {
  if (s.pricingMode === 'FREE') return 'FREE';
  if (s.pricingMode === 'ENQUIRE' || !s.price) return 'Enquire for Price';
  return `Starting ₹${Number(s.price).toLocaleString('en-IN')}`;
}

const PROCESS_STEPS = [
  { num: '01', title: 'Book Service', desc: 'Call, WhatsApp, or fill our online form to schedule a visit.' },
  { num: '02', title: 'Technician Assigned', desc: 'A certified technician is assigned within 30 minutes.' },
  { num: '03', title: 'Doorstep Visit', desc: 'Technician arrives on the scheduled date and time.' },
  { num: '04', title: 'Diagnosis & Repair', desc: 'Issue diagnosed, resolved, and tested on-site.' },
  { num: '05', title: 'Customer Feedback', desc: 'We collect feedback to ensure 100% satisfaction.' },
];

const FAQS = [
  { q: 'How often should I service my RO water purifier?', a: 'We recommend servicing your RO purifier every 3-6 months depending on your water quality and usage. Regular maintenance ensures optimal performance and longevity.' },
  { q: 'What is included in an Annual Service?', a: 'Annual Service covers scheduled servicing, filter replacements, and priority support for 12 months. It saves money compared to individual service calls.' },
  { q: 'How do I know if my water purifier needs a filter change?', a: 'Common signs include reduced water flow, change in taste or odor, the filter indicator light turning on, or if it has been more than 6 months since the last change.' },
  { q: 'Do you provide same-day installation service?', a: 'Yes! We offer same-day and next-day installation. Book before 2 PM for same-day service. Our technicians are available Mon to Sun, 8 AM to 8 PM.' },
  { q: 'Which brands do you service?', a: 'We service all major brands including Kent, AO Smith, Pureit, Eureka Forbes, Livpure, Aquaguard, Havells, Blue Star, and more.' },
];

export function ServicesPage() {
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [services, setServices] = useState(null); // null = loading, [] = loaded-empty
  useReveal();

  useEffect(() => {
    serviceAPI.getAll()
      .then(r => setServices(r.data.data || []))
      .catch(() => setServices([]));
  }, []);

  const displayServices = (services && services.length > 0)
    ? services.map(s => ({ icon: iconForService(s.name), title: s.name, desc: s.description, price: priceLabelForService(s) }))
    : SERVICES_FALLBACK;

  return (
    <PageShell onEnquire={() => setEnquireOpen(true)}>
      {/* Page hero */}
      <div className="pw-page-hero" style={{ background: 'linear-gradient(135deg,#0F9D58,#065F46)', padding: '60px 0 40px', textAlign: 'center' }}>
        <div className="site-max">
          <span className="section-tag" style={{ background: 'rgba(127,232,197,.2)', color: '#a7f3d0' }}>Our Services</span>
          <h1 className="poppins" style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: '#fff', marginTop: 12, marginBottom: 12 }}>
            Complete RO Service Solutions
          </h1>
          <p style={{ color: '#a0ffa0', fontSize: 15, maxWidth: 520, margin: '0 auto' }}>
            From installation to annual maintenance — every need covered by certified technicians.
          </p>
        </div>
      </div>

      {/* Service cards */}
      <section style={{ padding: '56px 0', background: '#F8FAFC' }}>
        <div className="site-max">
          <div className="services-grid">
            {displayServices.map((s, i) => (
              <div key={s.title} className="service-card reveal" style={{ background: SERVICE_GRADIENTS[i % SERVICE_GRADIENTS.length], transitionDelay: `${i * 0.08}s` }}>
                <div className="service-card-icon"><s.icon size={24} color="#fff" /></div>
                <div className="service-card-title poppins">{s.title}</div>
                <div className="service-card-desc">{s.desc}</div>
                <div style={{ marginTop: 12, fontSize: 13, fontWeight: 800, color: '#a7f3d0' }}>{s.price}</div>
                <button onClick={() => setEnquireOpen(true)} style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.2)', border: '1px solid rgba(255,255,255,.35)', color: '#fff', padding: '8px 14px', borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  Book Now <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="process-section">
        <div className="site-max">
          <div className="section-center reveal">
            <span className="section-tag">How It Works</span>
            <h2 className="section-h2 poppins">Simple 5-Step <span>Process</span></h2>
          </div>
          <div className="process-steps">
            {PROCESS_STEPS.map((s, i) => (
              <div key={s.num} className="process-step reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="process-num poppins">{s.num}</div>
                <div className="process-title poppins">{s.title}</div>
                <div className="process-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="site-max">
          <div className="section-center reveal">
            <span className="section-tag">FAQ</span>
            <h2 className="section-h2 poppins">Common <span>Questions</span></h2>
          </div>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <div key={i} className={`faq-item reveal${faqOpen === i ? ' open' : ''}`} style={{ transitionDelay: `${i * 0.05}s` }}>
                <div className="faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  {f.q}
                  <div className="faq-icon">{faqOpen === i ? <Minus size={14} /> : <Plus size={14} />}</div>
                </div>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {enquireOpen && <EnquiryModal onClose={() => setEnquireOpen(false)} />}
    </PageShell>
  );
}

// ══════════════════════════════════════════════════════════════
// GALLERY PAGE — uses the existing GalleryPage.js
// ══════════════════════════════════════════════════════════════
export { default as GalleryPageWrapper } from './website/GalleryPage';

// ══════════════════════════════════════════════════════════════
// CONTACT PAGE
// ══════════════════════════════════════════════════════════════
export function ContactPage() {
  const [form, setForm] = useState({ name: '', mobile: '', service: '', message: '' });
  const [sent, setSent] = useState(false);
  useReveal();

  const submit = e => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', mobile: '', service: '', message: '' });
  };

  return (
    <PageShell onEnquire={() => {}}>
      <div className="pw-page-hero" style={{ background: 'linear-gradient(135deg,#0F9D58,#065F46)', padding: '60px 0 40px', textAlign: 'center' }}>
        <div className="site-max">
          <span className="section-tag" style={{ background: 'rgba(127,232,197,.2)', color: '#a7f3d0' }}>Contact Us</span>
          <h1 className="poppins" style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: '#fff', marginTop: 12, marginBottom: 12 }}>Get in Touch</h1>
          <p style={{ color: '#a0ffa0', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>Call us, WhatsApp, or fill the form. We'll get back within 30 minutes.</p>
        </div>
      </div>
      <section className="contact-section">
        <div className="site-max">
          <div className="contact-grid">
            <div className="contact-info-card reveal-left">
              {[
                { icon: Phone,         label: 'Phone',   val: '9952828740, 9791814959, 8220801088, 9487416636' },
                { icon: MessageCircle, label: 'WhatsApp',val: '+91 99528 28740' },
                { icon: Mail,          label: 'Email',   val: 'aquagreen2017@gmail.com' },
                { icon: MapPin,        label: 'Address', val: '29, R.V.L. Nagar, ESI Hospital Opposite, Upilipalayam (PO), Coimbatore - 641015' },
                { icon: Clock,         label: 'Hours',   val: 'Mon – Sun: 8 AM to 8 PM' },
              ].map(c => (
                <div key={c.label} className="cinfo-item">
                  <div className="cinfo-icon"><c.icon size={20} color="#fff" /></div>
                  <div><div className="cinfo-label">{c.label}</div><div className="cinfo-value">{c.val}</div></div>
                </div>
              ))}
            </div>
            <div className="contact-form-card reveal-right">
              <h3 className="poppins" style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: '#1E293B' }}>Send a Message</h3>
              {sent && <div style={{ background: '#e0f9e0', border: '1px solid #0F9D58', borderRadius: 12, padding: '12px 16px', marginBottom: 16, color: '#0F9D58', fontWeight: 600, fontSize: 13 }}>✓ Message sent! We'll call you back shortly.</div>}
              <form onSubmit={submit}>
                {[['name','Your Name *','text'],['mobile','Mobile Number *','tel'],['service','Service Required','text']].map(([k,l,t]) => (
                  <div key={k}>
                    <label className="contact-form-label">{l}</label>
                    <input className="contact-form-input" type={t} required={k !== 'service'} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
                  </div>
                ))}
                <label className="contact-form-label">Message</label>
                <textarea className="contact-form-input" rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} style={{ resize: 'vertical' }} />
                <button type="submit" className="contact-submit"><Send size={16} /> Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

// ══════════════════════════════════════════════════════════════
// WRAPPED PAGES — provide Navbar + Footer for standalone routes
// ══════════════════════════════════════════════════════════════
export function WrappedGalleryPage() {
  const [enquireOpen, setEnquireOpen] = useState(false);
  return (
    <PageShell onEnquire={() => setEnquireOpen(true)}>
      <GalleryPageInner />
      {enquireOpen && <EnquiryModal onClose={() => setEnquireOpen(false)} />}
    </PageShell>
  );
}

export function WrappedSparesPage() {
  const [enquireOpen, setEnquireOpen] = useState(false);
  return (
    <PageShell onEnquire={() => setEnquireOpen(true)}>
      <SparesPageInner />
      {enquireOpen && <EnquiryModal onClose={() => setEnquireOpen(false)} />}
    </PageShell>
  );
}

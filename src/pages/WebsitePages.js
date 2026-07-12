import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Phone, MessageCircle, ChevronRight, ChevronDown,
  Droplets, Shield, Leaf, Sparkles, Check, Award,
  ArrowRight, ArrowUp, Menu, X, CalendarCheck, Send,
  BadgeCheck, Headphones, Zap, DollarSign, Wrench,
  RefreshCw, Filter, Package, FlaskConical, Plus, Minus,
  Users, Star, MapPin, Mail, Clock, FileText,
} from 'lucide-react';
import '../website.css';
import GalleryPageInner from './website/GalleryPage';
import SparesPageInner from './website/SparesPage';
import EnquiryModal from '../components/website/EnquiryModal';
import { productAPI, serviceAPI, galleryAPI, blogAPI } from '../services/api';
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

  const NAV_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/services', label: 'Services' },
    { to: '/spares', label: 'Spare Parts' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const isActive = to => to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <>
      {/* Top info strip */}
      <div style={{ background: '#062e23', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div className="site-max" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'rgba(255,255,255,.6)', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} /> 29, R.V.L. Nagar, ESI Hospital Opposite, Upilipalayam (PO), Coimbatore - 641015
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} /> Mon–Sun · Open till 8:45 PM
            </span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star size={12} fill="#fbbf24" color="#fbbf24" /> 4.9 Rating · 500+ Reviews
          </span>
        </div>
      </div>

      {/* Main nav */}
      <nav style={{
        background: scrolled ? 'rgba(0,155,0,.97)' : '#009B00',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,.2)' : 'none',
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,.08)',
        transition: 'all .3s ease',
      }}>
        <div className="site-max" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 66, gap: 16 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0, textDecoration: 'none' }}>
            <img src="/aga-logo.jpeg" alt="AGA Logo"
              style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2.5px solid rgba(127,232,197,.5)', boxShadow: '0 2px 12px rgba(0,0,0,.25)' }}
              onError={e => { e.target.style.display = 'none'; }} />
            <div>
              <div style={{ color: '#fff', fontSize: 15, fontWeight: 800, letterSpacing: '-0.3px', lineHeight: 1.2 }}>Aqua Green Agencies</div>
              <div style={{ color: '#7fff7f', fontSize: 10, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase' }}>RO Water · Coimbatore</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }} className="hide-mobile">
            {NAV_LINKS.map(link => (
              <Link key={link.to} to={link.to} style={{
                color: isActive(link.to) ? '#7fff7f' : 'rgba(255,255,255,.82)',
                padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                textDecoration: 'none', transition: 'all .2s',
                background: isActive(link.to) ? 'rgba(127,232,197,.12)' : 'transparent',
                position: 'relative',
              }}>
                {link.label}
                {isActive(link.to) && (
                  <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, background: '#7fff7f', borderRadius: 999 }} />
                )}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="hide-mobile">
            <a href="tel:09952828740" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.82)', border: '1px solid rgba(255,255,255,.2)', textDecoration: 'none', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.1)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,.82)'; }}>
              <Phone size={14} /> Call Now
            </a>
            <a href="https://wa.me/919952828740" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#fff', background: '#25D366', textDecoration: 'none', boxShadow: '0 4px 14px rgba(37,211,102,.3)', transition: 'all .2s' }}>
              <MessageCircle size={14} /> WhatsApp
            </a>
            <button onClick={onEnquire}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#009B00', background: '#7fff7f', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(127,232,197,.3)', transition: 'all .2s' }}>
              Free Quote <ChevronRight size={14} />
            </button>
          </div>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(m => !m)}
            style={{ display: 'none', padding: 8, borderRadius: 10, cursor: 'pointer', border: 'none', background: 'transparent', color: '#fff' }}
            className="show-mobile">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div style={{
          overflow: 'hidden', maxHeight: menuOpen ? 400 : 0,
          transition: 'max-height .35s ease', background: '#009B00',
          borderTop: '1px solid rgba(255,255,255,.08)',
        }}>
          <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {NAV_LINKS.map(link => (
              <Link key={link.to} to={link.to} style={{ display: 'block', padding: '12px 16px', borderRadius: 12, fontSize: 14, fontWeight: 500, color: isActive(link.to) ? '#7fff7f' : 'rgba(255,255,255,.82)', textDecoration: 'none', background: isActive(link.to) ? 'rgba(127,232,197,.1)' : 'transparent' }}>
                {link.label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
              <a href="tel:09952828740" style={{ flex: 1, textAlign: 'center', padding: 10, borderRadius: 12, fontSize: 13, fontWeight: 600, background: 'rgba(255,255,255,.1)', color: '#fff', textDecoration: 'none' }}>📞 Call</a>
              <button onClick={() => { setMenuOpen(false); onEnquire(); }} style={{ flex: 1, padding: 10, borderRadius: 12, fontSize: 13, fontWeight: 700, background: '#7fff7f', color: '#009B00', border: 'none', cursor: 'pointer' }}>Free Quote</button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

// ── Shared Footer ─────────────────────────────────────────────
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-wave-top">
        <svg viewBox="0 0 1440 80" style={{ position: 'absolute', bottom: 0, width: '100%' }} preserveAspectRatio="none">
          <path d="M0,20 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#009B00" />
        </svg>
      </div>
      <div className="footer-body" style={{ background: 'linear-gradient(135deg,#009B00,#007A00,#007A00)' }}>
        <div className="site-max">
          <div className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplets size={20} color="#fff" />
                </div>
                <div>
                  <div className="poppins" style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>Aqua Green</div>
                  <div style={{ fontSize: 9, color: '#7fff7f', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase' }}>Agencies</div>
                </div>
              </div>
              <p style={{ color: '#a0ffa0', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>Coimbatore's most trusted RO purifier sales and service since 2011. Pure water, healthy life.</p>
              <p style={{ color: '#7fff7f', fontSize: 12 }}>📍 29, R.V.L. Nagar, ESI Hospital Opposite, Upilipalayam (PO), CBE-641015</p>
              <p style={{ color: '#7fff7f', fontSize: 12, marginTop: 4 }}>📞 09952828740</p>
            </div>
            <div>
              <div className="footer-col-title poppins" style={{ color: '#fff', fontWeight: 700, marginBottom: 16 }}>Quick Links</div>
              {[['/', 'Home'], ['/products', 'Products'], ['/services', 'Services'], ['/gallery', 'Gallery'], ['/contact', 'Contact']].map(([to, label]) => (
                <Link key={to} to={to} className="footer-link" style={{ display: 'block', color: '#7fff7f', fontSize: 13, marginBottom: 10, textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
            <div>
              <div className="footer-col-title poppins" style={{ color: '#fff', fontWeight: 700, marginBottom: 16 }}>Services</div>
              {['Installation', 'Annual Service', 'Repair & Service', 'Filter Replacement', 'Water Quality Testing'].map(i => (
                <Link key={i} to="/services" className="footer-link" style={{ display: 'block', color: '#7fff7f', fontSize: 13, marginBottom: 10, textDecoration: 'none' }}>{i}</Link>
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
                  <c.icon size={13} color="#7fff7f" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{c.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.15)', paddingTop: 28, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', textAlign: 'center' }}>
            <p style={{ color: '#7fff7f', fontSize: 13 }}>© 2026 Aqua Green Agencies. All rights reserved.</p>
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
      <a href="tel:09952828740" className="mobile-sticky-btn" style={{ color: '#009B00' }}><Phone size={20} /> Call</a>
      <a href="https://wa.me/919952828740" className="mobile-sticky-btn" style={{ color: '#25D366' }} target="_blank" rel="noreferrer"><MessageCircle size={20} /> WhatsApp</a>
      <button className="mobile-sticky-btn" style={{ color: '#009B00' }} onClick={onEnquire}><CalendarCheck size={20} /> Book Service</button>
    </div>
  );
}

function PageShell({ children, onEnquire }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',system-ui,sans-serif" }}>
      <Navbar onEnquire={onEnquire} />
      {children}
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
  { icon: BadgeCheck, title: 'Genuine Products', desc: '100% authentic products from authorized distributors with full manufacturer warranty.' },
  { icon: Award,      title: 'Certified Technicians', desc: 'Factory-trained and certified technicians for all major water purifier brands.' },
  { icon: Zap,        title: 'Fast Service', desc: 'Same-day or next-day service across Coimbatore. Technician assigned within 30 minutes.' },
  { icon: DollarSign, title: 'Affordable Pricing', desc: 'Transparent pricing with no hidden charges. Best rates guaranteed in the market.' },
  { icon: Shield,     title: 'Warranty Support', desc: 'Full warranty coverage with free replacement of defective parts during warranty period.' },
  { icon: Headphones, title: '24x7 Support', desc: 'Round-the-clock customer support via phone, WhatsApp, and online chat.' },
];

const REVIEWS = [
  { name: 'Rajesh Kumar',    loc: 'RS Puram, Coimbatore',     rating: 5, review: 'Absolutely fantastic service! The technician arrived within 2 hours, fixed my Kent purifier efficiently. Super professional team!' },
  { name: 'Priya Sundaram',  loc: 'Ganapathy, Coimbatore',    rating: 5, review: 'Aqua Green installed my RO purifier flawlessly. The annual service they offer is excellent value. Highly recommended!' },
  { name: 'M. Karthikeyan',  loc: 'N.K.Palayam, Coimbatore', rating: 5, review: 'Best water purifier service in Coimbatore. Genuine spare parts, transparent pricing, and super fast response.' },
  { name: 'Girish',          loc: 'Uppilipalayam, Coimbatore',rating: 5, review: 'Professional work, completed same day. Exceptional service quality from Aqua Green Agencies!' },
];

const STATS = [
  { value: 5000, suffix: '+', label: 'Happy Customers', icon: Users },
  { value: 15,   suffix: '+', label: 'Years Experience', icon: Award },
  { value: 25000,suffix: '+', label: 'Services Completed', icon: BadgeCheck },
  { value: 4.9,  suffix: '★', label: 'Customer Rating', icon: Star, decimals: 1 },
];

const BRANDS = ['Kent','AO Smith','Pureit','Eureka Forbes','Livpure','Aquaguard','Havells','Blue Star','Whirlpool','LG','Tata Swach','Nasaka'];

export default function HomePage() {
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [enquireItem, setEnquireItem] = useState(null);
  useReveal();
  const openEnquire = (item = null) => { setEnquireItem(item); setEnquireOpen(true); };

  return (
    <PageShell onEnquire={openEnquire}>
      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-orb1" />
        <div className="hero-orb2" />
        <WaterParticles />
        <div className="hero-inner">
          <div>
            <div className="hero-badge animate-fade-up">
              <Droplets size={14} color="#00dd00" />
              Coimbatore's Most Trusted RO Purifier Service
            </div>
            <h1 className="hero-h1 poppins animate-fade-up delay-2">
              Pure Water.<span className="hero-h1-accent">Healthy Life.</span>
            </h1>
            <p className="hero-desc animate-fade-up delay-3">
              Aqua Green Agencies — Coimbatore's premier destination for RO water purifiers, commercial plants, expert installation and service since 2011. Near ESI Hospital, Upilipalayam (PO), ESI Hospital Opposite.
            </p>
            <div className="hero-ctas animate-fade-up delay-4">
              <button className="hero-cta-primary" onClick={openEnquire}><ArrowRight size={17} /> Get Free Quote</button>
              <a href="tel:09952828740" className="hero-cta-outline"><CalendarCheck size={17} /> Book Service</a>
              <Link to="/products" className="hero-cta-white">View Products</Link>
            </div>
            <div className="hero-trust animate-fade-up delay-5">
              {['Genuine Products', '5000+ Customers', '15+ Years', 'Same-Day Service'].map(t => (
                <div key={t} className="hero-trust-item">
                  <div className="hero-trust-dot"><Check size={10} color="#fff" /></div>{t}
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual animate-scale-pop delay-4">
            <div className="hero-visual-orb" />
            <div className="hero-visual-ring" />
            {[
              { icon: Droplets, label: 'Pure Water', cls: 'hero-chip-1' },
              { icon: Shield, label: 'ISO Certified', cls: 'hero-chip-2' },
              { icon: Leaf, label: 'Eco Safe', cls: 'hero-chip-3' },
              { icon: Sparkles, label: 'Smart Filter', cls: 'hero-chip-4' },
            ].map(({ icon: Icon, label, cls }) => (
              <div key={label} className={`hero-chip ${cls}`}>
                <div className="hero-chip-icon"><Icon size={14} color="#009B00" /></div>
                <span className="hero-chip-label">{label}</span>
              </div>
            ))}
            <div className="hero-img-wrap">
              <img src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=700&h=900&fit=crop&q=85" alt="RO Water Purifier" />
              <div className="hero-img-overlay" />
              <div className="hero-img-price">
                <div className="hero-img-price-label">Starting from</div>
                <div className="hero-img-price-value poppins">₹9,999/-</div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll"><span className="hero-scroll-text">Scroll Down</span><ChevronDown size={15} /></div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 80" style={{ width: '100%', display: 'block' }} preserveAspectRatio="none">
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="site-max">
          <div className="site-stats-grid reveal">
            {STATS.map(s => (
              <div key={s.label} className="stat-item">
                <div className="stat-icon-wrap"><s.icon size={22} color="#fff" /></div>
                <div className="stat-value poppins"><Counter target={s.value} suffix={s.suffix} decimals={s.decimals || 0} /></div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="why-section">
        <div className="site-max">
          <div className="section-center reveal">
            <span className="section-tag">Why Choose Us</span>
            <h2 className="section-h2 poppins">The Aqua Green <span>Advantage</span></h2>
            <p className="section-sub">We combine expertise, genuine products, and unmatched service.</p>
          </div>
          <div className="why-grid">
            {WHY.map((f, i) => (
              <div key={f.title} className="why-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="why-card-icon"><f.icon size={24} color="#fff" /></div>
                <div className="why-card-title poppins">{f.title}</div>
                <div className="why-card-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="brands-section">
        <div className="site-max" style={{ textAlign: 'center', marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 4 }}>Brands We Service</p>
          <h3 className="poppins" style={{ fontSize: 22, fontWeight: 900, color: '#1E293B' }}>Authorized Partners & Service Experts</h3>
        </div>
        <div className="brands-marquee-wrap">
          <div className="brands-marquee-track">
            {[...BRANDS, ...BRANDS].map((b, i) => <div key={i} className="brand-pill">{b}</div>)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="site-max">
          <div className="section-center reveal">
            <span className="section-tag">Reviews</span>
            <h2 className="section-h2 poppins">What Our <span>Customers Say</span></h2>
            <p className="section-sub">4.9★ average from over 5,000 happy customers in Coimbatore.</p>
          </div>
          <div className="testimonials-grid">
            {REVIEWS.map((r, i) => (
              <div key={r.name} className="testimonial-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="t-stars">{'★'.repeat(r.rating)}</div>
                <p className="t-text">"{r.review}"</p>
                <div className="t-author">
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#009B00,#007A00)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#7fff7f', fontWeight: 700, fontSize: 14 }}>{r.name[0]}</span>
                  </div>
                  <div>
                    <div className="t-name poppins">{r.name}</div>
                    <div className="t-loc">{r.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="reviews-cta">
            <a
              href="https://www.google.com/search?q=Aqua+Green+Agencies+Coimbatore+reviews"
              target="_blank"
              rel="noreferrer"
              className="google-reviews-btn"
            >
              <Star size={16} /> View All Google Reviews
            </a>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section style={{ background: 'linear-gradient(135deg,#009B00,#007A00)', padding: '64px 0' }}>
        <div className="site-max" style={{ textAlign: 'center' }}>
          <h2 className="poppins reveal" style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 900, color: '#fff', marginBottom: 16 }}>
            Ready for Pure, Clean Water?
          </h2>
          <p className="reveal" style={{ color: '#a0ffa0', fontSize: 16, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            Book a free consultation. Our expert will visit your home, test your water, and recommend the best purifier.
          </p>
          <div className="reveal" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={openEnquire} style={{ padding: '14px 32px', borderRadius: 16, background: '#7fff7f', color: '#009B00', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(127,232,197,.3)' }}>
              Book Free Consultation
            </button>
            <a href="tel:09952828740" style={{ padding: '14px 32px', borderRadius: 16, border: '2px solid rgba(255,255,255,.4)', color: '#fff', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <Phone size={16} /> 09952828740
            </a>
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
      <div style={{ background: 'linear-gradient(135deg,#009B00,#007A00)', padding: '60px 0 40px', textAlign: 'center' }}>
        <div className="site-max">
          <span className="section-tag" style={{ background: 'rgba(127,232,197,.2)', color: '#7fff7f' }}>Our Products</span>
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
                      <span style={{ fontSize: 20, fontWeight: 900, color: '#009B00', fontFamily: 'Poppins,sans-serif' }}>₹{Number(p.price).toLocaleString('en-IN')}</span>
                      {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                        <span style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'line-through' }}>₹{Number(p.originalPrice).toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#d4821a', marginBottom: 14 }}>📩 Enquire for Best Price</div>
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
const SERVICES_DATA = [
  { icon: Wrench,       title: 'Installation',           desc: 'Expert installation of all water purifier brands at your doorstep with same-day service.', gradient: 'linear-gradient(135deg,#009B00,#0d7a5c)', price: 'Starting ₹499' },
  { icon: RefreshCw,    title: 'Repair & Maintenance',   desc: 'Fast diagnosis and repair for all types of water purifier faults and issues.', gradient: 'linear-gradient(135deg,#007A00,#007A00)', price: 'Starting ₹299' },
  { icon: CalendarCheck,title: 'Annual Service',         desc: 'Comprehensive Annual Service with scheduled preventive maintenance visits.', gradient: 'linear-gradient(135deg,#009B00,#007A00)', price: 'Starting ₹999/yr' },
  { icon: Filter,       title: 'Filter Replacement',     desc: 'Genuine filter and membrane replacement using original OEM spare parts only.', gradient: 'linear-gradient(135deg,#0d7a5c,#009B00)', price: 'Starting ₹399' },
  { icon: FlaskConical, title: 'Water Quality Testing',  desc: 'Free water quality testing to recommend the right purification system.', gradient: 'linear-gradient(135deg,#007A00,#009B00)', price: 'FREE' },
  { icon: Package,      title: 'Spare Parts Supply',     desc: 'Original spare parts for all major brands at the most competitive prices.', gradient: 'linear-gradient(135deg,#009B00,#007A00)', price: 'Market Best Price' },
];

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
  useReveal();

  return (
    <PageShell onEnquire={() => setEnquireOpen(true)}>
      {/* Page hero */}
      <div style={{ background: 'linear-gradient(135deg,#009B00,#007A00)', padding: '60px 0 40px', textAlign: 'center' }}>
        <div className="site-max">
          <span className="section-tag" style={{ background: 'rgba(127,232,197,.2)', color: '#7fff7f' }}>Our Services</span>
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
            {SERVICES_DATA.map((s, i) => (
              <div key={s.title} className="service-card reveal" style={{ background: s.gradient, transitionDelay: `${i * 0.08}s` }}>
                <div className="service-card-icon"><s.icon size={24} color="#fff" /></div>
                <div className="service-card-title poppins">{s.title}</div>
                <div className="service-card-desc">{s.desc}</div>
                <div style={{ marginTop: 12, fontSize: 13, fontWeight: 800, color: '#7fff7f' }}>{s.price}</div>
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
      <div style={{ background: 'linear-gradient(135deg,#009B00,#007A00)', padding: '60px 0 40px', textAlign: 'center' }}>
        <div className="site-max">
          <span className="section-tag" style={{ background: 'rgba(127,232,197,.2)', color: '#7fff7f' }}>Contact Us</span>
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
              {sent && <div style={{ background: '#e0f9e0', border: '1px solid #009B00', borderRadius: 12, padding: '12px 16px', marginBottom: 16, color: '#009B00', fontWeight: 600, fontSize: 13 }}>✓ Message sent! We'll call you back shortly.</div>}
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

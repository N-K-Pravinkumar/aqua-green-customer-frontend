import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone, MessageCircle, FileText, Menu, X,
  MapPin, Clock, Star, ChevronDown, Droplets
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar({ onQuote }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const isActive = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <>
      {/* Top strip */}
      <div style={{ background: '#062e23', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'rgba(255,255,255,.6)', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} /> 29, R.V.L. Nagar, ESI Hospital Opposite, Upilipalayam (PO), Coimbatore - 641015
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} /> Mon–Sun · Open till 8:45 PM
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={12} fill="#fbbf24" color="#fbbf24" /> 4.9 Rating · 500+ Reviews
            </span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav style={{
        background: scrolled ? 'rgba(0,155,0,.97)' : '#0F9D58',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,.2)' : 'none',
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,.08)',
        transition: 'all .3s ease',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 66, gap: 16 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <img src="/aga-logo.jpeg" alt="Aqua Green Agencies Logo — RO Water Purifier Coimbatore"
                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2.5px solid rgba(127,232,197,.5)', boxShadow: '0 2px 12px rgba(0,0,0,.25)', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: -2, right: -2, background: '#a7f3d0', width: 12, height: 12, borderRadius: '50%', border: '2px solid #0F9D58' }} />
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: 15, fontWeight: 800, letterSpacing: '-0.3px', lineHeight: 1.2 }}>Aqua Green Agencies</div>
              <div style={{ color: '#a7f3d0', fontSize: 10, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase' }}>RO Water · Coimbatore</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }} className="hide-mobile">
            {NAV_LINKS.map(link => (
              <Link key={link.to} to={link.to} style={{
                color: isActive(link.to) ? '#a7f3d0' : 'rgba(255,255,255,.82)',
                fontWeight: isActive(link.to) ? 700 : 500, fontSize: 13.5,
                padding: '8px 13px', borderRadius: 8, transition: 'all .2s',
                borderBottom: isActive(link.to) ? '2px solid #a7f3d0' : '2px solid transparent',
                background: isActive(link.to) ? 'rgba(127,232,197,.08)' : 'transparent',
              }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }} className="hide-mobile">
            <a href="tel:09952828740" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 13px', borderRadius: 8, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', textDecoration: 'none' }}>
              <Phone size={14} /> Call Now
            </a>
            <a href="https://wa.me/919952828740" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 13px', borderRadius: 8, background: '#25D366', textDecoration: 'none' }}>
              <MessageCircle size={14} /> WhatsApp
            </a>
            <button onClick={onQuote} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 13, fontWeight: 700, padding: '9px 17px', borderRadius: 8, background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', border: 'none', cursor: 'pointer', boxShadow: '0 2px 10px rgba(212,130,26,.4)' }}>
              <FileText size={14} /> Get Quote
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="show-mobile"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', color: '#fff', width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: '#0F9D58', borderTop: '1px solid rgba(255,255,255,.1)', padding: '12px 0' }} className="show-mobile">
            {NAV_LINKS.map(link => (
              <Link key={link.to} to={link.to} style={{ display: 'block', color: isActive(link.to) ? '#a7f3d0' : 'rgba(255,255,255,.8)', padding: '12px 24px', fontWeight: isActive(link.to) ? 700 : 500, fontSize: 15, borderLeft: isActive(link.to) ? '3px solid #a7f3d0' : '3px solid transparent' }}>
                {link.label}
              </Link>
            ))}
            <div style={{ padding: '12px 24px 4px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="tel:09952828740" className="btn btn-sm" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={13} /> Call Now
              </a>
              <a href="https://wa.me/919952828740" className="btn btn-sm btn-wa" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MessageCircle size={13} /> WhatsApp
              </a>
              <button onClick={() => { setMobileOpen(false); onQuote(); }} className="btn btn-sm btn-amber" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={13} /> Get Quote
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

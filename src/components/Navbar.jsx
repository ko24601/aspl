import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import asplLogo from './ASPL_Logo.png';
import TikTokIcon from './TikTokIcon';

const LANGS = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
};

function LanguageSwitcher({ compact = false }) {
  const { i18n } = useTranslation();
  const current = i18n.language?.slice(0, 2) || 'en';
  const [open, setOpen] = useState(false);
  const currentLang = LANGS.find(l => l.code === current) || LANGS[0];

  if (compact) {
    return (
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {LANGS.map(lang => (
          <button key={lang.code} onClick={() => i18n.changeLanguage(lang.code)}
            style={{ background: current === lang.code ? 'var(--accent-red)' : 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: current === lang.code ? '#fff' : 'var(--text-muted)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.75rem', padding: '6px 12px', cursor: 'pointer', transition: 'all 0.15s' }}
          >
            {lang.flag} {lang.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '6px 10px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '1px' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
      >
        <Globe size={14} />
        {currentLang.flag} {currentLang.label}
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setOpen(false)} />
          <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#0d0d10', border: '1px solid var(--border-color)', minWidth: '110px', zIndex: 999, boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
            {LANGS.map(lang => (
              <button key={lang.code} onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', background: current === lang.code ? 'rgba(225,6,0,0.15)' : 'transparent', border: 'none', borderLeft: current === lang.code ? '2px solid var(--accent-red)' : '2px solid transparent', color: current === lang.code ? '#fff' : 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '1px', padding: '10px 14px', cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = current === lang.code ? 'rgba(225,6,0,0.15)' : 'transparent'; e.currentTarget.style.color = current === lang.code ? '#fff' : 'var(--text-secondary)'; }}
              >
                <span>{lang.flag}</span> {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  const navItems = [
    { label: t('nav.items.about'),         id: 'about' },
    { label: t('nav.items.championships'), id: 'series' },
    { label: t('nav.items.calendar'),      id: 'calendar' },
    { label: t('nav.items.standings'),     id: 'standings' },
    { label: t('nav.items.media'),         id: 'media' },
    { label: t('nav.items.community'),     id: 'community' },
  ];

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleScroll = (id) => {
    setIsOpen(false);
    if (onHome) {
      setTimeout(() => scrollTo(id), 50);
    } else {
      navigate('/');
      setTimeout(() => scrollTo(id), 200);
    }
  };

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(to right, #e10600, #ff5533)',
          transformOrigin: '0%',
          scaleX,
          zIndex: 2000,
          boxShadow: '0 0 10px rgba(225,6,0,0.8)',
        }}
      />

      {/* Top announcement ticker */}
      <div style={{
        background: 'var(--accent-red)',
        padding: '7px 0',
        fontFamily: 'var(--font-display)',
        fontSize: '0.72rem',
        fontWeight: 800,
        letterSpacing: '2.5px',
        textTransform: 'uppercase',
        color: '#fff',
        zIndex: 1001,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'flex', gap: '80px', whiteSpace: 'nowrap', paddingLeft: '24px' }}
          >
            {[...Array(4)].map((_, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                <span>🏆 {t('nav.ticker.season')}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><TikTokIcon size={14} /> {t('nav.ticker.tiktok')}</span>
                <span>💬 {t('nav.ticker.discord')}</span>
                <span>🎮 {t('nav.ticker.racing')}</span>
              </span>
            ))}
          </motion.div>
          <a
            href="https://discord.gg/cnqnmX8cEm"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'absolute', right: '24px',
              color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px',
              opacity: 0.9, transition: 'opacity 0.2s', background: 'var(--accent-red)',
              paddingLeft: '16px', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.9'}
          >
            Discord →
          </a>
        </div>
      </div>

      {/* Main nav */}
      <nav style={{
        background: isScrolled ? 'rgba(5, 5, 8, 0.97)' : 'rgba(5, 5, 8, 0.80)',
        borderBottom: `1px solid ${isScrolled ? 'var(--border-color)' : 'rgba(255,255,255,0.06)'}`,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: isScrolled ? '0 8px 32px rgba(0,0,0,0.6)' : 'none',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '72px',
          maxWidth: '1300px',
          margin: '0 auto',
          padding: '0 32px',
          gap: '32px',
        }}>

          {/* Logo */}
          <Link
            to="/"
            onClick={() => { setIsOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}
          >
            <img src={asplLogo} alt="ASPL Logo" style={{ height: '36px', width: 'auto', filter: 'drop-shadow(0 0 6px rgba(225,6,0,0.5))' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, letterSpacing: '2px', color: '#fff', textTransform: 'uppercase' }}>
                ASPL<span style={{ color: 'var(--accent-red)' }}> RACING</span>
              </span>
              <span style={{ fontSize: '0.55rem', letterSpacing: '2.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginTop: '2px' }}>
                Advanced Simracing Pro League
              </span>
            </div>
          </Link>

          {/* Center nav links — desktop */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
            {navItems.map(item => (
              <NavItem key={item.id} label={item.label} onClick={() => handleScroll(item.id)} />
            ))}
            <Link to="/sponsors" style={navLinkStyle} onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkHover)} onMouseLeave={e => Object.assign(e.currentTarget.style, navLinkStyle)}>
              Sponsors
            </Link>
          </div>

          {/* Right cluster: language switcher + discord */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <LanguageSwitcher />
            <a
              href="https://discord.gg/cnqnmX8cEm"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1.5px',
                textTransform: 'uppercase', color: '#fff', background: 'var(--accent-red)',
                padding: '8px 20px', textDecoration: 'none', transition: 'all 0.2s',
                clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ff1a0e'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-red)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Discord
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: '1px solid var(--border-color)', color: '#fff', cursor: 'pointer', padding: '7px 9px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-red)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </nav>

      <style>{`
        @media (max-width: 1024px) { .nav-desktop { display: none !important; } }
      `}</style>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 998, backdropFilter: 'blur(6px)' }}
            />
            <motion.div key="drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.22 }}
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(300px, 82vw)', background: '#09090d', borderLeft: '1px solid var(--border-color)', zIndex: 999, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '2px', color: '#fff' }}>
                  ASPL<span style={{ color: 'var(--accent-red)' }}> MENU</span>
                </span>
                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
                  <X size={22} />
                </button>
              </div>

              <nav style={{ flex: 1, padding: '16px 0' }}>
                {navItems.map((item, i) => (
                  <motion.button key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    onClick={() => handleScroll(item.id)}
                    style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)', textAlign: 'left', padding: '14px 28px', fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', cursor: 'pointer', transition: 'color 0.15s, padding-left 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '36px'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.paddingLeft = '28px'; }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                <Link to="/sponsors" onClick={() => setIsOpen(false)}
                  style={{ display: 'block', padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Sponsors
                </Link>
              </nav>

              <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ marginBottom: '14px' }}>
                  <LanguageSwitcher compact />
                </div>
                <a href="https://discord.gg/cnqnmX8cEm" target="_blank" rel="noopener noreferrer"
                  className="btn-aspl btn-aspl-primary"
                  style={{ justifyContent: 'center', width: '100%', textAlign: 'center', display: 'flex', marginBottom: '10px' }}
                >
                  Discord
                </a>
                <button onClick={() => { setIsOpen(false); navigate('/admin'); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', padding: '6px', marginTop: '4px', width: '100%' }}
                >
                  Admin Panel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ label, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: 'none', border: 'none', color: hovered ? '#fff' : 'var(--text-secondary)', padding: '8px 13px', fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s', position: 'relative' }}
    >
      {label}
      <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: `translateX(-50%) scaleX(${hovered ? 1 : 0})`, transformOrigin: 'center', width: 'calc(100% - 26px)', height: '2px', background: 'var(--accent-red)', transition: 'transform 0.2s cubic-bezier(0.16,1,0.3,1)', display: 'block' }} />
    </button>
  );
}

const navLinkStyle = { color: 'var(--text-secondary)', padding: '8px 13px', fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' };
const navLinkHover = { color: '#fff' };

export default Navbar;

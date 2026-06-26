import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import asplLogo from './ASPL_Logo.png';
import TikTokIcon from './TikTokIcon';

const DISCORD   = 'https://discord.gg/cnqnmX8cEm';
const TIKTOK    = 'https://www.tiktok.com/@aspl_acc_liga';
const TWITCH    = 'https://twitch.tv';
const YOUTUBE   = 'https://youtube.com';
const INSTAGRAM = 'https://www.instagram.com/aspl_racing_series';

function FooterLink({ href, children, external }) {
  const style = { transition: 'color 0.2s', color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' };
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" style={style} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-red)'} onMouseLeave={e => e.currentTarget.style.color = 'inherit'}>{children}</a>;
  return <Link to={href} style={style} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-red)'} onMouseLeave={e => e.currentTarget.style.color = 'inherit'}>{children}</Link>;
}

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const socials = [
    { href: DISCORD, icon: '💬', label: t('footer.socials.discord'), color: '#5865f2' },
    { href: TIKTOK,  icon: <TikTokIcon size={16} />, label: t('footer.socials.tiktok'), color: '#ff0050' },
    { href: TWITCH,  icon: '📺', label: t('footer.socials.twitch'), color: '#9147ff' },
    { href: YOUTUBE,   icon: '📹', label: t('footer.socials.youtube'),   color: '#ff0000' },
    { href: INSTAGRAM, icon: '📸', label: t('footer.socials.instagram'), color: '#e1306c' },
  ];

  const navLinks = [
    { href: '#about',     label: t('footer.nav.links.about') },
    { href: '#series',    label: t('footer.nav.links.series') },
    { href: '#calendar',  label: t('footer.nav.links.calendar') },
    { href: '#standings', label: t('footer.nav.links.standings') },
    { href: '#media',     label: t('footer.nav.links.media') },
    { href: '#community', label: t('footer.nav.links.community') },
  ];

  return (
    <footer style={{ background: '#050508', borderTop: '1px solid var(--border-color)', padding: '60px 24px 30px', color: 'var(--text-secondary)' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '48px' }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <img src={asplLogo} alt="ASPL Logo" style={{ height: '36px', filter: 'drop-shadow(0 0 6px rgba(225,6,0,0.4))' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 900, letterSpacing: '1px', color: '#fff', lineHeight: 1 }}>
              ADVANCED <span style={{ color: 'var(--accent-red)' }}>SIMRACING PRO LEAGUE</span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '20px' }}>
            {t('footer.brand.desc')}
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ padding: '5px 12px', background: '#003087', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', letterSpacing: '1px', border: '1px solid #0043c0' }}>🎮 PS5</span>
            <span style={{ padding: '5px 12px', background: '#107c10', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', letterSpacing: '1px', border: '1px solid #139d13' }}>🎮 XBOX</span>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '1px', marginBottom: '18px' }}>
            {t('footer.nav.heading')}
            <span style={{ display: 'block', width: '20px', height: '2px', background: 'var(--accent-red)', marginTop: '5px' }} />
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            {navLinks.map(l => (
              <li key={l.href}>
                <a href={l.href} style={{ transition: 'color 0.2s', color: 'inherit', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-red)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'inherit'}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '1px', marginBottom: '18px' }}>
            {t('footer.socials.heading')}
            <span style={{ display: 'block', width: '20px', height: '2px', background: 'var(--accent-red)', marginTop: '5px' }} />
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            {socials.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = s.color}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <span style={{ fontSize: '1rem', display: 'flex', alignItems: 'center' }}>{s.icon}</span>
                {s.label}
              </a>
            ))}
          </div>

          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)', letterSpacing: '1px', marginBottom: '10px' }}>{t('footer.socials.tiktokTitle')}</p>
            <a href={TIKTOK} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff0050', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}
            >
              <TikTokIcon size={16} /> @aspl_acc_liga
            </a>
          </div>
        </div>

        {/* Join */}
        <div>
          <h4 style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '1px', marginBottom: '18px' }}>
            {t('footer.join.heading')}
            <span style={{ display: 'block', width: '20px', height: '2px', background: 'var(--accent-red)', marginTop: '5px' }} />
          </h4>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '16px' }}>
            {t('footer.join.desc')}
          </p>
          <a href={DISCORD} target="_blank" rel="noopener noreferrer"
            className="btn-aspl btn-aspl-primary"
            style={{ fontSize: '0.85rem', padding: '12px 20px', display: 'inline-flex', gap: '8px', textDecoration: 'none', marginBottom: '12px' }}
          >
            {t('footer.join.discord')}
          </a>

          <div style={{ marginTop: '20px' }}>
            <FooterLink href="/sponsors"><span>🤝</span> {t('footer.sponsors')}</FooterLink>
          </div>
          <div style={{ marginTop: '8px' }}>
            <FooterLink href="/admin"><span>⚙️</span> {t('footer.admin')}</FooterLink>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', maxWidth: '1300px', margin: '0 auto', fontSize: '0.78rem' }}>
        <p>{t('footer.copyright', { year })}</p>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {socials.map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '1.1rem', opacity: 0.5, transition: 'opacity 0.2s', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
              title={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
      {/* Built by */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '16px', textAlign: 'center', maxWidth: '1300px', margin: '16px auto 0', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>
        Built by <span style={{ color: 'var(--accent-red)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>NUSSY DEV</span>
      </div>
    </footer>
  );
}

export default Footer;

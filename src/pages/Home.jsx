import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { DatabaseContext } from '../DatabaseContext';
import {
  Trophy, Calendar, Award, Users, ShieldAlert, Clock, ChevronRight,
  Play, Tv, Disc, Search
} from 'lucide-react';
import soloCalendarImg  from '../assets/solo-calendar.png';
import teamCalendarImg  from '../assets/team-calendar.png';
import TikTokIcon from '../components/TikTokIcon';

const DISCORD = 'https://discord.gg/cnqnmX8cEm';
const TIKTOK  = 'https://www.tiktok.com/@aspl_acc_liga';
const TWITCH  = 'https://twitch.tv';
const YOUTUBE = 'https://youtube.com';

// ── Shared animation variants ──────────────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
};
const item = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
};
const itemLeft = {
  hidden: { opacity: 0, x: -36 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

// ── Flip-digit for countdown ───────────────────────────────────────────────────
function FlipDigit({ value }) {
  const str = String(value).padStart(2, '0');
  return (
    <div style={{ position: 'relative', overflow: 'hidden', lineHeight: 1, height: '1em' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={str}
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          style={{ display: 'block' }}
        >
          {str}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ── Speed lines for hero ───────────────────────────────────────────────────────
function SpeedLines() {
  const lines = [
    { top: '18%', delay: '0s',    width: '35%', opacity: 0.18 },
    { top: '32%', delay: '0.4s',  width: '55%', opacity: 0.12 },
    { top: '45%', delay: '0.9s',  width: '40%', opacity: 0.22 },
    { top: '58%', delay: '0.2s',  width: '60%', opacity: 0.14 },
    { top: '72%', delay: '0.7s',  width: '30%', opacity: 0.16 },
    { top: '85%', delay: '1.1s',  width: '50%', opacity: 0.1  },
    { top: '10%', delay: '1.5s',  width: '25%', opacity: 0.08 },
    { top: '63%', delay: '0.6s',  width: '45%', opacity: 0.13 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {lines.map((l, i) => (
        <div key={i} className="speed-line" style={{ top: l.top, animationDelay: l.delay, width: l.width, opacity: l.opacity }} />
      ))}
    </div>
  );
}

// ── Section wrapper with scroll reveal ────────────────────────────────────────
function RevealSection({ children, style, id, className }) {
  return (
    <motion.section
      id={id}
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={fadeUp}
    >
      {children}
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function Home() {
  const { t } = useTranslation();
  const { dbData } = useContext(DatabaseContext);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.4], ['0%', '20%']);

  const [calendarFilter, setCalendarFilter] = useState('ALL');
  const [standingsTab, setStandingsTab] = useState('DRIVERS');
  const [expandedImage, setExpandedImage] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);

  const calendarEvents  = dbData.calendar       || [];
  const driverStandings = dbData.driverStandings || [];
  const teamStandings   = dbData.teamStandings   || [];
  const newsFeed        = dbData.news            || [];

  // Countdown: next race pulled from the published Season 2 calendar images
  const SEASON2_RACES = [
    { track: 'Imola',          country: 'Italy',        date: '2026-06-10', time: '20:30 UTC', series: 'SOLO' },
    { track: 'Imola',          country: 'Italy',        date: '2026-06-13', time: '19:00 UTC', series: 'TEAM' },
    { track: 'Barcelona',      country: 'Spain',        date: '2026-06-17', time: '20:30 UTC', series: 'SOLO' },
    { track: 'Barcelona',      country: 'Spain',        date: '2026-06-20', time: '19:00 UTC', series: 'TEAM' },
    { track: 'Red Bull Ring',  country: 'Austria',      date: '2026-06-24', time: '20:30 UTC', series: 'SOLO' },
    { track: 'Red Bull Ring',  country: 'Austria',      date: '2026-06-27', time: '19:00 UTC', series: 'TEAM' },
    { track: 'Laguna Seca',    country: 'USA',          date: '2026-07-01', time: '20:30 UTC', series: 'SOLO' },
    { track: 'Laguna Seca',    country: 'USA',          date: '2026-07-04', time: '19:00 UTC', series: 'TEAM' },
    { track: 'Nürburgring GP', country: 'Germany',      date: '2026-07-08', time: '20:30 UTC', series: 'SOLO' },
    { track: 'Nürburgring GP', country: 'Germany',      date: '2026-07-11', time: '19:00 UTC', series: 'TEAM' },
    { track: 'Donington Park', country: 'UK',           date: '2026-07-29', time: '20:30 UTC', series: 'SOLO' },
    { track: 'Donington Park', country: 'UK',           date: '2026-08-01', time: '19:00 UTC', series: 'TEAM' },
    { track: 'Mount Panorama', country: 'Australia',    date: '2026-08-05', time: '20:30 UTC', series: 'SOLO' },
    { track: 'Mount Panorama', country: 'Australia',    date: '2026-08-08', time: '19:00 UTC', series: 'TEAM' },
    { track: 'Monza',          country: 'Italy',        date: '2026-08-12', time: '20:30 UTC', series: 'SOLO' },
    { track: 'Monza',          country: 'Italy',        date: '2026-08-15', time: '19:00 UTC', series: 'TEAM' },
  ];

  useEffect(() => {
    const now = Date.now();
    const upcoming = SEASON2_RACES
      .map(r => ({ ...r, ts: Date.parse(`${r.date}T${r.time.replace(' UTC','')}:00Z`) }))
      .filter(r => r.ts > now)
      .sort((a, b) => a.ts - b.ts);

    if (!upcoming.length) { setNextEvent(null); setTimeLeft(null); return; }
    const next = upcoming[0];
    setNextEvent(next);

    const calc = () => {
      const diff = next.ts - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
      });
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredCalendar = calendarFilter === 'ALL' ? calendarEvents : calendarEvents.filter(e => e.championship === calendarFilter);

  const CountUnit = ({ val, label, accent }) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: accent ? 'var(--accent-red)' : '#fff', lineHeight: 1 }}>
        <FlipDigit value={val} />
      </div>
      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>{label}</div>
    </div>
  );

  const Sep = () => (
    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-muted)', opacity: 0.4, lineHeight: 1 }}>:</div>
  );

  return (
    <div className="carbon-bg" style={{ minHeight: '100vh' }}>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', overflow: 'hidden' }}>
        {/* Parallax bg */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url("${import.meta.env.BASE_URL}Article-1.jpg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            y: heroY,
            scale: 1.1,
          }}
        />
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,5,8,0.45) 0%, rgba(5,5,8,0.75) 100%)', pointerEvents: 'none' }} />
        {/* Scan line */}
        <div className="hero-scanline" />
        {/* Speed lines */}
        <SpeedLines />

        <div style={{ maxWidth: '1200px', width: '100%', position: 'relative', zIndex: 10, textAlign: 'center' }}>

          {/* Platform badges */}
          <motion.div
            initial="hidden" animate="show" variants={container}
            style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '24px' }}
          >
            {[
              { label: '🎮 PLAYSTATION 5', bg: '#003087', border: '#0043c0' },
              { label: '🎮 XBOX SERIES X|S', bg: '#107c10', border: '#139d13' }
            ].map(b => (
              <motion.span key={b.label} variants={item} style={{ background: b.bg, color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '6px 16px', letterSpacing: '2px', border: `1px solid ${b.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {b.label}
              </motion.span>
            ))}
          </motion.div>

          {/* Title with glitch */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-1px', marginBottom: '24px', textTransform: 'uppercase' }}
          >
            {t('hero.title1')} <br />
            <span
              className="hero-glitch"
              data-text="ACC CONSOLE ESPORTS"
              style={{ color: 'var(--accent-red)', textShadow: '0 0 30px var(--accent-red-glow), 0 0 60px rgba(225,6,0,0.3)' }}
            >
              ACC CONSOLE ESPORTS
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 40px', lineHeight: 1.6 }}
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial="hidden" animate="show" variants={container}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginBottom: '60px' }}
          >
            {[
              { href: DISCORD,  icon: <Disc size={18} />,       label: t('hero.cta.discord'),  cls: 'btn-aspl btn-aspl-primary', external: true },
              { href: '#calendar', icon: <Calendar size={18} />, label: t('hero.cta.schedule'), cls: 'btn-aspl btn-aspl-accent' },
              { href: TIKTOK,   icon: <TikTokIcon size={18} />,  label: '@ASPL_ACC_LIGA',       cls: 'btn-aspl btn-aspl-secondary', external: true },
            ].map(b => (
              <motion.a
                key={b.label}
                variants={item}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href={b.href}
                target={b.external ? '_blank' : undefined}
                rel={b.external ? 'noopener noreferrer' : undefined}
                className={b.cls}
                style={{ minWidth: '200px' }}
              >
                {b.icon} {b.label}
              </motion.a>
            ))}
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', background: 'rgba(18, 18, 22, 0.8)', border: '1px solid var(--border-color)', backdropFilter: 'blur(16px)', boxShadow: '0 15px 45px rgba(0,0,0,0.7), 0 0 30px rgba(225,6,0,0.08)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', letterSpacing: '1.5px', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} /> {t('hero.countdown.title')}
              </span>
              <span style={{ background: 'var(--accent-gray)', fontSize: '0.7rem', padding: '3px 8px', fontWeight: 'bold' }}>
                {nextEvent ? `${nextEvent.series} · ${nextEvent.track} · ${nextEvent.time}` : 'TBA'}
              </span>
            </div>
            {(nextEvent && timeLeft) ? (
              <div style={{ display: 'flex', justifyContent: 'space-around', gap: '15px' }}>
                <CountUnit val={timeLeft.days}    label={t('hero.countdown.days')} />
                <Sep /><CountUnit val={timeLeft.hours}   label={t('hero.countdown.hrs')}  />
                <Sep /><CountUnit val={timeLeft.minutes} label={t('hero.countdown.mins')} />
                <Sep /><CountUnit val={timeLeft.seconds} label={t('hero.countdown.secs')} accent />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px 0', fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: '2px', fontSize: '0.85rem' }}>
                SEASON SCHEDULE COMING SOON
              </div>
            )}
          </motion.div>

        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '40px', background: 'var(--bg-darker)', clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />
      </section>

      {/* ── ABOUT ───────────────────────────────────────────────────────────── */}
      <RevealSection id="about" className="content-section">
        <div className="section-header">
          <div className="sub">{t('about.sub')}</div>
          <h2>{t('about.heading')}</h2>
        </div>
        <motion.div
          variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'stretch' }}
        >
          <motion.div variants={item} className="glass-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '16px', fontFamily: 'var(--font-display)', letterSpacing: '1.2px' }}>{t('about.card.heading')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.95rem', lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: t('about.card.p1').replace(/<strong>/g, '<strong style="color:#fff">') }} />
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.95rem', lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: t('about.card.p2').replace(/<strong>/g, '<strong style="color:#fff">') }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: t('about.card.p3').replace(/<strong>/g, '<strong style="color:#fff">') }} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
              <a href={DISCORD} target="_blank" rel="noopener noreferrer" className="btn-aspl btn-aspl-secondary" style={{ padding: '10px 18px', fontSize: '0.82rem' }}>💬 Discord</a>
              <a href={TIKTOK}  target="_blank" rel="noopener noreferrer" className="btn-aspl btn-aspl-secondary" style={{ padding: '10px 18px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}><TikTokIcon size={16} /> TikTok</a>
              <a href={TWITCH}  target="_blank" rel="noopener noreferrer" className="btn-aspl btn-aspl-secondary" style={{ padding: '10px 18px', fontSize: '0.82rem' }}>📺 Twitch</a>
              <a href={YOUTUBE} target="_blank" rel="noopener noreferrer" className="btn-aspl btn-aspl-secondary" style={{ padding: '10px 18px', fontSize: '0.82rem' }}>📹 YouTube</a>
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[
              { icon: <Trophy size={32} />,      title: t('about.pillars.gt3.title'),      desc: t('about.pillars.gt3.desc') },
              { icon: <Users size={32} />,        title: t('about.pillars.dev.title'),      desc: t('about.pillars.dev.desc') },
              { icon: <ShieldAlert size={32} />,  title: t('about.pillars.clean.title'),    desc: t('about.pillars.clean.desc') },
              { icon: <Tv size={32} />,           title: t('about.pillars.broadcast.title'), desc: t('about.pillars.broadcast.desc') },
            ].map((c, i) => (
              <motion.div key={i} variants={item} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ color: 'var(--accent-red)' }}>{c.icon}</div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>{c.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </RevealSection>

      {/* ── LEAGUE STRUCTURE ────────────────────────────────────────────────── */}
      <section id="series" style={{ background: '#08080b', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="content-section">
          <motion.div className="section-header" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <div className="sub">{t('series.sub')}</div>
            <h2>{t('series.heading')}</h2>
          </motion.div>

          <motion.div
            className="aspl-grid-3"
            variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
            style={{ marginBottom: '40px' }}
          >
            {[
              { num: '01', badge: t('series.team.badge'), badgeBg: 'var(--accent-red)', title: t('series.team.title'), desc: t('series.team.desc'), bullets: t('series.team.bullets', { returnObjects: true }) },
              { num: '02', badge: t('series.solo.badge'), badgeBg: 'var(--accent-gray)', badgeBorder: '1px solid var(--border-color)', title: t('series.solo.title'), desc: t('series.solo.desc'), bullets: t('series.solo.bullets', { returnObjects: true }) },
              { num: '03', badge: t('series.endurance.badge'), badgeBg: '#d97706', title: t('series.endurance.title'), desc: t('series.endurance.desc'), bullets: t('series.endurance.bullets', { returnObjects: true }) },
            ].map((s, i) => (
              <motion.div key={i} variants={item} className="glass-card" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '6rem', color: 'var(--border-color)', opacity: 0.15, fontWeight: 900, fontFamily: 'var(--font-display)' }}>{s.num}</div>
                <span style={{ background: s.badgeBg, border: s.badgeBorder, color: '#fff', fontSize: '0.7rem', padding: '4px 10px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '16px' }}>{s.badge}</span>
                <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '12px' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '20px' }}>{s.desc}</p>
                <ul style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {s.bullets.map(b => <li key={b}>{b}</li>)}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="glass-card" style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--accent-red)' }}>
            <div style={{ flex: '1 1 500px' }}>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '6px' }}>{t('series.promo.title')}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {t('series.promo.desc')}
              </p>
            </div>
            <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} href={DISCORD} target="_blank" rel="noopener noreferrer" className="btn-aspl btn-aspl-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>{t('series.promo.cta')}</motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── RACE CALENDAR ───────────────────────────────────────────────────── */}
      <section id="calendar" className="content-section" style={{ maxWidth: '1300px', margin: '0 auto', width: '100%' }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="section-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px' }}>
          <div>
            <div className="sub">{t('calendar.sub')}</div>
            <h2>{t('calendar.heading')}</h2>
          </div>
          <div style={{ display: 'flex', gap: '6px', background: '#0a0a0c', border: '1px solid var(--border-color)', padding: '4px' }}>
            {['ALL', 'TEAM', 'SOLO', 'ENDURANCE'].map(f => (
              <motion.button
                key={f} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setCalendarFilter(f)}
                style={{ background: calendarFilter === f ? 'var(--accent-red)' : 'transparent', color: '#fff', border: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', padding: '8px 16px', letterSpacing: '1px', cursor: 'pointer', transition: 'background 0.2s' }}
              >
                {f}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}
        >
          {[
            { src: soloCalendarImg, alt: 'ASPL Solo Series Season 2 Race Calendar', label: t('calendar.solo.label'), schedule: t('calendar.solo.schedule'), badgeBg: 'var(--accent-gray)', title: 'SOLO SERIES SEASON 2 RACE CALENDAR' },
            { src: teamCalendarImg, alt: 'ASPL Team Series Season 2 Race Calendar', label: t('calendar.team.label'), schedule: t('calendar.team.schedule'), badgeBg: 'var(--accent-red)',  title: 'TEAM SERIES SEASON 2 RACE CALENDAR' },
          ].map(img => (
            <motion.div key={img.title} variants={item}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setExpandedImage(img)}
                style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', border: '1px solid var(--border-color)' }}
              >
                <motion.img
                  src={img.src} alt={img.alt}
                  whileHover={{ scale: 1.07 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px', background: 'linear-gradient(transparent, rgba(5,5,8,0.92))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '2px', color: '#fff' }}>{img.label}</span>
                  <span style={{ background: img.badgeBg, border: img.badgeBg === 'var(--accent-gray)' ? '1px solid var(--border-color)' : undefined, color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 8px', letterSpacing: '1px' }}>{img.schedule}</span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── STANDINGS ───────────────────────────────────────────────────────── */}
      <section id="standings" style={{ background: '#08080b', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="content-section">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="section-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px' }}>
            <div>
              <div className="sub">{t('standings.sub')}</div>
              <h2>{t('standings.heading')}</h2>
            </div>
            <div style={{ display: 'flex', gap: '6px', background: '#0a0a0c', border: '1px solid var(--border-color)', padding: '4px' }}>
              {[
                { key: 'DRIVERS',      label: t('standings.tabs.drivers') },
                { key: 'CONSTRUCTORS', label: t('standings.tabs.constructors') },
                { key: 'STATISTICS',   label: t('standings.tabs.statistics') },
              ].map(tab => (
                <motion.button key={tab.key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setStandingsTab(tab.key)}
                  style={{ background: standingsTab === tab.key ? 'var(--accent-red)' : 'transparent', color: '#fff', border: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', padding: '8px 16px', letterSpacing: '1px', cursor: 'pointer', transition: 'background 0.2s' }}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="glass-card" style={{ padding: '24px', overflowX: 'auto' }}>
            <AnimatePresence mode="wait">

              {standingsTab === 'DRIVERS' && (
                <motion.table key="drivers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                  style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}
                >
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <th style={{ padding: '12px 8px' }}>{t('standings.drivers.pos')}</th><th>{t('standings.drivers.driver')}</th><th>{t('standings.drivers.car')}</th><th>{t('standings.drivers.team')}</th><th>{t('standings.drivers.poles')}</th><th>{t('standings.drivers.podiums')}</th><th>{t('standings.drivers.wins')}</th>
                      <th style={{ textAlign: 'right', paddingRight: '12px' }}>{t('standings.drivers.points')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverStandings.map((driver, i) => (
                      <motion.tr key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem', height: '52px' }}
                        whileHover={{ backgroundColor: 'rgba(225,6,0,0.04)' }}
                      >
                        <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                          <span style={{ display: 'inline-block', width: '24px', textAlign: 'center', color: driver.pos === 1 ? '#ffd700' : driver.pos === 2 ? '#c0c0c0' : driver.pos === 3 ? '#cd7f32' : 'var(--text-secondary)', fontSize: driver.pos <= 3 ? '1.1rem' : '0.9rem' }}>{driver.pos}</span>
                        </td>
                        <td><span style={{ marginRight: '8px' }}>{driver.nationality}</span><span style={{ fontWeight: 'bold', color: '#fff' }}>{driver.name}</span></td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{driver.car}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{driver.team}</td>
                        <td>{driver.poles}</td><td>{driver.podiums}</td><td>{driver.wins}</td>
                        <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-red)', paddingRight: '12px' }}>{driver.pts}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </motion.table>
              )}

              {standingsTab === 'CONSTRUCTORS' && (
                <motion.table key="constructors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                  style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}
                >
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <th style={{ padding: '12px 8px' }}>{t('standings.constructors.pos')}</th><th>{t('standings.constructors.team')}</th><th>{t('standings.constructors.mfr')}</th><th>{t('standings.constructors.wins')}</th>
                      <th style={{ textAlign: 'right', paddingRight: '12px' }}>{t('standings.constructors.pts')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamStandings.map((team, i) => (
                      <motion.tr key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                        whileHover={{ backgroundColor: 'rgba(225,6,0,0.04)' }}
                        style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem', height: '52px' }}
                      >
                        <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                          <span style={{ display: 'inline-block', width: '24px', textAlign: 'center', color: team.pos === 1 ? '#ffd700' : team.pos === 2 ? '#c0c0c0' : team.pos === 3 ? '#cd7f32' : 'var(--text-secondary)' }}>{team.pos}</span>
                        </td>
                        <td style={{ fontWeight: 'bold', color: '#fff' }}>{team.name}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{team.car}</td>
                        <td>{team.wins}</td>
                        <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-red)', paddingRight: '12px' }}>{team.pts}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </motion.table>
              )}

              {standingsTab === 'STATISTICS' && (
                <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  {(() => {
                    const ds = driverStandings;
                    if (!ds.length) return (
                      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🏁</div>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '1px' }}>{t('standings.stats.noData')}</p>
                        <p style={{ fontSize: '0.82rem', marginTop: '6px' }}>{t('standings.stats.noDataSub')}</p>
                      </div>
                    );

                    const byPoles   = [...ds].sort((a,b) => (b.poles||0)   - (a.poles||0))[0];
                    const byWins    = [...ds].sort((a,b) => (b.wins||0)    - (a.wins||0))[0];
                    const byPodiums = [...ds].sort((a,b) => (b.podiums||0) - (a.podiums||0))[0];
                    const leader    = ds[0];
                    const totalWins = ds.reduce((s, d) => s + (d.wins||0), 0);
                    const totalPodiums = ds.reduce((s, d) => s + (d.podiums||0), 0);
                    const totalPoles = ds.reduce((s, d) => s + (d.poles||0), 0);
                    const topTeam = teamStandings[0];

                    const cards = [
                      { title: t('standings.stats.leader'),    value: leader.name,      flag: leader.nationality,    sub: `${leader.pts} PTS · ${leader.wins||0} WIN${leader.wins!==1?'S':''}` },
                      { title: t('standings.stats.mostPoles'), value: byPoles.name,     flag: byPoles.nationality,   sub: `${byPoles.poles||0} POLE${(byPoles.poles||0)!==1?'S':''}` },
                      { title: t('standings.stats.mostWins'),  value: byWins.name,      flag: byWins.nationality,    sub: `${byWins.wins||0} WIN${(byWins.wins||0)!==1?'S':''}` },
                      { title: t('standings.stats.mostPodiums'), value: byPodiums.name, flag: byPodiums.nationality, sub: `${byPodiums.podiums||0} PODIUM${(byPodiums.podiums||0)!==1?'S':''}` },
                      ...(topTeam ? [{ title: t('standings.stats.topTeam'), value: topTeam.name, flag: topTeam.nationality, sub: `${topTeam.pts} PTS · ${topTeam.wins||0} WIN${topTeam.wins!==1?'S':''}` }] : []),
                    ];

                    const summary = [
                      { label: t('standings.stats.totalDrivers'), val: ds.length },
                      { label: t('standings.stats.totalTeams'),   val: teamStandings.length },
                      { label: t('standings.stats.totalPoles'),   val: totalPoles },
                      { label: t('standings.stats.totalWins'),    val: totalWins },
                      { label: t('standings.stats.totalPodiums'), val: totalPodiums },
                    ];

                    return (
                      <div>
                        <motion.div variants={container} initial="hidden" animate="show"
                          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', padding: '10px 10px 24px' }}
                        >
                          {cards.map((s, i) => (
                            <motion.div key={i} variants={item} whileHover={{ scale: 1.03 }}
                              style={{ background: '#050508', border: '1px solid var(--border-color)', padding: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
                            >
                              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--accent-red)' }} />
                              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.72rem', letterSpacing: '1.5px', marginBottom: '10px', textTransform: 'uppercase' }}>{s.title}</h4>
                              <div style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{s.flag}</div>
                              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-display)', lineHeight: 1.1, marginBottom: '6px' }}>{s.value}</div>
                              <p style={{ color: 'var(--accent-red)', fontWeight: 800, fontSize: '0.85rem', fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>{s.sub}</p>
                            </motion.div>
                          ))}
                        </motion.div>

                        {/* Summary bar */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0', borderTop: '1px solid var(--border-color)' }}>
                          {summary.map((s, i) => (
                            <div key={i} style={{ flex: '1 1 100px', textAlign: 'center', padding: '16px 8px', borderRight: i < summary.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.8rem', color: '#fff', lineHeight: 1 }}>{s.val}</div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '1.5px', marginTop: '4px', textTransform: 'uppercase' }}>{s.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── STREAMING & MEDIA ───────────────────────────────────────────────── */}
      <RevealSection id="media" className="content-section">
        <div className="section-header">
          <div className="sub">{t('media.sub')}</div>
          <h2>{t('media.heading')}</h2>
        </div>
        <motion.div
          variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}
        >
          <motion.div variants={item} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}><Tv size={18} style={{ color: 'var(--accent-red)' }} /> {t('media.stream.title')}</h3>
              <span style={{ background: '#6441a5', color: '#fff', fontSize: '0.65rem', padding: '3px 8px', fontWeight: 'bold' }}>TWITCH</span>
            </div>
            <div style={{ background: '#000', height: '240px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', position: 'relative', overflow: 'hidden' }}>
              <div className="scanlines-overlay" />
              <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--accent-red)', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 8px', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#fff', animation: 'pulse 1.2s infinite' }} /> LIVE
              </div>
              <motion.div
                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}
                style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #fff', backdropFilter: 'blur(4px)' }}
              >
                <Play size={22} fill="#fff" />
              </motion.div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('media.stream.click')}</p>
            </div>
            <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <p style={{ fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>{t('media.stream.upcoming')}</p>
              <p>{t('media.stream.hosts')}</p>
            </div>
          </motion.div>

          <motion.div variants={item} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '16px' }}>{t('media.follow.heading')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { href: TIKTOK,   icon: <TikTokIcon size={22} />, label: 'TikTok',   handle: '@aspl_acc_liga',        desc: t('media.tiktok.desc'),   color: '#ff0050' },
                { href: YOUTUBE,  icon: '📹',                     label: 'YouTube',  handle: 'ASPL League',           desc: t('media.youtube.desc'),  color: '#ff0000' },
                { href: TWITCH,   icon: '📺',                     label: 'Twitch',   handle: 'ASPL TV',               desc: t('media.twitch.desc'),   color: '#9147ff' },
                { href: DISCORD,  icon: '💬',                     label: 'Discord',  handle: 'discord.gg/cnqnmX8cEm', desc: t('media.discord.desc'), color: '#5865f2' },
              ].map((s, i) => (
                <motion.a key={i} href={s.href} target="_blank" rel="noopener noreferrer" whileHover={{ x: 4 }}
                  style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '12px', background: '#050508', border: '1px solid var(--border-color)', textDecoration: 'none', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = s.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <span style={{ width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.4rem' }}>{s.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>{s.label}</span>
                      <span style={{ color: s.color, fontSize: '0.75rem', fontWeight: 700 }}>{s.handle}</span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>{s.desc}</p>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </RevealSection>

      {/* ── COMMUNITY / NEWS ────────────────────────────────────────────────── */}
      <section id="community" style={{ background: '#08080b', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="content-section">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="section-header">
            <div className="sub">{t('community.sub')}</div>
            <h2>{t('community.heading')}</h2>
          </motion.div>

          <motion.div
            variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}
          >
            {newsFeed.map((news, i) => (
              <motion.div key={news.id} variants={item} whileHover={{ y: -6 }} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.65rem', background: 'var(--accent-gray)', border: '1px solid var(--border-color)', color: 'var(--accent-red)', padding: '2px 8px', fontWeight: 'bold' }}>{news.tag}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{news.date}</span>
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>{news.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>{news.summary}</p>
                <motion.a whileHover={{ x: 4 }} href="#news" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#fff', fontWeight: 'bold', marginTop: 'auto' }}>
                  {t('community.readMore')} <ChevronRight size={14} />
                </motion.a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LIGHTBOX ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(14px)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', cursor: 'zoom-out' }}
          >
            <motion.button
              whileHover={{ scale: 1.1, background: 'var(--accent-red)' }}
              onClick={e => { e.stopPropagation(); setExpandedImage(null); }}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', zIndex: 10000 }}
            >
              ×
            </motion.button>
            <motion.div
              initial={{ scale: 0.88, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '92%', maxHeight: '82vh', position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(225,6,0,0.15)', border: '1px solid var(--border-color)', background: '#0a0a0d', cursor: 'default' }}
            >
              <img src={expandedImage.src} alt={expandedImage.title} style={{ width: '100%', height: 'auto', maxHeight: '82vh', objectFit: 'contain', display: 'block' }} />
              <div style={{ background: 'rgba(10,10,12,0.95)', padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '2px', color: '#fff', fontSize: '1.1rem' }}>{expandedImage.title}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Click background to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
      `}</style>
    </div>
  );
}

export default Home;

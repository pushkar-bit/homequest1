import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, BarChart3, Heart, User, LogOut, Sun, Moon, Trash2 } from 'lucide-react';
import { authAPI } from '../services/api';
import { sessionStorage } from '../services/sessionStorage';
import { useDarkMode } from '../hooks/useDarkMode';

/* ─── Scoped styles ──────────────────────────────────────────────────────────
   All visual rules live here so zero Tailwind classes are changed on the
   logic-bearing elements (links, buttons, etc.).                             */
const CSS = `
  /* ── Container ─────────────────────────────────────────────── */
  .hq-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: transparent;
    border-bottom: 1px solid transparent;
    transition: background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease;
  }

  /* ── Scrolled state (light) ─────────────────────────────────── */
  .hq-nav.scrolled {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom-color: rgba(0, 0, 0, 0.08);
  }

  /* ── Scrolled state (dark) ──────────────────────────────────── */
  .dark .hq-nav.scrolled {
    background: rgba(20, 20, 20, 0.85);
    border-bottom-color: rgba(255, 255, 255, 0.07);
  }

  /* ── Inner wrapper ──────────────────────────────────────────── */
  .hq-nav__inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }

  /* ── Logo ───────────────────────────────────────────────────── */
  .hq-nav__logo {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 22px;
    font-weight: 400;
    color: #111111;
    text-decoration: none;
    letter-spacing: -0.02em;
    transition: color 0.3s ease;
  }

  .dark .hq-nav__logo {
    color: rgba(255, 255, 255, 0.95);
  }

  .hq-nav.scrolled .hq-nav__logo {
    color: var(--hq-red);
  }

  /* ── Desktop link group ─────────────────────────────────────── */
  .hq-nav__links {
    display: none;
    align-items: center;
    gap: 0.25rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  @media (min-width: 768px) {
    .hq-nav__links { display: flex; }
  }

  /* ── Individual link ────────────────────────────────────────── */
  .hq-nav__link {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.75rem;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    color: #374151;
    border-radius: 8px;
    transition: color 0.25s ease, background 0.25s ease;
    white-space: nowrap;
  }

  .dark .hq-nav__link {
    color: rgba(255, 255, 255, 0.88);
  }

  .hq-nav.scrolled .hq-nav__link {
    color: #374151; /* gray-700 */
  }

  .dark .hq-nav.scrolled .hq-nav__link {
    color: #d1d5db; /* gray-300 */
  }

  /* hover underline slide-in from left */
  .hq-nav__link::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 0.75rem;
    right: 0.75rem;
    height: 2px;
    background: var(--hq-red);
    border-radius: 2px;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.25s ease;
  }

  .hq-nav__link:hover::after,
  .hq-nav__link--active::after {
    transform: scaleX(1);
  }

  /* active tint */
  .hq-nav__link--active {
    color: var(--hq-red) !important;
  }

  .hq-nav__link:hover {
    color: var(--hq-red);
  }

  /* ── Right-side actions ─────────────────────────────────────── */
  .hq-nav__actions {
    display: none;
    align-items: center;
    gap: 0.75rem;
  }

  @media (min-width: 768px) {
    .hq-nav__actions { display: flex; }
  }

  /* ── Theme toggle button ────────────────────────────────────── */
  .hq-nav__theme-btn {
    position: relative;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    color: #374151;
    transition: background 0.25s ease, color 0.25s ease;
    flex-shrink: 0;
  }

  .dark .hq-nav__theme-btn {
    color: rgba(255, 255, 255, 0.88);
  }

  .hq-nav.scrolled .hq-nav__theme-btn {
    color: #374151;
  }

  .dark .hq-nav.scrolled .hq-nav__theme-btn {
    color: #d1d5db;
  }

  .hq-nav__theme-btn:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  .hq-nav.scrolled .hq-nav__theme-btn:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  .dark .hq-nav.scrolled .hq-nav__theme-btn:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  /* Icon swap animation */
  .hq-nav__theme-icon {
    position: absolute;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .hq-nav__theme-icon--enter {
    opacity: 1;
    transform: rotate(0deg);
  }

  .hq-nav__theme-icon--exit {
    opacity: 0;
    transform: rotate(90deg);
  }

  /* ── Auth pill buttons ──────────────────────────────────────── */
  .hq-nav__btn-ghost {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 500;
    padding: 0.45rem 1rem;
    border-radius: 8px;
    border: none;
    background: transparent;
    cursor: pointer;
    text-decoration: none;
    color: #374151;
    transition: background 0.25s ease, color 0.25s ease;
  }

  .dark .hq-nav__btn-ghost {
    color: rgba(255, 255, 255, 0.88);
  }

  .hq-nav__btn-ghost:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  .hq-nav.scrolled .hq-nav__btn-ghost {
    color: #374151;
  }

  .hq-nav.scrolled .hq-nav__btn-ghost:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .dark .hq-nav.scrolled .hq-nav__btn-ghost {
    color: #d1d5db;
  }

  .dark .hq-nav.scrolled .hq-nav__btn-ghost:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .hq-nav__btn-primary {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 0.45rem 1.1rem;
    border-radius: 8px;
    border: none;
    background: var(--hq-red);
    color: #ffffff;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 0 2px 8px rgba(255, 90, 95, 0.32);
    transition: var(--hq-transition);
  }

  .hq-nav__btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(255, 90, 95, 0.42);
  }

  /* ── Agent upload link ──────────────────────────────────────── */
  .hq-nav__upload-link {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 0.35rem 0.85rem;
    border-radius: 7px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    transition: var(--hq-transition);
  }

  .hq-nav.scrolled .hq-nav__upload-link {
    border-color: rgba(0, 0, 0, 0.18);
    color: #374151;
  }

  .dark .hq-nav.scrolled .hq-nav__upload-link {
    border-color: rgba(255, 255, 255, 0.2);
    color: #d1d5db;
  }

  .hq-nav__upload-link:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  /* ── Username chip ──────────────────────────────────────────── */
  .hq-nav__username {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
    transition: color 0.4s ease;
  }

  .hq-nav.scrolled .hq-nav__username {
    color: #374151;
  }

  .dark .hq-nav.scrolled .hq-nav__username {
    color: #d1d5db;
  }

  /* ── Logout button ──────────────────────────────────────────── */
  .hq-nav__logout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: none;
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.8);
    transition: background 0.25s ease, color 0.25s ease;
  }

  .hq-nav.scrolled .hq-nav__logout-btn {
    color: #6b7280;
  }

  .hq-nav__logout-btn:hover {
    background: rgba(255, 90, 95, 0.15);
    color: var(--hq-red);
  }

  /* ── Mobile hamburger ───────────────────────────────────────── */
  .hq-nav__hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.9);
    transition: background 0.25s ease, color 0.25s ease;
  }

  @media (min-width: 768px) {
    .hq-nav__hamburger { display: none; }
  }

  .hq-nav.scrolled .hq-nav__hamburger {
    color: #374151;
  }

  .dark .hq-nav.scrolled .hq-nav__hamburger {
    color: #d1d5db;
  }

  .hq-nav__hamburger:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  .hq-nav.scrolled .hq-nav__hamburger:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  /* ── Mobile drawer ──────────────────────────────────────────── */
  .hq-nav__drawer {
    display: block;
    padding: 0.75rem 1.5rem 1.25rem;
    background: rgba(255, 255, 255, 0.97);
    border-top: 1px solid rgba(0, 0, 0, 0.07);
  }

  .dark .hq-nav__drawer {
    background: rgba(18, 18, 18, 0.97);
    border-top-color: rgba(255, 255, 255, 0.07);
  }

  @media (min-width: 768px) {
    .hq-nav__drawer { display: none; }
  }

  .hq-nav__drawer-link {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 0.75rem;
    border-radius: 8px;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    color: #374151;
    transition: background 0.2s ease, color 0.2s ease;
    margin-bottom: 2px;
  }

  .dark .hq-nav__drawer-link {
    color: #d1d5db;
  }

  .hq-nav__drawer-link:hover {
    background: rgba(255, 90, 95, 0.07);
    color: var(--hq-red);
  }

  .hq-nav__drawer-link--active {
    color: var(--hq-red);
    background: rgba(255, 90, 95, 0.08);
  }

  .hq-nav__drawer-divider {
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.07);
    margin: 0.75rem 0;
  }

  .dark .hq-nav__drawer-divider {
    border-top-color: rgba(255, 255, 255, 0.07);
  }
`;

export default function Navbar({ onThemeToggle, isDarkMode = true }) {
  /* ── State ── */
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  /* ── Routing / auth (unchanged) ── */
  const navigate = useNavigate();
  const location = useLocation();
  const user = authAPI.getCurrentUser();
  const isAuthenticated = authAPI.isAuthenticated();

  /* ── Theme (new hook; also keep backward-compat prop bridge) ── */
  const { isDark, toggleTheme } = useDarkMode();

  /* ── Scroll listener ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Helpers (unchanged logic) ── */
  const toggleMenu = () => setIsOpen((o) => !o);

  const handleLogout = () => {
    sessionStorage.clearAll();
    authAPI.logout();
    navigate('/login');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  /* ── Nav links (unchanged logic) ── */
  const navLinks = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/insights', label: 'Insights', icon: BarChart3 },
    user && user.role === 'agent'
      ? { path: '/deals', label: 'Deals', icon: BarChart3 }
      : user && user.role === 'admin'
      ? { path: '/admin/deleted-properties', label: 'Recently Deleted', icon: Trash2 }
      : { path: '/shortlist', label: 'Shortlist', icon: Heart },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Inject scoped styles once */}
      <style>{CSS}</style>

      {/* Spacer so page content doesn't hide behind the fixed bar */}
      <div style={{ height: 64 }} aria-hidden="true" />

      <nav
        ref={navRef}
        className={`hq-nav${scrolled ? ' scrolled' : ''}`}
        aria-label="Main navigation"
      >
        <div className="hq-nav__inner">

          {/* ── Logo ── */}
          <Link to="/home" className="hq-nav__logo">
            HomeQuest
          </Link>

          {/* ── Desktop links ── */}
          <ul className="hq-nav__links">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`hq-nav__link${isActive(path) ? ' hq-nav__link--active' : ''}`}
                >
                  <Icon size={15} strokeWidth={2} aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Desktop right actions ── */}
          <div className="hq-nav__actions">
            {/* Sun / Moon toggle */}
            <button
              onClick={toggleTheme}
              className="hq-nav__theme-btn"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <Sun
                size={17}
                className="hq-nav__theme-icon"
                style={{
                  opacity: isDark ? 1 : 0,
                  transform: isDark ? 'rotate(0deg)' : 'rotate(90deg)',
                }}
                aria-hidden="true"
              />
              <Moon
                size={17}
                className="hq-nav__theme-icon"
                style={{
                  opacity: isDark ? 0 : 1,
                  transform: isDark ? 'rotate(-90deg)' : 'rotate(0deg)',
                }}
                aria-hidden="true"
              />
            </button>

            {/* Auth section */}
            {isAuthenticated && user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {user.role === 'agent' && (
                  <Link to="/agent/upload" className="hq-nav__upload-link">
                    Upload
                  </Link>
                )}
                <span className="hq-nav__username">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="hq-nav__logout-btn"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={16} strokeWidth={2} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="hq-nav__btn-ghost">
                  Login
                </Link>
                <Link to="/signup" className="hq-nav__btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={toggleMenu}
            className="hq-nav__hamburger"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Mobile drawer ── */}
        {isOpen && (
          <div className="hq-nav__drawer" role="dialog" aria-label="Mobile navigation">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`hq-nav__drawer-link${isActive(path) ? ' hq-nav__drawer-link--active' : ''}`}
              >
                <Icon size={16} strokeWidth={2} aria-hidden="true" />
                {label}
              </Link>
            ))}

            <hr className="hq-nav__drawer-divider" />

            {isAuthenticated && user ? (
              <>
                {user.role === 'agent' && (
                  <Link
                    to="/agent/upload"
                    onClick={() => setIsOpen(false)}
                    className="hq-nav__drawer-link"
                    style={{ color: 'var(--hq-red)' }}
                  >
                    Upload listing
                  </Link>
                )}
                <div style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '13px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  color: '#6b7280',
                  marginBottom: '0.25rem',
                }}>
                  {user.name} · {user.role}
                </div>
                <button
                  onClick={handleLogout}
                  className="hq-nav__drawer-link"
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--hq-red)', textAlign: 'left' }}
                >
                  <LogOut size={16} strokeWidth={2} aria-hidden="true" />
                  Logout
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="hq-nav__drawer-link"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="hq-nav__btn-primary"
                  style={{ textAlign: 'center', display: 'block', padding: '0.6rem 1rem' }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

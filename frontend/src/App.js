import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { authAPI } from './services/api';
import { useDarkMode } from './hooks/useDarkMode';


import Home from './pages/Home';
import Insights from './pages/Insights';
import Shortlist from './pages/Shortlist';
import Profile from './pages/Profile';
import PropertyDetails from './pages/PropertyDetails';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import AgentUpload from './pages/AgentUpload';
import ChatPage from './pages/Chat';
import Deals from './pages/Deals';
import PaymentPage from './pages/Payment';
import AgentRoute from './components/AgentRoute';
import EMICalculator from './pages/EMICalculator';
import BudgetCalculator from './pages/BudgetCalculator';
import { TransitionProvider } from './components/TransitionContext';
import LoanEligibility from './pages/LoanEligibility';
import AreaConverter from './pages/AreaConverter';
import AdminDeletedProperties from './pages/AdminDeletedProperties';
import AdminInsightsHistory from './pages/AdminInsightsHistory';
import SuccessAnimation from './pages/SuccessAnimation';
import PrivacyTerms from './pages/PrivacyTerms';


function App() {
  // Theme is managed by ThemeProvider (index.js) via ThemeContext.
  const { isDark, toggleTheme } = useDarkMode();

  // Silently refresh the access token on app load if a session exists.
  useEffect(() => {
    if (localStorage.getItem('token')) {
      authAPI.refresh().catch(() => {});
    }
  }, []);

  // ── Custom magnifying-glass cursor ────────────────────────────
  useEffect(() => {
    // Skip on touch devices
    if ('ontouchstart' in window) return;

    // Create cursor element once
    const el = document.createElement('div');
    el.id = 'hq-cursor';
    Object.assign(el.style, {
      position: 'fixed', top: '0', left: '0',
      pointerEvents: 'none', zIndex: '99999',
      transition: 'transform 0.03s linear, scale 0.15s ease-out',
      willChange: 'transform, scale',
    });
    el.innerHTML = `
      <style>
        #hq-cursor .cursor-circle {
          transform-origin: 14px 14px;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        #hq-cursor.hovering .cursor-circle {
          transform: scale(1.4);
        }
      </style>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: translate(-4px, -4px)">
        <path d="M21 21 L28 28" stroke="#333333" stroke-width="4" stroke-linecap="round" />
        <circle cx="14" cy="14" r="9" stroke="#777777" stroke-width="2.5" fill="rgba(173, 216, 230, 0.4)" class="cursor-circle" />
      </svg>`;
    document.body.appendChild(el);

    // Mouse move — follow cursor exactly and ensure it's visible
    const onMove = (e) => {
      if (el.style.opacity === '0') el.style.opacity = '1';
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    // Interactive-element hover
    const SELECTORS = 'a, button, [role="button"], input, select, textarea, label[for], [tabindex]';
    const onOver = (e) => {
      const target = e.target.closest(SELECTORS);
      if (target) {
        el.classList.add('hovering');
      }
    };
    const onOut = (e) => {
      const target = e.target.closest(SELECTORS);
      if (target) {
        el.classList.remove('hovering');
      }
    };

    // Prevent cursor from freezing in place when native OS menus (like <select>) open
    const onDown = (e) => {
      if (e.target.tagName === 'SELECT' || e.target.closest('select')) {
        el.style.opacity = '0';
      }
    };

    const onMouseLeave = () => { el.style.opacity = '0'; };
    const onMouseEnter = () => { el.style.opacity = '1'; };

    document.addEventListener('mousemove',   onMove);
    document.addEventListener('mousedown',   onDown);
    document.addEventListener('mouseover',   onOver);
    document.addEventListener('mouseout',    onOut);
    document.addEventListener('mouseleave',  onMouseLeave);
    document.addEventListener('mouseenter',  onMouseEnter);

    return () => {
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseover',  onOver);
      document.removeEventListener('mouseout',   onOut);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);
  // ─────────────────────────────────────────────────────────────


  return (
    <Router>
      <Navbar onThemeToggle={toggleTheme} isDarkMode={isDark} />
      <TransitionProvider>
        <Routes>
          {}
          <Route path="/success" element={<SuccessAnimation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {}
          <Route path="/home" element={<Home />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/privacy-terms" element={<PrivacyTerms />} />

          {}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {}
          <Route path="/insights" element={<Insights />} />
          <Route path="/shortlist" element={<Shortlist />} />
          <Route
            path="/deals"
            element={
              <AgentRoute>
                <Deals />
              </AgentRoute>
            }
          />
          <Route path="/payment" element={<PaymentPage />} />

          {}
          <Route path="/tools/emi-calculator" element={<EMICalculator />} />
          <Route path="/tools/budget-calculator" element={<BudgetCalculator />} />
          <Route path="/tools/loan-eligibility" element={<LoanEligibility />} />
          <Route path="/tools/area-converter" element={<AreaConverter />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {}
          <Route
            path="/agent/upload"
            element={
              <AgentRoute>
                <AgentUpload />
              </AgentRoute>
            }
          />

          {}
          <Route path="/" element={<Navigate to="/home" replace />} />
          {}
          <Route
            path="/chat/:id"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {}
          <Route
            path="/admin/deleted-properties"
            element={
              <ProtectedRoute>
                <AdminDeletedProperties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/insights/:type/:id/history"
            element={
              <ProtectedRoute>
                <AdminInsightsHistory />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </TransitionProvider>
    </Router>
  );
}

export default App;

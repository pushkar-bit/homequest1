import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { authAPI } from './services/api';


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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    
    const savedMode = localStorage.getItem('theme');
    return savedMode ? savedMode === 'dark' : true;
  });

  useEffect(() => {
    
    document.documentElement.classList.add('dark');

    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    
    if (localStorage.getItem('token')) {
      authAPI.refresh().catch(() => {
        
      });
    }
  }, []);

  return (
    <Router>
      <Navbar onThemeToggle={setIsDarkMode} isDarkMode={isDarkMode} />
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

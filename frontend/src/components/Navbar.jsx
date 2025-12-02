import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, BarChart3, Heart, User, LogOut, Sun, Moon, Trash2 } from 'lucide-react';
import { authAPI } from '../services/api';
import { sessionStorage } from '../services/sessionStorage';

export default function Navbar({ onThemeToggle, isDarkMode = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = authAPI.getCurrentUser();
  const isAuthenticated = authAPI.isAuthenticated();

  const toggleTheme = () => {
    const enableDark = !isDarkMode;
    if (onThemeToggle) {
      onThemeToggle(enableDark);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    
    sessionStorage.clearAll();
    authAPI.logout();
    navigate('/login');
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  
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
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800" style={{boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {}
          <Link to="/home" className="flex items-center gap-3">
            <span className="text-2xl font-bold" style={{color: '#DC143C'}}>HomeQuest</span>
          </Link>

          {}
          <div className="hidden md:flex items-center gap-4 font-ui text-sm">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all font-medium ${
                  isActive(path)
                    ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </div>

          {}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-700 dark:text-gray-300 hover:scale-105"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                {user.role === 'agent' && (
                  <Link to="/agent/upload" className="px-3 py-1 rounded text-sm border border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition">Upload</Link>
                )}
                <span className="text-sm text-black dark:text-white">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 text-white rounded-xl hover:shadow-md transition-all font-medium hover:-translate-y-0.5"
                  style={{backgroundColor: '#DC143C', boxShadow: '0 2px 8px rgba(220, 20, 60, 0.25)'}}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-800">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                  isActive(path)
                    ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                    : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}

            <hr className="my-4" />

            {isAuthenticated && user ? (
              <>
                {user.role === 'agent' && (
                  <Link to="/agent/upload" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-white rounded-lg mb-2 text-center" style={{backgroundColor: '#DC143C'}}>Upload</Link>
                )}
                <div className="px-4 py-2 text-sm text-black dark:text-white mb-2">
                  {user.name} ({user.role})
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition text-center"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition text-center"
                  style={{backgroundColor: '#DC143C'}}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

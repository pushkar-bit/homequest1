import React from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { LogOut, Heart, FileText, User } from 'lucide-react';
import api from '../services/api';
import { useState } from 'react';

export default function Profile() {
  const navigate = useNavigate();
  const user = authAPI.getCurrentUser();
  const isAuthenticated = authAPI.isAuthenticated();

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [saving, setSaving] = useState(false);

  

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api.patch('/api/profile', { name: form.name, email: form.email });
      if (res?.data?.success) {
        const updated = res.data.data;
        
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        const merged = { ...stored, name: updated.name, email: updated.email };
        localStorage.setItem('user', JSON.stringify(merged));
        
        window.location.reload();
      } else {
        alert(res?.data?.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile save error', err);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mb-6">
              <User className="w-16 h-16 mx-auto text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Not Logged In</h1>
            <p className="text-gray-600 mb-8">
              Sign in to your account to access your profile and manage your listings.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <User className="w-10 h-10" />
              </div>
              <div>
                  <div className="flex items-center gap-4">
                    {!editing ? (
                      <h1 className="text-4xl font-bold text-gray-900">{user.name}</h1>
                    ) : (
                      <input className="text-4xl font-bold text-gray-900 border-b px-2 py-1" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                    )}
                    {!editing ? (
                      <button onClick={() => setEditing(true)} className="text-sm text-blue-600 underline">Edit</button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={handleSave} disabled={saving} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                        <button onClick={() => { setEditing(false); setForm({ name: user.name, email: user.email }); }} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                      </div>
                    )}
                  </div>
                <p className="text-gray-600 mt-1">{user.email}</p>
                <p className="text-sm font-semibold text-blue-600 mt-2 capitalize">
                  {user.role === 'user' ? 'Homebuyer' : user.role === 'agent' ? 'Real Estate Agent' : 'Admin'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
              {!editing ? (
                <p className="text-lg text-gray-900">{user.name}</p>
              ) : (
                <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border rounded" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
              {!editing ? (
                <p className="text-lg text-gray-900">{user.email}</p>
              ) : (
                <input value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 border rounded" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Account Type</label>
              <p className="text-lg text-gray-900 capitalize">
                {user.role === 'user' ? 'Homebuyer' : user.role === 'agent' ? 'Real Estate Agent' : 'Administrator'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">User ID</label>
              <p className="text-lg text-gray-900">{user.id}</p>
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {}
          <button
            onClick={() => navigate('/shortlist')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <Heart className="w-8 h-8 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">My Favorites</h3>
            <p className="text-gray-600 text-sm mt-2">View your shortlisted properties</p>
          </button>

          {}
          <button
            onClick={() => navigate('/insights')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <FileText className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Market Insights</h3>
            <p className="text-gray-600 text-sm mt-2">Explore market trends and data</p>
          </button>

          {}
          {(user.role === 'agent' || user.role === 'admin') && (
            <button
              onClick={() => navigate('/manage-listings')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
            >
              <FileText className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Manage Listings</h3>
              <p className="text-gray-600 text-sm mt-2">Manage your property listings</p>
            </button>
          )}
        </div>

        {}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useCallback } from 'react';
import api, { authAPI } from '../services/api';

const AgentUpload = () => {
  const [form, setForm] = useState({
    city: '',
    locality: '',
    type: '',
    price: '',
    pricePerUnit: '',
    area: '',
    image: '',
    description: ''
  });
  const [status, setStatus] = useState(null);
  const [listings, setListings] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const currentUser = authAPI.getCurrentUser();

  const fetchListings = useCallback(async () => {
    try {
      const res = await api.get('/api/properties', { params: { sellerId: currentUser?.id } });
      setListings(res.data.data || res.data);
    } catch (err) {
      console.warn('Failed to fetch listings', err.message);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) fetchListings();
  }, [currentUser, fetchListings]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingFiles(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      const res = await api.post('/api/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const urls = res.data.data || [];
      setUploadedUrls(urls);
      
      if (urls.length > 0) setForm(prev => ({ ...prev, image: urls[0], images: urls }));
    } catch (err) {
      console.error('File upload failed', err.message);
      setStatus({ error: 'File upload failed' });
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true });
    try {
      let response;
      if (editingId) {
        response = await api.put(`/api/properties/${editingId}`, form);
      } else {
        response = await api.post('/api/properties', form);
      }
      setStatus({ success: true, data: response.data });
      setForm({ city: '', locality: '', type: '', price: '', pricePerUnit: '', area: '', image: '', description: '' });
      setEditingId(null);
      fetchListings();
    } catch (err) {
      setStatus({ error: err.response?.data?.error || err.message });
    }
  };

  const handleEdit = (prop) => {
    setEditingId(prop.id);
    setForm({ city: prop.city || '', locality: prop.locality || '', type: prop.type || '', price: prop.price || '', pricePerUnit: prop.pricePerUnit || '', area: prop.area || '', image: prop.image || '', description: prop.description || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await api.delete(`/api/properties/${id}`);
      fetchListings();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 font-ui">
      <h2 className="text-2xl font-semibold mb-4">Upload Property (Agent)</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-muted">City</label>
          <input name="city" value={form.city} onChange={handleChange} className="mt-1 block w-full border border-neutral-200 rounded px-3 py-2 text-primary-text" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Locality</label>
          <input name="locality" value={form.locality} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Type (e.g. 2BHK)</label>
          <input name="type" value={form.type} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Price (display string)</label>
          <input name="price" value={form.price} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Price per unit (number)</label>
          <input name="pricePerUnit" value={form.pricePerUnit} onChange={handleChange} type="number" className="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Area (e.g. 600 sqft)</label>
          <input name="area" value={form.area} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Upload Images</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="mt-1 block w-full" />
          <div className="mt-2 flex flex-wrap gap-2">
            {uploadingFiles && <div className="text-sm text-gray-400">Uploading images...</div>}
            {uploadedUrls.map(u => (
              <img key={u} src={u} alt="thumb" className="w-20 h-20 object-cover rounded" />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div>
          <button type="submit" className="px-4 py-2 bg-hm-red text-white rounded font-semibold">{editingId ? 'Update Property' : 'Upload Property'}</button>
        </div>
      </form>

      {status?.loading && <p className="mt-4">Uploading...</p>}
      {status?.error && <p className="mt-4 text-red-600">Error: {status.error}</p>}
      {status?.success && (
        <div className="mt-4 p-4 border rounded bg-green-50">
          <h3 className="font-semibold">Property created</h3>
          <pre className="text-xs mt-2">{JSON.stringify(status.data, null, 2)}</pre>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3">Your Listings</h3>
        {listings.length === 0 && <p className="text-gray-600">No listings yet.</p>}
        <div className="space-y-3">
          {listings.map((p) => (
            <div key={p.id} className="p-3 border rounded flex justify-between items-start bg-white/5">
              <div>
                <div className="font-semibold">{p.city} — {p.locality} ({p.type})</div>
                <div className="text-sm text-gray-400">{p.price} • {p.area}</div>
                <div className="text-xs mt-1 text-gray-300">ID: {p.id}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentUpload;

import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, Search, Calendar } from 'lucide-react';
import { authAPI } from '../services/api';
import { sessionStorage } from '../services/sessionStorage';

export default function AdminDeletedProperties() {
  const [deletedProperties, setDeletedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const currentUser = authAPI.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchDeletedProperties();
    }
  }, [isAdmin]);

  const fetchDeletedProperties = async () => {
    try {
      setLoading(true);
      
      const deletedIds = sessionStorage.getDeletedProperties();
      console.log('Deleted IDs from session:', deletedIds);
      
      if (deletedIds.length === 0) {
        console.log('No deleted properties in session');
        setDeletedProperties([]);
        setLoading(false);
        return;
      }
      
      
      const response = await fetch('http://localhost:5001/api/properties');
      const data = await response.json();
      console.log('All properties from API:', data);
      
      if (data.success) {
        
        const deleted = (data.data || []).filter(p => {
          const isDeleted = deletedIds.includes(p.id);
          console.log(`Property ${p.id} (${p.city}): isDeleted=${isDeleted}`);
          return isDeleted;
        });
        console.log('Filtered deleted properties:', deleted);
        setDeletedProperties(deleted);
      }
    } catch (err) {
      console.error('Failed to fetch deleted properties:', err);
      setDeletedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = (propertyId) => {
    if (!window.confirm('Remove this property from deleted list?')) return;

    try {
      sessionStorage.removeDeletedProperty(propertyId);
      alert('Property recovered successfully!');
      
      window.location.reload();
    } catch (err) {
      alert('Failed to recover property: ' + err.message);
    }
  };

  const filteredProperties = deletedProperties.filter(prop =>
    prop.city?.toLowerCase().includes(filter.toLowerCase()) ||
    prop.locality?.toLowerCase().includes(filter.toLowerCase()) ||
    prop.type?.toLowerCase().includes(filter.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Access denied. Admin only.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recently Deleted Properties</h1>
        <p className="text-gray-600">Manage and recover deleted properties</p>
      </div>

      {}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by city, locality, or type..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading deleted properties...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Trash2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No deleted properties found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deleted At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProperties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{property.type}</div>
                        <div className="text-sm text-gray-500">{property.price}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property.city}</div>
                    <div className="text-sm text-gray-500">{property.locality}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      Session (Temporary)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Recoverable
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRecover(property.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Recover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

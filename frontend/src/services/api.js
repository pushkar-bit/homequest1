import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const authAPI = {
  signup: async (userData) => {
    const response = await api.post('/api/auth/signup', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  
  refresh: async () => {
    try {
      const response = await api.post('/api/auth/refresh');
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (err) {
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw err;
    }
  },
};


api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await authAPI.refresh();
        
        return api(originalRequest);
      } catch (refreshErr) {
        
        authAPI.logout();
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);


export const getProperties = async (params) => {
  const response = await api.get('/api/properties', { params });
  return response.data;
};

export const getPropertyById = async (id) => {
  const response = await api.get(`/api/properties/${id}`);
  return response.data;
};


export const getCityInsights = async (cityName) => {
  const response = await api.get('/api/insights/city', { 
    params: { name: cityName } 
  });
  return response.data;
};

export const getLocalityInsights = async (city, search) => {
  const response = await api.get('/api/insights/locality', { 
    params: { city, search } 
  });
  return response.data;
};

export const getSocietyInsights = async (city, locality) => {
  const response = await api.get('/api/insights/society', { 
    params: { city, locality } 
  });
  return response.data;
};


export const favoritesAPI = {
  
  getFavorites: async () => {
    const response = await api.get('/api/favorites');
    return response.data;
  },

  
  addFavorite: async (propertyId) => {
    const response = await api.post('/api/favorites', { propertyId });
    return response.data;
  },

  
  removeFavorite: async (favoriteId) => {
    const response = await api.delete(`/api/favorites/${favoriteId}`);
    return response.data;
  },
};


export const sendContactMessage = async (contactData) => {
  const response = await api.post('/api/contact', contactData);
  return response.data;
};

export default api;

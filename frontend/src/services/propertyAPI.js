import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';


export const fetchPropertiesFromBackend = async (city, type = '', page = 1, pageSize = 12, sortBy = 'newest') => {
  try {
    const params = {
      city: city,
      ...(type && { type: type }),
      page,
      pageSize,
      sortBy,
    };

    const response = await axios.get(`${API_BASE_URL}/api/properties`, {
      params,
    });

    return {
      success: true,
      data: response.data.data || [],
      total: response.data.total || 0,
      page: response.data.page || page,
      pageSize: response.data.pageSize || pageSize,
    };
  } catch (error) {
    console.error('Error fetching properties from backend:', error.message);
    return {
      success: false,
      data: [],
      error: error.message,
    };
  }
};


export const fetchTrendingProperties = async (limit = 6) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/properties/trending`, {
      params: { limit },
    });


    const data = response.data.data || response.data || [];
    return {
      success: true,
      data: Array.isArray(data) ? data : [],
    };
  } catch (error) {
    console.error('Error fetching trending properties:', error);

    return {
      success: true,
      data: [],
      error: error.message,
    };
  }
};


export const fetchAllProperties = async (page = 1, pageSize = 12, sortBy = 'newest') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/properties`, {
      params: { page, pageSize, sortBy },
    });

    return {
      success: true,
      data: response.data.data || [],
      total: response.data.total || 0,
      page: response.data.page || page,
      pageSize: response.data.pageSize || pageSize,
    };
  } catch (error) {
    console.error('Error fetching all properties:', error);
    return {
      success: false,
      data: [],
      total: 0,
      error: error.message,
    };
  }
};


export const fetchProperties = async (filters = {}) => {
  const { city, type, page = 1, pageSize = 12, sortBy = 'newest' } = filters;

  if (!city) {
    return { success: false, data: [], error: 'City is required' };
  }

  return fetchPropertiesFromBackend(city, type, page, pageSize, sortBy);
};


export const sortProperties = (properties, sortBy = 'newest') => {
  const sorted = [...properties];

  switch (sortBy) {
    case 'newest':
      return sorted.reverse();
    case 'highDemand':
      return sorted.sort(
        (a, b) => (b.demand || b.views || 0) - (a.demand || a.views || 0)
      );
    case 'priceLowHigh':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.price || a.pricePerUnit || 0);
        const priceB = parseFloat(b.price || b.pricePerUnit || 0);
        return priceA - priceB;
      });
    default:
      return sorted;
  }
};

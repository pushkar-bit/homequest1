const axios = require('axios');


const fetchPropertiesFromAPI = async (filters = {}) => {
  try {
    
    const response = await axios.get(process.env.EXTERNAL_PROPERTY_API, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch properties: ${error.message}`);
  }
};

module.exports = {
  fetchPropertiesFromAPI,
};

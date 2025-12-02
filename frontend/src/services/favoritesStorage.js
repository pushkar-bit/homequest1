

const FAVORITES_KEY = 'homequest_favorites';

export const favoritesStorage = {
  
  getFavorites: () => {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading favorites from storage:', error);
      return [];
    }
  },

  
  addFavorite: (property) => {
    try {
      const favorites = favoritesStorage.getFavorites();
      const propertyId = property.id || property.title;
      
      
      if (favorites.find(fav => fav.id === propertyId)) {
        return false; 
      }

      
      favorites.push({
        id: propertyId,
        propertyId: propertyId,
        ...property,
        addedAt: new Date().toISOString()
      });

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      return true;
    } catch (error) {
      console.error('Error adding favorite to storage:', error);
      return false;
    }
  },

  
  removeFavorite: (propertyId) => {
    try {
      const favorites = favoritesStorage.getFavorites();
      const filtered = favorites.filter(fav => fav.id !== propertyId && fav.propertyId !== propertyId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error removing favorite from storage:', error);
      return false;
    }
  },

  
  isFavorited: (propertyId) => {
    try {
      const favorites = favoritesStorage.getFavorites();
      return favorites.some(fav => fav.id === propertyId || fav.propertyId === propertyId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  },

  
  clearAll: () => {
    try {
      localStorage.removeItem(FAVORITES_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return false;
    }
  }
};

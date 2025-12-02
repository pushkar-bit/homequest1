const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.userId; 

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        error: 'Property ID is required'
      });
    }

    
    const existingFavorite = await prisma.favorites.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId
        }
      }
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        error: 'Property is already in favorites'
      });
    }

    
    const favorite = await prisma.favorites.create({
      data: {
        userId,
        propertyId
      }
    });

    res.status(201).json({
      success: true,
      data: favorite,
      message: 'Property added to favorites'
    });
  } catch (error) {
    console.error('Error adding favorite:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to add property to favorites',
      details: error.message
    });
  }
};


const getFavorites = async (req, res) => {
  try {
    const userId = req.userId; 

    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '12', 10);
    const skip = (page - 1) * pageSize;

    const [total, favorites] = await Promise.all([
      prisma.favorites.count({ where: { userId } }),
      prisma.favorites.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, skip, take: pageSize }),
    ]);

    res.json({
      success: true,
      data: favorites,
      total,
      page,
      pageSize,
      message: 'Favorites fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch favorites',
      details: error.message
    });
  }
};


const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; 

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Favorite ID is required'
      });
    }

    
    const favorite = await prisma.favorites.findUnique({
      where: { id: parseInt(id) }
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        error: 'Favorite not found'
      });
    }

    if (favorite.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized to delete this favorite'
      });
    }

    
    await prisma.favorites.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Property removed from favorites'
    });
  } catch (error) {
    console.error('Error removing favorite:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to remove favorite',
      details: error.message
    });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
};

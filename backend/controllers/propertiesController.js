
const MOCK_PROPERTIES = {
  'Mumbai': [
    { id: 'MUM001', city: 'Mumbai', locality: 'Bandra', type: '2BHK', price: '1.5Cr', pricePerUnit: 250000, area: '600 sqft', demand: 95, views: 1250, image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=400' },
    { id: 'MUM002', city: 'Mumbai', locality: 'Andheri', type: '1BHK', price: '80L', pricePerUnit: 180000, area: '450 sqft', demand: 88, views: 980, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' },
    { id: 'MUM003', city: 'Mumbai', locality: 'Worli', type: '3BHK', price: '2.5Cr', pricePerUnit: 280000, area: '900 sqft', demand: 92, views: 1100, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' },
    { id: 'MUM004', city: 'Mumbai', locality: 'Dadar', type: 'Villa', price: '3Cr', pricePerUnit: 300000, area: '1000 sqft', demand: 85, views: 750, image: 'https://images.unsplash.com/photo-1516683487411-3606a36ecc64?w=400' },
  ],
  'Bangalore': [
    { id: 'BNG001', city: 'Bangalore', locality: 'Koramangala', type: '2BHK', price: '1.2Cr', pricePerUnit: 200000, area: '600 sqft', demand: 90, views: 1050, image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=400' },
    { id: 'BNG002', city: 'Bangalore', locality: 'Whitefield', type: '1BHK', price: '70L', pricePerUnit: 160000, area: '440 sqft', demand: 87, views: 920, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' },
    { id: 'BNG003', city: 'Bangalore', locality: 'Indiranagar', type: '3BHK', price: '2Cr', pricePerUnit: 250000, area: '800 sqft', demand: 91, views: 1180, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' },
    { id: 'BNG004', city: 'Bangalore', locality: 'Malleswaram', type: '2BHK', price: '1.1Cr', pricePerUnit: 195000, area: '565 sqft', demand: 86, views: 890, image: 'https://images.unsplash.com/photo-1516683487411-3606a36ecc64?w=400' },
  ],
  'Delhi': [
    { id: 'DEL001', city: 'Delhi', locality: 'South Delhi', type: '2BHK', price: '1.8Cr', pricePerUnit: 270000, area: '670 sqft', demand: 93, views: 1320, image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=400' },
    { id: 'DEL002', city: 'Delhi', locality: 'Gurgaon', type: '1BHK', price: '75L', pricePerUnit: 170000, area: '440 sqft', demand: 89, views: 1010, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' },
    { id: 'DEL003', city: 'Delhi', locality: 'Noida', type: 'Plot', price: '50L', pricePerUnit: 100000, area: '500 sqft', demand: 84, views: 720, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' },
    { id: 'DEL004', city: 'Delhi', locality: 'New Delhi', type: '3BHK', price: '2.2Cr', pricePerUnit: 260000, area: '850 sqft', demand: 88, views: 950, image: 'https://images.unsplash.com/photo-1516683487411-3606a36ecc64?w=400' },
  ],
  'Pune': [
    { id: 'PUN001', city: 'Pune', locality: 'Hinjewadi', type: '2BHK', price: '90L', pricePerUnit: 185000, area: '486 sqft', demand: 87, views: 860, image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=400' },
    { id: 'PUN002', city: 'Pune', locality: 'Kalyani Nagar', type: '1BHK', price: '60L', pricePerUnit: 150000, area: '400 sqft', demand: 85, views: 780, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' },
    { id: 'PUN003', city: 'Pune', locality: 'Wakad', type: '3BHK', price: '1.5Cr', pricePerUnit: 210000, area: '715 sqft', demand: 89, views: 1050, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' },
    { id: 'PUN004', city: 'Pune', locality: 'Viman Nagar', type: 'Commercial', price: '2Cr', pricePerUnit: 400000, area: '500 sqft', demand: 82, views: 650, image: 'https://images.unsplash.com/photo-1516683487411-3606a36ecc64?w=400' },
  ],
  'Hyderabad': [
    { id: 'HYD001', city: 'Hyderabad', locality: 'Jubilee Hills', type: '2BHK', price: '1.3Cr', pricePerUnit: 210000, area: '620 sqft', demand: 90, views: 1120, image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=400' },
    { id: 'HYD002', city: 'Hyderabad', locality: 'Banjara Hills', type: '1BHK', price: '65L', pricePerUnit: 155000, area: '420 sqft', demand: 86, views: 820, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' },
    { id: 'HYD003', city: 'Hyderabad', locality: 'HITEC City', type: '3BHK', price: '1.8Cr', pricePerUnit: 230000, area: '780 sqft', demand: 91, views: 1240, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' },
    { id: 'HYD004', city: 'Hyderabad', locality: 'Madhapur', type: '2BHK', price: '1.1Cr', pricePerUnit: 205000, area: '540 sqft', demand: 88, views: 950, image: 'https://images.unsplash.com/photo-1516683487411-3606a36ecc64?w=400' },
  ],
  'Chennai': [
    { id: 'CHN001', city: 'Chennai', locality: 'T Nagar', type: '2BHK', price: '1Cr', pricePerUnit: 190000, area: '525 sqft', demand: 85, views: 780, image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=400' },
    { id: 'CHN002', city: 'Chennai', locality: 'Anna Nagar', type: '1BHK', price: '55L', pricePerUnit: 145000, area: '380 sqft', demand: 83, views: 720, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' },
    { id: 'CHN003', city: 'Chennai', locality: 'OMR', type: '3BHK', price: '1.6Cr', pricePerUnit: 220000, area: '730 sqft', demand: 88, views: 1050, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' },
    { id: 'CHN004', city: 'Chennai', locality: 'Adyar', type: 'Villa', price: '2.5Cr', pricePerUnit: 280000, area: '890 sqft', demand: 87, views: 920, image: 'https://images.unsplash.com/photo-1516683487411-3606a36ecc64?w=400' },
  ],
};
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getProperties = async (req, res) => {
  try {
    const { city, type, page = 1, sellerId } = req.query;

    let dbError = null;
    
    try {
      const where = { deletedAt: null }; 
      if (city) where.city = { equals: city };
      if (type) where.type = { equals: type };
      if (sellerId) where.sellerId = parseInt(sellerId, 10);

      const pageNum = parseInt(page) || 1;
      const pageSize = 12;

      const [total, data] = await Promise.all([
        prisma.property.count({ where }),
        prisma.property.findMany({ where, skip: (pageNum - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
      ]);

      return res.json({ success: true, data, total, page: pageNum, pageSize, message: 'Properties fetched (db)' });
    } catch (dbErr) {
      console.warn('Prisma unavailable or error. Falling back to mock properties:', dbErr.message);
      
    }

    
    const { city: cityQuery, type: typeQuery } = req.query;
    let properties = [];
    if (cityQuery) {
      const cityKey = Object.keys(MOCK_PROPERTIES).find(k => k.toLowerCase() === cityQuery.toLowerCase());
      properties = cityKey ? MOCK_PROPERTIES[cityKey] : [];
    }

    if (typeQuery) {
      properties = properties.filter(p => p.type.toLowerCase() === typeQuery.toLowerCase());
    }

    const pageNum = parseInt(page) || 1;
    const pageSize = 12;
    const start = (pageNum - 1) * pageSize;
    const paginated = properties.slice(start, start + pageSize);

    res.json({ success: true, data: paginated, total: properties.length, page: pageNum, pageSize, message: 'Properties fetched (mock)' });
  } catch (error) {
    console.error('Error fetching properties:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch properties', details: error.message });
  }
};


const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, error: 'Property ID is required' });
    }

    try {
      const property = await prisma.property.findUnique({ where: { id } });
      if (property) {
        
        if (property.deletedAt) {
          return res.status(410).json({
            success: false,
            error: 'Property has been deleted by the admin',
            deleted: true
          });
        }
        return res.json({ success: true, data: property, message: 'Property fetched (db)' });
      }
    } catch (dbErr) {
      console.warn('Prisma error in getPropertyById, falling back to mock:', dbErr.message);
    }

    
    for (const city in MOCK_PROPERTIES) {
      const property = MOCK_PROPERTIES[city].find(p => p.id === id);
      if (property) return res.json({ success: true, data: property, message: 'Property fetched (mock)' });
    }

    res.status(404).json({ success: false, error: 'Property not found' });
  } catch (error) {
    console.error('Error fetching property:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch property', details: error.message });
  }
};


const getTrendingProperties = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    try {
      const data = await prisma.property.findMany({ orderBy: { demand: 'desc' }, take: parseInt(limit, 10) });
      return res.json({ success: true, data, message: 'Trending properties fetched (db)' });
    } catch (dbErr) {
      console.warn('Prisma trending error, falling back to mock:', dbErr.message);
    }

    
    const allProperties = [];
    for (const city in MOCK_PROPERTIES) allProperties.push(...MOCK_PROPERTIES[city]);
    const trending = allProperties.sort((a, b) => b.demand - a.demand).slice(0, parseInt(limit, 10));
    res.json({ success: true, data: trending, message: 'Trending properties fetched (mock)' });
  } catch (error) {
    console.error('Error fetching trending properties:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch trending properties', details: error.message });
  }
};


const createProperty = async (req, res) => {
  try {
    const user = req.user || {};
    if (!user.role || !['agent', 'admin'].includes(user.role)) {
      return res.status(403).json({ success: false, error: 'Only agents or admins can create properties' });
    }

    const {
      id,
      city,
      locality,
      type,
      price,
      pricePerUnit,
      area,
      demand = 50,
      views = 0,
      image,
      description
    } = req.body;

    if (!city || !locality || !type || !price) {
      return res.status(400).json({ success: false, error: 'Missing required fields: city, locality, type, price' });
    }

    
    let newId = id;
    if (!newId) {
      const prefix = city.replace(/\s+/g, '').slice(0, 3).toUpperCase();
      newId = `${prefix}${Date.now().toString().slice(-6)}`;
    }

    const newProperty = {
      id: newId,
      city,
      locality,
      type,
      price,
      pricePerUnit: pricePerUnit ? parseInt(pricePerUnit, 10) : 0,
      area: area || '',
      demand: demand ? parseInt(demand, 10) : 50,
      views: views ? parseInt(views, 10) : 0,
      image: image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      images: req.body.images || [],
      description: description || ''
    };

    
    const created = await prisma.property.create({
      data: {
        id: newProperty.id,
        sellerId: req.userId || null,
        city: newProperty.city,
        locality: newProperty.locality,
        type: newProperty.type,
        price: newProperty.price,
        pricePerUnit: newProperty.pricePerUnit,
        area: newProperty.area,
        demand: newProperty.demand,
        views: newProperty.views,
        image: newProperty.image,
        images: newProperty.images,
        description: newProperty.description,
      }
    });

    return res.status(201).json({ success: true, data: created, message: 'Property created (db)' });
  } catch (error) {
    console.error('Error creating property:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to create property', details: error.message });
  }
};


const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    
    try {
      const existing = await prisma.property.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ success: false, error: 'Property not found' });
      
      if (existing.sellerId && existing.sellerId !== req.userId && req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Not authorized to update this property' });
      }
      const updated = await prisma.property.update({ where: { id }, data: { ...payload } });
      return res.json({ success: true, data: updated, message: 'Property updated' });
    } catch (dbErr) {
      console.warn('Prisma update failed, trying mock fallback:', dbErr.message);
    }

    
    for (const city in MOCK_PROPERTIES) {
      const idx = MOCK_PROPERTIES[city].findIndex(p => p.id === id);
      if (idx !== -1) {
        MOCK_PROPERTIES[city][idx] = { ...MOCK_PROPERTIES[city][idx], ...payload };
        return res.json({ success: true, data: MOCK_PROPERTIES[city][idx], message: 'Property updated (mock)' });
      }
    }

    return res.status(404).json({ success: false, error: 'Property not found' });
  } catch (error) {
    console.error('Error updating property:', error.message);
    res.status(500).json({ success: false, error: 'Failed to update property', details: error.message });
  }
};


const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const existing = await prisma.property.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ success: false, error: 'Property not found' });
      if (existing.deletedAt) return res.status(404).json({ success: false, error: 'Property already deleted' });
      if (existing.sellerId && existing.sellerId !== req.userId && req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Not authorized to delete this property' });
      }
      
      await prisma.property.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedBy: req.userId
        }
      });
      return res.json({ success: true, message: 'Property deleted' });
    } catch (dbErr) {
      console.warn('Prisma delete failed, trying mock fallback:', dbErr.message);
    }

    
    for (const city in MOCK_PROPERTIES) {
      const idx = MOCK_PROPERTIES[city].findIndex(p => p.id === id);
      if (idx !== -1) {
        MOCK_PROPERTIES[city].splice(idx, 1);
        return res.json({ success: true, message: 'Property deleted (mock)' });
      }
    }

    return res.status(404).json({ success: false, error: 'Property not found' });
  } catch (error) {
    console.error('Error deleting property:', error.message);
    res.status(500).json({ success: false, error: 'Failed to delete property', details: error.message });
  }
};


const getDeletedProperties = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const pageNum = parseInt(page) || 1;
    const pageSize = 12;

    const [total, data] = await Promise.all([
      prisma.property.count({ where: { deletedAt: { not: null } } }),
      prisma.property.findMany({
        where: { deletedAt: { not: null } },
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
        orderBy: { deletedAt: 'desc' }
      }),
    ]);

    return res.json({ success: true, data, total, page: pageNum, pageSize });
  } catch (error) {
    console.error('Error fetching deleted properties:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch deleted properties', details: error.message });
  }
};


const recoverProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, error: 'Property not found' });
    if (!existing.deletedAt) return res.status(400).json({ success: false, error: 'Property is not deleted' });

    
    const recovered = await prisma.property.update({
      where: { id },
      data: {
        deletedAt: null,
        deletedBy: null
      }
    });

    return res.json({ success: true, data: recovered, message: 'Property recovered' });
  } catch (error) {
    console.error('Error recovering property:', error.message);
    res.status(500).json({ success: false, error: 'Failed to recover property', details: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  getTrendingProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getDeletedProperties,
  recoverProperty,
};

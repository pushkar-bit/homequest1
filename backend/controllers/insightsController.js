const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const listCities = async (req, res) => {
  try {
    const cities = await prisma.cityInsight.findMany({ orderBy: { city: 'asc' } });
    return res.json({ success: true, data: cities, count: cities.length });
  } catch (err) {
    console.error('Error listing cities:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to list cities' });
  }
};


const getCityInsights = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'City name is required'
      });
    }

    const cityInsight = await prisma.cityInsight.findUnique({
      where: { city: name }
    });

    if (!cityInsight) {
      return res.status(404).json({
        success: false,
        error: 'City insights not found'
      });
    }

    res.json({
      success: true,
      data: cityInsight,
      message: 'City insights fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching city insights:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch city insights',
      details: error.message
    });
  }
};


const getLocalityInsights = async (req, res) => {
  try {
    const { city, search } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        error: 'City parameter is required'
      });
    }

    const whereClause = {
      city: city
    };

    if (search) {
      whereClause.locality = {
        contains: search
      };
    }

    const localityInsights = await prisma.localityInsight.findMany({
      where: whereClause
    });

    if (localityInsights.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No locality insights matched your criteria',
      });
    }

    res.json({
      success: true,
      data: localityInsights,
      message: 'Locality insights fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching locality insights:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch locality insights',
      details: error.message
    });
  }
};


const getSocietyInsights = async (req, res) => {
  try {
    const { locality, city } = req.query;

    if (!locality || !city) {
      return res.status(400).json({
        success: false,
        error: 'Both locality and city parameters are required'
      });
    }

    const societyInsights = await prisma.societyInsight.findMany({
      where: {
        locality: locality,
        city: city
      }
    });

    if (societyInsights.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No society insights found for that locality/city',
      });
    }

    res.json({
      success: true,
      data: societyInsights,
      message: 'Society insights fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching society insights:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch society insights',
      details: error.message
    });
  }
};



const createCityInsight = async (req, res) => {
  try {
    const { city, avgPriceSqFt, oneYearGrowth, demandIndex } = req.body;
    if (!city || !avgPriceSqFt) {
      return res.status(400).json({ success: false, error: 'City and avgPriceSqFt are required' });
    }
    const newInsight = await prisma.cityInsight.create({
      data: {
        city,
        avgPriceSqFt: parseFloat(avgPriceSqFt),
        oneYearGrowth: parseFloat(oneYearGrowth || 0),
        demandIndex: parseFloat(demandIndex || 0),
      }
    });
    res.status(201).json({ success: true, data: newInsight, message: 'City insight created' });
  } catch (error) {
    console.error('Error creating city insight:', error.message);
    res.status(500).json({ success: false, error: 'Failed to create city insight', details: error.message });
  }
};

const updateCityInsight = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    
    const existing = await prisma.cityInsight.findUnique({ where: { id: parseInt(id, 10) } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'City insight not found' });
    }

    
    const historyEntries = [];
    const updates = {
      avgPriceSqFt: data.avgPriceSqFt ? parseFloat(data.avgPriceSqFt) : undefined,
      oneYearGrowth: data.oneYearGrowth ? parseFloat(data.oneYearGrowth) : undefined,
      demandIndex: data.demandIndex ? parseFloat(data.demandIndex) : undefined,
    };

    for (const [fieldName, newValue] of Object.entries(updates)) {
      if (newValue !== undefined && existing[fieldName] !== newValue) {
        historyEntries.push({
          insightType: 'city',
          insightId: existing.id,
          fieldName,
          oldValue: String(existing[fieldName]),
          newValue: String(newValue),
          changedBy: req.userId
        });
      }
    }

    
    if (historyEntries.length > 0) {
      await prisma.insightHistory.createMany({ data: historyEntries });
    }

    
    const updated = await prisma.cityInsight.update({
      where: { id: parseInt(id, 10) },
      data: updates
    });

    res.json({ success: true, data: updated, message: 'City insight updated' });
  } catch (error) {
    console.error('Error updating city insight:', error.message);
    res.status(500).json({ success: false, error: 'Failed to update city insight', details: error.message });
  }
};

const deleteCityInsight = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cityInsight.delete({ where: { id: parseInt(id, 10) } });
    res.json({ success: true, message: 'City insight deleted' });
  } catch (error) {
    console.error('Error deleting city insight:', error.message);
    res.status(500).json({ success: false, error: 'Failed to delete city insight', details: error.message });
  }
};



const createLocalityInsight = async (req, res) => {
  try {
    const { city, locality, avgPriceSqFt, oneYearGrowth, trendComment } = req.body;
    if (!city || !locality || !avgPriceSqFt) {
      return res.status(400).json({ success: false, error: 'City, locality, and avgPriceSqFt are required' });
    }
    const newInsight = await prisma.localityInsight.create({
      data: {
        city,
        locality,
        avgPriceSqFt: parseFloat(avgPriceSqFt),
        oneYearGrowth: parseFloat(oneYearGrowth || 0),
        trendComment: trendComment || '',
      }
    });
    res.status(201).json({ success: true, data: newInsight, message: 'Locality insight created' });
  } catch (error) {
    console.error('Error creating locality insight:', error.message);
    res.status(500).json({ success: false, error: 'Failed to create locality insight', details: error.message });
  }
};

const updateLocalityInsight = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    
    const existing = await prisma.localityInsight.findUnique({ where: { id: parseInt(id, 10) } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Locality insight not found' });
    }

    
    const historyEntries = [];
    const updates = {
      avgPriceSqFt: data.avgPriceSqFt ? parseFloat(data.avgPriceSqFt) : undefined,
      oneYearGrowth: data.oneYearGrowth ? parseFloat(data.oneYearGrowth) : undefined,
      trendComment: data.trendComment || undefined,
    };

    for (const [fieldName, newValue] of Object.entries(updates)) {
      if (newValue !== undefined && existing[fieldName] !== newValue) {
        historyEntries.push({
          insightType: 'locality',
          insightId: existing.id,
          fieldName,
          oldValue: String(existing[fieldName]),
          newValue: String(newValue),
          changedBy: req.userId
        });
      }
    }

    
    if (historyEntries.length > 0) {
      await prisma.insightHistory.createMany({ data: historyEntries });
    }

    
    const updated = await prisma.localityInsight.update({
      where: { id: parseInt(id, 10) },
      data: updates
    });

    res.json({ success: true, data: updated, message: 'Locality insight updated' });
  } catch (error) {
    console.error('Error updating locality insight:', error.message);
    res.status(500).json({ success: false, error: 'Failed to update locality insight', details: error.message });
  }
};

const deleteLocalityInsight = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.localityInsight.delete({ where: { id: parseInt(id, 10) } });
    res.json({ success: true, message: 'Locality insight deleted' });
  } catch (error) {
    console.error('Error deleting locality insight:', error.message);
    res.status(500).json({ success: false, error: 'Failed to delete locality insight', details: error.message });
  }
};


const getInsightHistory = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { limit = 50 } = req.query;

    if (!['city', 'locality'].includes(type)) {
      return res.status(400).json({ success: false, error: 'Invalid insight type. Must be "city" or "locality"' });
    }

    const history = await prisma.insightHistory.findMany({
      where: {
        insightType: type,
        insightId: parseInt(id, 10)
      },
      include: {
        changedByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit, 10)
    });

    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching insight history:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch insight history', details: error.message });
  }
};


const undoInsightChange = async (req, res) => {
  try {
    const { type, id } = req.params;

    if (!['city', 'locality'].includes(type)) {
      return res.status(400).json({ success: false, error: 'Invalid insight type. Must be "city" or "locality"' });
    }

    
    const lastChange = await prisma.insightHistory.findFirst({
      where: {
        insightType: type,
        insightId: parseInt(id, 10)
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!lastChange) {
      return res.status(404).json({ success: false, error: 'No history found to undo' });
    }

    
    const model = type === 'city' ? prisma.cityInsight : prisma.localityInsight;
    const fieldName = lastChange.fieldName;
    let oldValue = lastChange.oldValue;

    
    if (['avgPriceSqFt', 'oneYearGrowth', 'demandIndex'].includes(fieldName)) {
      oldValue = parseFloat(oldValue);
    }

    const reverted = await model.update({
      where: { id: parseInt(id, 10) },
      data: { [fieldName]: oldValue }
    });

    
    await prisma.insightHistory.delete({ where: { id: lastChange.id } });

    res.json({ success: true, data: reverted, message: `Undid change to ${fieldName}` });
  } catch (error) {
    console.error('Error undoing insight change:', error.message);
    res.status(500).json({ success: false, error: 'Failed to undo insight change', details: error.message });
  }
};

module.exports = {
  listCities,
  getCityInsights,
  getLocalityInsights,
  getSocietyInsights,
  createCityInsight,
  updateCityInsight,
  deleteCityInsight,
  createLocalityInsight,
  updateLocalityInsight,
  deleteLocalityInsight,
  getInsightHistory,
  undoInsightChange,
};

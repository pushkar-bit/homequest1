
const DEALS = [];
const OFFERS = [];


const getDeals = async (req, res) => {
  try {
    const user = req.user || {};
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '12', 10);
    const skip = (page - 1) * pageSize;
    
    let filtered = DEALS;
    if (user.role === 'agent') filtered = filtered.filter(d => d.agentId === req.userId);
    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + pageSize);
    return res.json({ success: true, data: paginated, total, page, pageSize });
  } catch (err) {
    console.error('getDeals error', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch deals' });
  }
};

const createDeal = async (req, res) => {
  try {
    const user = req.user || {};
    if (!user.role || !['agent', 'admin'].includes(user.role)) {
      return res.status(403).json({ success: false, error: 'Only agents can create deals' });
    }

    const { propertyId, buyerName, price, notes } = req.body;
    if (!propertyId || !buyerName || !price) return res.status(400).json({ success: false, error: 'Missing fields' });

    const newDeal = { id: `DEAL${Date.now().toString().slice(-6)}`, propertyId, agentId: req.userId, buyerName, price, notes: notes || '', createdAt: new Date() };
    DEALS.push(newDeal);
    res.status(201).json({ success: true, data: newDeal });
  } catch (err) {
    console.error('createDeal error', err.message);
    res.status(500).json({ success: false, error: 'Failed to create deal' });
  }
};

const getOffers = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '12', 10);
    const skip = (page - 1) * pageSize;
    
    const total = OFFERS.length;
    const paginated = OFFERS.slice(skip, skip + pageSize);
    res.json({ success: true, data: paginated, total, page, pageSize });
  } catch (err) {
    console.error('getOffers error', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch offers' });
  }
};

const createOffer = async (req, res) => {
  try {
    const { propertyId, buyerName, offerPrice, message } = req.body;
    if (!propertyId || !buyerName || !offerPrice) return res.status(400).json({ success: false, error: 'Missing fields' });
    const newOffer = { id: `OFF${Date.now().toString().slice(-6)}`, propertyId, buyerName, offerPrice, message: message || '', createdAt: new Date() };
    OFFERS.push(newOffer);
    res.status(201).json({ success: true, data: newOffer });
  } catch (err) {
    console.error('createOffer error', err.message);
    res.status(500).json({ success: false, error: 'Failed to create offer' });
  }
};

module.exports = {
  getDeals,
  createDeal,
  getOffers,
  createOffer,
  
  addDeal: (deal) => {
    const normalized = { id: `DEAL${Date.now().toString().slice(-6)}`, ...deal, createdAt: new Date() };
    DEALS.push(normalized);
    return normalized;
  },
  _DEALS: DEALS,
};

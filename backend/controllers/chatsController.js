
const CHATS = []; 
const { v4: uuidv4 } = require('uuid');
const { addDeal } = require('./dealsController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createChat = async (req, res) => {
  try {
    let { propertyId, agentId } = req.body;
    const buyerId = req.userId; 

    if (!propertyId) {
      return res.status(400).json({ success: false, error: 'propertyId is required' });
    }

    
    if (!agentId) {
      try {
        const agentUser = await prisma.user.findFirst({ where: { role: 'agent' } });
        if (agentUser) agentId = agentUser.id;
      } catch (err) {
        
      }
    }

    const chat = { id: uuidv4(), propertyId, agentId, buyerId: buyerId || null, messages: [], status: 'open', createdAt: new Date() };
    CHATS.push(chat);

      
      try {
        const io = req.app.get('io');
        if (io) {
          io.to(`chat:${chat.id}`).emit('chatCreated', chat);
        }
      } catch (err) {}

      res.status(201).json({ success: true, data: chat });
  } catch (err) {
    console.error('createChat error', err.message);
    res.status(500).json({ success: false, error: 'Failed to create chat' });
  }
};

const getChat = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = CHATS.find(c => c.id === id);
    if (!chat) return res.status(404).json({ success: false, error: 'Chat not found' });
    res.json({ success: true, data: chat });
  } catch (err) {
    console.error('getChat error', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch chat' });
  }
};

const postMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const senderId = req.userId || null;
    if (!text) return res.status(400).json({ success: false, error: 'Message text is required' });

    const chat = CHATS.find(c => c.id === id);
    if (!chat) return res.status(404).json({ success: false, error: 'Chat not found' });
    if (chat.status === 'closed') return res.status(400).json({ success: false, error: 'Chat is closed' });

    const message = { id: uuidv4(), text, senderId, createdAt: new Date() };
    chat.messages.push(message);

    
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(`chat:${chat.id}`).emit('message', { chatId: chat.id, message });
      }
    } catch (err) {}

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    console.error('postMessage error', err.message);
    res.status(500).json({ success: false, error: 'Failed to post message' });
  }
};

const closeChat = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = CHATS.find(c => c.id === id);
    if (!chat) return res.status(404).json({ success: false, error: 'Chat not found' });
    if (chat.status === 'closed') return res.status(400).json({ success: false, error: 'Chat already closed' });

    
    const dealPayload = {
      propertyId: chat.propertyId,
      agentId: chat.agentId,
      buyerName: (req.user && req.user.email) || `Buyer-${chat.buyerId || 'guest'}`,
      price: req.body.price || 'Negotiated',
      notes: req.body.notes || 'Closed via chat'
    };
    
    const newDeal = addDeal(dealPayload);

    
    try {
      
      if (createDeal) {
        
        
      }
    } catch (err) {}

    
    chat.status = 'closed';
    chat.closedAt = new Date();

    
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(`chat:${chat.id}`).emit('dealClosed', newDeal);
      }
    } catch (err) {}
    res.json({ success: true, data: newDeal, message: 'Deal closed via chat' });
  } catch (err) {
    console.error('closeChat error', err.message);
    res.status(500).json({ success: false, error: 'Failed to close chat' });
  }
};

module.exports = {
  createChat,
  getChat,
  postMessage,
  closeChat,
  
  CHATS,
};

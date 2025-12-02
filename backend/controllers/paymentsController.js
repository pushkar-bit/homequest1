
const { addDeal } = require('./dealsController');



const createBankTransfer = async (req, res) => {
  try {
    const { propertyId, amount, payerName, payerAccount } = req.body;
    if (!propertyId || !amount) {
      return res.status(400).json({ success: false, error: 'propertyId and amount are required' });
    }

    
    
    const transactionId = `TXN${Date.now().toString().slice(-8)}`;

    
    const demoDeal = addDeal({ propertyId, buyerName: payerName || 'Guest', price: amount, agentId: 'bank-transfer' });

    return res.status(201).json({
      success: true,
      data: {
        transactionId,
        status: 'pending',
        instructions: `Please transfer ₹${amount} to account 1234567890 (IFSC: HOME000123) and include reference ${transactionId}. Once transferred, upload the receipt to /api/uploads or contact support.`,
        demoDeal,
      }
    });
  } catch (err) {
    console.error('createBankTransfer error', err?.message || err);
    res.status(500).json({ success: false, error: 'Failed to initiate bank transfer' });
  }
};

module.exports = { createBankTransfer };

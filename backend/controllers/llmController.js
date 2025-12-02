const { OpenAI } = require('openai');


const OPENAI_KEY = process.env.OPENAI_API_KEY;
let openai = null;
if (OPENAI_KEY) {
  openai = new OpenAI({ apiKey: OPENAI_KEY });
}


const createPromptContext = (propertyData) => {
  const system = `You are a property assistant. Only use the provided property data JSON to answer questions. If the user's question is outside the provided data, respond with: "I can only answer questions about this property."`;
  const context = `PROPERTY_JSON_START\n${JSON.stringify(propertyData)}\nPROPERTY_JSON_END`;
  return { system, context };
};



const propertyChat = async (req, res) => {
  try {
    const { property, message } = req.body;
    if (!property || !property.id) {
      return res.status(400).json({ success: false, error: 'Property object with id required' });
    }
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message text required' });
    }

    
    const { system, context } = createPromptContext(property);

    
    if (!openai) {
      const normalized = message.toLowerCase();
      const allowedFields = ['price', 'location', 'amenities', 'builder', 'area', 'carpet', 'super', 'configuration', 'nearby', 'society', 'owner', 'agent', 'remarks'];
      const isAboutProperty = allowedFields.some(f => normalized.includes(f) || (property[f] && normalized.includes(property[f].toString().toLowerCase())));

      if (!isAboutProperty) {
        return res.json({ success: true, data: { text: 'I can only answer questions about this property.' } });
      }

      
      if (normalized.includes('price')) {
        return res.json({ success: true, data: { text: `Price: ${property.price || 'Not specified'}` } });
      }
      if (normalized.includes('location')) {
        return res.json({ success: true, data: { text: `Location: ${property.location || property.locality || 'Not specified'}` } });
      }
      if (normalized.includes('area')) {
        return res.json({ success: true, data: { text: `Area: ${property.area || 'Not specified'} (Carpet/Super: ${property.carpetArea || 'N/A'}/${property.superArea || 'N/A'})` } });
      }

      
      return res.json({ success: true, data: { text: `${property.title || property.name || 'This property'} - ${property.description || 'No description provided'}` } });
    }

    
    const promptMessages = [
      { role: 'system', content: system },
      { role: 'system', content: `Property context: ${context}` },
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: promptMessages,
      max_tokens: 300,
      temperature: 0.3,
    });

    const text = completion.choices?.[0]?.message?.content?.trim() || 'I can only answer questions about this property.';

    
    
    if (text.length === 0) {
      return res.json({ success: true, data: { text: 'I can only answer questions about this property.' } });
    }

    res.json({ success: true, data: { text } });
  } catch (err) {
    console.error('propertyChat error', err?.message || err);
    return res.status(500).json({ success: false, error: 'Failed to process chat with LLM' });
  }
};

module.exports = { propertyChat };

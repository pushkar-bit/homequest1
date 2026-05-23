const Groq = require('groq-sdk');

// ── Groq client ───────────────────────────────────────────────────────────────
const GROQ_API_KEY = process.env.RAPIDAPI_KEY; // stored under RAPIDAPI_KEY in .env
let groq = null;

// Only initialize Groq if the key is a valid Groq key (starts with gsk_)
if (GROQ_API_KEY && GROQ_API_KEY.startsWith('gsk_')) {
  groq = new Groq({ apiKey: GROQ_API_KEY });
} else {
  console.warn('[llmController] No valid GROQ API key found (must start with gsk_) — falling back to static responses');
}

// ── System prompt ─────────────────────────────────────────────────────────────
const buildSystemPrompt = (propertyData) => `
You are HomeQuest AI, a knowledgeable and friendly real estate assistant embedded inside the HomeQuest property platform.

You have TWO areas of expertise:

1. **This Specific Property** — You have access to the full data of the property the user is currently viewing (provided below as JSON). Use it to answer specific questions about this listing accurately. Always prefer data from the property JSON when the user asks about price, location, area, builder, amenities, configuration, agent, owner, society, availability, etc.

2. **General Real Estate Knowledge** — You can also answer any general real estate questions such as:
   - How home loans and EMIs work
   - Difference between carpet area, built-up area, and super built-up area
   - What RERA is and how to verify a project
   - Tips for buying vs renting
   - How property registration and stamp duty works
   - Real estate investment advice, market trends, terminologies
   - Legal processes like sale deeds, NOCs, encumbrance certificates
   - Any other real estate-related questions

**Formatting Rules (STRICTLY FOLLOW):**
- Be concise, clear, and professional.
- When listing multiple points, ALWAYS put each point on its OWN NEW LINE. Never write list items inline or separated by numbers in the same paragraph.
- Use bullet lists like this (each on its own line):
  - Point one
  - Point two
  - Point three
- Or numbered lists like this (each on its own line):
  1. First item
  2. Second item
  3. Third item
- Use **bold** for headings or key terms.
- Separate distinct sections with a blank line.
- If a question is completely unrelated to real estate (e.g., cooking, sports), politely say you're a real estate assistant.
- Never make up property details — only use what is in the property JSON.
- Keep responses under 300 words unless a detailed explanation is truly necessary.

--- PROPERTY DATA START ---
${JSON.stringify(propertyData, null, 2)}
--- PROPERTY DATA END ---
`.trim();

// ── Main handler ──────────────────────────────────────────────────────────────
const propertyChat = async (req, res) => {
  try {
    const { property, message, history = [] } = req.body;

    if (!property || !property.id) {
      return res.status(400).json({ success: false, error: 'Property object with id required' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message text required' });
    }

    // ── Groq not configured — static fallback ─────────────────────────────────
    if (!groq) {
      const normalized = message.toLowerCase();
      if (normalized.includes('price')) {
        return res.json({ success: true, data: { text: `The price of this property is ${property.price || 'not specified'}.` } });
      }
      if (normalized.includes('location') || normalized.includes('where')) {
        return res.json({ success: true, data: { text: `This property is located at ${property.location || property.locality || 'location not specified'}.` } });
      }
      if (normalized.includes('area')) {
        return res.json({ success: true, data: { text: `Area: ${property.area || 'N/A'} sq ft (Carpet: ${property.carpetArea || 'N/A'} / Super: ${property.superArea || 'N/A'}).` } });
      }
      return res.json({
        success: true,
        data: { text: `${property.title || 'This property'}: ${property.description || 'No description available.'}` }
      });
    }

    // ── Build message history for multi-turn conversation ─────────────────────
    const conversationMessages = [
      { role: 'system', content: buildSystemPrompt(property) },
      // Include prior conversation turns (max last 8 for context window efficiency)
      ...history.slice(-8).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
      { role: 'user', content: message.trim() },
    ];

    // ── Call Groq API ─────────────────────────────────────────────────────────
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',   // fast, high-quality Groq-hosted model
      messages: conversationMessages,
      max_tokens: 500,
      temperature: 0.5,
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim() ||
      'Sorry, I could not generate a response. Please try again.';

    return res.json({ success: true, data: { text } });
  } catch (err) {
    console.error('[propertyChat] Groq error:', err?.message || err);
    return res.status(500).json({ success: false, error: 'Failed to process chat request' });
  }
};

module.exports = { propertyChat };

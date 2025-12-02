const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true } });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    return res.json({ success: true, data: user });
  } catch (err) {
    console.error('getProfile error', err?.message || err);
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
};


const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { name, email } = req.body;
    const data = {};
    if (typeof name === 'string' && name.trim().length > 0) data.name = name.trim();
    if (typeof email === 'string' && email.trim().length > 0) data.email = email.trim().toLowerCase();

    if (Object.keys(data).length === 0) return res.status(400).json({ success: false, error: 'No valid fields provided' });

    
    if (data.email) {
      const existing = await prisma.user.findUnique({ where: { email: data.email } });
      if (existing && existing.id !== userId) {
        return res.status(400).json({ success: false, error: 'Email already in use' });
      }
    }

    const updated = await prisma.user.update({ where: { id: userId }, data, select: { id: true, name: true, email: true, role: true, updatedAt: true } });
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('updateProfile error', err?.message || err);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};

module.exports = { getProfile, updateProfile };

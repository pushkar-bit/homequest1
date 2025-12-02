const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyPassword = async (password, hashedPassword) => {
  
  
  return password === hashedPassword;
};

module.exports = {
  generateToken,
  verifyPassword,
};

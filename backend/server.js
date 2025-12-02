const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();

const app = express();
const http = require('http');
const { Server } = require('socket.io');
const prisma = new PrismaClient();




const corsOptions = {
  origin: function (origin, callback) {
    
    if (!origin) return callback(null, true);
    const allowed = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    if (process.env.NODE_ENV === 'production') {
      if (origin === allowed) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    }
    
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1') || origin === allowed) {
      return callback(null, true);
    }
    
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const REFRESH_TOKEN_TTL_DAYS = parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '30', 10);



const propertiesRoutes = require('./routes/properties');
const insightsRoutes = require('./routes/insights');
const favoritesRoutes = require('./routes/favorites');
const contactRoutes = require('./routes/contact');
const dealsRoutes = require('./routes/deals');
const uploadsRoutes = require('./routes/uploads');
const chatsRoutes = require('./routes/chats');
const profileRoutes = require('./routes/profile');
const paymentsRoutes = require('./routes/payments');




app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password' });
    }

    
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    
    if (!['user', 'agent', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be user, agent, or admin' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    });

    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    try {
      const refreshTokenValue = crypto.randomBytes(40).toString('hex');
      const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
      await prisma.refreshToken.create({
        data: {
          token: refreshTokenValue,
          userId: user.id,
          expiresAt,
        }
      });

      
      res.cookie('refreshToken', refreshTokenValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
      });
    } catch (err) {
      console.warn('RefreshToken table missing or error creating token, continuing without refresh token:', err.message);
    }

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    try {
      const refreshTokenValue = crypto.randomBytes(40).toString('hex');
      const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
      await prisma.refreshToken.create({ data: { token: refreshTokenValue, userId: user.id, expiresAt } });

      
      res.cookie('refreshToken', refreshTokenValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
      });
    } catch (err) {
      console.warn('RefreshToken table missing or error creating token on login, continuing without refresh token:', err.message);
    }

    return res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





app.post('/api/auth/refresh', async (req, res) => {
  try {
    const refreshTokenValue = req.cookies?.refreshToken;
    if (!refreshTokenValue) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }

    
    let rt;
    try {
      rt = await prisma.refreshToken.findUnique({ where: { token: refreshTokenValue } });
    } catch (err) {
      console.warn('RefreshToken table missing; cannot refresh via cookie:', err.message);
      return res.status(501).json({ error: 'Refresh not available' });
    }

    if (!rt || rt.revoked) return res.status(401).json({ error: 'Invalid refresh token' });

    const now = new Date();
    if (new Date(rt.expiresAt) < now) return res.status(401).json({ error: 'Refresh token expired' });

    
    const user = await prisma.user.findUnique({ where: { id: rt.userId } });
    if (!user) return res.status(401).json({ error: 'User not found' });

    
    try {
      await prisma.refreshToken.update({ where: { id: rt.id }, data: { revoked: true } });
      const newRefreshTokenValue = crypto.randomBytes(40).toString('hex');
      const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
      await prisma.refreshToken.create({ data: { token: newRefreshTokenValue, userId: user.id, expiresAt } });

      
      const accessToken = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      
      res.cookie('refreshToken', newRefreshTokenValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
      });

      return res.json({ token: accessToken });
    } catch (err) {
      console.error('Error rotating refresh token:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/auth/logout', async (req, res) => {
  try {
    const refreshTokenValue = req.cookies?.refreshToken;
    if (refreshTokenValue) {
      const rt = await prisma.refreshToken.findUnique({ where: { token: refreshTokenValue } });
      if (rt) {
        await prisma.refreshToken.update({ where: { id: rt.id }, data: { revoked: true } });
      }
    }
    res.clearCookie('refreshToken');
    return res.json({ success: true });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});




app.use('/api/properties', propertiesRoutes);


app.use('/api/insights', insightsRoutes);


app.use('/api/favorites', favoritesRoutes);


app.use('/api/contact', contactRoutes);


app.use('/api/deals', dealsRoutes);

app.use('/api/profile', profileRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));


app.use('/api/uploads', uploadsRoutes);

app.use('/api/chats', chatsRoutes);


const llmRoutes = require('./routes/llm');
app.use('/api/llm', llmRoutes);

app.use('/api/payments', paymentsRoutes);



app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});




app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});



const PORT = process.env.PORT || 5001;


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});


app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  
  socket.on('join', (room) => {
    socket.join(room);
  });
  socket.on('leave', (room) => {
    socket.leave(room);
  });
  socket.on('disconnect', () => {
    
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

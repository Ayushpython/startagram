const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS — uses CORS_ORIGIN env var; falls back to localhost for dev
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  // Default dev origins
  allowedOrigins.push('http://localhost:3000', 'http://localhost:3001');
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Database connection
const MONGO_URI =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_PROD || process.env.MONGODB_URI
    : process.env.MONGODB_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ---------- API Routes ----------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/blueprints', require('./routes/blueprints'));
app.use('/api/marketplace', require('./routes/marketplace'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/collaboration', require('./routes/collaboration'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/validation', require('./routes/validation'));
app.use('/api/chat', require('./routes/chat'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// API root — info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Idea Marketplace API',
    version: '1.0.0',
    health: '/api/health',
    docs: {
      auth: '/api/auth',
      users: '/api/users',
      blueprints: '/api/blueprints',
      marketplace: '/api/marketplace',
      comments: '/api/comments',
      collaboration: '/api/collaboration',
      wallet: '/api/wallet',
      transactions: '/api/transactions',
      validation: '/api/validation',
      chat: '/api/chat',
    },
  });
});

// API 404 — must come BEFORE the static file catch-all
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// ---------- Production: serve React build ----------
if (process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  const clientBuildPath = path.join(__dirname, '..', 'client', 'build');

  if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));

    // Any non-API request → serve React index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  }
} else {
  // Dev root endpoint
  app.get('/', (req, res) => {
    res.send('API is running (development mode)');
  });
}

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error(err.stack || err);
  const status = err.status || 500;
  res.status(status).json({
    error:
      process.env.NODE_ENV === 'production' && status === 500
        ? 'Internal server error'
        : err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`
  );
});

module.exports = app;

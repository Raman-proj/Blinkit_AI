const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load .env variables
dotenv.config();

// Import Routes
const productRoutes = require('./routes/productRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Allow Cross-Origin Requests from React Vite frontend
app.use(express.json({ limit: '50mb' })); // Support Base64 image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Blinkit AI Shopping Concierge Backend is up and running!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🛍️  Blinkit AI Backend Server`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🟢 Products API: http://localhost:${PORT}/api/products`);
  console.log(`🤖 AI Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`=================================================`);
});

module.exports = { app, server };

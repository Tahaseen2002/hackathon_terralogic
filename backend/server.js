const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const NodeCache = require('node-cache');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize in-memory cache (simulates Redis)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection (with fallback to in-memory for demo)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pulsevo';

console.log('🔌 Attempting MongoDB connection...');
if (MONGODB_URI.includes('mongodb+srv')) {
  console.log('📡 Using MongoDB Atlas');
} else {
  console.log('💻 Using local MongoDB');
}

// Disable buffering to prevent timeout errors when MongoDB is unavailable
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 3000);

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 5000,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => {
  console.log('⚠️ MongoDB connection failed, using in-memory storage');
  console.log('Error:', err.message);
  console.log('💡 Tip: Check your MONGODB_URI in backend/.env');
});

// Make cache available globally
app.set('cache', cache);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'PULSEVO API Documentation'
}));

// API Documentation JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);

// Health check
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: PULSEVO API is running
 *                 cache:
 *                   type: object
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PULSEVO API is running',
    cache: cache.getStats(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PULSEVO Backend running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`📄 OpenAPI Spec: http://localhost:${PORT}/api-docs.json`);
});

module.exports = app;

const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const swaggerDocs = require('./swagger');
// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);

// Setup Swagger docs
swaggerDocs(app);

app.get('/', (req, res) => {
  res.send('✅ Website Analytics API is running!');
});


module.exports = app; 
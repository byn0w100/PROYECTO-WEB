const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: '../.env' }); // Since server.js is in /backend, it needs to point to root .env

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Route files
const authRoutes = require('./routes/authRoutes');
const progressRoutes = require('./routes/progressRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

// Static mapping for frontend (optional, since it's an HTML file you might open directly or serve)
const path = require('path');
app.use(express.static(path.join(__dirname, '../')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));

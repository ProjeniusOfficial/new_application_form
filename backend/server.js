// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = [
  'http://localhost:3000', // For local testing
  'https://new-application-form.vercel.app/' // <-- ADD THIS LINE
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions)); // Allow cross-origin requests
app.use(express.json({ limit: '10mb' })); // Allow server to accept JSON
app.use(express.urlencoded({ extended: true }));

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB!'))
.catch((err) => console.error('MongoDB connection error:', err));

// --- Routes ---
// We will add our API routes here
app.use('/api', require('./routes/applicationRoutes')); // We'll create this file next

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
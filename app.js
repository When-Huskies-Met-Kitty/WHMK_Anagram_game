const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();

// Import API routes
const clueRoutes = require('./routes/api/clues');
const authorRoutes = require('./routes/api/authors');
const editorRoutes = require('./routes/api/editors');

// Connect to MongoDB
// remote mongodb+srv://whenHMK:<password>@whmk.3sd5shf.mongodb.net/?retryWrites=true&w=majority
//local 'mongodb://localhost:27017/mern-demo'
mongoose.connect( process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })

    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Apply CORS middleware
app.use(cors());
app.use(express.static(path.resolve(__dirname, "./client/build")));

// Middleware for parsing JSON
app.use(express.json());

// Use API routes
app.use('/api/clues', clueRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/editors', editorRoutes);

// Simple "Hello, World!" route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const express = require('express');
const router = express.Router();

const authorController = require('../../controllers/authorController');

// Example route: Get all authors
router.get('/', authorController.getAllAuthors);

// Add more author-related routes here

module.exports = router;

const express = require('express');
const router = express.Router();

const editorController = require('../../controllers/editorController');

// Example route: Get all editors
router.get('/', editorController.getAllEditors);

// Add more editor-related routes here

module.exports = router;

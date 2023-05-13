const express = require('express');
const router = express.Router();

const clueController = require('../../controllers/clueController');

router.get('/random', clueController.getRandomUnusedClue);

// Add a route for validating the answer
router.post('/validate', clueController.validateAnswer);

// Add a route for saving clue data
router.post('/saveClueData', clueController.saveClueData);

module.exports = router;



const express = require('express');
const router = express.Router();

const clueController = require('../../controllers/clueController');

router.get('/random', clueController.getRandomUnusedClue);

// Add a route for validating the answer
router.post('/validate', clueController.validateAnswer);

// Add a route for saving clue data
router.post('/saveClueData', clueController.saveClueData);

// Add a route for getting all the clue data
router.get('/getEntireClueData', clueController.getEntireClueData);

// Add a route to update clue data
router.put('/updateClueData', clueController.updateClueData);

module.exports = router;



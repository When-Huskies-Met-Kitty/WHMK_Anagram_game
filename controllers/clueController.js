const Clue = require('../models/clue');

exports.getRandomUnusedClue = async (req, res) => {
    try {
        const unusedCluesCount = await Clue.countDocuments({ used: false });

        if (unusedCluesCount === 0) {
            return res.status(404).json({ message: 'No unused clues available.' });
        }

        const randomIndex = Math.floor(Math.random() * unusedCluesCount);
        const randomUnusedClue = await Clue.findOne({ used: false }).skip(randomIndex);

        res.json(randomUnusedClue);
    } catch (error) {
        console.error('Error retrieving random unused clue:', error);
        res.status(500).json({ message: 'Error retrieving random unused clue.' });
    }
};

exports.validateAnswer = async (req, res) => {
    const { answer, clueId } = req.body;

    try {
        const clue = await Clue.findById(clueId);

        if (!clue) {
            return res.status(404).json({ message: 'Clue not found' });
        }

        if (clue.answer === answer) {
            res.json({ correct: true });
        } else {
            res.json({ correct: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while validating the answer' });
    }
};




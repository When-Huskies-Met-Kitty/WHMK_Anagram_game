const Clue = require('../models/clue');

exports.getRandomUnusedClue = async (req, res) => {
    try {
        // Check if there is a clue for the day
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let clueOfTheDay = await Clue.findOne({ dayOfUse: { $gte: today, $lt: tomorrow } });

        // If there is no clue for the day or the clue is from a previous day
        if (!clueOfTheDay || clueOfTheDay.dayOfUse < today) {
            const unusedCluesCount = await Clue.countDocuments({ used: false });

            if (unusedCluesCount === 0) {
                return res.status(404).json({ message: 'No unused clues available.' });
            }

            const randomIndex = Math.floor(Math.random() * unusedCluesCount);
            clueOfTheDay = await Clue.findOne({ used: false }).skip(randomIndex);

            // Mark the clue as used and set the day of use
            clueOfTheDay.used = true;
            clueOfTheDay.dayOfUse = Date.now();
            await clueOfTheDay.save();
        }

        res.json(clueOfTheDay);
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

exports.saveClueData = async(req,res) => {
    const { answer, clue, articleUrl, used} = req.body;

    try{
        const insertObj = await Clue.create({
            answer: answer,
            clue: clue,
            articleUrl: articleUrl,
            user:used
        });
        if(insertObj != null){
            res.json({ isClueSaved: true });
        }else{
            res.json({ isClueSaved: false });
        }
    }catch(error){
        console.error('Error saving clue data : ', error);
        res.status(500).json({ message: 'Error saving clue data' });
    }
}




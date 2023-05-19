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
    const { answer, clue, articleUrl} = req.body;

    try{
        const insertObj = await Clue.create({
            answer: answer,
            clue: clue,
            articleUrl: articleUrl
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

exports.getEntireClueData = async(req,res) => {
    try{
        const clueData = await Clue.find();
        if(clueData != null){
            res.json({ clueData: clueData, doesClueDataExist:true });
        }else{
            res.json({ doesClueDataExist:false });
        }
    }catch(error){
        console.error('Error while fetching clue data : ', error);
        res.status(500).json({ message: 'Error while fetching clue data' });
    }
}

exports.updateClueData = async(req, res) => {
    try{
        console.log(req.body);
        const { _id, answer, clue, articleUrl, used, dayOfUse} = req.body;
        let clueData = await Clue.findOne({ _id: _id });
        
        clueData.answer = answer;
        clueData.clue = clue;
        clueData.articleUrl = articleUrl;
        clueData.used = used;
        clueData.dayOfUse = dayOfUse;
    
        await clueData.save();

        res.json({ isClueUpdated: true });
    }catch(error){
        console.error('Error while updating clue data : ', error);
        res.status(500).json({ message: 'Error while updating clue data' });
    }
}




const mongoose = require('mongoose');

const clueSchema = new mongoose.Schema({
    answer: {
        type: String,
        required: true
    },
    clue: {
        type: String,
        required: true
    },
    articleUrl: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    },
    dayOfUse: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});

const Clue = mongoose.model('Clue', clueSchema);

module.exports = Clue;

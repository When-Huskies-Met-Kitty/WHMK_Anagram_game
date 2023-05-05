const mongoose = require('mongoose');

const editorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const Editor = mongoose.model('Editor', editorSchema);

module.exports = Editor;

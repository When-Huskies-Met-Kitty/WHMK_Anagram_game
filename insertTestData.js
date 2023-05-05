const mongoose = require('mongoose');
const Clue = require('./models/clue');

// Replace this URL with your MongoDB connection string if it's different
const mongoURL = 'mongodb://localhost:27017/mern-demo';

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

const testData = [
    {
        clue: "This is a test clue 1",
        answer: "testanswer1",
        articleUrl: "https://example.com/test-article-1",
        used: false
    },
    {
        clue: "This is a test clue 2",
        answer: "testanswer2",
        articleUrl: "https://example.com/test-article-2",
        used: false
    },
    {
        clue: "This is a test clue 3",
        answer: "testanswer3",
        articleUrl: "https://example.com/test-article-3",
        used: false
    }
];


// Insert the test data into the database
Clue.insertMany(testData)
    .then(() => {
        console.log('Test data inserted successfully');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error inserting test data:', err);
        mongoose.connection.close();
    });

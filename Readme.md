# MERN Stack Web Game

This project is a web-based game built using the MERN stack (MongoDB, Express, React, and Node.js). The game features daily anagram puzzles, streak counts, and author/editor interfaces.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- [Node.js and npm](https://nodejs.org/en/download/)
- [MongoDB](https://docs.mongodb.com/manual/administration/install-on-linux/)

## Getting Started

1. **Clone the repository**:

2. **Navigate to the project directory**:
3. **Install server dependencies**:
   from root directory ->
   npm install
4. **Install client dependencies**:
cd client -> 
npm install

**This version currently uses a local MongoDB database**. To set up your own database, follow the instructions [here](https://docs.mongodb.com/manual/installation/).

you will need the .env file to connect to the database. Please contact me for the .env file.

The way this is set up is in the app.js file, the mongoose.connect() function is called with the .env file as an argument. This is how the database is connected to the app.
```angular2html
// Line 19
mongoose.connect( process.env.LOCAL_MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
```
the current options are:

MONGODB_CONNECTION_STRING=server string with password and username

LOCAL_MONGODB_CONNECTION_STRING=mongodb://localhost:27017/mern-demo this is my local database connection string add yours when your local is set up

**The remote is rather slow so for testing purposes, I would recommend using the local database.**

to run the basic test run the following commands from the root directory:
node insertTestData.js -> this will seed your database with some test data to work with

Start server:

from root directory -> npm start

Start client:

cd client -> npm start
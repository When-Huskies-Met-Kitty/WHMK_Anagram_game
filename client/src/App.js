import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { stats } from './components/Stats';

function App() {
    const [userInput, setUserInput] = useState('');
    const [message, setMessage] = useState('');
    const [clue, setClue] = useState(null);

    useEffect(() => {
        fetch('/api/clues/random')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched data:', data);
                setClue(data);
            })
            .catch((error) => {
                console.error('Error fetching random unused clue:', error);
            });
    }, []);



    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/clues/validate', {

                answer: userInput,
                clueId: clue._id,
            });

            if (response.data.correct) {
                stats(true)
                setMessage('Correct! You solved the anagram.');
            } else {
                setMessage('Incorrect! Please try again.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };



    return (
        <div className="App">
            <h1>Anagram Game</h1>
            {clue ? (
                <>
                    <p>Clue: {clue.clue}</p>
                    <p>
                        <a href={clue.articleUrl} target="_blank" rel="noopener noreferrer">
                            View article
                        </a>
                    </p>
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                    <button onClick={handleSubmit}>Submit</button>
                </>
            ) : (
                <p>Loading...</p>
            )}
            <p>{message}</p>
        </div>
    );
}

export default App;



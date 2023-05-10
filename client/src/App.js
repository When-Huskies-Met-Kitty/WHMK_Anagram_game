import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { stats } from './components/Stats';

function App() {
    const [clue, setClue] = useState(null);
    const [message, setMessage] = useState("");
    const [letters, setLetters] = useState([]);
    const [boxes, setBoxes] = useState([]);
    const [retryCount, setRetryCount] = useState(0);
    const [timer, setTimer] = useState(180);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        fetch('/api/clues/random')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setClue(data);
                const answerLetters = data.answer.split('');
                const shuffledLetters = shuffle(answerLetters.map((letter, index) => ({ id: index, value: letter })));
                setLetters(shuffledLetters);
                setBoxes(new Array(answerLetters.length).fill(null));
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timer <= 0) {
            setGameOver(true);
        }
    }, [timer]);

    const handleSubmit = async () => {
        const response = await axios.post('http://localhost:5000/api/clues/validate', {
            answer: boxes.map(box => box?.value).join(''),
            clueId: clue._id,
        });

        if (response.data.correct) {
            stats(true);
            setMessage('Correct! You solved the anagram.');
            setGameOver(true); // Set gameOver to true
        } else {
            setMessage('Incorrect! Please try again.');
            setRetryCount(prevRetryCount => prevRetryCount + 1);

            if (retryCount + 1 >= 3) {
                setGameOver(true);
            }

            // Reset the board
            const answerLetters = clue.answer.split('');
            const shuffledLetters = shuffle(answerLetters.map((letter, index) => ({ id: index, value: letter })));
            setLetters(shuffledLetters);
            setBoxes(new Array(answerLetters.length).fill(null));
        }
    };


    const handleDrop = (e, index) => {
        const id = e.dataTransfer.getData("text");
        const letter = letters.find(item => item.id === Number(id));
        let box = null;
        let originIndex = null;

        if (!letter) {
            box = boxes.find((box, idx) => {
                if (box && box.id === Number(id)) {
                    originIndex = idx;
                    return box;
                }
                return false;
            });
            if (box) {
                setBoxes(prevBoxes => prevBoxes.map((prevBox, boxIndex) => (boxIndex === originIndex ? null : prevBox)));
            }
        } else {
            setLetters(prevLetters => prevLetters.filter(item => item.id !== Number(id)));
        }

        setBoxes(prevBoxes => {
            const newBoxes = [...prevBoxes];
            const displacedLetter = newBoxes[index];
            if (displacedLetter) {
                setLetters(prevLetters => [...prevLetters, displacedLetter]);
            }
            newBoxes[index] = letter || box;
            return newBoxes;
        });
    };

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData("text", id);
    };


    const shuffle = (array) => {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    return (
        <div className="App" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>Anagram Game</h1>
            {!gameOver && timer > 0 ? (
                <>
                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                        Timer: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                    </div>
                    {clue ? (
                        <>
                            <p>Clue: {clue.clue}</p>
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                                {boxes.map((box, index) => (
                                    <div
                                        key={index}
                                        onDrop={e => handleDrop(e, index)}
                                        onDragOver={e => e.preventDefault()}
                                        draggable
                                        onDragStart={e => box && handleDragStart(e, box.id)}
                                        style={{ border: "1px solid black", width: "30px", height: "30px", display: "inline-block", marginRight: "10px" }}
                                    >
                                        {box?.value}
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                                {letters.map((letter, index) => (
                                    <div
                                        key={index}
                                        draggable
                                        onDragStart={e => handleDragStart(e, letter.id)}
                                        style={{ border: "1px solid black", width: "30px", height: "30px", display: "inline-block", marginRight: "10px" }}
                                    >
                                        {letter.value}
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleSubmit}>Submit</button>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <p>{message}</p>
                </>
            ) : (
                <div>
                    {timer <= 0 ? (
                        <p>Time's up! Game over.</p>
                    ) : retryCount >= 3 ? (
                        <p>Maximum retries reached. Game over.</p>
                    ) : (
                        <p>Congratulations! You won the game.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;

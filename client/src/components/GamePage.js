import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GamePage.css';
import { displayStats, updateStats, updateStreak } from './Stats';

const GamePage = () => {
    const [clue, setClue] = useState(null);
    const [message, setMessage] = useState("");
    const [letters, setLetters] = useState([]);
    const [boxes, setBoxes] = useState([]);
    const [retryCount, setRetryCount] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [totalTime, setTotalTime] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [incorrectWords, setIncorrectWords] = useState("");
    const [helpIsOpen, setHelpIsOpen] = useState(false);

    useEffect(() => {
        const lastPlayedTime = localStorage.getItem('lastPlayedTime');
        if (lastPlayedTime) {
            const twentyFourHours = 24 * 60 * 60 * 1000;
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - parseInt(lastPlayedTime, 10);
            if (timeDiff < twentyFourHours) {
                setGameOver(true);
                setMessage('You can only play once per day. Please come back tomorrow.');
            }
        }

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
                setStartTime(new Date().getTime()); // Set the start time
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    const handleSubmit = async () => {
        const response = await axios.post('http://localhost:5000/api/clues/validate', {
            answer: boxes.map(box => box?.value).join(''),
            clueId: clue._id,
        });

        if (response.data.correct) {
            updateStats(true);
            setMessage('Correct! You solved the anagram.');
            setGameOver(true); // Set gameOver to true
            setEndTime(new Date().getTime()); // Set the end time
        } else {
            const guess = JSON.stringify(response.config.data).split('\"');
            const incorrectGuess = guess[4]
            setMessage('Incorrect! Please try again.');
            setIncorrectWords(incorrectWords.concat(" ", incorrectGuess.substring(0,incorrectGuess.length-1)));

            setRetryCount(prevRetryCount => prevRetryCount + 1);

            if (retryCount + 1 >= 3) {
                updateStats(false)
                setGameOver(true);
                setEndTime(new Date().getTime()); // Set the end time
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
            box = boxes
                .find((box, idx) => {
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

    const shuffle = array => {
        let currentIndex = array.length,
            temporaryValue,
            randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };

    useEffect(() => {
        if (gameOver && startTime && endTime) {
            const timeTakenInSeconds = Math.floor((endTime - startTime) / 1000);
            setTotalTime(timeTakenInSeconds);
        }
    }, [gameOver, startTime, endTime]);

    useEffect(() => {
        if (endTime) {
            localStorage.setItem('lastPlayedTime', endTime.toString());
        }
    }, [endTime]);

    const openPopup = () => {
        setIsOpen(true);
      };

    const closePopup = () => {
        setIsOpen(false);
    };

    const openHelpPopup = () => {
        setHelpIsOpen(true);
      };

    const closeHelpPopup = () => {
        setHelpIsOpen(false);
    };

    const statValues = displayStats();

    updateStreak();

    return (
        <div className="Game" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>Anagram Game</h1>
            {!gameOver ? (
                <>
                    {clue ? (
                        <>
                            <div id="top-of-game" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "100px" }}>
                                <div id="stats">
                                    <p onClick={openPopup}>Statistics!</p>
                                    {isOpen && (
                                    <div className="overlay">
                                        <div className="popup">
                                        <span className="close" onClick={closePopup}>&times;</span>
                                        <p>{statValues}</p>
                                        </div>
                                    </div>
                                    )}
                                </div>

                                <div id="tries-left">
                                    <p>Number of Times Tried: {retryCount}</p>
                                </div>

                                <div id="help">
                                    <p onClick={openHelpPopup}>Help</p>
                                    {helpIsOpen && (
                                    <div className="overlay">
                                        <div className="popup">
                                        <span className="close" onClick={closeHelpPopup}>&times;</span>
                                        <p>Drag and drop a letter into an empty box to spell out the scrambled word.</p>
                                        </div>
                                    </div>
                                    )}
                                </div>
                            </div>
                            <div id="game-board" style={{ display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid black", padding: "10px"}}>
                                <p>Clue: {clue.clue}</p>
                                <a href={clue.articleUrl} style={{marginBottom: "10px" }}>Click here to visit article</a>
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
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
                            </div>
                            <div id="incorrect guesses">
                                    <p>Guesses: {incorrectWords}</p>
                            </div>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <p>{message}</p>
                </>
            ) : (
                <div>
                    {retryCount >= 3 ? (
                        <p>You have used all your tries. Game over.</p>
                    ) : (
                        <>
                            {localStorage.getItem('lastPlayedTime') ? (
                                <>
                                    <p>You have already played today. Please come back tomorrow.</p>
                                    <div id="stats">
                                        <p onClick={openPopup}>Statistics!</p>
                                        {isOpen && (
                                            <div className="overlay">
                                                <div className="popup">
                                                    <span className="close" onClick={closePopup}>&times;</span>
                                                    <p>{statValues}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <p>Congratulations! You won the game.</p>
                            )}
                        </>
                    )}
                    {/* Display the total time taken */}
                    <p>Total time taken: {totalTime} seconds</p>
                </div>
            )}
        </div>
    );
}

export default GamePage;
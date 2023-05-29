import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GamePage.css';
import { displayStats, updateStats, updateStreak } from './Stats';

const GamePage = () => {
    const [clue, setClue] = useState(null);
    const [message, setMessage] = useState("");
    const [letters, setLetters] = useState([]);
    const [boxes, setBoxes] = useState([]);
    // Initialization of retryCount with localStorage:
    const [retryCount, setRetryCount] = useState(() => {
        const savedRetryCount = localStorage.getItem('retryCount');
        return savedRetryCount ? JSON.parse(savedRetryCount) : 0;
    });
    const [gameOver, setGameOver] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [totalTime, setTotalTime] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [incorrectWords, setIncorrectWords] = useState([]);
    const [helpIsOpen, setHelpIsOpen] = useState(false);
    const [didWin,setDidWin] = useState(false);


    useEffect(() => {
        const lastPlayedTime = localStorage.getItem('lastPlayedTime');
        if (lastPlayedTime) {
            const lastPlayedDate = new Date(parseInt(lastPlayedTime, 10));
            const currentDate = new Date();

            if (lastPlayedDate.getDate() === currentDate.getDate() &&
                lastPlayedDate.getMonth() === currentDate.getMonth() &&
                lastPlayedDate.getFullYear() === currentDate.getFullYear()) {
                setGameOver(true);
                setMessage('You can only play once per day. Please come back tomorrow.');
                return;
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
        const response = await axios.post('/api/clues/validate', {
            answer: boxes.map(box => box?.value).join(''),
            clueId: clue._id,
        });

        if (response.data.correct) {
            updateStats(true);
            setMessage('Congratulations! You solved the anagram.');
            setDidWin(true);
            setGameOver(true); // Set gameOver to true
            setEndTime(new Date().getTime()); // Set the end time
            console.log(didWin)
        } else {
            const guess = JSON.stringify(response.config.data).split('\"');
            const incorrectGuess = guess[4]
            setMessage('Incorrect! Please try again.');
            setIncorrectWords((prevGuesses) => [...prevGuesses, incorrectGuess]);

            setRetryCount(prevRetryCount => prevRetryCount + 1);

            if (retryCount + 1 >= 3) {
                updateStats(false)
                setGameOver(true);
                // const correctAnswer = clue.answer;
                // Display the correct answer
                setMessage("You used all your tries. The correct answer is: ${clue.answer}.");
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
        localStorage.setItem('retryCount', JSON.stringify(retryCount));
    }, [retryCount]);

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
        <div id="main" className="Game" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <style>@import url('https://fonts.googleapis.com/css2?family=Vollkorn&display=swap');</style>
            <img src="https://roamingkitty196290393.files.wordpress.com/2018/01/cropped-rk-logo.png" alt={"kitty"}></img>
            <h1>Anagram Game</h1>
            {!gameOver ? (
                <>
                    {clue ? (
                        <>
                            <div id="top-of-game" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "100px" }}>
                                <div id="stats">
                                    <p className="sub-headings" onClick={openPopup}>STATS</p>
                                    {isOpen && (
                                    <div className="overlay">
                                        <div className="popup">
                                        <span className="close" onClick={closePopup}>&times;</span>
                                        <p>{statValues}</p>
                                        </div>
                                    </div>
                                    )}
                                </div>

                                <div id="tries-left" className="sub-headings">
                                    <p>Number of Times Tried: {retryCount}</p>
                                </div>

                                <div id="help">
                                    <p className="sub-headings" onClick={openHelpPopup}>Help</p>
                                    {helpIsOpen && (
                                    <div className="overlay">
                                        <div className="popup">
                                        <span className="close" onClick={closeHelpPopup}>&times;</span>
                                        <p>The clue for the anagram is related to the article hyperlinked. Read the blog post to get a better idea of what the anagram might be. Drag and drop a letter into an empty box to spell out the scrambled word.</p>
                                        </div>
                                    </div>
                                    )}
                                </div>
                            </div>
                            <div id="game-board" style={{ display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid black", padding: "10px", margin: "10px"}}>
                                <p>Clue: {clue.clue}</p>
                                <a target="_blank" href={clue.articleUrl} style={{marginBottom: "10px" }}>Click here to visit article</a>
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                                    {boxes.map((box, index) => (
                                        <div
                                            key={index}
                                            onDrop={e => handleDrop(e, index)}
                                            onDragOver={e => e.preventDefault()}
                                            draggable
                                            onDragStart={e => box && handleDragStart(e, box.id)}
                                            style={{ border: "1px solid black", width: "30px", height: "30px", display: "inline-block", marginRight: "10px", "box-shadow": "2px 5px #888888" }}
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
                                <button id="submit-btn" onClick={handleSubmit}>Submit</button>
                            </div>
                            <div id="incorrect guesses">
                                    <p>Guesses: {incorrectWords.map((guess, index) => (
                                                <React.Fragment key={index}>
                                                    {guess}
                                                    <br />
                                                </React.Fragment>
                                                ))}</p>
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
                        <p>You have used all your tries. Game over. The answer was: {clue ? clue.answer : ""}</p>

                    ) : (
                        <>
                            {localStorage.getItem('lastPlayedTime') && didWin ? (

                                <p>Congratulations! You won the game.</p>
                            ) : (
                                <>
                                    <p>You have already played today. Please come back tomorrow.</p>
                                    <div id="stats">
                                        <p className="sub-headings" onClick={openPopup}>STATS</p>
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

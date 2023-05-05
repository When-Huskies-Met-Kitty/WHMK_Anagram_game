import React, { useState } from 'react';

const Clue = ({ clueData }) => {
    const [answer, setAnswer] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setAnswer(e.target.value);
    };

    const validateAnswer = (input) => {
        return input.toLowerCase() === clueData.answer.toLowerCase();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateAnswer(answer)) {
            setMessage('Correct! Well done!');
        } else {
            setMessage('Incorrect. Try again.');
        }
    };

    return (
        <div>
            <h2>{clueData.clue}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={answer}
                    onChange={handleChange}
                    placeholder="Type your answer here"
                />
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Clue;


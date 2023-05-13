import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Clue from './ClueDataPage';

const Game = () => {
    const [clueData, setClueData] = useState(null);

    useEffect(() => {
        const fetchClue = async () => {
            try {
                const response = await axios.get('/api/clues/random');
                setClueData(response.data);
            } catch (error) {
                console.error('Error fetching clue:', error);
            }
        };

        fetchClue();
    }, []);

    return (
        <div>
            {clueData ? (
                <Clue clueData={clueData} />
            ) : (
                <p>Loading clue...</p>
            )}
        </div>
    );
};

export default Game;

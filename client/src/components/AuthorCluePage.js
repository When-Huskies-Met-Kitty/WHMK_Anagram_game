import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import EditPage from './EditCluePage';
import AddCluePage from './AddCluePage';

const AuthorCluePage = () => {
    const [cluesData, setCluesData] = useState([]);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    
    useEffect( () => {
        fetchClueData();       
    }, []);

    const fetchClueData = async () =>{
        const response = await axios.get('http://localhost:5000/api/clues/getEntireClueData');
        if(response.data.doesClueDataExist){
            setCluesData(response.data.clueData);
        }
    }

    const openAddPopup = () => {
        setIsAddPopupOpen(true);
    };

    const closeAddPopup = () => {
        fetchClueData();
        setIsAddPopupOpen(false);
    };
    const addClueHandler = () => {
        openAddPopup();
    }
    const AddCluePageCallBackHandler = () =>{
        closeAddPopup();
    }
    return(
        <div className="clue-page">
            <div className='Add-clue'>
                <button className='Add-clue-button' onClick={addClueHandler}>Add Clue</button>
            </div>
            <div className='clue-data'>
                <table className='clue-table'>
                    <thead className='clue-table-headings'>
                        <tr>
                        <th>S.No</th>
                        <th>Answer</th>
                        <th>Clue</th>
                        <th>Article URL</th>
                        <th>Used</th>
                        <th>Day of Use</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cluesData && cluesData.map((clue, index) => (
                            <tr key={clue._id} className='clue-table-values'>
                                <td>{index+1}</td>
                                <td>{clue.answer}</td>
                                <td>{clue.clue}</td>
                                <td><a href={clue.articleUrl}>{clue.articleUrl}</a></td>
                                <td>{clue.used.toString()}</td>
                                <td>{clue.dayOfUse && clue.dayOfUse.split('T')[0]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isAddPopupOpen && (
                        <div className="overlay">
                            <div className="popup">
                            <span className="close" onClick={closeAddPopup}>&times;</span>
                            <AddCluePage callBack={AddCluePageCallBackHandler}></AddCluePage>
                            </div>
                        </div>
                    )}
            <ToastContainer/>
        </div>
    )
}

export default AuthorCluePage;
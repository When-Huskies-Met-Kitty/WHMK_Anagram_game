import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import './CluePage.css'
import EditPage from './EditCluePage';
import AddCluePage from './AddCluePage';

const CluePage = () => {
    const [cluesData, setCluesData] = useState([]);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [editClueData , setEditClueData] =useState('');
    
    useEffect( () => {
        fetchClueData();       
    }, []);

    const fetchClueData = async () =>{
        const response = await axios.get('http://localhost:5000/api/clues/getEntireClueData');
        if(response.data.doesClueDataExist){
            setCluesData(response.data.clueData);
        }
    }
    const openEditPopup = () => {
        setIsEditPopupOpen(true);
    };

    const closeEditPopup = () => {
        fetchClueData();
        setIsEditPopupOpen(false);
    };

    const editClueHandler = (clue) => {
        setEditClueData(clue);
        openEditPopup();
    }
    const editPageCallBackHandler = () =>{
        closeEditPopup();
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
                        <th>Edit Clue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cluesData && cluesData.map((clue, index) => (
                            <tr key={clue._id} className='clue-table-values'>
                                <td>{index+1}</td>
                                <td>{clue.answer}</td>
                                <td>{clue.clue}</td>
                                <td>{clue.articleUrl}</td>
                                <td>{clue.used.toString()}</td>
                                <td>{clue.dayOfUse && clue.dayOfUse.split('T')[0]}</td>
                                <td>
                                    <button className= 'edit-clue' id={clue._id + "_button"} onClick={() => editClueHandler(clue)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isEditPopupOpen && (
                        <div className="overlay">
                            <div className="popup">
                            <span className="close" onClick={closeEditPopup}>&times;</span>
                            <EditPage clue={editClueData} callBack={editPageCallBackHandler}></EditPage>
                            </div>
                        </div>
                    )}
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

export default CluePage;
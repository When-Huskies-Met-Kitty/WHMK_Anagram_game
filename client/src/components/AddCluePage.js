import React, { useState } from 'react';
import axios from 'axios';
import './AddCluePage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCluePage = (props) => {
  const [answer, setAnswer] = useState('');
  const [clue, setClue] = useState('');
  const [articleUrl, setArticleUrl] = useState('');
 

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(answer === '' || clue === '' || articleUrl === ''){
      toast.warning("Please enter required details");
      return;
    }
    
    const response = await axios.post('/api/clues/saveClueData', {
            answer: answer,
            clue: clue,
            articleUrl: articleUrl
        });
        console.log(response);
        if (response.data.isClueSaved) {
          resetFormValues();
          toast.success("Clue is saved !",{
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            progressBar: false,
            theme: "light",
            });
            props.callBack && props.callBack();

        } else {
          toast.error("Error while saving clue",{
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            progressBar: false,
            theme: "light",
            });
        }
  };

  const resetFormValues = () =>{
    setAnswer('');
    setArticleUrl('');
    setClue('');
  };

  return (
    <div>
      <h2>Add Clue</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Answer<span className="required">*</span>:</label>
          <input type="text" placeholder="Enter anagram answer" value={answer} onChange={(event) => setAnswer(event.target.value)} />
        </div>
        <br />
        <div className='form-group'>
          <label>Clue<span className="required">*</span>:</label>
          <input type="text" placeholder="Enter anagram clue" value={clue} onChange={(event) => setClue(event.target.value)} />
        </div>
        <br />
        <div className='form-group'>
          <label>Article URL<span className="required">*</span>:</label>
          <input type="text" placeholder="Enter clue article url" value={articleUrl} onChange={(event) => setArticleUrl(event.target.value)} />
        </div>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default AddCluePage;


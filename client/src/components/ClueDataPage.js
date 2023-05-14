import React, { useState } from 'react';
import axios from 'axios';
import './ClueDataPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClueDataPage = ({ clueData }) => {
  const [answer, setAnswer] = useState('');
  const [clue, setClue] = useState('');
  const [articleUrl, setArticleUrl] = useState('');
  const [used, setUsed] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(answer === '' || clue === '' || articleUrl === ''){
      toast.warning("Please enter required details");
      return;
    }
    const response = await axios.post('http://localhost:5000/api/clues/saveClueData', {
            answer: answer,
            clue: clue,
            articleUrl: articleUrl,
            uses: used
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
    setUsed(false);
  };
  return (
    <div>
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
        <div className='form-group'>
          <label>Used:</label>
          <input type="checkbox" checked={used} onChange={(event) => setUsed(event.target.checked)} />
        </div>
        <br />
        <input type="submit" value="Submit" />
      </form>
      <ToastContainer/>
    </div>
  );
};

export default ClueDataPage;


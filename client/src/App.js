import React from 'react';
import './App.css'
// import { displayStats, updateStats, updateStreak } from './components/Stats';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GamePage from './components/GamePage';
import ClueDataPage from './components/ClueDataPage';
import NotfoundPage from './components/NotFoundPage';

function App() {
    return (
        <BrowserRouter>
          <div className="App">
            <div id="page-body">
              <Routes>
                <Route path="/" element={<GamePage/>}></Route>
                <Route path="/clue-form" element={<ClueDataPage/>}></Route>  
                {/* path="*" indicates if user hits any route that does not exists routes , the application will be redirected to this page */}
                <Route path="*" element={<NotfoundPage/>}></Route>
              </Routes>
            </div>
          </div>
        </BrowserRouter>
        
      );
}

export default App;
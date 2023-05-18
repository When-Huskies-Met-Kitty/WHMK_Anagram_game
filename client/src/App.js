import React from 'react';
import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GamePage from './components/GamePage';
import AddCluePage from './components/AddCluePage';
import NotfoundPage from './components/NotFoundPage';
import CluePage from './components/CluePage';

function App() {
    return (
        <BrowserRouter>
          <div className="App">
            <div id="page-body">
              <Routes>
                <Route path="/" element={<GamePage/>}></Route>
                <Route path="/clue-data" element={<CluePage/>}></Route> 
                {/* path="*" indicates if user hits any route that does not exists routes , the application will be redirected to this page */}
                <Route path="*" element={<NotfoundPage/>}></Route>
              </Routes>
            </div>
          </div>
        </BrowserRouter>
        
      );
}

export default App;
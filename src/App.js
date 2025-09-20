import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import RecipePage from './pages/RecipePage';
// import RecipePageOriginal from './pages/RecipePageOriginal';
import RecipePageArchive from './pages/RecipePageArchive';

import './App.css';

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/recipe/:id' element={<RecipePage />} />
          <Route path='/recipe-original/:id' element={<RecipePage />} />
          <Route path='/recipe-archive/:id' element={<RecipePageArchive />} />
          <Route path='*' element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
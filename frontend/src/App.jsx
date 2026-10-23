import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeUI from './pages/Home';
import Events from './pages/Events';
import EventsUI from './pages/Events';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeUI />} />
          <Route path='/events' element={< EventsUI/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;

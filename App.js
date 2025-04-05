import React from 'react';
import Navbar from './component/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact />
          <div className="text-3xl font-bold underline text-blue-500">Hello Tailwind!</div>


        </Routes>
      </Router>
    </>
  );
}

export default App;

import React from 'react';
import Home from './Home';
import PickWinner from './PickWinner';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-purple-800 to-pink-600">
        <nav className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-3xl font-extrabold flex items-center space-x-2">
              {/* Enhanced Logo */}
              <span className="text-4xl text-yellow-300">
                🎟️
              </span>
              <Link to="/" className="hover:text-yellow-300 transition-colors duration-300">
                <span className="text-4xl font-extrabold text-white bg-opacity-80 bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500">
                  Lotty Totty
                </span>
              </Link>
            </div>
            <ul className="flex space-x-8">
              <li>
                <Link
                  to="/"
                  className="text-white hover:text-yellow-300 transition-colors duration-300 text-lg font-medium"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/PickWinner"
                  className="text-white hover:text-yellow-300 transition-colors duration-300 text-lg font-medium"
                >
                  Pick Winner
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="flex-grow p-6">
          <Routes>
            <Route path="/PickWinner" element={<PickWinner />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </main>

        <footer className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-center text-white shadow-inner mt-auto">
          <p className="text-sm">© 2024 Lottery DApp. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;

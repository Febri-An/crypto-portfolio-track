import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CryptoConvert from './pages/Convert';
import './styles/App.css'

export default function App() {
    return (
        <Router basename='/crypto-portfolio-track'>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/convert' element={<CryptoConvert />} />
            </Routes>
        </Router>
    )
}
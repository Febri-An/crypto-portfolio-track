import React, { useState } from 'react';
import Header from '../components/Header';
import CreateForm from '../components/CreateForm';
import Footer from '../components/Footer'
import CoinList from '../components/CoinList';
import '../styles/Home.css'

export default function Home() {
    const [array] = useState(CoinList)
    return (
        <div className='main-container'>
            <Header />
            <CreateForm coinArray={array}/>
            <Footer />
        </div>
    )
};
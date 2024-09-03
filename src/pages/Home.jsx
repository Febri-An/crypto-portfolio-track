import React, { useState } from 'react';
import Header from '../components/Header';
import Form from '../components/Form';
import Footer from '../components/Footer'
import CoinList from '../components/CoinList';
import CurrList from '../components/CurrList';
import '../styles/Home.css'

export default function Home() {
    const [coins] = useState(CoinList)
    const [currency] = useState(CurrList)
    return (
        <div className='main-container'>
            <header>
                <Header />
            </header>
            <main>
                <Form coinArray={coins} currArray={currency}/>
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    )
};
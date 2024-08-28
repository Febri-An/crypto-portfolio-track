import React, { useState } from 'react';
import Header from '../components/Header';
import Form from '../components/Form';
import Footer from '../components/Footer'
import CoinList from '../components/CoinList';
import '../styles/Home.css'

export default function Home() {
    const [array] = useState(CoinList)
    return (
        <div className='main-container'>
            <header>
                <Header />
            </header>
            <main>
                <Form coinArray={array}/>
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    )
};
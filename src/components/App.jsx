import React, { useState } from 'react';
import Header from './Header';
import CreateForm from './CreateForm';
import CoinList from '../CoinList'
import Footer from './Footer'

export default function App() {
    const [array, setArray] = useState(CoinList)
    return (
        <div className='main-container'>
            <Header />
            <CreateForm list={array}/>
            <Footer />
        </div>
    )
};


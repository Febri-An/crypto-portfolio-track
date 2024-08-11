import React, { useEffect, useState } from "react";
import PnlBox from './PnlBox'
import SearchIcon from '@mui/icons-material/Search';

export default function CreateForm(props) {
    const apikey = process.env.REACT_APP_COINLIB_APIKEY

    const [input, setInput] = useState({
        symbol: '',
        avg: '',
        num: ''
    })

    const [pnl, setPnl] = useState({
        dolars: '',
        percent: ''
    })


    function search(event) { // for search bar
        const {name, value} = event.target;
        setInput((prevValue) => {
            return {
                ...prevValue,
                [name]: value 
            }
        })
    }

    const [result, setResult] = useState([])
    useEffect(() => {
        const symbol = input.symbol.toUpperCase()
        // console.log('Symbol:', symbol)
        const newResult = props.list.filter(ticker => ticker.includes(symbol))
        // console.log('Result:', result)
        setResult(newResult)
    }, [input.symbol])

    const [isDeleted, setIsDeleted] = useState(true)
    function resultClicked(event) {
        const newSymbol = event.target.textContent
        setInput(prevValue => {
            return {
                ...prevValue,
                symbol: newSymbol
            }            
        })
        setIsDeleted(true)
    }


    function handleChange(event) { //for avg.buy and num
        const {name, value} = event.target;
        setInput((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            }
        })
    }
    
    const [clicked, setClicked] = useState(0)
    useEffect(() => {
        if (clicked >= 1) {
            fetch(`/api/v1/coin?key=${apikey}&pref&pref&pref=USD&symbol=${input.symbol}`)
                .then(response => response.json())
                .then(data => { 
                    let dolars = (data.price - input.avg).toFixed(2)
                    let totalDolars = dolars * input.num
                    setPnl({
                        dolars: totalDolars,
                        percent: Math.floor(dolars / input.avg * 100)
                    })
                })
            }
    }, [clicked]);

    function handleClick() {
        setClicked(prevValue => prevValue + 1)
    }
    

    return (    
        <div className="form-container row">

            <div className="left-form">
                <div className="input-group mb-3 search-container">
                    <label className="input-group-text grey-bg" htmlFor="inputGroupSelect01">Ticker</label>
                    <div className="search-box">
                        <input type="text" className="search-form" 
                            value={input.symbol} placeholder="Search" name="symbol" 
                            onClick={() => setIsDeleted(false)} 
                            onChange={search} 
                            aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                        <button className="search-btn">
                            <SearchIcon />
                        </button>
                        { isDeleted ? null : (
                            <ul className="result">
                                {result.map((ticker, index) => <li onClick={resultClicked} key={index}>{ticker}</li>)}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-default">Avg. Buy</span>
                    <input type="text" className="form-control" placeholder="$" name="avg" 
                        onChange={handleChange} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-default">Amount</span>
                    <input type="text" className="form-control" placeholder="0" name="num" 
                        onChange={handleChange} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                </div>
                
                <div className="btn-container">
                    <button type="button" className="btn btn-secondary" 
                        onClick={handleClick}>Execute</button>
                    <button type="button" className="btn btn-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg>
                    </button>
                </div>
            </div>

            <PnlBox data={pnl}/>

        </div>       
    )
}
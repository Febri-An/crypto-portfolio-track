import React, { useEffect, useState } from "react";
import PnlBox from './PnlBox'
import Pagination from "./Pagination";
import SearchIcon from '@mui/icons-material/Search';

export default function CreateForm({ coinArray }) {
    const apikey = process.env.REACT_APP_COINLIB_APIKEY

    const [input, setInput] = useState([{
        symbol: '',
        avg: '',
        num: ''
    }])

    const [pnl, setPnl] = useState({
        dolars: '',
        percent: ''
    })

    const [pageNum, setPageNum] = useState([1]) // pagination
    const [totalPage, setTotalPage] = useState(1)

    const [currentPage, setCurrentPage] = useState(1)
    const [sliceIndex, setSliceIndex] = useState(0)
    useEffect(() => {
        setSliceIndex(currentPage-1)
    }, [currentPage])


    function handleChange(event) { //for symbol, avg.buy, and num
        const {name, value} = event.target;
        const updateInput = [...input]
        updateInput[sliceIndex] = { 
            ...updateInput[sliceIndex], 
            [name]: value
        }
        setInput(updateInput)
    }

    const [searchResult, setSearchResult] = useState([])
    useEffect(() => {
        const symbol = input[sliceIndex].symbol.toUpperCase()
        const newResult = coinArray.filter(ticker => ticker.includes(symbol))
        setSearchResult(newResult)
    }, [input[sliceIndex].symbol])


    const [isDeleted, setIsDeleted] = useState(true) // delete search result
    function resultClicked(event) {
        const newSymbol = event.target.textContent
        const updateInput = [...input]
        updateInput[sliceIndex] = {
            ...updateInput[sliceIndex],
            symbol: newSymbol
        }
        setInput(updateInput)
        setIsDeleted(true)
    }

    
    const [clicked, setClicked] = useState(0) // for execute button
    useEffect(() => {
        if (clicked >= 1) {
            async function fetchData() {
                try {
                    const results = await Promise.all(input.map( async (item) => {
                        const response = await fetch(`/api/v1/coin?key=${apikey}&pref=USD&symbol=${item.symbol}`)
                        if (!response.ok) {
                            throw new Error(`Error fetching data: ${response.statusText}`)
                        }
                        const data = await response.json()
                        return {
                            dollars: ((data.price - item.avg) * item.num).toFixed(2),
                            avg: item.avg,
                            num: item.num
                        } 
                    }))
                    let totalGain = 0
                    let modal = 0 
                    results.forEach(result => {
                        totalGain += parseFloat(result.dollars)   
                        modal += parseFloat(result.avg * result.num)
                    })
                    const percent = Math.floor(totalGain / modal * 100)
                    console.log(`gain: ${totalGain}, modal: ${modal}`)
                    setPnl({
                        dolars: totalGain,
                        percent: percent
                    })                    
                } catch (err) {
                    alert(err.message)
                }
            }
            fetchData()
        }
    }, [clicked]);

    function handleClick() {
        setClicked(prevValue => prevValue + 1)
    }


    function addPage() {    // for add button
        setTotalPage(prevValue => prevValue+1)
        setPageNum(prevValue => {
            const nextNum = pageNum.length + 1
            return [...prevValue, nextNum]
        })
        setCurrentPage(totalPage+1)
        setInput(prevValue => {
            return [
                ...prevValue,
                {
                    symbol: '',
                    avg: '',
                    num: ''
                }
            ]
        })
    }



    return (    
        <div className="form-container row">

            <div className="left-form">

                <div className="btn-group paging" role="group" aria-label="Basic outlined example">
                    <button type="button" className="btn btn-outline-secondary"
                        onClick={() => { if (currentPage > 1) {setCurrentPage(prevValue => prevValue-1)}}}>Previous</button>

                    { pageNum.map((number, index) => <Pagination key={index} page={number} currentPage={currentPage} setCurrentPage={setCurrentPage}/>) }

                    <button type="button" className="btn btn-outline-secondary"
                        onClick={() => { if (currentPage !== totalPage) {setCurrentPage(prevValue => prevValue+1)}}}>Next</button>
                </div>

                <div className="input-group mb-3 search-container">
                    <label className="input-group-text grey-bg" htmlFor="inputGroupSelect01">Ticker</label>
                    <div className="search-box">
                        <input type="text" className="search-form" placeholder="Search" name="symbol" 
                            value={input[sliceIndex].symbol} 
                            onClick={() => setIsDeleted(false)} 
                            onChange={handleChange}
                            aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                        <button className="search-btn" disabled>
                            <SearchIcon />
                        </button>
                        { isDeleted ? null : (
                            <ul className="result">
                                {searchResult.map((ticker, index) => <li onClick={resultClicked} key={index}>{ticker}</li>)}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-default">Avg. Buy</span>
                    <input type="text" className="form-control" placeholder="$" name="avg" 
                        value={input[sliceIndex].avg} 
                        onChange={handleChange}
                        aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-default">Amount</span>
                    <input type="text" className="form-control" placeholder="0" name="num" 
                        value={input[sliceIndex].num} 
                        onChange={handleChange} 
                        aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                </div>
                
                <div className="btn-container">
                    <button type="button" className="btn btn-secondary" 
                        onClick={handleClick}>Execute</button>
                    <button type="button" className="btn btn-secondary"
                        onClick={addPage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg>
                    </button>
                </div>
            </div>

            <PnlBox dolars={pnl.dolars} percent={pnl.percent}/>

        </div>       
    )
}
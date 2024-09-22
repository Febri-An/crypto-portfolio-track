import React, { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import PnlBox from './PnlBox'
import Button from './Button'
import Input from "./Input";
import Pagination from "./Pagination";
import Dropdown from "./Dropdown";  

export default function CreateForm({ coinArray, currArray }) {
    const apikey = process.env.REACT_APP_COINLIB_APIKEY
    const currName = currArray.map(item => item.name)

    const location = useLocation()
    const dataInject = location.state?.body.data || [] // array
    

    const [input, setInput] = useState([{
        symbol: '',
        avg: '',
        num: ''
    }])

    const [pnl, setPnl] = useState({
        dolars: '',
        percent: ''
    })

    const [currency, setCurrency] = useState({
        name: 'USD',
        symbol: '$'
    })

    const [pageNum, setPageNum] = useState([1]) // pagination
    const [totalPage, setTotalPage] = useState(1)

    const [currentPage, setCurrentPage] = useState(1)

    async function deletePage(event, page) {
        event.stopPropagation()
        
        setTotalPage(prevValue => prevValue -1) // total page -1 
        
        const updatePageNum = pageNum // delete & update pageNum, ex: [1,'2',3,4] -> [1,2,3]
            .filter(num => num !== page)
            .map(num => num > page ? num - 1 : num)
        setPageNum(updatePageNum)

        const updatedInput = [...input]; // delete an item form input array
        updatedInput.splice(page - 1, 1);
        setInput(updatedInput);
        
        if (currentPage >= page) {
            console.log(true)
            setCurrentPage(prevValue => prevValue - 1)
        } 

        if (dataInject) {
            await fetch('http://localhost:3001/delete-crypto', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: dataInject[0].user_id,
                    page: page
                })
            })
        }
    }

    function handleChange(event) { //for symbol, avg.buy, num
        const {name, value} = event.target;
        const updateInput = [...input]
        updateInput[currentPage-1] = { 
            ...updateInput[currentPage-1], 
            [name]: value
        }
        setInput(updateInput)
    }

     // responsive coin search
    const [searchResult, setSearchResult] = useState([])
    useEffect(() => {
        const symbol = input[currentPage-1].symbol.toUpperCase()
        const newResult = coinArray.filter(ticker => ticker.includes(symbol))
        setSearchResult(newResult)
    }, [input[currentPage-1].symbol])


    const [isDeleted, setIsDeleted] = useState({    // delete search result clicked
        symbol: true,
        curr: true
    }) 
    function resultClicked(event) {
        const name = event.target.getAttribute('data-name')
        const key = event.target.getAttribute('data-key')
        const newSymbol = event.target.textContent
        // console.log(name, key, newSymbol)
        const updateInput = [...input]
        
        if (name === "symbol") {
            updateInput[currentPage-1] = {
                ...updateInput[currentPage-1],
                [name]: newSymbol
            }
            setInput(updateInput)
            
        } else if (name === "curr") {
            setCurrency({
                    name: newSymbol,
                    symbol: currArray[key].symbol   /////// 
            })
        }

        setIsDeleted(prevValue => {
            return {
                ...prevValue,
                [name]: true
            }
        })
    }

    
    const [clicked, setClicked] = useState(0) // for execute button
    useEffect(() => {
        if (clicked >= 1) {
            const allFilled = input.every(item => Object.values(item).every(value => value !== ''))
            if (allFilled) {
                async function fetchData() {
                    try {
                        const results = await Promise.all(input.map( async (item) => {
                            const response = await fetch(`/api/v1/coin?key=${apikey}&pref=${currency.name}&symbol=${item.symbol}`)
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
                        // console.log(`gain dollars: ${totalGain} ${typeof(totalGain)} percent: ${percent} ${typeof(percent)}`)
                        setPnl({
                            dolars: totalGain,
                            percent: percent
                        })
                    } catch (err) {
                        alert(err.message)
                    } finally {
                        // console.log('input \n', input)
                        if (dataInject) {
                            let newValues = input.map((item, index) => 
                                // user_id, page, symbol, average, amount
                                `(${dataInject[0].user_id}, ${index+1}, '${item.symbol}', ${parseFloat(item.avg)}, ${parseFloat(item.num)})`).join(', ');
                                
                            console.log('set crypto on procces')
                            await fetch('http://localhost:3001/set-crypto', {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify({
                                    user_id: dataInject[0].user_id,
                                    data: newValues
                                  })
                            })
                        }

                    }
                }
                fetchData()
            } else {
                alert('Please fill all fields')
            }
        }
    }, [clicked]);

    function execute() {
        setClicked(prevValue => prevValue + 1)
    }


    function addPage() {    // for add button
        setTotalPage(prevValue => prevValue + 1)
        setPageNum(prevValue => {
            const nextNum = prevValue.length + 1
            return [...prevValue, nextNum]
        })
        setCurrentPage(prevTotalPage => prevTotalPage + 1)
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

    const hasRun = useRef(false);

    useEffect(() => {
        if (!hasRun.current) {
            // console.log('loading')
            for (let i = 1; i < dataInject.length; i++) { // add page of the length of the inject data. except:1
                addPage()
            }

            if (dataInject) { // data provided ?
                let newInput = [...input]
                dataInject.forEach(item => {
                    const pageIndex = item.page-1   
                    newInput[pageIndex] = {
                        symbol: item.symbol,
                        avg: item.average,
                        num: item.amount
                    }
                })
                setInput(newInput)
            }
        
            hasRun.current = true;
        }
    }, []);



    return (    
        <div className="form-container row">

            <div className="left-form">
                
                <div className="btn-group paging" role="group" aria-label="Basic outlined example">
                    <Button 
                        addClass={"btn-outline-secondary"}
                        handleClick={() => { if (currentPage > 1) {setCurrentPage(prevValue => prevValue-1)}}}
                        content={'Previous'}/>
            
                    { pageNum.map((number, index) => <Pagination key={index} page={number} currentPage={currentPage} setCurrentPage={setCurrentPage} deletePage={deletePage}/>) }

                    <Button
                        addClass={"btn-outline-secondary"}
                        handleClick={() => { if (currentPage !== totalPage) {setCurrentPage(prevValue => prevValue+1)}}}
                        content={'Next'}/>
                </div>

                <Dropdown 
                    labelContent={"Ticker"}
                    dropdownType={"input"}
                    placeholder={"Search"}
                    name={"symbol"}
                    handleClick={() => setIsDeleted(prevValue => {
                        return {
                            ...prevValue,
                            symbol: false
                        }
                    })}
                    handleChange={handleChange}
                    content={input[currentPage-1].symbol}
                    isDeleted={isDeleted.symbol}
                    array={searchResult}
                    sliceStart={0}
                    sliceEnd={10}
                    resultName={"symbol"}
                    resultClick={resultClicked}
                    />
                
                <Input
                    spanContent={"Avg. Buy"}
                    placeholder={"$"}
                    name={"avg"}
                    handleChange={handleChange}
                    content={input[currentPage-1].avg}/>

                <Dropdown 
                    labelContent={"Fiat"}
                    dropdownType={"button"}
                    placeholder={"USD"}
                    name={"curr"}
                    handleClick={() => setIsDeleted(prevValue => {
                        return {
                            ...prevValue,
                            curr: false
                        }
                    })}
                    content={currency.name}
                    isDeleted={isDeleted.curr}
                    array={currName}
                    resultName={"curr"}
                    resultClick={resultClicked}
                    />

                <Input 
                    spanContent={"Amount"}
                    placeholder={"0"}
                    name={"num"}
                    handleChange={handleChange}
                    content={input[currentPage-1].num}/>
                
                <div className="btn-box">
                    <Button 
                        addClass={"btn-secondary"}
                        handleClick={execute}
                        content={'Execute'}/>
                    <Button 
                        addClass={"btn-secondary"}
                        handleClick={addPage}
                        content={(
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                            </svg>
                        )} />
                </div>
            </div>

            <div className="right-form">

                <PnlBox dolars={pnl.dolars} currSymbol={currency.symbol} percent={pnl.percent}/>
            
            </div>

        </div>       
    )
}
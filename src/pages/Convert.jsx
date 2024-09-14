import React, { useState } from "react"
import Header from '../components/Header';
import Footer from '../components/Footer'
import Input from '../components/Input'
import CoinList from '../data/CoinList';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import '../styles/Convert.css'

export default function Convert() {
    const apikey = process.env.REACT_APP_COINLIB_APIKEY

    const [coins] = useState(CoinList)

    const [result, setResult] = useState({
        base: '',
        target: ''
    })

    const [symbol, setSymbol] = useState({
        base: '',
        target: ''
    })

    const [open, setOpen] = useState({
        base: false,
        target: false
    });

    function handleChange(event) {
        const { name, value } = event.target
        if (name === 'input') {
            setResult(prevValue => {
                return {
                    ...prevValue,
                    base: value
                }
            })
        } else {
            setSymbol(prevValue => {
                return {
                    ...prevValue,
                    [name] : value
                }
            })
        }
    };

    async function fetchData() {   
        try {
            const response = await fetch(`/api/v1/coin?key=${apikey}&pref=${symbol.target}&symbol=${symbol.base}`)
            const data = await response.json()
            const totalPrice = data.price * result.base
            setResult(prevValue => {
                return {
                    ...prevValue,
                    target: totalPrice
                }
            })
        } catch (err) {
            alert(err.message)
        }
    }

    return (
    <div className='main-container'>
        <header>
            <Header />
        </header>
        <main className="convert">
            <div className="swap-box">
                <h1>Swap</h1>
                <span>from</span>
                <div className="base-form">
                    <Input 
                        span={false}
                        name='input'
                        placeholder='0'
                        addClass='no-border'
                        handleChange={handleChange}
                        value={result.base}
                        />
                    <FormControl required sx={{ m: 1, minWidth: 120 }} className="full-fit">
                    <InputLabel id="demo-simple-select-required-label">Symbol</InputLabel>
                        <Select
                            labelId="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            name="base"
                            open={open.base}
                            onClose={() => setOpen(prevValue => {
                                return {
                                    ...prevValue,
                                    base: false
                                }
                            })}
                            onOpen={() => setOpen(prevValue => {
                                return {
                                    ...prevValue,
                                    base: true
                                }
                            })}
                            value={symbol.base}
                            label="base"
                            onChange={handleChange}
                            >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        { coins.map(coin => <MenuItem value={coin}>{coin}</MenuItem>) }
                        </Select>
                    </FormControl>
                </div>

                <div className="icon">
                    <span>to</span>
                    <ImportExportIcon/>
                </div>

                <div className="target-form">
                    <label>{result.target === '' ? '0' : result.target}</label>

                    <FormControl required sx={{ m: 1, minWidth: 120 }} className="full-fit">
                    <InputLabel id="demo-simple-select-required-label">Symbol</InputLabel>
                        <Select
                            labelId="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            name="target"
                            open={open.target}
                            onClose={() => setOpen(prevValue => {
                                return {
                                    ...prevValue,
                                    target: false
                                }
                            })}
                            onOpen={() => setOpen(prevValue => {
                                return {
                                    ...prevValue,
                                    target: true
                                }
                            })}
                            value={symbol.target}
                            label="target"
                            onChange={handleChange}
                            >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        { coins.map(coin => <MenuItem value={coin}>{coin}</MenuItem>) }
                        </Select>
                    </FormControl>
                </div>

                <button onClick={fetchData}>Convert</button>

            </div>
        </main>
        <footer>
            <Footer />
        </footer>
    </div>
  )
}

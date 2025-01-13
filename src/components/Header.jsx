import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom'

export default function Header() {

    const [googleDataInject, setGoogleDataInject] = useState([]) 
    
    const location = useLocation()
    const navigate = useNavigate();
    const dataInject = location.state?.body.data  || [{ username: 'Login' }]
    
    const isStarting = useRef(true)


    function goLink(event) {
        const { name } = event.target
        navigate(`/${name}`); // move page
      };

    useEffect(() => {
        async function prepare() {
            if (isStarting.current) {
    
                // get session data from backend
                const response = await fetch('http://localhost:5000/get-session', {
                    credentials: "include"
                })
                const result = await response.json()
                if (Object.keys(result).length !== 0) {
                    setGoogleDataInject(result.body.data)
                }
            }
        }
        prepare()
        isStarting.current = false;
    }, [])
      

    return (
        <nav className="navbar bg-dark border-bottom border-body sticky-top" data-bs-theme="dark">
            <a className="navbar-brand" href="/crypto-portfolio-track"><span>Crypto </span>Tracker</a>
            <div className="link-bar">
                <button className="btn btn-link" type="submit" name=''  onClick={goLink}>Home</button>
                <button className="btn btn-link" type="submit" name='convert'  onClick={goLink}>Convert</button>
                <button className="btn btn-outline-light" type="submit" name='login' onClick={goLink}>{googleDataInject.length ? googleDataInject[0].username : dataInject[0].username}</button>
            </div>
        </nav>

    )
}
import React from "react";
import { useNavigate } from 'react-router-dom'

export default function Header() {
    const navigate = useNavigate();

    function goLink(event) {
        const { name } = event.target
        navigate(`/${name}`); // move page
      };

    return (
        <nav className="navbar bg-dark border-bottom border-body sticky-top" data-bs-theme="dark">
            <a className="navbar-brand" href="/crypto-portfolio-track"><span>Crypto </span>Tracker</a>
            <div className="link-bar">
                <button className="btn btn-link" type="submit" name=''  onClick={goLink}>Home</button>
                <button className="btn btn-link" type="submit" name='convert'  onClick={goLink}>Convert</button>
                <button className="btn btn-outline-light" type="submit" name='login' onClick={goLink}>Login</button>
            </div>
        </nav>

    )
}
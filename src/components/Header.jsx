import React from "react";
import { useNavigate } from 'react-router-dom'

export default function Header() {
    const navigate = useNavigate();

    const goLogin = () => {
      navigate('/login'); // move to login page
    };
    return (
        <nav className="navbar bg-dark border-bottom border-body sticky-top" data-bs-theme="dark">
            <a className="navbar-brand" href="/crypto-portfolio-track">Crypto Checker</a>
            <button className="btn btn-outline-light" type="submit" onClick={goLogin}>Login</button>
        </nav>

    )
}
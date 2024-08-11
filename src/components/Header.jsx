import React from "react";

export default function Header() {
    return (
        <nav className="navbar bg-dark border-bottom border-body sticky-top" data-bs-theme="dark">
            <a className="navbar-brand" href="/">Crypto Checker</a>
            <button className="btn btn-outline-light" type="submit">Login</button>
        </nav>

    )
}
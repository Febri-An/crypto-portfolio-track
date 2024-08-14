import React from "react";

export default function Pnl({ dolars, percent }) {
    return (
    <div className="right-form">
        <span className="input-group-text" id="inputGroup-sizing-default">PnL</span>
        <ul className="list-group">
            <li className="list-group-item" style={{backgroundColor: dolars === '' ? "lightgrey" : dolars > 0 ? "lightgreen" : "lightcoral"}}>{dolars}$</li>
            <li className="list-group-item" style={{backgroundColor: percent === '' ? "lightgrey" : percent > 0 ? "lightgreen" : "lightcoral"}}>
                {percent}%
            </li>
        </ul>
    </div>
    )
}
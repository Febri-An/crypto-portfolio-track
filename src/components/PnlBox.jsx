import React from "react";

export default function Pnl(props) {
    return (
    <div className="right-form">
        <span className="input-group-text" id="inputGroup-sizing-default">PnL</span>
        <ul className="list-group">
            <li className="list-group-item" style={{backgroundColor: props.data.dolars === '' ? "lightgrey" : props.data.dolars > 0 ? "lightgreen" : "lightcoral"}}>{props.data.dolars}$</li>
            <li className="list-group-item" style={{backgroundColor: props.data.percent === '' ? "lightgrey" : props.data.percent > 0 ? "lightgreen" : "lightcoral"}}>
                {props.data.percent}%
            </li>
        </ul>
    </div>
    )
}
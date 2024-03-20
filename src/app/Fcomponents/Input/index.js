import React, { Component } from "react";
import './Input.css';

const Input = (props) => {
    return(
        <div className="label-input">
            <label for="input" className="label" >{props.label}</label>
            <input type={props.type} className="input" />
        </div>
    )
}
export default Input;
import React, { Component } from "react";
import './Botao.css';

const Botao = (props) => {
    return(
        <button className='botao'>
            {props.name}
        </button>
    )
}
export default Botao;
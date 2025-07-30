import React from 'react';
import './Square.css';

function Square({value,status,onClick}){
    let squareContent = '';
    let squareClassName = `square ${status}`;

    if(status === 'opened'){
        if(value === 'bomb'){
            squareContent = '*';
            squareClassName += ' bomb'
        } else if (value > 0) {
            squareContent = value;
            squareClassName += ` num-${value}`;
        }
    } else if (status === 'flag'){
        squareContent = 'P';
    } else if(status === 'question'){
        squareContent = '?';
    }

    return (
        <button
        className={squareClassName}
        onClick={onClick}
        >
        {squareContent}
        </button>
    );
}

export default Square;
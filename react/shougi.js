import React from 'react';
import './App.css'; 

function Square ({value,onSquareClick,isHighlight}){

    const className = `square ${isHighlight ? 'highlight' : ''}`;

    return (
        <button
        className = {className} onClick={onSquareClick}>
        {value}
        </button>
    );
}

function Board(){
    const squares = Array(81).fill(null);

  squares[0] = '香';
  squares[1] = '桂';
  squares[2] = '銀';
  squares[3] = '金';
  squares[4] = '王';
  squares[5] = '金';
  squares[6] = '銀';
  squares[7] = '桂';
  squares[8] = '香';
  squares[10] = '飛';
  squares[16] = '角';

  for (let i = 18; i < 27; i++){
    squares[i] = '歩';
  }

   for (let i = 54; i < 63; i++){
    squares[i] = '歩';
  }

  squares[64] = '角';
  squares[70] = '飛';
  squares[72] = '香';
  squares[73] = '桂';
  squares[74] = '銀';
  squares[75] = '金';
  squares[76] = '玉';
  squares[77] = '金';
  squares[78] = '銀';
  squares[79] = '桂';
  squares[80] = '香';

  const handleClick = (i) => {
        console.log(`マス${i}がクリックされました。`);
    };

  const boardRows = [];
    for (let row = 0; row < 9; row++) {
        const rowSquares = [];
        for (let col = 0; col < 9; col++) {
            const i = row * 9 + col;
            rowSquares.push(
                <Square
                    key={i}
                    value={squares[i]}
                    onSquareClick={() => handleClick(i)}
                    isHighlight={false}
                />
            );
        }
        boardRows.push(<div key={row} className="board-row">{rowSquares}</div>);
    }

    return (
        <div className="board-container">
            {boardRows}
        </div>
    );
}

export default Board; 
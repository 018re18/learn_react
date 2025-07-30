import React from 'react';
import Square from './Square';
import './Board.css';

function Board({boardData,onCellClick})
{
    const currentBoard = boardData || [];

    const renderBoard = () => {
        return currentBoard.map((row,rowIndex) => (
            <div key={rowIndex} className="board-row">
                {row.map((cell,colIndex) => (
                    <Square
                    key={`${rowIndex}-${colIndex}`}
                    value={cell.opened ? (cell.Mine ? 'bomb' : cell.mineCount) : null}
                    status={cell.opened ? 'opened' : (cell.Flag ? 'flag' : (cell.Question ? 'question' : 'hide'))}
                    onClick={() => onCellClick(rowIndex, colIndex)}
                    />
                ))}
            </div>
        ));
    };

    return (
        <div className="board-container">
            {renderBoard()}
        </div>
    );
}

export default Board;
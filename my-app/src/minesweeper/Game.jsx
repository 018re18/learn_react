import React, { useState, useEffect } from 'react';
import Board from './Board';
import './Game.css';

function Game() {
    const [boardRows, setBoardRows] = useState(9);
    const [boardCols, setBoardCols] = useState(9);
    const [numMines, setNumMines] = useState(10);

    const [board,setBoard] = useState([]);
    const [gameState,setGameState] = useState('playing');
    const [operate,setOperate] = useState('dig');
    const [minesNum,setMineNum] = useState(numMines);
    const [inGame,setInGame] = useState(false);

    useEffect(() => {
        initBoard();
    },[boardRows,boardCols,numMines]);

    const setMine = (newBoard, row, col) => {
        let mineSeted = 0;
        while(mineSeted < numMines){
            const randomRow = Math.floor(Math.random()*boardRows);
            const randomCol = Math.floor(Math.random()*boardCols);

            if(!newBoard[randomRow][randomCol].Mine &&
                (Math.abs(randomRow - row) > 1 || Math.abs(randomCol - col) > 1)
            ){
                newBoard[randomRow][randomCol].Mine = true;
                mineSeted++;
            }
        }
        for (let r = 0; r < boardRows; r++){
            for (let c = 0; c < boardCols; c++){
                if(!newBoard[r][c].Mine){
                    let count = 0;
                    for (let dr = -1; dr <= 1; dr++){
                        for (let dc = -1; dc <=1; dc++){
                            if(dr === 0 && dc === 0)
                                continue;
                            const neighborRow = r + dr;
                            const neighborCol = c + dc;

                            if (
                                neighborRow >= 0 && neighborRow < boardRows &&
                                neighborCol >= 0 && neighborCol < boardCols
                            ){
                                if (newBoard[neighborRow][neighborCol].Mine){
                                    count++;
                                }
                            }
                        }
                    }
                    newBoard[r][c].mineCount = count;
                }
            }
        }
    };

    const initBoard = () => {
        let newBoard = Array(boardRows)
        .fill(null)
        .map((_,rowIndex) =>
            Array(boardCols)
                .fill(null)
                .map((_,colIndex) => ({
                    id: `${rowIndex}-${colIndex}`,
                    row: rowIndex,
                    col: colIndex,
                    Mine: false,
                    opened: false,
                    Flag: false,
                    Question: false,
                    mineCount: 0,
                }))
        );
        setBoard(newBoard);
        setGameState('playing');
        setOperate('dig');
        setMineNum(numMines);
        setInGame(false);
    };

    const checkWin = (currentBoard) => {
        if(gameState !== 'playing')
            return;
        let allNonMine = true;
        for (let r = 0; r < boardRows; r++){
            for (let c = 0; c < boardCols; c++){
                const cell = currentBoard[r][c];
                if(!cell.Mine && !cell.opened){
                    allNonMine = false;
                    break;
                }
            }
            if(!allNonMine)
                break;
        }
        if(allNonMine){
            setGameState('win');
            const finalBoard = currentBoard.map(rowArr => 
                rowArr.map(cell => {
                if(cell.Mine && !cell.Flag){
                    return { ...cell, Flag: true};
                }
                return cell;
            }));
            setBoard(finalBoard);
            setMineNum(0);
        }
    };

    const chainOpen = (r, c, currentBoard) => {
        if(
            r < 0 || r >= boardRows || c < 0 || c >= boardCols ||
            currentBoard[r][c].opened || currentBoard[r][c].Flag ||
            currentBoard[r][c].Question || currentBoard[r][c].Mine
        ){
            return;
        }

        currentBoard[r][c].opened = true;
        if(currentBoard[r][c].mineCount > 0){
            return;
        }
        chainOpen(r - 1, c - 1, currentBoard);
        chainOpen(r - 1, c, currentBoard);
        chainOpen(r - 1, c + 1, currentBoard);
        chainOpen(r, c - 1, currentBoard);
        chainOpen(r, c + 1, currentBoard);
        chainOpen(r + 1, c - 1, currentBoard);
        chainOpen(r + 1, c, currentBoard);
        chainOpen(r + 1, c + 1, currentBoard);
    };


    const handleCellClick = (row,col) => {
        if(gameState !== 'playing')
            return;
        const newBoard = board.map(rowArr =>
            rowArr.map(cell => ({...cell}))
        );
        const cell = newBoard[row][col];
        if(cell.opened)
            return;
        if(!inGame){
            setMine(newBoard, row, col);
            setInGame(true);
            if(newBoard[row][col].mineCount === 0) {
                chainOpen(row, col, newBoard);
            } else {
                newBoard[row][col].opened = true;
            }
            setBoard(newBoard);
            return;
        }

        switch(operate){
            case 'dig':
                if(cell.Flag || cell.Question)
                 return;
                if(cell.Mine){
                  setGameState('lose');
                  for (let r = 0; r < boardRows; r++){
                    for (let c = 0; c < boardCols; c++){
                        if(newBoard[r][c].Mine){
                            newBoard[r][c].opened = true;
                        }
                    }
                  }
                } else {
                    if(cell.mineCount === 0){
                        chainOpen(row, col, newBoard);
                    } else {
                        cell.opened = true;
                    }
                }
                break;

            case 'flag':
                if(cell.Flag){
                    cell.Flag = false;
                    cell.Question = true;
                    setMineNum(prev => prev +1);
                } else if(cell.Question){
                    cell.Question = false;
                } else {
                    cell.Flag = true;
                    setMineNum(prev => prev -1);
                }
                break;
            
            case 'question':
                if(cell.Question){
                    cell.Question = false;
                } else if ( cell.Flag){
                    return;
                } else {
                    cell.Question = true;
                }
                break;

            default:
                break;

        }
        setBoard(newBoard);
        if(gameState === 'playing'){
            checkWin(newBoard);
        }
    };

    const changeMap = (rows, cols, mines) => {
        setBoardRows(rows);
        setBoardCols(cols);
        setNumMines(mines);
    };

    return (
        <div className = "game-container">
            <div>
                <button onClick={() => changeMap(9,9,10)}>9*9</button>
                <button onClick={() => changeMap(15,15,30)}>15*15</button>
                <button onClick={() => changeMap(20,20,50)}>20*20</button>
            </div>
            <div className = "game-info">
                <div className = "status-display">
                    {gameState === 'playing' && `残りの爆弾の数: ${minesNum}`}
                    {gameState === 'win' && 'Game Clear'}
                    {gameState === 'lose' && 'Game Over'}
                </div>
                <div className = "operate-mode">
                    <button
                    className={`mode-button ${operate === 'dig' ? 'active' : ''}`}
                    onClick={() => setOperate('dig')}
                    disabled={gameState !== 'playing'}
                    >
                        掘る
                    </button>
                     <button
                    className={`mode-button ${operate === 'flag' ? 'active' : ''}`}
                    onClick={() => setOperate('flag')}
                    disabled={gameState !== 'playing'}
                    >
                        P
                    </button>
                     <button
                    className={`mode-button ${operate === 'question' ? 'active' : ''}`}
                    onClick={() => setOperate('question')}
                    disabled={gameState !== 'playing'}
                    >
                        ?
                    </button>
                </div>
            </div>
            <Board
            boardData={board}
            onCellClick={handleCellClick}
            />
        </div>
    );
}

export default Game;
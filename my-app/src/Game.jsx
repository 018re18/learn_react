import React, { useState, useEffect } from 'react';
import Board from './Board';
import './Game.css';

const BOARD_ROWS = 20;
const BOARD_COLS = 20;
const NUM_MINES = 50;

function Game() {
    const [board,setBoard] = useState([]);
    const [gameState,setGameState] = useState('playing');
    const [operate,setOperate] = useState('dig');
    const [minesNum,setMineNum] = useState(NUM_MINES);

    const initBoard = () => {
        let newBoard = Array(BOARD_ROWS)
        .fill(null)
        .map((_,rowIndex) =>
            Array(BOARD_COLS)
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
        let minesPlaced = 0;
        while(minesPlaced < NUM_MINES){
            const randomRow = Math.floor(Math.random()*BOARD_ROWS);
            const randomCol = Math.floor(Math.random()*BOARD_COLS);

            if(!newBoard[randomRow][randomCol].Mine){
                newBoard[randomRow][randomCol].Mine = true;
                minesPlaced++;
            }
        }
        for (let r = 0; r < BOARD_ROWS; r++){
            for (let c = 0; c < BOARD_COLS; c++){
                if(!newBoard[r][c].Mine){
                    let count = 0;
                    for (let dr = -1; dr <= 1; dr++){
                        for (let dc = -1; dc <=1; dc++){
                            if(dr === 0 && dc === 0)
                                continue;
                            const neighborRow = r + dr;
                            const neighborCol = c + dc;

                            if (
                                neighborRow >= 0 && neighborRow < BOARD_ROWS &&
                                neighborCol >= 0 && neighborCol < BOARD_COLS
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

        setBoard(newBoard);
        setGameState('playing');
        setMineNum(NUM_MINES);
    };

    useEffect(() => {
        initBoard();
    },[]);

    const checkWin = (currentBoard) => {
        if(gameState !== 'playing')
            return;
        let allNonMine = true;
        for (let r = 0; r < BOARD_ROWS; r++){
            for (let c = 0; c < BOARD_COLS; c++){
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
            r < 0 || r >= BOARD_ROWS || c < 0 || c >= BOARD_COLS ||
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

        switch(operate){
            case 'dig':
                if(cell.Flag || cell.Question)
                 return;
                if(cell.Mine){
                  setGameState('lose');
                  for (let r = 0; r < BOARD_ROWS; r++){
                    for (let c = 0; c < BOARD_COLS; c++){
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

    return (
        <div className = "game-container">
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
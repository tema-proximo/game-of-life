import { useCallback, useRef, useState } from 'react'
import produce from 'immer'
import { ROWS_COUNT, COLS_COUNT, UPDATE_SPEED_MS } from './constants'

const neighboursCalculator = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
]

const cellStyle = (isActive) => {
    return {
        width: '30px',
        height: '30px',
        border: '1px solid #e6e6e6',
        cursor: 'pointer',
        backgroundColor: isActive ? '#03ff00' : '#000',
    }
}

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${COLS_COUNT}, 30px)`,
}

const GameOfLife = () => {
    const [grid, setGrid] = useState(
        Array.from(Array(ROWS_COUNT), () =>
            Array.from(Array(COLS_COUNT), () => 0)
        )
    )
    const [isGameStarted, setIsGameStarted] = useState(false)

    const isGameStartedRef = useRef(null)
    isGameStartedRef.current = isGameStarted

    const handleClickCell = (rowIndex, colIndex) => {
        if (isGameStarted) {
            return
        }
        const newGrid = produce(grid, (draftGrid) => {
            draftGrid[rowIndex][colIndex] = 1
        })
        setGrid(newGrid)
    }

    const handleClickStart = () => {
        setIsGameStarted(!isGameStarted)
        if (!isGameStarted) {
            isGameStartedRef.current = true
            startGame()
        }
    }

    const handleClickReset = () => {
        setGrid(() => {
            return Array.from(Array(ROWS_COUNT), () =>
                Array.from(Array(COLS_COUNT), () => 0)
            )
        })
        setIsGameStarted(false)
        isGameStartedRef.current = false
    }

    const startGame = useCallback(() => {
        if (!isGameStartedRef.current) {
            return
        }

        setGrid((prevGrid) => {
            return produce(prevGrid, (draftGrid) => {
                for (let row = 0; row < ROWS_COUNT; row++) {
                    for (let col = 0; col < COLS_COUNT; col++) {
                        let neighbours = 0
                        neighboursCalculator.forEach(([i, k]) => {
                            const newRow = row + i
                            const newCol = col + k
                            if (
                                newRow >= 0 &&
                                newRow < ROWS_COUNT &&
                                newCol >= 0 &&
                                newCol < COLS_COUNT
                            ) {
                                neighbours += prevGrid[newRow][newCol]
                            }
                        })

                        if (neighbours < 2 || neighbours > 3) {
                            draftGrid[row][col] = 0
                        } else if (
                            prevGrid[row][col] === 0 &&
                            neighbours === 3
                        ) {
                            draftGrid[row][col] = 1
                        }
                    }
                }
            })
        })

        setTimeout(startGame, UPDATE_SPEED_MS)
    }, [])

    return (
        <div className="game">
            <div className="header">Game of life</div>
            <div className="controls">
                <button onClick={handleClickStart} className="button">
                    {isGameStarted ? 'Стоп' : 'Старт'}
                </button>
                <button onClick={handleClickReset} className="button">
                    Сброс
                </button>
            </div>
            <div style={gridStyle}>
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}_${colIndex}`}
                            style={cellStyle(cell)}
                            onClick={() => handleClickCell(rowIndex, colIndex)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default GameOfLife

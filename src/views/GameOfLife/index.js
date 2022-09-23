import { useCallback, useRef, useState } from 'react'
import produce from 'immer'
import { ROWS_COUNT, COLS_COUNT, UPDATE_SPEED_MS } from './constants'
import styled from 'styled-components'

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

const Game = styled.div`
    display: flex;
    padding: 10px;
`

const Sidebar = styled.div`
    margin-right: 15px;
`

const Cell = styled.div`
    width: 30px;
    height: 30px;
    border: 1px solid #e6e6e6;
    cursor: pointer;
    background-color: ${(props) => (props.isActive ? '#59ffa0' : '#b4adea')};
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: ${(props) => `repeat(${props.cols}, 30px)`};
`

const Button = styled.button`
    font-family: 'Press Start 2P', cursive;
    font-size: 24px;
    color: #03ff00;
    background: #000;
    border: 1px solid #03ff00;
    margin: 5px 10px;
    padding: 7px 0;
    cursor: pointer;
    min-width: 170px;
`

const Logo = styled.div`
    font-family: 'Press Start 2P', cursive;
    font-size: 24px;
    color: #b4adea;
    margin-bottom: 12px;
    margin-top: 0;
    text-align: center;
`

const GameOfLife = () => {
    const [grid, setGrid] = useState(
        Array.from(Array(ROWS_COUNT), () =>
            Array.from(Array(COLS_COUNT), () => 0)
        )
    )

    const [isGameStarted, setIsGameStarted] = useState(false)

    const generationRef = useRef(0)
    const isGameStartedRef = useRef(isGameStarted)
    const timerRef = useRef(null)

    const handleClickCell = (rowIndex, colIndex) => {
        if (isGameStarted) {
            return
        }
        const newGrid = produce(grid, (draftGrid) => {
            draftGrid[rowIndex][colIndex] = !draftGrid[rowIndex][colIndex]
        })
        setGrid(newGrid)
    }

    const generateGeneration = useCallback(() => {
        setGrid((prevGrid) => {
            return produce(prevGrid, (draftGrid) => {
                for (let row = 0; row < ROWS_COUNT; row++) {
                    for (let col = 0; col < COLS_COUNT; col++) {
                        let neighbours = 0
                        neighboursCalculator.forEach(([i, k]) => {
                            const newRow =
                                row + i >= ROWS_COUNT
                                    ? row + i - ROWS_COUNT
                                    : row + i < 0
                                    ? ROWS_COUNT + i
                                    : row + i
                            const newCol =
                                col + k >= COLS_COUNT
                                    ? col + k - COLS_COUNT
                                    : col + k < 0
                                    ? COLS_COUNT + k
                                    : col + k

                            neighbours += prevGrid[newRow][newCol]
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
    }, [])

    const startGame = useCallback(() => {
        if (!isGameStartedRef.current) {
            return
        }
        timerRef.current = setInterval(() => {
            generateGeneration()
            generationRef.current++
        }, UPDATE_SPEED_MS)
    }, [generateGeneration])

    const handleClickStart = () => {
        setIsGameStarted(!isGameStarted)
        if (!isGameStarted) {
            isGameStartedRef.current = true
            startGame()
        } else {
            clearInterval(timerRef.current)
            isGameStartedRef.current = false
        }
    }

    const handleClickReset = () => {
        generationRef.current = 0
        setGrid(() => {
            return Array.from(Array(ROWS_COUNT), () =>
                Array.from(Array(COLS_COUNT), () => 0)
            )
        })
        setIsGameStarted(false)
        isGameStartedRef.current = false
        clearInterval(timerRef.current)
    }

    return (
        <Game>
            <Sidebar>
                <Logo>Conway's Game of Life</Logo>
                <div className="controls">
                    <Button onClick={handleClickStart}>
                        {isGameStarted ? 'Stop' : 'Start'}
                    </Button>
                    <Button onClick={handleClickReset}>Reset</Button>
                </div>
                <span>
                    {generationRef.current
                        ? `Generation: ${generationRef.current}`
                        : ''}
                </span>
            </Sidebar>
            <Grid cols={COLS_COUNT}>
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <Cell
                            key={`${rowIndex}_${colIndex}`}
                            isActive={cell}
                            onClick={() => handleClickCell(rowIndex, colIndex)}
                        />
                    ))
                )}
            </Grid>
        </Game>
    )
}

export default GameOfLife

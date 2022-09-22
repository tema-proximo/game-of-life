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
    background-color: ${(props) => (props.isActive ? '#b24949' : '#496fb2')};
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
    color: #e6e6e6;
    margin-bottom: 12px;
    margin-top: 0;
    border: 8px dashed;
    padding: 18px;
    text-align: center;
`

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
        <Game>
            <Sidebar>
                <Logo>Game of life</Logo>
                <div className="controls">
                    <Button onClick={handleClickStart}>
                        {isGameStarted ? 'Stop' : 'Start'}
                    </Button>
                    <Button onClick={handleClickReset}>Reset</Button>
                </div>
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

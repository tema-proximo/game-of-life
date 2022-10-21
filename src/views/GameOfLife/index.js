import { useCallback, useRef, useState } from 'react'
import produce from 'immer'
import { ROWS_COUNT, COLS_COUNT, UPDATE_SPEED_MS, COL_SIZE } from './constants'
import styled from 'styled-components'
import Controls from '../../components/Controls'
import GenerationCounter from '../../components/GenerationsCounter'

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
`

const Sidebar = styled.div`
    min-width: 200px;
    padding-right: 1em;
`

const Cell = styled.div`
    width: ${COL_SIZE}px;
    height: ${COL_SIZE}px;
    border: 1px solid #e4f0f9;
    cursor: pointer;
    background-color: ${(props) => (props.isActive ? '#f0f6fa' : '#fff')};
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: ${(props) => `repeat(${props.cols}, ${COL_SIZE}px)`};
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

    const handleClickCell = useCallback((rowIndex, colIndex) => {
        if (isGameStarted) {
            return
        }
        const newGrid = produce(grid, (draftGrid) => {
            draftGrid[rowIndex][colIndex] = !draftGrid[rowIndex][colIndex]
        })
        setGrid(newGrid)
    }, [grid, isGameStarted])

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

    const handleClickStart = useCallback(() => {
        setIsGameStarted(!isGameStarted)
        if (!isGameStarted) {
            isGameStartedRef.current = true
            startGame()
        } else {
            clearInterval(timerRef.current)
            isGameStartedRef.current = false
        }
    }, [isGameStarted, startGame])

    const handleClickReset = useCallback(() => {
        generationRef.current = 0
        setGrid(() => {
            return Array.from(Array(ROWS_COUNT), () =>
                Array.from(Array(COLS_COUNT), () => 0)
            )
        })
        setIsGameStarted(false)
        isGameStartedRef.current = false
        clearInterval(timerRef.current)
    }, [])

    return (
        <Game>
            <Sidebar>
                <Controls isGameStarted={isGameStartedRef.current} handleClickStart={handleClickStart} handleClickReset={handleClickReset} />
                <GenerationCounter generation={generationRef.current}/>
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

import './App.css'
import { useState } from 'react'
import produce from 'immer'

const COLS_COUNT = 30
const ROWS_COUNT = 30

const cellStyle = {
    width: '50px',
    height: '50px',
    border: '1px solid #000',
    cursor: 'pointer',
}

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${COLS_COUNT}, 50px)`,
}

function App() {
    const [grid, setGrid] = useState(
        Array.from(Array(ROWS_COUNT), () =>
            Array.from(Array(COLS_COUNT), () => 'cell')
        )
    )

    const handleClick = (rowIndex, colIndex) => {
        const newGrid = produce(grid, (draftGrid) => {
            draftGrid[rowIndex][colIndex] = 'clicked!'
        })
        setGrid(newGrid)
    }

    return (
        <div style={gridStyle}>
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}_${colIndex}`}
                        style={cellStyle}
                        onClick={() => handleClick(rowIndex, colIndex)}
                    >
                        {cell}
                    </div>
                ))
            )}
        </div>
    )
}

export default App

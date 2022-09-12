import './App.css'
import { useState } from 'react'
import produce from 'immer'

const COLS_COUNT = 30
const ROWS_COUNT = 30

const cellStyle = {
    width: '50px',
    height: '50px',
    border: '1px solid #000',
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

    return (
        <div style={gridStyle}>
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}_${colIndex}`}
                        style={cellStyle}
                        onClick={() => {
                            const newGrid = produce(grid, (draftGrid) => {
                                draftGrid[rowIndex][colIndex] = 'clicked!'
                            })
                            setGrid(newGrid)
                        }}
                    >
                        {cell}
                    </div>
                ))
            )}
        </div>
    )
}

export default App

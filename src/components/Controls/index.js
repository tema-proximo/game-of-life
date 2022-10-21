import { Button } from 'react-bootstrap'
import { memo } from 'react'

const Controls = ({isGameStarted, handleClickStart, handleClickReset}) => {
    return (
    <>
        <Button variant='primary' onClick={handleClickStart}>
            {isGameStarted ? 'Pause' : 'Start'}
        </Button>
        <Button variant='primary' onClick={handleClickReset}>Reset</Button>
    </>
)
    }

export default memo(Controls)
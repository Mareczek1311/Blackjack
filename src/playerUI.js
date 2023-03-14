import './App.css';
import Button from 'react-bootstrap/Button';

const PlayerUI = ({ playersVal, playersUI, turn, restart, playerIndex, currPlayer }) => {
    return (
        <div className="playerUI">
                  <h1>You:</h1>
                        <ul className="playerCardsList">
                          {playersVal[playerIndex].map((el, inx) => <li key={inx}>{el}</li>)}
                        </ul>
                    {playersUI[playerIndex] == "inGame" ? <>


                        <div className='playButtons'>
                          { currPlayer == playerIndex ?
                            <>
                              <Button onClick={ () => turn("stand", playerIndex) } className='playbtn' as="a" variant="primary">
                                Stand
                              </Button>
                              <Button onClick={ () => turn("hit", playerIndex) } className='playbtn' as="a" variant="primary">
                                Hit
                              </Button>
                            </>
                            :
                            <></>
                          }
                      </div>

                      </> 
                      :
                      playersUI[playerIndex] == "lose" ?<> 
                      
                      <p>Lose</p> </>: <p>Win</p>
                    }


                </div> 
    )
}

export default PlayerUI
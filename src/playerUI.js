import './App.css';
import Button from 'react-bootstrap/Button';

const cardsDir = ["/kier2.png","/kier3.png","/kier4.png","/kier5.png","/kier6.png","/kier7.png","/kier8.png","/kier9.png","/kier10.png"
,"/kierAS.png","/kierK.png","/kierQ.png","/kier2.png"]

const PlayerUI = ({ playersVal, playersUI, turn, playerIndex, currPlayer }) => {
    return (
        <div className="playerUI">
                  <h1>Player {playerIndex}:</h1>
                        <ul className="playerCardsList">
                          {playersVal[playerIndex].map((el, inx) => <li key={inx}>
                            
                            <img key={inx} src={require(`./image/cards/kier${cardsDir[el-2]}`) } width="32px" height="32px" alt={inx}></img>

                          </li>)}
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
import './App.css';
import Button from 'react-bootstrap/Button';
import { useEffect } from 'react';

const cardsDir = ["/kier2.png","/kier3.png","/kier4.png","/kier5.png","/kier6.png","/kier7.png","/kier8.png","/kier9.png","/kier10.png"
,"/kierAS.png","/kierK.png","/kierQ.png","/kier2.png"]

const PlayerUI = ({ playersVal, playersUI, turn, playerIndex, currPlayer, myIndex, betingTurn, currBetPlayer, bet, playersBet, playersBalance, playersLoseCounter, playersWinCounter, playersNickname }) => {
  function button(value){
    if(playersBalance[myIndex] >= value){
      return(
        <div onClick={ () => bet(value) } className='pixel' as="a" variant="primary">
        <p>{value}</p>
        </div>
      )
    }
    else{
      //Definetly need to change this to diffrent style WHY NOT VISABLE!?
      <div className='pixel' as="a" variant="primary">
        <p>*{value}*</p>
      </div>
    }
  }

  function UI(){
    if(betingTurn){
      if(playerIndex == currBetPlayer && playerIndex==myIndex)
      {
        return(
          <>    

                       
            <div className='playButtons'>
              {
                    <div className="container">
                      {button(100)}
                      {button(500)}
                    </div>
              }
            </div>
 
          </>
        )
      }
      else if(playerIndex == currBetPlayer){
        return(
                          
          <div className='playButtons'>
            <div className="container">
             <p>Waiting for player...</p>
            </div>
          </div>
        )
      }
      else{
        return(
                            
            <div className='playButtons'>
              <div className="container">
              </div>
            </div>
          )
      }
    }
    else{
      return(
        <div className="ugabugaContainer">
        <h1>Player {playerIndex}:</h1>
              <ul className="playerCardsList">
                {playersVal[playerIndex].map((el, inx) => <li key={inx}>
                  
                  <img key={inx} src={require(`./image/cards/kier${cardsDir[el-2]}`) } width="32px" height="32px" alt={inx}></img>

                </li>)}
              </ul>
          {playersUI[playerIndex] == "inGame" ? 
          <>
                { currPlayer == playerIndex ?
                  <>
                  {
                    myIndex == currPlayer ?
                    <div className="container">
                      <div onClick={ () => turn("stand", playerIndex) } className='pixel' as="a" variant="primary">
                        <p>Stand</p>
                      </div>
                      <div onClick={ () => turn("hit", playerIndex) } className='pixel' as="a" variant="primary">
                        <p>Hit</p>
                      </div>
                    </div>
                    :
                    <p>Waiting for player...</p>
                    
                  }
                  </>
                  :
                  <></>
                }

            </> 
            :
            playersUI[playerIndex] == "lose" ?<> 
            
            <p>Lose</p> </>: <p>Win</p>
          }
      </div> 
      )   
    }
  }

    return ( 
      <>
      <div className="playerUI">
        {UI()}
      </div>
      </>
    )
}

export default PlayerUI
import '../App.css';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import PlayerUI from '../playerUI';

function Blackjack( { numOfPlayers, startGame, parentStarted, myIndex, parentPlayersVal, parentCurrPlayer, parentPlayersUI, parentIsDealerRound, parentTurn } ){

    
    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }
  
    const cardsDir = ["/kier2.png","/kier3.png","/kier4.png","/kier5.png","/kier6.png","/kier7.png","/kier8.png","/kier9.png","/kier10.png"
  ,"/kierAS.png","/kierK.png","/kierQ.png","/kier2.png"]
  
      //1 becouse 0 is dealer
      const [currPlayer, setCurrPlayer] = useState(1);
  
      const [playersBalance, setPlayerBalance] = useState(1000)
  
      const [playersVal, setPlayersVal] = useState([[],[],[],[]]);
      const [playersUI, setPlayersUI] = useState(["inGame", "inGame", "inGame", "inGame"]);
      const [isDealerRound, setIsDealerRound] = useState(false);
  
      
      //now its useless bc i use cards on server and i keep them only bc fun restart use it
      const [cards, setCards]= useState([4,4,4,4,4,4,4,4,7,4])
      const setOfCards = [4,4,4,4,4,4,4,4,7,4]


      const [started, setStarted] = useState(true)
  
      useEffect(()=>{
        if(parentStarted == true){
          setStarted(false);
        }
      },[parentStarted])

      useEffect(()=>{
        setPlayersVal(parentPlayersVal)
      },[parentPlayersVal])
      

      useEffect(()=>{
        setCurrPlayer(parentCurrPlayer);
      },[parentCurrPlayer])
      
      useEffect(()=>{
        setPlayersUI(parentPlayersUI)
      },[parentPlayersUI])
      
      useEffect(()=>{
        setIsDealerRound(parentIsDealerRound)
      },[parentIsDealerRound])

  
      function restart(){
        setIsDealerRound(false)
  
        setCards(setOfCards)
        const playersUIRestart = playersVal.map((item, i) => {
          return "inGame";
        
      });
        setPlayersUI(playersUIRestart)
  
  
        const playersValRestart = playersVal.map((item, i) => {
          return [];
        
      });
        setPlayersVal(playersValRestart)
  
        setStarted(true)
      }

    

  


  

  

    return(
        <header className="App-header">
          {
            started ? 
            
            <>
                {   numOfPlayers == 3 ?
                    <>
                    <Button onClick={ () => startGame() } className='playbtn' as="a" variant="primary">
                            Start
                        </Button>
                        
                    </>
                    :
                    <>
                        
                        <Button className='playbtn' as="a" variant="secondary">
                            Start
                        </Button>
                    </>
                }
            </> :
            <>
              <h1>Dealer: </h1>
              <ul className="playerCardsList">
              {playersVal[0].map((el, inx) => {
                if(inx == 0)
                {
                  return(
                <li key={inx}>
                <img key={inx} src={require(`../image/cards/kier${cardsDir[el-2]}`) } width="32px" height="32px" alt={inx}></img>

                </li>)
                }
                else if(inx == 1 && isDealerRound == false){
                  return( 
                    <li key={inx}>
                      <img key={inx} src={require(`../image/cards/question.png`) } width="32px" height="32px" alt={inx}></img>

                    </li>)
                    
                }
                else{
                  return(
                    <img key={inx} src={require(`../image/cards/kier${cardsDir[el-2]}`) } width="32px" height="32px" alt={inx}></img>
                    
                    )
                }
              })}
              </ul>


              <div className="playerUIContainer">
                <PlayerUI 
                playersVal={playersVal} 
                playersUI={playersUI} 
                turn={parentTurn} 
                playerIndex={1}
                currPlayer={currPlayer}
                myIndex={myIndex}
                
                />
                <PlayerUI 
                playersVal={playersVal} 
                playersUI={playersUI} 
                turn={parentTurn} 
                playerIndex={2}
                currPlayer={currPlayer}
                myIndex={myIndex}
                />
                <PlayerUI 
                playersVal={playersVal} 
                playersUI={playersUI} 
                turn={parentTurn} 
                playerIndex={3}
                currPlayer={currPlayer}
                myIndex={myIndex}
                />
              </div>
              <div onClick={ () => restart() } className='pixel' as="a" variant="primary">
                <p>Restart</p>
              </div>
            </>
        }
        </header>
    )
}

export default Blackjack
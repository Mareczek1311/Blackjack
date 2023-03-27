import '../App.css';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import PlayerUI from '../playerUI';

function Blackjack( { numOfPlayers, startGame, parentStarted, myIndex, parentPlayersVal, parentCurrPlayer, parentPlayersUI, parentIsDealerRound, parentTurn, betingTurn, currBetPlayer, bet, playersBet, playersBalance } ){

  const cardsDir = ["/kier2.png","/kier3.png","/kier4.png","/kier5.png","/kier6.png","/kier7.png","/kier8.png","/kier9.png","/kier10.png"
  ,"/kierAS.png","/kierK.png","/kierQ.png","/kier2.png"]
  
      //1 becouse 0 is a dealer
      const [currPlayer, setCurrPlayer] = useState(1);
      const [playersVal, setPlayersVal] = useState([[],[],[],[]]);
      const [playersUI, setPlayersUI] = useState(["inGame", "inGame", "inGame", "inGame"]);
      const [isDealerRound, setIsDealerRound] = useState(false);
      const [started, setStarted] = useState(true)
      const [playerCount, setPlayerCount] = useState([1])

      //code that later
      const playersLoseCounter = [0, 0, 0, 0]
      const playersWinCounter = [0, 0, 0, 0]

      useEffect(() => {
        let arr = playerCount.map((item, i) => {
          return item;
      });
      if(numOfPlayers > arr.length){
        arr.push(1)
      }
      else if(numOfPlayers < arr.length){
        arr.pop()
      }
      setPlayerCount(arr)
      }, [numOfPlayers])
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

    return(
        <header className="App-header">
          {
            started ? 
            <>
                {   numOfPlayers != 0 ?
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
                {
                  playerCount.map((el ,i) => {
                  return(
                    <PlayerUI 
                    key={i}
                    playersVal={playersVal} 
                    playersUI={playersUI} 
                    turn={parentTurn} 
                    playerIndex={i+1}
                    currPlayer={currPlayer}
                    myIndex={myIndex}
                    betingTurn={betingTurn}
                    currBetPlayer= {currBetPlayer}
                    playersBet={playersBet}
                    playersBalance={playersBalance}
                    bet={bet}
                    />)})
                }
              </div>
            </>
        }
        </header>
    )
}

export default Blackjack
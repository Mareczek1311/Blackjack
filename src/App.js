import './App.css';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import PlayerUI from './playerUI';

//i need to change that when i win round by move(hit) i need to turn the new function that i need to write to make a dealer round



function App() {

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

    const [cards, setCards]= useState([4,4,4,4,4,4,4,4,7,4])
    const setOfCards = [4,4,4,4,4,4,4,4,7,4]
    const [started, setStarted] = useState(true)

    

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

       
    function getRandomCard(){
      let card = Math.floor(Math.random() * 10);
      while(cards[card] === 0)
      {
        card = Math.floor(Math.random() * 10);
      }
      
      
      const newArray = cards.map((item, i) => {
        return item;
      
    });
      newArray[card]-=1;
      
      setCards(newArray)
      card += 2; 
      return card
    }


  function takeCard(index){
    var card = getRandomCard()
    
    const newArray = playersVal.map((item, i) => {
        return item;
      
    });

    newArray[index].push(card)
    setPlayersVal(newArray)
  }
  
  function dealCard(){
    for(let i=0; i<playersVal.length; i++){
      takeCard(i)
    }

  }

  function start(){
    dealCard()
    dealCard()
    setStarted(false);
  
  }
  
  function hit(playerIndex){
    takeCard(playerIndex)

    let playerSum = sum(playersVal[playerIndex])
    let plUI = playersUI

    setPlayersUI(plUI)
  }
  
  function sum(array){
    var res = 0
    for(let i=0; i<array.length; i++){
      res += array[i]
    }
    return res
  }

  function dealerRound(){
    let plUI = playersUI
    let dealerSum = sum(playersVal[0])
    
    setIsDealerRound(true)
      if(dealerSum <= 16){
        takeCard(0)
      }
      dealerSum = sum(playersVal[0])

      for(let i=1; i<playersUI.length; i++)
      {
        let playerSum =  sum(playersVal[i])
        if(plUI[i]== "Win"){
          continue;
        }

        if(dealerSum > 21 && playersUI[i] == "inGame"){
          plUI[i] = "Win"
        }
        else if(playerSum > dealerSum && playerSum <= 21){
          plUI[i] = "Win"
        }
        else if(playerSum == dealerSum){
          plUI[i] = "lose"
        }
        else{
          plUI[i] = "lose"
        }
      }
  }

  function stand(playerIndex){
    setCurrPlayer(currPlayer+1)
    
    //im now hard code and assume that there are always 4 players so i continue only if everyone stand or win
    let playerSum = sum(playersVal[playerIndex])
    let plUI = playersUI

    if(playerSum == 21){
      plUI[playerIndex] = "Win"
    }

    setPlayersUI(plUI)

  }

  function move(index){
    let cardSum = sum(playersVal[index])
    let plUI = playersUI

    if(cardSum == 21){
      plUI[index] = "Win"
      setCurrPlayer(currPlayer+1)
    }
    else if(cardSum > 21){
      plUI[index] = "lose"
      setCurrPlayer(currPlayer+1)
    }
    else{
      plUI[index] = "inGame"
      
    }

    setPlayersUI(plUI)
 
  }

  function turn(state, playerIndex){
    if(state == "hit"){
      hit(playerIndex)
      move(playerIndex)

    }

    if(state == "stand"){
      stand(playerIndex)
    } 
   console.log(currPlayer)
    if(currPlayer >= 3){
      dealerRound()
    }
  }
//await timeout(1000); //for 1 sec delay

  return (
    <div className="App">
      <div className="mainContainer">  
        <header className="App-header">
          {
            started ? 
            <>
              <Button onClick={ () => start() } className='playbtn' as="a" variant="primary">
                Start
              </Button>
              
            </> :
            <>
              <h1>Dealer: </h1>
              <ul className="playerCardsList">
              {playersVal[0].map((el, inx) => {
                if(inx == 0)
                {
                  return(
                <li key={inx}>
                <img key={inx} src={require(`./image/cards/kier${cardsDir[el-2]}`) } width="32px" height="32px" alt={inx}></img>

                </li>)
                }
                else if(inx == 1 && isDealerRound == false){
                  return( 
                    <li key={inx}>
                      <img key={inx} src={require(`./image/cards/question.png`) } width="32px" height="32px" alt={inx}></img>

                    </li>)
                    
                }
                else{
                  return(
                    <img key={inx} src={require(`./image/cards/kier${cardsDir[el-2]}`) } width="32px" height="32px" alt={inx}></img>
                    
                    )
                }
              })}
              </ul>


              <div className="playerUIContainer">
                <PlayerUI 
                playersVal={playersVal} 
                playersUI={playersUI} 
                turn={turn} 
                playerIndex={1}
                currPlayer={currPlayer}
                />
                <PlayerUI 
                playersVal={playersVal} 
                playersUI={playersUI} 
                turn={turn} 
                playerIndex={2}
                currPlayer={currPlayer}
                />
                <PlayerUI 
                playersVal={playersVal} 
                playersUI={playersUI} 
                turn={turn} 
                playerIndex={3}
                currPlayer={currPlayer}
                />
              </div>
              <div onClick={ () => restart() } className='pixel' as="a" variant="primary">
                <p>Restart</p>
              </div>
            </>
        }
        </header>
      </div>
    </div>
  );
}

export default App;

import './App.css';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import PlayerUI from './playerUI';




function App() {

    function timeout(delay) {
      return new Promise( res => setTimeout(res, delay) );
  }

    const [playersBalance, setPlayerBalance] = useState(1000)

    const [playersVal, setPlayersVal] = useState([[],[],[],[]]);
    const [playersUI, setPlayersUI] = useState(["inGame", "inGame", "inGame", "inGame"]);
    const [isDealerRound, setIsDealerRound] = useState(false);

    const [cards, setCards]= useState([4,4,4,4,4,4,4,4,7,4])
    const setOfCards = [4,4,4,4,4,4,4,4,7,4]
   
    
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
  const [started, setStarted] = useState(true)

  function start(){
    dealCard()
    dealCard()
    setStarted(false);
  
  }
  
  function hit(playerIndex){
    // its one rn becouse im playing solo
    takeCard(playerIndex)

    let playerSum = sum(playersVal[playerIndex])
    let plUI = playersUI

    if(playerSum > 21){
      plUI[1] = "lose"  
    }

    setPlayersUI(plUI)
  }
  
  function sum(array){
    var res = 0
    for(let i=0; i<array.length; i++){
      res += array[i]
    }
    return res
  }

  function stand(playerIndex){
    //Sould next player play but right now im gonna hard code that. I will make
    //sure that game is playable 1v1 rn
    setIsDealerRound(true)
    //check if its the last player

    // i assume that im the last player so its dealer round rn

    let dealerSum = sum(playersVal[0])

    if(dealerSum <= 16){
      takeCard(0)
    }
    dealerSum = sum(playersVal[0])
    let plUI = playersUI
  
    let playerSum = sum(playersVal[playerIndex])
    if(dealerSum > 21){
      plUI[1] = "Win"
    }
    else if(playerSum > dealerSum){
      plUI[1] = "Win"
    }
    else if(playerSum == dealerSum){
      // Reset ??????
    }
    else{
      plUI[playerIndex] = "lose"
    }
    setPlayersUI(plUI)
  }

  function move(index){
    let cardSum = sum(playersVal[index])
    let plUI = playersUI

    if(cardSum == 21){
      plUI[index] = "Win"
    }
    else if(cardSum > 21){
      plUI[index] = "lose"

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
                <li key={inx}>{el}</li>)
                }
                else if(inx == 1 && isDealerRound == false){
                  return( 
                    <li key={inx}>?</li>)
                }
                else{
                  return(
                    <li key={inx}>{el}</li>)
                }
              })}
              </ul>


              <div className="playerUIContainer">
                <PlayerUI 
                playersVal={playersVal} 
                playersUI={playersUI} 
                turn={turn} 
                restart={restart} 
                playerIndex={1}
                />
                <PlayerUI 
                playersVal={playersVal} 
                playersUI={playersUI} 
                turn={turn} 
                restart={restart} 
                playerIndex={2}

                />
                <PlayerUI 
                playersVal={playersVal} 
                playersUI={playersUI} 
                turn={turn} 
                restart={restart} 
                playerIndex={3}

                />
              </div>
            </>
        }
        </header>
      </div>
    </div>
  );
}

export default App;

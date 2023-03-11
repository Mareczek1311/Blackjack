import './App.css';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';





function App() {
    const cards = [
      4,4,4,4,4,4,4,4,7,4
    ]
    
    const [dealerVal, setDealerVal] = useState(0);
    const [playerVal, setPlayerVal] = useState(0);
  
  function dealCard(){
    let card = Math.floor(Math.random() * 10);
    while(cards[card] === 0)
    {
      card = Math.floor(Math.random() * 10);
    }  
  
      cards[card]-=1;
  
      card += 2;
  
      setDealerVal(dealerVal + card);
      setPlayerVal(playerVal + card);
  }
  const [started, setStarted] = useState(true)

  function start(){
    dealCard()
    setStarted(false);
  
  }
  
  function hit(){
  
  }
  
  function stand(){
    
  }
  
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
              <h1>Dealer: {dealerVal}</h1>
              <h1>You: {playerVal}</h1>
              <div className='playButtons'>
              <Button onClick={ () => stand() } className='playbtn' as="a" variant="primary">
                Stand
              </Button>
              <Button onClick={ () => hit() } className='playbtn' as="a" variant="primary">
                Hit
              </Button>
              </div>
            </>
        }
        </header>
      </div>
    </div>
  );
}

export default App;

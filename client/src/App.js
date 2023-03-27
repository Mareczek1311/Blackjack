import './App.css';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { socket } from './socket';

import Blackjack from './components/blackjack';

import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { MyForm } from './components/MyForm';



function App() {
  const [connected, setConnected] = useState(false)
  const [numOfPlayers, setNumOfPlayers] = useState(0);
  const [parentStarted, setParentStarted] = useState(false)
  const [parentPlayersVal, setParentPlayersVal] = useState([[],[],[],[]])
  const [myIndex, setMyIndex] = useState(-1)
  const [parentCurrPlayer, setParentCurrPlayer] = useState(1);
  const [parentIsDealerRound, setParentIsDealerRound] = useState(false);
  const [parentPlayersUI, setParentPlayersUI] = useState(["inGame", "inGame", "inGame", "inGame"]);
  const [betingTurn, setBetingTurn] = useState(true)
  const [currBetPlayer, setCurrBetPlayer] = useState(1)
  const [playersBet, setPlayersBet] = useState([0,0,0,0])
  const [playersBalance, setPlayersBalance] = useState([0,0,0,0]);

  useEffect(() => {
    function onConnect() {
      setConnected(true);
    }

    function onDisconnect() {
      setConnected(false);
    }


    socket.on('syncCards', (props) => {
      setParentPlayersVal(props.playersVal)
      setPlayersBalance(props.playersBalance)

    })

    socket.on('receiveData', (props) => {
      setParentPlayersVal(props.playersVal)
      setParentCurrPlayer(props.currPlayer)
      setParentIsDealerRound(props.isDealerRound)
      setParentPlayersUI(props.playersUI)
      setBetingTurn(props.betingTurn)
      setCurrBetPlayer(props.currBetPlayer)
      setPlayersBet(props.playersBet)
      setPlayersBalance(props.playersBalance)

    })

    socket.on('createIndex', (index) => 
    {
      setMyIndex(index+1)
    });

    socket.on('connection', (players) => {
      setNumOfPlayers(players)
    })
    socket.on('connect', onConnect);
    socket.on('startGame', () => {
      setParentStarted(true)
    });
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  function startGame(){
    socket.emit("startGame")
  }

  function bet(value, index){
    socket.emit("bet", value )
  }

    //only using state bc i too lazy to change params in child component
  function turn(state, playerIndex){
    socket.emit("turn", state)
  }

  
//await timeout(1000); //for 1 sec delay

  return (
    <div className="App">
      <div className="mainContainer">  
        { 
          connected ?
            <Blackjack
              numOfPlayers={numOfPlayers}
              startGame={startGame}
              parentStarted={parentStarted}
              myIndex={myIndex}
              parentPlayersVal={parentPlayersVal}
              parentIsDealerRound={parentIsDealerRound}
              parentPlayersUI={parentPlayersUI}
              parentCurrPlayer={parentCurrPlayer}
              parentTurn={turn}
              bet={bet}
              betingTurn={betingTurn}
              currBetPlayer={currBetPlayer}
              playersBet={playersBet}
              playersBalance={playersBalance}
             />
            :
            <>
            <MyForm
              setConnected={setConnected}
             />
            <ConnectionState connected={ connected } />
            <ConnectionManager />
            </>
         
        }
      </div>
    </div>
  );
}

export default App;

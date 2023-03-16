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

  useEffect(() => {
    function onConnect() {
      setConnected(true);
    }

    function onDisconnect() {
      setConnected(false);
    }


    socket.on('syncCards', (playersVal) => {
      setParentPlayersVal(playersVal)
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

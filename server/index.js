const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server({
  cors: {
    origin: "*"
  }
})

// besides of restart function everything is now server side, only thing i need to do is fix lots of bugs....

var players = 0

var playersVal = [[],[],[],[]]
var playersUI = ["inGame", "inGame", "inGame", "inGame"]
var isDealerRound = false
var cards = [4,4,4,4,4,4,4,4,7,4]
var currPlayer = 1

function start(){
  dealCard()
  dealCard()

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
  
  cards = newArray
  card += 2; 
  return card
}

function sum(array){
  var res = 0
  for(let i=0; i<array.length; i++){
    res += array[i]
  }
  return res
}

function stand(playerIndex){
  currPlayer = currPlayer + 1
  
  //im now hard code and assume that there are always 4 players so i continue only if everyone stand or win
  let playerSum = sum(playersVal[playerIndex])
  let plUI = playersUI

  if(playerSum == 21){
    plUI[playerIndex] = "Win"
  }

  playersUI = plUI

}

function dealCard(){
  for(let i=0; i<playersVal.length; i++){
    takeCard(i)
  }

}

  
function takeCard(index){
  var card = getRandomCard()
  
  const newArray = playersVal.map((item, i) => {
      return item;
    
  });

  newArray[index].push(card)
  playersVal = newArray
}

function dealerRound(){
  let plUI = playersUI
  let dealerSum = sum(playersVal[0])
  
    isDealerRound = true;
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


function move(index){
  let cardSum = sum(playersVal[index])
  let plUI = playersUI

  if(cardSum == 21){
    plUI[index] = "Win"
    currPlayer += 1
  }
  else if(cardSum > 21){
    plUI[index] = "lose"
    currPlayer+=1
  }
  else{
    plUI[index] = "inGame"
    
  }

  playersUI = plUI

}


  
function hit(playerIndex){
  takeCard(playerIndex)

  let playerSum = sum(playersVal[playerIndex])
  let plUI = playersUI

  playersUI = plUI
}

io.listen(4000);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  io.to(socket.id).emit("createIndex", players);
  

  socket.on('turn', (state)=>{
    turn(state, currPlayer);
    io.emit('receiveData', {playersUI, playersVal, currPlayer, isDealerRound})
  })

  socket.on('startGame', function() { 
    io.emit("startGame");
    console.log("game is started");
    start()
    io.emit("syncCards", playersVal)
  })

  socket.on('disconnect', function() { 
    console.log("user disconnected")
    players -= 1;
    socket.broadcast.emit("connection", players);
    console.log(players)

  })
  players += 1;
  io.emit("connection", players);

  console.log('a user connected');

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
  

  
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
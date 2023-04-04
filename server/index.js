const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ response: "Server is up and running." }).status(200);
});

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

const host = '0.0.0.0';
const PORT = process.env.PORT || 5000;


var players = 0

var playersVal = [[],[],[],[]]
var playersUI = ["inGame", "inGame", "inGame", "inGame"]
var isDealerRound = false
var cards = [4,4,4,4,4,4,4,4,7,4]
var currPlayer = 1
var playersBalance = [0,1000, 1000, 1000]
var playersBet = [0, 0, 0, 0]
var betingTurn = true
var currBetPlayer = 1
var playersLoseCounter = [0, 0, 0, 0]
var playersWinCounter = [0, 0, 0, 0]
var playersNickname = ["", "", "", ""]


const restartGame = async () => {
    playersVal = [[],[],[],[]]
    isDealerRound = false
    cards = [4,4,4,4,4,4,4,4,7,4]
    currPlayer = 1
    playersUI = ["inGame", "inGame", "inGame", "inGame"]
    playersBet = [0,0,0,0]
    betingTurn = true
    currBetPlayer = 1
    if(players == 0)
    {
      playersBalance = [0, 1000 ,1000, 1000]
    }
    start();
};

function start(){


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

    for(let i=1; i<playersUI.length; i++){
      if(plUI[i] == "Win"){
        playersBalance[i] += playersBet[i]*2
      }
      if(playersBalance[i] >= 2000){
        playersWinCounter[i] += 1
        playersBalance[i] = 1000
      }
      if(playersBalance[i] <= 0){
        playersLoseCounter[i] += 1
        playersBalance[i] = 1000
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
  if(currPlayer >= players+1){
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
  let plUI = playersUI
  playersUI = plUI
}

function controlFunction(){
  console.log("=============")
  console.log(playersVal)
  console.log(playersUI)
  console.log(currPlayer)
  console.log(currBetPlayer)
  console.log(playersNickname)
  console.log("=============")
}

function bet(value){
  playersBet[currBetPlayer] = value
  playersBalance[currBetPlayer] -= value
  currBetPlayer += 1
  if(currBetPlayer >= players+1){
    betingTurn = false
    dealCard()
    dealCard()
  }
}

io.on('connection', (socket) => {
  socket.on('join', nickname => {
    playersNickname[players] = nickname
    })
  console.log("Current players count: ", players)

  io.to(socket.id).emit("createIndex", {players, playersNickname});
  
  socket.on('bet', (value)=>{
    bet(value)
    io.emit('receiveData', {playersUI, playersVal, currPlayer, isDealerRound, betingTurn, currBetPlayer, playersBet, playersBalance, playersLoseCounter, playersWinCounter})
    controlFunction();

  })

  socket.on('turn', (state)=>{
    turn(state, currPlayer);
    controlFunction();
    io.emit('receiveData', {playersUI, playersVal, currPlayer, isDealerRound, betingTurn, currBetPlayer, playersBet, playersBalance, playersLoseCounter, playersWinCounter})
    
    if(isDealerRound==true)
    {
      console.log("restarting...")
      restartGame()
      setInterval(() => {
        io.emit('receiveData', {playersUI, playersVal, currPlayer, isDealerRound, betingTurn, currBetPlayer, playersBet, playersBalance, playersLoseCounter, playersWinCounter})
        
      }, 5000)
    }

  })

  socket.on('startGame', function() { 
    io.emit("startGame");
    console.log("game is started");
    start()
    io.emit("syncCards", {playersVal, playersBalance})
  })

  socket.on('disconnect', function() { 
    console.log("user disconnected")
    players -= 1;
    socket.broadcast.emit("connection", {players, playersNickname});
    console.log("Current players count: ", players)
    if(players == 0){
      console.log("Game restarted")
      restartGame()
    }

  })

  players += 1;
  io.emit("connection", {players, playersNickname});
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });

 
});

server.listen(PORT,host, () => {
  console.log(`Server has started.`)});
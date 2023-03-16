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

// now what I need to do is transfer rest of the functions from client to server 

var players = 0

var playersVal = [[],[],[],[]]
var playersUI = ["inGame", "inGame", "inGame", "inGame"]
var isDealerRound = false
var cards = [4,4,4,4,4,4,4,4,7,4]


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



io.listen(4000);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  io.to(socket.id).emit("createIndex", players);
  
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
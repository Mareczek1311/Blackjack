const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server({
  cors: {
    origin: "*"
  }
});


let players = 0

io.listen(4000);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  socket.on('startGame', function() { 
    io.emit("startGame");
    console.log("game is started");
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

io.on('connection', (socket) => {



})

server.listen(3000, () => {
  console.log('listening on *:3000');
});
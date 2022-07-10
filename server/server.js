const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../')));

app.use((__req, res) => res.sendFile(path.join(__dirname, '../index.html')));

const port = 3000
server.listen(port, () => console.log(`Server Running\nhttp://localhost:${port}`));

io.on('connection', (socket) => {
  let roomId;
  socket.on('disconnect', () => { });
  socket.on('room-join', (evtData) => {
    socket.join(evtData.roomId);
    roomId = evtData.roomId;
  })
  socket.on('action', (actionData) => {
    socket.to(roomId).emit('action', actionData);
  });
});
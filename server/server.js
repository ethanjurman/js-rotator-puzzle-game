const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../')));

app.use((__req, res) => res.sendFile(path.join(__dirname, '../index.html')));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server Running\nhttp://localhost:${PORT}`));

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
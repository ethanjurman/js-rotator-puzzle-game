const socket = io();

const roomId = searchParams.get('roomId');

socket.emit('room-join', { roomId });

const socketPause = () => {
  socket.emit("action", { action: 'pause', roomId });
}

const socketUnpause = () => {
  socket.emit("action", { action: 'unpause', roomId });
}

const socketRotate = (playerId, cursorX, cursorY) => {
  socket.emit("action", { action: "rotate", roomId, playerId, cursorX, cursorY });
}

socket.on('action', (actionData) => {
  if (actionData.action === 'rotate' && actionData.playerId === 1) {
    rotateP1(actionData.cursorX, actionData.cursorY, true);
  }
  if (actionData.action === 'rotate' && actionData.playerId === 2) {
    rotateP2(actionData.cursorX, actionData.cursorY, true);
  }
  if (actionData.action === 'pause') {
    pauseGame(true);
  }
  if (actionData.action === 'unpause') {
    unpauseGame(true);
  }
});
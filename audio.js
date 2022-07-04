const audioMoveElement = document.querySelector('#audio-move');
audioMoveElement.volume = 0.1;
const audioRotateElement = document.querySelector('#audio-rotate');
audioRotateElement.volume = 0.3;
const audioClearCellsElement = document.querySelector('#audio-clear-cells');

const playAudioMove = () => {
  audioMoveElement.currentTime = 0;
  audioMoveElement.play();
}

const playAudioRotate = () => {
  audioRotateElement.currentTime = 0;
  audioRotateElement.play();
}

const playAudioClearCells = () => {
  audioClearCellsElement.currentTime = 0;
  audioClearCellsElement.play();
}

document.addEventListener('keydown', (ev) => {
  if (endGame) {
    return;
  }
  if (ev.key === 'w' || ev.key === 'ArrowUp') {
    playAudioMove();
  }
  if (ev.key === 'a' || ev.key === 'ArrowLeft') {
    playAudioMove();
  }
  if (ev.key === 's' || ev.key === 'ArrowDown') {
    playAudioMove();
  }
  if (ev.key === 'd' || ev.key === 'ArrowRight') {
    playAudioMove();
  }
});

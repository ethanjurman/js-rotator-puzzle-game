const audioMoveElement = document.querySelector('#audio-move');
const audioRotateElement = document.querySelector('#audio-rotate');
const audioClearCellsElement = document.querySelector('#audio-clear-cells');
const audioRunningOutElement = document.querySelector('#audio-running-out');

const setAudioVolumeAndSettings = (volume) => {
  audioMoveElement.volume = 0.2 * volume;
  audioRotateElement.volume = 0.6 * volume;
  audioClearCellsElement.preservesPitch = false;
  audioClearCellsElement.volume = 0.4 * volume;
  audioRunningOutElement.preservesPitch = false;
  audioRunningOutElement.playbackRate = 0.6;
  audioRunningOutElement.volume = 0.2 * volume;
}

try {
  setAudioVolumeAndSettings(localStorage.getItem('config-sound') || 0.5)
} catch (e) {
  setAudioVolumeAndSettings(0.5)
}

const playAudioMove = () => {
  audioMoveElement.currentTime = 0;
  audioMoveElement.play();
}

const playAudioRotate = () => {
  audioRotateElement.currentTime = 0;
  audioRotateElement.play();
}

const playAudioClearCells = (chainClear = 1) => {
  audioClearCellsElement.currentTime = 0;
  audioClearCellsElement.playbackRate = chainClear * 2;
  audioClearCellsElement.play();
}

const playAudioRunningOut = () => {
  audioRunningOutElement.currentTime = 0;
  audioRunningOutElement.play();
}

document.addEventListener('keydown', (ev) => {
  if (endGame || paused) {
    return;
  }
  if (ev.key === config["config-p1-up"] || ev.key === config["config-p2-up"]) {
    playAudioMove();
  }
  if (ev.key === config["config-p1-right"] || ev.key === config["config-p2-right"]) {
    playAudioMove();
  }
  if (ev.key === config["config-p1-down"] || ev.key === config["config-p2-down"]) {
    playAudioMove();
  }
  if (ev.key === config["config-p1-left"] || ev.key === config["config-p2-left"]) {
    playAudioMove();
  }
});

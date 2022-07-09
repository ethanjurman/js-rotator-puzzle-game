let startTime = -1;
let paused;
let player1TimerMS = 120000;
let player2TimerMS = 120000;
let startTimerPlayer1;
let startTimerPlayer2;
let addToTimerPlayer1;
let addToTimerPlayer2;

let pausedTime = { 1: 0, 2: 0 };

const pauseGame = () => {
  if (!paused) {
    paused = new Date().getTime();
  }
}

const unpauseGame = () => {
  if (startTime !== -1) {
    const newUnpausedTime = new Date().getTime();
    try {
      player1TimerMS += newUnpausedTime - paused;
      player2TimerMS += newUnpausedTime - paused;
    } catch (e) { /* do nothing */ }
  }
  paused = 0;
}

const pauseTime = (playerId) => {
  if (!pausedTime[playerId]) {
    pausedTime[playerId] = new Date().getTime();
  }
}

const unpauseTime = (playerId) => {
  if (!pausedTime[playerId]) { return; }
  if (startTime !== -1) {
    const newUnpausedTime = new Date().getTime();
    try {
      timerMS += newUnpausedTime - pausedTime[playerId];
    } catch (e) { /* do nothing */ }
  }
  pausedTime[playerId] = 0;
}

const msToSecondsString = (ms, padding) => {
  ms = `${ms}`
  return `${ms.slice(0, -3).padStart(padding, "0") || 0}:${ms.slice(-3).padStart(padding, "0")}`
}

const playerTimer = (playerId) => {
  const makeTimer = () => {
    const timerContainer = document.createElement('div');
    timerContainer.classList.add('timerContainer');
    timerContainer.classList.add(`player-${playerId}`);
    const playField = document.querySelector(`.player-${playerId}-space`);
    playField.appendChild(timerContainer);
    const timer = document.createElement('div');
    timer.classList.add('timer');
    timer.classList.add(`player-${playerId}`);
    timer.textContent = 'press:space'
    timerContainer.appendChild(timer);
    const bonusTimer = document.createElement('div');
    bonusTimer.classList.add('bonusTimer');
    bonusTimer.classList.add(`player-${playerId}`);
    timerContainer.appendChild(bonusTimer);
    const damageTimer = document.createElement('div');
    damageTimer.classList.add('damageTimer');
    damageTimer.classList.add(`player-${playerId}`);
    timerContainer.appendChild(damageTimer);
  }

  const updateTimer = () => {
    const currentTime = new Date().getTime();
    const timer = document.querySelector(`.player-${playerId} > .timer`);
    const newTime = (playerId === 1 ? player1TimerMS : player2TimerMS) - (currentTime - startTime);
    if (timer) {
      const newTimeString = `${Math.max(newTime, 0)}`
      timer.textContent = msToSecondsString(newTimeString, 3)
    }
    if (Math.floor(newTime) <= 0) {
      timer.textContent = msToSecondsString(0, 3);
      timer.classList.add('timerStopped')
      endGame = true;
    }
  }

  const startTimer = () => {
    startTime = new Date().getTime();
  }

  const addToTimer = (timeToAdd) => {
    const bonusTimer = document.querySelector(`.player-${playerId} > .bonusTimer`);
    bonusTimer.textContent = `+${msToSecondsString(timeToAdd, 0)}`;
    bonusTimer.classList.add('showBonusTimer');
    setTimeout(() => {
      bonusTimer.classList.remove('showBonusTimer');
      unpauseTime(playerId);
    }, 1000);
    const damageTimer = document.querySelector(`.player-${playerId === 1 ? 2 : 1} > .damageTimer`);
    damageTimer.textContent = `-${msToSecondsString(timeToAdd, 0)}`;
    damageTimer.classList.add('showDamageTimer');
    setTimeout(() => {
      damageTimer.classList.remove('showDamageTimer');
    }, 1000);
    player1TimerMS += playerId === 1 ? timeToAdd : -timeToAdd;
    player2TimerMS += playerId === 2 ? timeToAdd : -timeToAdd;
  }

  function stepTimer() {
    const timer = document.querySelector(`.player-${playerId} > .timer`);
    if (timer.textContent == '000:000') {
      return;
    }
    if (endGame) {
      timer.classList.add('timerEnded');
      return;
    }
    if (startTime !== -1 && !paused && !pausedTime[playerId]) {
      updateTimer(playerId);
    }
    setTimeout(() => {
      stepTimer();
    }, 10)
  }

  makeTimer();
  stepTimer();

  return { startTimer, addToTimer };
}

function stepRunningOutTimer() {
  const currentTime = new Date().getTime();
  const timer1 = document.querySelector(`.player-1 > .timer`);
  const timer2 = document.querySelector(`.player-2 > .timer`);
  if (timer1.textContent == '000:000') {
    timer1.classList.add('timerStopped');
    return;
  }
  if (timer2.textContent == '000:000') {
    timer2.classList.add('timerStopped');
    return;
  }
  if (startTime !== -1 && !paused) {
    const newTimeP1 = player1TimerMS - (currentTime - startTime);
    const newTimeP2 = player2TimerMS - (currentTime - startTime);
    if (newTimeP1 < 10000 || newTimeP2 < 10000) {
      playAudioRunningOut();
    }
    if (newTimeP1 < 5000 || newTimeP2 < 5000) {
      setTimeout(() => playAudioRunningOut(), 500);
    }
  }

  setTimeout(() => {
    stepRunningOutTimer();
  }, 1000)
}

const player1TimerObject = playerTimer(1);
const player2TimerObject = playerTimer(2);
startTimerPlayer1 = player1TimerObject.startTimer;
startTimerPlayer2 = player2TimerObject.startTimer;
addToTimerPlayer1 = player1TimerObject.addToTimer;
addToTimerPlayer2 = player2TimerObject.addToTimer;

stepRunningOutTimer();
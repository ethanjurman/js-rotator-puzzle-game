let startTime = -1;
let timerMS = 60000;
let paused = 0;

const msToSecondsString = (ms, padding) => {
  ms = `${ms}`
  return `${ms.slice(0, -3).padStart(padding, "0") || 0}:${ms.slice(-3).padStart(padding, "0")}`
}

const makeTimer = () => {
  const timerContainer = document.createElement('div');
  timerContainer.setAttribute('class', 'timerContainer');
  document.body.appendChild(timerContainer);
  const timer = document.createElement('div');
  timer.setAttribute('class', 'timer');
  timer.textContent = 'press:space'
  timerContainer.appendChild(timer);
  const bonusTimer = document.createElement('div');
  bonusTimer.setAttribute('class', 'bonusTimer');
  timerContainer.appendChild(bonusTimer);
}

const updateTimer = () => {
  const currentTime = new Date().getTime();
  const timer = document.querySelector('.timer');
  const newTime = timerMS - (currentTime - startTime);
  if (timer) {
    const newTimeString = `${Math.max(newTime, 0)}`
    timer.textContent = msToSecondsString(newTimeString, 3)
  }
  if (Math.floor(newTime) <= 0) {
    timer.textContent = msToSecondsString(0, 3);
    endGame = true;
  }
}

const startTimer = () => {
  if (document.querySelector('.modal')) {
    return;  // modal up, don't start timer
  }
  startTime = new Date().getTime();
  stepRunningOutTimer();
}

const addToTimer = (timeToAdd) => {
  const bonusTimer = document.querySelector('.bonusTimer');
  if (!bonusTimer) {
    return;
  }
  bonusTimer.textContent = `+${msToSecondsString(timeToAdd, 0)}`;
  bonusTimer.classList.add('showBonusTimer');
  setTimeout(() => {
    bonusTimer.classList.remove('showBonusTimer');
  }, 1000)
  timerMS += timeToAdd;
}

function stepTimer() {
  const timer = document.querySelector('.timer');
  if (timer.textContent == '000:000') {
    timer.classList.add('timerStopped');
    return;
  }
  if (startTime !== -1 && !paused) {
    updateTimer();
  }

  setTimeout(() => {
    stepTimer();
  }, 10)
}

function stepRunningOutTimer() {
  const currentTime = new Date().getTime();
  const timer = document.querySelector('.timer');
  const newTime = timerMS - (currentTime - startTime);
  if (timer.textContent == '000:000') {
    timer.classList.add('timerStopped');
    return;
  }
  if (newTime < 11000 && !paused) {
    playAudioRunningOut();
  }
  if (newTime < 6000 && !paused) {
    setTimeout(() => playAudioRunningOut(), 500);
  }

  setTimeout(() => {
    stepRunningOutTimer();
  }, 1000)
}

makeTimer();
stepTimer();

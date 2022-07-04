let startTime = -1;
let timerMS = 4000;

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
  startTime = new Date().getTime();
}

const addToTimer = (timeToAdd) => {
  const bonusTimer = document.querySelector('.bonusTimer');
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
  if (startTime !== -1) {
    updateTimer();
  }

  setTimeout(() => {
    stepTimer();
  }, 10)
}

makeTimer();
stepTimer();

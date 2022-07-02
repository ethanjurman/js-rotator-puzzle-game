let startTime = -1;
let timerMS = 90000;

const makeTimer = () => {
  const timer = document.createElement('div');
  timer.setAttribute('class', 'timer');
  document.body.appendChild(timer);
}

const updateTimer = () => {
  const currentTime = new Date().getTime();
  const timer = document.querySelector('.timer');
  const newTime = timerMS - (currentTime - startTime);
  if (timer) {
    timer.textContent = Math.max(newTime, 0);
  }
  if (newTime < 0) {
    endGame = true;
  }
}

const startTimer = () => {
  startTime = new Date().getTime();
}

const addToTimer = (timeToAdd) => {
  timerMS += timeToAdd;
}

function stepTimer() {
  if (startTime !== -1) {
    updateTimer();
  }
  setTimeout(() => {
    stepTimer();
  }, 10)
}

makeTimer();
stepTimer();
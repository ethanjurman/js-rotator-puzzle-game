let startTime = -1;
let player1TimerMS = 120000;
let player2TimerMS = 120000;

const msToSecondsString = (ms, padding) => {
  ms = `${ms}`
  return `${ms.slice(0, -3).padStart(padding, "0") || 0}:${ms.slice(-3).padStart(padding, "0")}`
}

const playerTimer = (playerId) => {
  const makeTimer = () => {
    const timerContainer = document.createElement('div');
    timerContainer.classList.add('timerContainer');
    timerContainer.classList.add(`player-${playerId}`);
    document.body.appendChild(timerContainer);
    const timer = document.createElement('div');
    timer.classList.add('timer');
    timer.classList.add(`player-${playerId}`);
    timer.textContent = 'press:space'
    timerContainer.appendChild(timer);
    const bonusTimer = document.createElement('div');
    bonusTimer.classList.add('bonusTimer');
    bonusTimer.classList.add(`player-${playerId}`);
    timerContainer.appendChild(bonusTimer);
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
    }, 1000);
    player1TimerMS += playerId === 1 ? timeToAdd : -timeToAdd;
    player2TimerMS += playerId === 2 ? timeToAdd : -timeToAdd;
    console.log('added time to timer', player1TimerMS, player2TimerMS);
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
    if (startTime !== -1) {
      updateTimer(playerId);
    }
    setTimeout(() => {
      stepTimer();
    }, 10)
  }

  makeTimer();
  stepTimer();

  return {startTimer, addToTimer};
}

const {startTimer: startTimerPlayer1, addToTimer: addToTimerPlayer1} = playerTimer(1);
const {startTimer: startTimerPlayer2, addToTimer: addToTimerPlayer2} = playerTimer(2);
const gameOverModal = () => `
  <div class="modal show-modal">
    <div class="title">
    <span class="title-block">G</span>
    <span class="title-block">A</span>
    <span class="title-block">M</span>
    <span class="title-block">E</span>
    <span class="title-block spacer"> </span>
    <span class="title-block">O</span>
    <span class="title-block">V</span>
    <span class="title-block">E</span>
    <span class="title-block">R</span>
    </div>
    <div style="margin-bottom: 50px">Total Score: ${scoreValue}</div>
    <div class="start-button" onclick="closeGameOverModal()">Click Here to Start Again!</div>
  </div>
`

const createGameOverModal = () => {
  const modal = document.createElement('div');
  modal.innerHTML = gameOverModal();
  document.body.appendChild(modal);
  modalEle = document.querySelector('.modal');
  setTimeout(() => modalEle.classList.remove('show-modal'), 100);
  showTitle();
}

const closeGameOverModal = () => {
  const modal = document.querySelector('.modal');
  modal.classList.add('remove-modal');
  // reset game states
  endGame = false;
  startTime = -1;
  newScoreValue = 0;
  scoreValue = 0;
  timerMS = 4000; // reset this timer at the start of the game
  const scoreEle = document.querySelector('.score');
  scoreEle.textContent = '0'
  const timerEle = document.querySelector('.timerContainer');
  timerEle.remove();

  makeTimer();
  stepTimer();
  startGameOverCheck();

  setTimeout(() => {
    modal.remove();
  }, 500)
}

const startGameOverCheck = () => {
  let modalGameOverCheck = setInterval(() => {
    if (endGame === true) {
      createGameOverModal();
      clearInterval(modalGameOverCheck);
    }
  }, 1000);
}
startGameOverCheck();
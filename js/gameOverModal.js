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
    <div style="margin: 50px">Total Score: ${scoreValue}</div>
    <div class="start-button" onclick="startOver()">Start Over!</div>
    <div style="margin-top: 20px" class="endless-button" onclick="startEndless()">Continue Endless (no timer)</div>
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

const startOver = () => {
  window.location.href = '';
}

const startEndless = () => {
  // reset game states
  endGame = false;
  startTime = -1;
  const timerEle = document.querySelector('.timerContainer');
  timerEle.remove();
  closeWelcomeModal();
  startGameOverCheck();
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
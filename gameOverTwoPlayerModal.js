const gameOverModal = (string, newScore1, newScore2) => `
  <div class="modal show-modal">
    <div class="title" style="display:flex; justify-content: space-between; margin-bottom: 30px">
    ${[...string].map(c => {
  if (c) { return `<span class="title-block" style="margin-right: 5px">${c}</span>` }
  return `<span class="title-block spacer"> </span>`
}).join("")}
    </div>
    <div class="scores">${newScore1} - ${newScore2}</div>
    <div class="start-button" onclick="startOver()">Click Here to Start Again!</div>
    <div class="endless-button" onclick="startReset()" style="margin-top: 30px">Click Here to Reset Scores!</div>
  </div>
`

const getScores = () => {
  const score1 = Number(document.querySelector('.score.playerId-1').textContent);
  const score2 = Number(document.querySelector('.score.playerId-2').textContent);
  let newScore1 = (score1 >= score2 ? 1 : 0);
  let newScore2 = (score1 < score2 ? 1 : 0);
  try {
    newScore1 += Number(window.location.search.match(/score1=(\d)/)[1] || 0);
    newScore2 += Number(window.location.search.match(/score2=(\d)/)[1] || 0);
  } catch (__error) {
    // do nothing
  }
  return { winner: score1 >= score2 ? 1 : 2, newScore1, newScore2 };
}

const createGameOverModal = () => {
  const modal = document.createElement('div');
  const { winner, newScore1, newScore2 } = getScores();
  modal.innerHTML = gameOverModal(winner === 1 ? "Player 1 Wins!" : "Player 2 Wins!", newScore1, newScore2);
  document.body.appendChild(modal);
  modalEle = document.querySelector('.modal');
  setTimeout(() => modalEle.classList.remove('show-modal'), 100);
  showTitle();
}

const startOver = () => {
  const { newScore1, newScore2 } = getScores();
  window.location.href = `?welcomeModal=false&score1=${newScore1}&score2=${newScore2}`;
}

const startReset = () => {
  window.location.href = `./twoPlayer.html`;
}

const startGameOverCheck = () => {
  let modalGameOverCheck = setInterval(() => {
    if (endGame === true) {
      createGameOverModal();
      clearInterval(modalGameOverCheck);

      document.addEventListener('keydown', (ev) => {
        if (ev.key === ' ' || ev.key === 'z') {
          startOver();
        }
      })
    }
  }, 1000);
}
startGameOverCheck();

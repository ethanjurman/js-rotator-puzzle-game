let playerOneCellsCleared = {};
let playerTwoCellsCleared = {};

const comboNum = 30;

const buildCellClearTowers = (grid, colorNumber, amount) => {
  const numberOfTowers = grid.querySelectorAll('.tower').length;
  const tower = document.createElement('div');
  tower.classList.add('tower');
  tower.classList.add(`color${colorNumber}`);
  tower.style.right = -20 * (numberOfTowers + 1);
  const towerFill = document.createElement('div');
  towerFill.classList.add('towerFill');
  towerFill.style.backgroundColor = `var(--color-${colorNumber})`;
  towerFill.style.height = `${Math.floor((amount / comboNum) * 100)}%`;
  tower.appendChild(towerFill);
  grid.appendChild(tower);
}

const addToCounter = (player, color, amount) => {
  const grid = document.querySelector(`.grid.player-${player}`) || document.querySelector(`.grid`);
  const playerObject = player === 2 ? playerTwoCellsCleared : playerOneCellsCleared;
  if (isNaN(playerObject[color])) {
    // create tower;
    playerObject[color] = amount;
    buildCellClearTowers(grid, [...color][5], amount);
  } else {
    playerObject[color] = playerObject[color] + amount;
    if (playerObject[color] > comboNum) {
      playerObject[color] = playerObject[color] % comboNum;
      clearCells(player, color);
    }
    const towerFill = grid.querySelector(`.tower.${color} > .towerFill`);
    towerFill.style.height = `${Math.floor((playerObject[color] / comboNum) * 100)}%`
  }
}

const clearCells = (player, color) => {
  console.log({ player, color })
  const grid = document.querySelector(`.grid.player-${player}`) || document.querySelector(`.grid`);
  const cellsToRemove = grid.querySelectorAll(`.cell.${color}`);
  [...cellsToRemove].sort((a, b) => a.dataset.y - b.dataset.y).forEach((cell, index) => {
    setTimeout(() => cell.classList.add('remove'), 50 * index);
  });
  setTimeout(() => {
    cellsToRemove.forEach(cell => cell.remove());
  }, 400)
}


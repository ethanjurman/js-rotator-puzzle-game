const COLORS = ['color1', 'color2', 'color3', 'color4'];
const GRID_HEIGHT_SIZE = Number(getComputedStyle(document.documentElement)
  .getPropertyValue('--cells-high')) || 6;
const GRID_WIDTH_SIZE = Number(getComputedStyle(document.documentElement)
  .getPropertyValue('--cells-wide')) || 6;
const CELL_HEIGHT = (400 / GRID_HEIGHT_SIZE) + 4;
const CELL_WIDTH = (400 / GRID_WIDTH_SIZE) + 4;

let cursorPos = { x: 0, y: 0 };
let createHold = false;
let scoreValue = 0;
let newScoreValue = 0;
let chain = 1;
let endGame = false;

const getRandomColor = () => {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

const makeCell = (x, y) => {
  const cell = document.createElement('div');
  const color = getRandomColor();
  cell.setAttribute('class', `cell ${color}`);
  cell.style = `left: ${CELL_WIDTH * x}px; top: ${CELL_HEIGHT * y}px;`
  cell.dataset.x = x;
  cell.dataset.y = y;
  cell.dataset.color = color;
  return cell;
}

const makeClickPoint = (x, y) => {
  if (x >= GRID_HEIGHT_SIZE - 1 || y >= GRID_WIDTH_SIZE - 1) {
    return document.createElement('div');
  }
  const clickPoint = document.createElement('div');
  clickPoint.setAttribute('class', `clickPoint`);
  clickPoint.style = `left: ${(CELL_WIDTH * x) + 75}px; top: ${(CELL_HEIGHT * y) + 75}px;`
  clickPoint.dataset.clickX = x;
  clickPoint.dataset.clickY = y;
  return clickPoint;
}

const makeCursor = () => {
  const cursor = document.createElement('div');
  cursor.setAttribute('class', 'cursor');
  return cursor;
}

const makeScore = () => {
  const score = document.createElement('div');
  score.setAttribute('class', 'score');
  score.textContent = 0;
  return score;
}

const updateScore = () => {
  if (scoreValue === newScoreValue) {
    return;
  }
  const score = document.querySelector('.score');
  for (let i = scoreValue; i < newScoreValue + 1; i++) {
    setTimeout(() => {
      score.textContent = i
    }, (i - scoreValue) * 50);
  }
  addToTimer((newScoreValue - scoreValue) * 500);
  scoreValue = newScoreValue;
}

const makeGrid = () => {
  const grid = document.createElement('div');
  grid.setAttribute('class', 'grid');
  document.body.appendChild(grid);

  for (let i = 0; i < GRID_WIDTH_SIZE; i++) {
    for (let j = 0; j < GRID_HEIGHT_SIZE; j++) {
      grid.appendChild(makeClickPoint(i, j));
      grid.appendChild(makeCell(i, j))
    }
  }

  grid.appendChild(makeCursor());
  grid.appendChild(makeScore())
}

makeGrid();

document.onkeydown = (ev) => {
  if (endGame || paused) {
    return;
  }
  if (ev.key === config["config-p1-up"] || ev.key === config["config-p2-up"]) {
    cursorPos = { x: cursorPos.x, y: cursorPos.y ? cursorPos.y - 1 : GRID_HEIGHT_SIZE - 2 }
  }
  if (ev.key === config["config-p1-right"] || ev.key === config["config-p2-right"]) {
    cursorPos = { x: cursorPos.x ? cursorPos.x - 1 : GRID_WIDTH_SIZE - 2, y: cursorPos.y }
  }
  if (ev.key === config["config-p1-down"] || ev.key === config["config-p2-down"]) {
    cursorPos = { x: cursorPos.x, y: (cursorPos.y + 1) % (GRID_HEIGHT_SIZE - 1) }
  }
  if (ev.key === config["config-p1-left"] || ev.key === config["config-p2-left"]) {
    cursorPos = { x: (cursorPos.x + 1) % (GRID_WIDTH_SIZE - 1), y: cursorPos.y }
  }
  if (ev.key === config["config-p1-rotate"] || ev.key === config["config-p2-rotate"]) {
    rotateCells();
  }
  updateCursor();
}

const updateCursor = () => {
  const cursor = document.querySelector('.cursor');
  const { x, y } = cursorPos;
  cursor.style = `left: ${CELL_WIDTH * x}px; top: ${CELL_HEIGHT * y}px;`
}

const getCellItem = (x, y) => {
  return document.querySelector(`[data-x="${x}"][data-y="${y}"]`)
}

const rotateCells = () => {
  const cells = document.querySelectorAll('.cell')
  const areCellsBeingRemoved = Boolean(document.querySelector('.remove'));
  if (cells.length !== GRID_HEIGHT_SIZE * GRID_WIDTH_SIZE || areCellsBeingRemoved) {
    return;
  }
  const { x, y } = cursorPos;
  const cellsToRotate = [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]];
  const cellElements = cellsToRotate.map((pair) => getCellItem(pair[0], pair[1]));
  cellElements.forEach((cellElement, index) => {
    if (!cellElement) {
      return false;
    }
    const [newX, newY] = cellsToRotate[(Number(index) + 1) % cellsToRotate.length]
    cellElement.dataset.x = newX;
    cellElement.dataset.y = newY;
    cellElement.style = `left: ${CELL_WIDTH * newX}px; top: ${CELL_HEIGHT * newY}px;`
  });

  playAudioRotate();

  // if this is the first rotate, let's start the timer;
  if (startTime === -1) {
    startTimer();
  }
}


let chainResetTime = 0;
const queueChainReset = () => {
  chainResetTime = new Date().getTime() + 3000;
  const chainInternval = setInterval(() => {
    const percent = (chainResetTime - new Date().getTime()) / 30;
    const scoreBox = document.querySelector('.score');
    scoreBox.style = `background-color: inherit; background: linear-gradient(to right, #60507b  ${percent}%, #392f5a ${percent}%)`
  }, 10)
  setTimeout(() => { chain = 1; clearInterval(chainInternval) }, 3000)
}

const clearColumns = () => {
  let wereItemsRemoved = false;
  for (let i = 0; i < GRID_WIDTH_SIZE; i++) {
    let color = 'UNREGISTERED';
    for (let j = 0; j < GRID_HEIGHT_SIZE; j++) {
      const cellItem = getCellItem(i, j);
      if (!cellItem) {
        continue;
      }
      if (color === 'UNREGISTERED') {
        color = cellItem.dataset.color;
      }
      if (color !== cellItem.dataset.color) {
        color = null;
      }
    }
    if (color && color !== 'UNREGISTERED') {
      const cells = document.querySelectorAll(`[data-x="${i}"]`);
      const growingScore = newScoreValue - scoreValue;
      newScoreValue = scoreValue + growingScore + (cells.length * chain);
      cells.forEach(cell => cell.classList.add('remove'));
      setTimeout(() => {
        cells.forEach(cell => cell.remove());
      }, 200)
      wereItemsRemoved = true;
      queueChainReset()
      playAudioClearCells(chain);
    }
  }
  return wereItemsRemoved;
}

const clearRows = () => {
  let wereItemsRemoved = false;
  for (let i = 0; i < GRID_WIDTH_SIZE; i++) {
    let color = 'UNREGISTERED';
    for (let j = 0; j < GRID_HEIGHT_SIZE; j++) {
      const cellItem = getCellItem(j, i);
      if (!cellItem) {
        continue;
      }
      if (color === 'UNREGISTERED') {
        color = cellItem.dataset.color;
      }
      if (color !== cellItem.dataset.color) {
        color = null;
      }
    }
    if (color && color !== 'UNREGISTERED') {
      const cells = document.querySelectorAll(`[data-y="${i}"]`);
      const growingScore = newScoreValue - scoreValue;
      newScoreValue = scoreValue + growingScore + (cells.length * chain);
      cells.forEach(cell => cell.classList.add('remove'));
      setTimeout(() => {
        cells.forEach(cell => cell.remove());
      }, 200)
      wereItemsRemoved = true;
      queueChainReset()
      playAudioClearCells(chain);
    }
  }
  return wereItemsRemoved;
}

const gravity = () => {
  const cellElements = document.querySelectorAll('.cell')
  for (cellElement of cellElements) {
    const { x, y } = cellElement.dataset;
    if (Number(y) === GRID_HEIGHT_SIZE - 1) {
      continue;
    }
    if (!getCellItem(Number(x), Number(y) + 1)) {
      cellElement.dataset.y = Number(y) + 1;
      cellElement.style = `left: ${CELL_WIDTH * x}px; top: ${CELL_HEIGHT * (Number(y) + 1)}px;`;
    }
  }
}

const makeTopCells = () => {
  let wereItemsAdded = false;
  const grid = document.querySelector('.grid');
  for (let x = 0; x < GRID_WIDTH_SIZE; x++) {
    if (!getCellItem(x, 0)) {
      grid.appendChild(makeCell(x, 0));
      wereItemsAdded = true;
    }
  }
  return wereItemsAdded;
}

const step = () => {
  const areItemsCurrentlyBeingRemoved = document.querySelector('.remove')
  if (createHold && !areItemsCurrentlyBeingRemoved) { // if create hold is true, allow clearing items
    const wereItemsRemovedFromColumns = clearColumns() && chain++;
    const wereItemsRemovedFromRows = clearRows() && chain++;
    if (!wereItemsRemovedFromColumns && !wereItemsRemovedFromRows) {
      createHold = false;
    }
  }
  if (!createHold) { // if create hold is false, allow creating items
    gravity();
    updateScore()
    const wereItemsAdded = makeTopCells();
    if (!wereItemsAdded) {
      createHold = true;
    }
  }
  setTimeout(() => {
    window.requestAnimationFrame(step);
  }, 50)
}

window.requestAnimationFrame(step);



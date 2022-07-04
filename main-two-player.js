const COLORS = ['color1', 'color2', 'color3', 'color4'];
const GRID_HEIGHT_SIZE = Number(getComputedStyle(document.documentElement)
  .getPropertyValue('--cells-high')) || 6;
const GRID_WIDTH_SIZE = Number(getComputedStyle(document.documentElement)
  .getPropertyValue('--cells-wide')) || 6;
const CELL_HEIGHT = (400 / GRID_HEIGHT_SIZE) + 4;
const CELL_WIDTH = (400 / GRID_WIDTH_SIZE) + 4;

let endGame = false;

const makePlayer = (playerId) => {
  let cursorPos = { x: 0, y: 0 };
  let createHold = false;
  let scoreValue = 0;
  let newScoreValue = 0;
  let chain = 1;

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
    score.classList.add(`playerId-${playerId}`)
    score.textContent = 0;
    return score;
  }

  const updateScore = () => {
    if (scoreValue === newScoreValue) {
      return;
    }
    const score = document.querySelector(`.playerId-${playerId}.score`);
    for (let i = scoreValue; i < newScoreValue + 1; i++) {
      setTimeout(() => {
        score.textContent = i
      }, (i - scoreValue) * 50);
    }
    playerId === 1
      ? addToTimerPlayer1((newScoreValue - scoreValue) * 500)
      : addToTimerPlayer2((newScoreValue - scoreValue) * 500);
    scoreValue = newScoreValue;
  }

  const makeGrid = () => {
    const grid = document.createElement('div');
    grid.classList.add('grid');
    grid.classList.add(`player-${playerId}`);
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

  document.addEventListener('keydown', (ev) => {
    if (endGame) {
      return;
    }
    if (playerId === 1 ? ev.key === 'w' : ev.key === 'ArrowUp') {
      cursorPos = { x: cursorPos.x, y: cursorPos.y ? cursorPos.y - 1 : GRID_HEIGHT_SIZE - 2 }
    }
    if (playerId === 1 ? ev.key === 'a' : ev.key === 'ArrowLeft') {
      cursorPos = { x: cursorPos.x ? cursorPos.x - 1 : GRID_WIDTH_SIZE - 2, y: cursorPos.y }
    }
    if (playerId === 1 ? ev.key === 's' : ev.key === 'ArrowDown') {
      cursorPos = { x: cursorPos.x, y: (cursorPos.y + 1) % (GRID_HEIGHT_SIZE - 1) }
    }
    if (playerId === 1 ? ev.key === 'd' : ev.key === 'ArrowRight') {
      cursorPos = { x: (cursorPos.x + 1) % (GRID_WIDTH_SIZE - 1), y: cursorPos.y }
    }
    if (playerId === 1 ? ev.key === ' ' : ev.key === 'z') {
      rotateCells();
    }
    updateCursor();
  });

  const updateCursor = () => {
    const cursor = document.querySelector(`.player-${playerId} > .cursor`);
    const { x, y } = cursorPos;
    cursor.style = `left: ${CELL_WIDTH * x}px; top: ${CELL_HEIGHT * y}px;`
  }

  const getCellItem = (x, y) => {
    return document.querySelector(`.player-${playerId} > [data-x="${x}"][data-y="${y}"]`)
  }

  const rotateCells = () => {
    const cells = document.querySelectorAll(`.player-${playerId} > .cell`)
    const areCellsBeingRemoved = Boolean(document.querySelector(`.player-${playerId} > .remove`));
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
      playerId === 1 ? startTimerPlayer1() : startTimerPlayer2();
    }
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
        const cells = document.querySelectorAll(`.player-${playerId} > [data-x="${i}"]`);
        const growingScore = newScoreValue - scoreValue;
        newScoreValue = scoreValue + growingScore + (cells.length * chain);
        cells.forEach(cell => cell.classList.add('remove'));
        setTimeout(() => {
          cells.forEach(cell => cell.remove());
        }, 200)
        wereItemsRemoved = true;
        playAudioClearCells();
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
        const cells = document.querySelectorAll(`.player-${playerId} > [data-y="${i}"]`);
        const growingScore = newScoreValue - scoreValue;
        newScoreValue = scoreValue + growingScore + (cells.length * chain);
        cells.forEach(cell => cell.classList.add('remove'));
        setTimeout(() => {
          cells.forEach(cell => cell.remove());
        }, 200)
        wereItemsRemoved = true;
        playAudioClearCells();
      }
    }
    return wereItemsRemoved;
  }

  const gravity = () => {
    const cellElements = document.querySelectorAll(`.player-${playerId} > .cell`)
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
    const grid = document.querySelector(`.player-${playerId}.grid`);
    for (let x = 0; x < GRID_WIDTH_SIZE; x++) {
      if (!getCellItem(x, 0)) {
        grid.appendChild(makeCell(x, 0));
        wereItemsAdded = true;
      }
    }
    return wereItemsAdded;
  }

  const step = () => {
    const areItemsCurrentlyBeingRemoved = document.querySelector(`.player-${playerId} > .remove`)
    if (createHold && !areItemsCurrentlyBeingRemoved) { // if create hold is true, allow clearing items
      const wereItemsRemovedFromColumns = clearColumns() && chain++;
      const wereItemsRemovedFromRows = clearRows() && chain++;
      if (!wereItemsRemovedFromColumns && !wereItemsRemovedFromRows) {
        createHold = false;
      }
    }
    if (!createHold) { // if create hold is false, allow creating items
      gravity();
      chain = 1; // reset chain
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
}

makePlayer(1);
makePlayer(2);
const COLORS = ['color1', 'color2', 'color3', 'color4'];
const GRID_HEIGHT_SIZE = Number(getComputedStyle(document.documentElement)
  .getPropertyValue('--cells-high')) || 6;
const GRID_WIDTH_SIZE = Number(getComputedStyle(document.documentElement)
  .getPropertyValue('--cells-wide')) || 6;
const CELL_HEIGHT = (400 / GRID_HEIGHT_SIZE) + 4;
const CELL_WIDTH = (400 / GRID_WIDTH_SIZE) + 4;

let endGame = false;
let rotateP1;
let rotateP2;
let updateCursorP1;
let updateCursorP2;
let cursorP1;
let cursorP2;

const searchParams = new URLSearchParams(window.location.search);
let seed = Number(searchParams.get("seed")) || Math.floor(Math.random() * 100000000);
searchParams.set("seed", seed);

const makePlayer = (playerId, playerSeed = seed) => {
  let cursorPos = { x: 0, y: 0 };
  let createHold = false;
  let scoreValue = 0;
  let newScoreValue = 0;
  let chain = 1;

  function random() {
    var x = Math.sin(playerSeed++) * 10000;
    return x - Math.floor(x);
  }

  const getRandomColor = () => {
    return COLORS[Math.floor(random() * COLORS.length)];
  }

  const getCursorPos = () => {
    const { x, y } = document.querySelector(`.player-${playerId} > .cursor`).dataset;
    return { x: Number(x), y: Number(y) };
  };

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
    cursor.classList.add(`cursor`);
    cursor.classList.add(`playerId-${playerId}`);
    cursor.dataset.x = 0;
    cursor.dataset.y = 0;
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
    const playField = document.querySelector(`.player-${playerId}-space`);
    playField.appendChild(grid);

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
    if (endGame || paused) {
      return;
    }
    if (playerId === 1 ? ev.key === config["config-p1-up"] : ev.key === config["config-p2-up"]) {
      cursorPos = { x: cursorPos.x, y: cursorPos.y ? cursorPos.y - 1 : GRID_HEIGHT_SIZE - 2 }
      updateCursor();
    }
    if (playerId === 1 ? ev.key === config["config-p1-right"] : ev.key === config["config-p2-right"]) {
      cursorPos = { x: cursorPos.x ? cursorPos.x - 1 : GRID_WIDTH_SIZE - 2, y: cursorPos.y }
      updateCursor();
    }
    if (playerId === 1 ? ev.key === config["config-p1-down"] : ev.key === config["config-p2-down"]) {
      cursorPos = { x: cursorPos.x, y: (cursorPos.y + 1) % (GRID_HEIGHT_SIZE - 1) }
      updateCursor();
    }
    if (playerId === 1 ? ev.key === config["config-p1-left"] : ev.key === config["config-p2-left"]) {
      cursorPos = { x: (cursorPos.x + 1) % (GRID_WIDTH_SIZE - 1), y: cursorPos.y }
      updateCursor();
    }
    if (playerId === 1 ? ev.key === config["config-p1-rotate"] : ev.key === config["config-p2-rotate"]) {
      rotateCells();
    }
  });

  const updateCursor = (x = cursorPos.x, y = cursorPos.y) => {
    const cursor = document.querySelector(`.player-${playerId} > .cursor`);
    cursor.dataset.x = x;
    cursor.dataset.y = y;
    cursor.style = `left: ${CELL_WIDTH * x}px; top: ${CELL_HEIGHT * y}px;`
  }

  const getCellItem = (x, y) => {
    return document.querySelector(`.player-${playerId} > .cell[data-x="${x}"][data-y="${y}"]`)
  }

  const rotateCells = (x = cursorPos.x, y = cursorPos.y, remote) => {
    const cells = document.querySelectorAll(`.player-${playerId} > .cell`)
    const areCellsBeingRemoved = Boolean(document.querySelector(`.player-${playerId} > .remove`));
    if (cells.length !== GRID_HEIGHT_SIZE * GRID_WIDTH_SIZE || areCellsBeingRemoved) {
      return;
    }
    if (x != cursorPos.x || y != cursorPos.y) {
      cursorPos = { x, y };
      updateCursor();
    }
    if (!remote) {
      try { socketRotate(playerId, x, y) } catch (e) {/* ignore */ }
    }
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

  let chainResetTime = 0;
  let resetChainTimeout;
  let chainInternval;
  const queueChainReset = () => {
    chainResetTime = new Date().getTime() + 2500;
    clearTimeout(resetChainTimeout);
    clearInterval(chainInternval);
    chainInternval = setInterval(() => {
      const percent = (chainResetTime - new Date().getTime()) / 30;
      const scoreBox = document.querySelector(`.score.playerId-${playerId}`);
      scoreBox.style = `background-color: inherit; background: linear-gradient(to right, #60507b  ${percent}%, #392f5a ${percent}%)`
    }, 10)
    resetChainTimeout = setTimeout(() => {
      chain = 1;
      clearInterval(chainInternval);
      hideChainElement(`.grid.player-${playerId} > .chain-counter`);
    }, 2750)
  }

  const clearColumns = () => {
    let wereItemsRemoved = false;
    for (let i = 0; i < GRID_WIDTH_SIZE; i++) {
      if (wereItemsRemoved) { continue; } // only clear one column at a time
      let color = 'UNREGISTERED';
      for (let j = 0; j < GRID_HEIGHT_SIZE; j++) {
        if (wereItemsRemoved) { continue; } // only clear one column at a time
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
        const cells = document.querySelectorAll(`.player-${playerId} > .cell[data-x="${i}"]`);
        const growingScore = newScoreValue - scoreValue;
        newScoreValue = scoreValue + growingScore + (cells.length * chain);
        [...cells].sort((a, b) => a.dataset.y - b.dataset.y).forEach((cell, index) => {
          setTimeout(() => cell.classList.add('remove'), 50 * index);
        });
        setTimeout(() => {
          cells.forEach(cell => cell.remove());
        }, 400)
        wereItemsRemoved = true;
        showChainElement(`.grid.player-${playerId} > .chain-counter`);
        queueChainReset();
        pauseTime(playerId);
        playAudioClearCells(chain);
        increaseChainElement(chain, `.grid.player-${playerId} > .chain-counter`);
      }
    }
    return wereItemsRemoved;
  }

  const clearRows = () => {
    let wereItemsRemoved = false;
    for (let i = 0; i < GRID_WIDTH_SIZE; i++) {
      if (wereItemsRemoved) { continue; } // only clear one row at a time
      let color = 'UNREGISTERED';
      for (let j = 0; j < GRID_HEIGHT_SIZE; j++) {
        if (wereItemsRemoved) { continue; } // only clear one row at a time
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
        const cells = document.querySelectorAll(`.player-${playerId} > .cell[data-y="${i}"]`);
        const growingScore = newScoreValue - scoreValue;
        newScoreValue = scoreValue + growingScore + (cells.length * chain);
        [...cells].sort((a, b) => a.dataset.x - b.dataset.x).forEach((cell, index) => {
          setTimeout(() => cell.classList.add('remove'), 50 * index);
        });
        setTimeout(() => {
          cells.forEach(cell => cell.remove());
        }, 400)
        wereItemsRemoved = true;
        showChainElement(`.grid.player-${playerId} > .chain-counter`);
        queueChainReset();
        playAudioClearCells(chain);
        increaseChainElement(chain, `.grid.player-${playerId} > .chain-counter`);
      }
    }
    return wereItemsRemoved;
  }

  const gravity = () => {
    for (let x = 0; x < GRID_WIDTH_SIZE; x++) {
      for (let y = 0; y < GRID_HEIGHT_SIZE; y++) {
        const cellElement = getCellItem(Number(x), Number(y));
        if (!cellElement) {
          return;
        }
        if (Number(y) === GRID_HEIGHT_SIZE - 1) {
          continue;
        }
        if (!getCellItem(Number(x), Number(y) + 1)) {
          cellElement.dataset.y = Number(y) + 1;
          cellElement.style = `left: ${CELL_WIDTH * x}px; top: ${CELL_HEIGHT * (Number(y) + 1)}px;`;
        }
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

  return { rotateCells, updateCursor, getCursorPos };
}

player1Functions = makePlayer(1);
player2Functions = makePlayer(2);

rotateP1 = player1Functions.rotateCells;
rotateP2 = player2Functions.rotateCells;
updateCursorP1 = player1Functions.updateCursor;
updateCursorP2 = player2Functions.updateCursor;
getCursorP1 = player1Functions.getCursorPos;
getCursorP2 = player2Functions.getCursorPos;


makeChainCounter(document.querySelector('.grid.player-1'));
makeChainCounter(document.querySelector('.grid.player-2'));
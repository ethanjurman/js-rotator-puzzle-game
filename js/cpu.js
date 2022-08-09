const checkForCPU = (playerId) => {
  const cpuLevel = config[`config-cpu-${playerId}`];
  if (cpuWorkMap[`cpu-${playerId}`]) {
    clearTimeout(cpuWorkMap[`cpu-${playerId}`]);
  }
  if (Number(cpuLevel)) {
    makeCPU(playerId, cpuLevel);
  }
}

const cloneBoard = (boardState) => {
  return [...boardState.map(a => ([...a]))]
}

let cpuOn;
const cpuWorkMap = {};
const makeCPU = (playerId, level) => {
  const cpuMoveQueue = [];
  const rotateCells = playerId === 1 ? rotateP1 : rotateP2;
  const updateCursor = playerId === 1 ? updateCursorP1 : updateCursorP2;
  const getCursorPos = playerId === 1 ? getCursorP1 : getCursorP2;

  function cpuOn() {
    if (paused || endGame || startTime < 0) {
      cpuWorkMap[`cpu-${playerId}`] = setTimeout(cpuOn, 1000)
      return;
    }
    if (cpuMoveQueue.length > 0) {
      cpuWorkMap[`cpu-${playerId}`] = setTimeout(() => {
        const { x, y } = getCursorPos();
        const desiredX = cpuMoveQueue[0].x;
        const desiredY = cpuMoveQueue[0].y;
        if (desiredX != x) {
          desiredX > x ? updateCursor(x + 1, y) : updateCursor(x - 1, y)
        } else if (cpuMoveQueue[0].y != y) {
          desiredY > y ? updateCursor(x, y + 1) : updateCursor(x, y - 1)
        } else {
          rotateCells(x, y);
          cpuMoveQueue.shift();
        }
        cpuOn();
      }, 300 / (level / 2));
    }
    if (cpuMoveQueue.length === 0) {
      cpuWorkMap[`cpu-${playerId}`] = setTimeout(() => {
        const boardState = getBoardState(playerId);
        const { score, moves } = tryBoardMoves({ cpuLevel: Math.min(Math.max(level, 3), 8), boardState }); // after level 8, just go faster
        if (score > 0) {
          moves.forEach((move) => {
            cpuMoveQueue.push(move)
          })
        }
        const boardHeatMove = tryBoardHeatMove({ cpuLevel: Math.min(Math.max(level, 3), 8), boardState }); // after level 8, just go faster
        if (score === 0 && boardHeatMove) {
          cpuMoveQueue.push(boardHeatMove.moves[0])
        }
        if (score === 0 && !boardHeatMove) {
          cpuMoveQueue.push({ x: Math.floor(Math.random() * 4), y: Math.floor(Math.random() * 4) })
        }
        cpuOn();
      }, (Math.random() + 0.5) * 500);
    }
  }

  cpuOn();
}

const getBoardState = (playerId) => {
  return [...document.querySelectorAll(`.grid.player-${playerId} > .cell`)]
    .reduce((boardState, cell) => {
      boardState[Number(cell.dataset.x)][Number(cell.dataset.y)] = cell.dataset.color;
      return boardState;
    }, [[], [], [], [], [], []]);
}

const tryBoardMoves = ({ cpuLevel, boardState, moves = [], score = 0 }) => {
  const lastMove = moves[moves.length - 1];
  let xMin = 0;
  let yMin = 0;
  let xMax = 4;
  let yMax = 4;
  if (moves.length < cpuLevel) {
    if (lastMove) {
      xMin = Math.max(lastMove.x - 1, 0);
      xMax = Math.min(lastMove.x + 1, 5);
      yMin = Math.max(lastMove.y - 1, 0);
      yMax = Math.min(lastMove.y + 1, 5);
    }
    for (let x = xMin; x < xMax; x++) {
      for (let y = yMin; y < yMax; y++) {
        const moveResult = tryMove(boardState, x, y);
        const futureMoveResult = tryBoardMoves({ cpuLevel, boardState: moveResult.newBoardState, moves: [...moves, { x, y }], score: moveResult.score });
        // checking futureMoves
        if (futureMoveResult.score > 0) {
          return futureMoveResult;
        }
        if (moveResult.score > 0) {
          return { cpuLevel, boardState: moveResult.newBoardState, moves: [...moves, { x, y }], score: moveResult.score };
        }
      }
    }
  }
  return { cpuLevel, boardState, moves, score };
}

const tryBoardHeatMove = ({ cpuLevel, boardState, moves = [], score = 0 }) => {
  const boardScore = checkBoardHeatScore(boardState);
  let maxScore = boardScore;
  let maxScoreMove = null;
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      const moveResult = tryHeatMove(boardState, x, y);
      if (moveResult.score > maxScore) {
        maxScore = moveResult.score;
        maxScoreMove = { x, y };
      }
    }
  }
  if (maxScoreMove) {
    return { cpuLevel, boardState, moves: [maxScoreMove], score };
  }
  return null;
}

const tryMove = (boardState, x, y) => {
  const newBoardState = cloneBoard(boardState);
  newBoardState[x + 1][y] = boardState[x][y];
  newBoardState[x + 1][y + 1] = boardState[x + 1][y];
  newBoardState[x][y] = boardState[x][y + 1];
  newBoardState[x][y + 1] = boardState[x + 1][y + 1];

  return { newBoardState, score: checkBoardState(newBoardState) };
}

const tryHeatMove = (boardState, x, y) => {
  const newBoardState = cloneBoard(boardState);
  newBoardState[x + 1][y] = boardState[x][y];
  newBoardState[x + 1][y + 1] = boardState[x + 1][y];
  newBoardState[x][y] = boardState[x][y + 1];
  newBoardState[x][y + 1] = boardState[x + 1][y + 1];

  return { newBoardState, score: checkBoardHeatScore(newBoardState) };
}

const checkBoardState = (boardState, score = 0) => {
  const newScore = checkBoardStateRows(boardState, score) + checkBoardStateColumns(boardState, score);
  return newScore;
}

const getBoardStateColumn = (boardState, column) => {
  let cells = [];
  for (let x = 0; x < GRID_WIDTH_SIZE; x++) {
    for (let y = 0; y < GRID_HEIGHT_SIZE; y++) {
      if (x === column) {
        cells.push(boardState[x][y]);
      }
    }
  }
  return cells;
}

const getBoardStateRow = (boardState, row) => {
  let cells = [];
  for (let x = 0; x < GRID_WIDTH_SIZE; x++) {
    for (let y = 0; y < GRID_HEIGHT_SIZE; y++) {
      if (y === row) {
        cells.push(boardState[x][y]);
      }
    }
  }
  return cells;
}

const checkBoardHeatScore = (checkedBoardState) => {
  let score = 0;
  for (let i = 0; i < checkedBoardState.length; i++) {
    const rowScore = 4 / (new Set(getBoardStateRow(checkedBoardState, i)).size)
    const columnScore = 4 / (new Set(getBoardStateColumn(checkedBoardState, i)).size)
    if (rowScore === 4 || columnScore === 4) {
      return Infinity;
    }
    score += rowScore * rowScore;
    score += columnScore * columnScore;
  }
  return score;
}

const checkBoardStateRows = (boardState, score) => {
  for (let i = 0; i < GRID_WIDTH_SIZE; i++) {
    let color = 'UNREGISTERED';
    for (let j = 0; j < GRID_HEIGHT_SIZE; j++) {
      const cellColor = boardState[i][j];
      if (!cellColor) {
        continue;
      }
      if (color === 'UNREGISTERED') {
        color = cellColor;
      }
      if (color !== cellColor) {
        color = null;
      }
    }
    if (color && color !== 'UNREGISTERED') {
      const newBoardState = cloneBoard(boardState);
      for (let n = 0; n < GRID_WIDTH_SIZE; n++) {
        delete newBoardState[i][n];
      }
      return checkBoardState(newBoardState, score + 1);
    }
  }
  return score;
}

const checkBoardStateColumns = (boardState, score) => {
  for (let i = 0; i < GRID_WIDTH_SIZE; i++) {
    let color = 'UNREGISTERED';
    for (let j = 0; j < GRID_HEIGHT_SIZE; j++) {
      const cellColor = boardState[j][i];
      if (!cellColor) {
        continue;
      }
      if (color === 'UNREGISTERED') {
        color = cellColor;
      }
      if (color !== cellColor) {
        color = null;
      }
    }
    if (color && color !== 'UNREGISTERED') {
      const newBoardState = cloneBoard(boardState);
      for (let n = 0; n < GRID_WIDTH_SIZE; n++) {
        delete newBoardState[n][i];
      }
      return checkBoardState(newBoardState, score + 1);
    }
  }
  return score;
}

checkForCPU(1);
checkForCPU(2); 
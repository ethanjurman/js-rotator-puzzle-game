const checkForCPU = (playerId) => {
  const searchParams = new URLSearchParams(window.location.search);
  const cpuLevel = searchParams.get(`cpu${playerId}`);
  if (Number(cpuLevel)) {
    makeCPU(playerId, cpuLevel);
  }
}

const cloneBoard = (boardState) => {
  return boardState.map(a => { return { ...a } })
}

let cpuOn;
const makeCPU = (playerId, level) => {
  const rotateCells = playerId === 1 ? rotateP1 : rotateP2;
  cpuOn = setInterval(() => {
    if (paused || endGame) {
      return;
    }
    const boardState = getBoardState(playerId);
    const { score, moves } = tryBoardMoves({ cpuLevel: level, boardState });
    if (score > 0) {
      moves.forEach((move, index) => {
        setTimeout(() => rotateCells(move.x, move.y), 150 * index)
      })
    }
    if (score === 0) {
      rotateCells(Math.floor(Math.random() * 5), Math.floor(Math.random() * 5));
    }
  }, 1500)
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
  let xMax = 5;
  let yMax = 5;
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
        if (moveResult.score > 0) {
          return { cpuLevel, boardState: moveResult.newBoardState, moves: [...moves, { x, y }], score: moveResult.score };
        }
        // checking futureMoves
        const futureMoveResult = tryBoardMoves({ cpuLevel, boardState: moveResult.newBoardState, moves: [...moves, { x, y }], score: moveResult.score });
        if (futureMoveResult.score > 0) {
          return futureMoveResult;
        }
      }
    }
  }

  return { cpuLevel, boardState, moves, score };
}

const tryMove = (boardState, x, y) => {
  const newBoardState = cloneBoard(boardState);
  newBoardState[x + 1][y] = boardState[x][y];
  newBoardState[x + 1][y + 1] = boardState[x + 1][y];
  newBoardState[x][y] = boardState[x][y + 1];
  newBoardState[x][y + 1] = boardState[x + 1][y + 1];

  return { newBoardState, score: checkBoardState(newBoardState) };
}

const checkBoardState = (boardState, score = 0) => {
  const newScore = checkBoardStateRows(boardState, score) + checkBoardStateColumns(boardState, score);
  return newScore;
}

const checkBoardHeatScore = (boardState) => {
  let score = 0;
  for (let i = 0; i < boardState.length; i++) {
    for (let j = 0; j < boardState[i].length; j++) {
      if (i != 0) {
        score += boardState[i][j] == boardState[i - 1][j];
      }
      if (j != 0) {
        score += boardState[i][j] == boardState[i][j - 1];
      }
    }
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
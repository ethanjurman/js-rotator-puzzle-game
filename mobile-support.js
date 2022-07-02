let touchStartX = 0
let touchEndX = 0
let touchStartY = 0
let touchEndY = 0
    
function checkDirection() {
  if (endGame) {
    return;
  }
  const yDiff = Math.abs(touchStartY - touchEndY);
  const xDiff = Math.abs(touchStartX - touchEndX);
  if (xDiff > yDiff && xDiff > 20) {
    if (touchEndX < touchStartX) {
      // SWIPED LEFT
      cursorPos = {x: Math.max(cursorPos.x - 1, 0), y: cursorPos.y}
    }
    if (touchEndX > touchStartX) {
      // SWIPED RIGHT
      cursorPos = {x: Math.min(cursorPos.x + 1, GRID_WIDTH_SIZE - 2), y: cursorPos.y}
    }
  }
  if (xDiff < yDiff && yDiff > 20) {
    if (touchEndY < touchStartY) {
      // SWIPED UP
      cursorPos = {x: cursorPos.x, y: Math.max(cursorPos.y - 1, 0)}
    }
    if (touchEndY > touchStartY) {
      // SWIPED DOWN
      cursorPos = {x: cursorPos.x, y: Math.min(cursorPos.y + 1, GRID_HEIGHT_SIZE - 2)}
    }
  }
  updateCursor();
}

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX
  touchStartY = e.changedTouches[0].screenY
})

document.addEventListener('touchend', e => {
  if (endGame) {
    return;
  }
  touchEndX = e.changedTouches[0].screenX
  touchEndY = e.changedTouches[0].screenY
  checkDirection()
})

let clickStatus = false;
let timeout;
document.addEventListener('click', () => {
  if (endGame) {
    return;
  }
  // time to check if we've clicked recently enough
  if (clickStatus === true) {
    clickStatus = false;
    rotateCells();
    clearTimeout(timeout);
  }
  clickStatus = true;

  // reset click status after a set amount of time
  timeout = setTimeout(() => {
    clickStatus = false;
  }, 500);
});
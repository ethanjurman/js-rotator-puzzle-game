let touchStartX = 0
let touchEndX = 0
let touchStartY = 0
let touchEndY = 0
const cursor = document.querySelector('.cursor');
    
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

document.addEventListener('touchstart', evt => {
  touchStartX = evt.changedTouches[0].clientX;
  touchStartY = evt.changedTouches[0].clientY;
  // const cursor = document.querySelector('.cursor');
  cursor.style = `left: ${touchStartX - 75}px; top: ${touchStartY - 75}px; position: fixed;`
})

document.addEventListener('touchmove', evt => {
  touchMoveX = evt.changedTouches[0].clientX;
  touchMoveY = evt.changedTouches[0].clientY;
  // const cursor = document.querySelector('.cursor');
  cursor.style = `left: ${touchMoveX - 75}px; top: ${touchMoveY - 75}px; position: fixed;`
})

document.addEventListener('touchend', evt => {
  if (endGame) {
    return;
  }
  touchEndX = evt.changedTouches[0].clientX;
  touchEndY = evt.changedTouches[0].clientY;
  const targetElement = document.elementFromPoint(touchEndX, touchEndY);
  if (targetElement.classList.contains('clickPoint')) {
    cursorPos = {x: Number(targetElement.dataset.clickX), y: Number(targetElement.dataset.clickY)}
    updateCursor();
    rotateCells();
  } else {
    rotateCells();
  }
})

let clickStatus = false;
let timeout;

// document.addEventListener('click', (evt) => {
//   if (endGame) {
//     return;
//   }
//   if (evt.target.classList.contains('clickPoint')) {
//     cursorPos = {x: Number(evt.target.dataset.clickX), y: Number(evt.target.dataset.clickY)}
//     updateCursor();
//     rotateCells();
//   } else {
//     rotateCells();
//   }
// });

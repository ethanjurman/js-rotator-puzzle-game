let touchStartX = 0
let touchEndX = 0
let touchStartY = 0
let touchEndY = 0
const cursor = document.querySelector('.cursor');

document.addEventListener('touchstart', evt => {
  touchStartX = evt.changedTouches[0].clientX;
  touchStartY = evt.changedTouches[0].clientY;
  cursor.style = `left: ${touchStartX - 75}px; top: ${touchStartY - 75}px; position: fixed;`
})

document.addEventListener('touchmove', evt => {
  touchMoveX = evt.changedTouches[0].clientX;
  touchMoveY = evt.changedTouches[0].clientY;
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
    cursorPos = { x: Number(targetElement.dataset.clickX), y: Number(targetElement.dataset.clickY) }
    updateCursor();
    rotateCells();
  }
})

let clickStatus = false;
let timeout;

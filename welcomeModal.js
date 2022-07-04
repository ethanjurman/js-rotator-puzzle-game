const welcomeModal = `
  <div class="modal">
    <div class="super-title">Welcome to...</div>
    <div class="title">
    <span class="title-block">J</span>
    <span class="title-block">S</span>
    <span class="title-block spacer"></span>
    <span class="title-block">R</span>
    <span class="title-block">O</span>
    <span class="title-block">T</span>
    <span class="title-block">A</span>
    <span class="title-block">T</span>
    <span class="title-block">O</span>
    <span class="title-block">R</span>
    </div>
    <div class="content" onscroll="scrollModal()">
      <p>JS ROTATOR is a fully vanilla JavaScript game inspired by games like Yoshis Cookie & Tetris.</p>
      <p>Move the cursor by pushing WASD or UP, DOWN, LEFT or RIGHT on the keyboard. Rotate a section of 4 blocks by pushing space.</p>
      <img src="./gifs/rotate.gif">
      <p>Match an entire row or column of blocks with the same color to get points.</p>
      <img src="./gifs/row-clear.gif">
      <img src="./gifs/column-clear.gif">
      <p>Get a high score before the time runs out!</p>
      <img src="./gifs/combo.gif">
    </div>
    <div class="start-button" onclick="closeWelcomeModal()">Click Here to Start!</div>
  </div>
`

const createWelcomeModal = () => {
  const modal = document.createElement('div');
  modal.innerHTML = welcomeModal;
  document.body.appendChild(modal);
}

const showTitle = () => {
  document.querySelectorAll('.title-block').forEach((block, index) => {
    setTimeout(() => {
      block.classList.add(COLORS[Math.floor(Math.random() * 4)])
      block.classList.add('title-block-appear')
    }, 50 * index)
  })
}

const closeWelcomeModal = () => {
  const modal = document.querySelector('.modal');
  modal.classList.add('remove-modal');
  setTimeout(() => {
    modal.remove();
  }, 500)
}

const scrollModal = () => {
  const content = document.querySelector('.content');
  content.style = `box-shadow: inset 0px -14px 16px -18px black, inset 0px ${Math.min(content.scrollTop, 14)}px 16px -18px black;`
}

createWelcomeModal();
showTitle();
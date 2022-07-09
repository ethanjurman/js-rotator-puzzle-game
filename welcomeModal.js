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
    ${window.location.href.includes('twoPlayer') ?
    `<div class="title">
      <span class="title-block">V</span>
      <span class="title-block">E</span>
      <span class="title-block">R</span>
      <span class="title-block">S</span>
      <span class="title-block">U</span>
      <span class="title-block">S</span>
    </div>` : ''
  }
    <div class="content" onscroll="scrollModal()">
      <p><b>JS ROTATOR</b> is a fully vanilla JavaScript game inspired by games like Yoshi's Cookie & Tetris.<br/>Made by Ethan Jurman.</p>
      ${window.location.href.includes('twoPlayer')
    ? `<p>Move the cursor by pushing <span style="color:F4D06F">WASD</span> (for player 1)<br /> and <span style="color:F4D06F">UP, DOWN, LEFT and RIGHT</span> (for player 2).<br />Rotate a section of 4 blocks by pushing <span style="color:F4D06F">space</span> (for player 1) and <span style="color:F4D06F">Z</span> (for player 2).</p>`
    : `<p>Move the cursor by pushing <span style="color:F4D06F">WASD</span> or <span style="color:F4D06F">UP, DOWN, LEFT and RIGHT</span> on the keyboard.<br />Rotate a section of 4 blocks by pushing <span style="color:F4D06F">space<span> or <span style="color:F4D06F">Z</span>.</p>`}
      ${window.location.href.includes('twoPlayer') ? '' : `<p>On mobile & touch devices, <span style="color:F4D06F">tap on the screen</span> inbetween the four blocks you want to rotate.</p>`}
      <img src="./gifs/rotate.gif">
      <p>Match an entire row or column of blocks with the same color to get points and extra time.</p>
      <img src="./gifs/row-clear.gif">
      <img src="./gifs/column-clear.gif">
      <p>Get a high score before the time runs out! Use combos by chaining row and column clears together to get lots of points.<br/>Time starts after you rotate your first piece.</p>
      <img src="./gifs/combo.gif">
      <p>Push <span style="color:F4D06F">Escape</span> or <span onclick="closeWelcomeModal(); setTimeout(() => createConfigureModal(), 500)" style="color:F4D06F">click here for configuration.</span></p>
    </div>
    <div class="start-button" onclick="closeWelcomeModal()">Click Here to Start!</div>
    ${window.location.href.includes('twoPlayer')
    ? `<a href="./index.html"><div class="start-button">Go to Single Player</div></a>`
    : `<a href="./twoPlayer.html"><div class="start-button">Go to Two Player</div></a>`
  }

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
  const bottomShadow = Math.max(content.scrollTop - (content.scrollHeight - content.clientHeight), -14);
  const topShadow = Math.min(content.scrollTop, 14);
  content.style = `box-shadow: inset 0px ${bottomShadow}px 16px -18px black, inset 0px ${topShadow}px 16px -18px black;`
}

if (!window.location.search.includes('welcomeModal=false')) {
  createWelcomeModal();
  showTitle();
}
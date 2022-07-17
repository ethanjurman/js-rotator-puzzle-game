let config;
try {
  config = {
    "config-p1-up": localStorage.getItem("config-p1-up") || "w",
    "config-p1-down": localStorage.getItem("config-p1-down") || "s",
    "config-p1-right": localStorage.getItem("config-p1-right") || "a",
    "config-p1-left": localStorage.getItem("config-p1-left") || "d",
    "config-p1-rotate": localStorage.getItem("config-p1-rotate") || " ",
    "config-p2-up": localStorage.getItem("config-p2-up") || "ArrowUp",
    "config-p2-down": localStorage.getItem("config-p2-down") || "ArrowDown",
    "config-p2-right": localStorage.getItem("config-p2-right") || "ArrowLeft",
    "config-p2-left": localStorage.getItem("config-p2-left") || "ArrowRight",
    "config-p2-rotate": localStorage.getItem("config-p2-rotate") || "z",
    "config-color-blind": localStorage.getItem("config-color-blind") || "0",
  }
  const root = document.documentElement;
  root.style.setProperty('--color-blind-mode', config["config-color-blind"]);
} catch (e) {
  config = {
    "config-p1-up": "w",
    "config-p1-down": "s",
    "config-p1-right": "a",
    "config-p1-left": "d",
    "config-p1-rotate": " ",
    "config-p2-up": "ArrowUp",
    "config-p2-down": "ArrowDown",
    "config-p2-right": "ArrowLeft",
    "config-p2-left": "ArrowRight",
    "config-p2-rotate": "z",
    "config-color-blind": "0",
  }
}

const configModal = () => `
  <div class="modal show-modal config-modal">
    <div class="title" style="display:flex; justify-content: space-between; margin-bottom: 30px">
    ${[..."Settings"].map(c => `<span class="title-block" style="margin-right: 5px">${c}</span>`).join("")}
    </div>
    <div class="config-color-blind">Color Blind <input type="checkbox" id="config-color-blind" ${config['config-color-blind'] != '0' ? 'checked' : ''} />
      <div class="cellfake color1" style="position: inherit;"></div>
      <div class="cellfake color2" style="position: inherit;"></div>
      <div class="cellfake color3" style="position: inherit;"></div>
      <div class="cellfake color4" style="position: inherit;"></div>
    </div>
    <div class="config-sound">Sound <input type="range" id="config-sound" min="0" max="1" step="0.1" value=${localStorage.getItem('config-sound') || 0.5} /></div>
    <div class="config">
      <div class="config-p1" style="margin-right: 5px">
        <div>PLAYER 1</div>
        <div>UP: <input onkeyup="configItem('config-p1-up')(event)" list="keyboard-buttons" id="config-p1-up" value="${config["config-p1-up"]}" /></div>
        <div>DOWN: <input onkeyup="configItem('config-p1-down')(event)" list="keyboard-buttons" id="config-p1-down" value="${config["config-p1-down"]}" /></div>
        <div>LEFT: <input onkeyup="configItem('config-p1-right')(event)" list="keyboard-buttons" id="config-p1-right" value="${config["config-p1-right"]}" /></div>
        <div>RIGHT: <input onkeyup="configItem('config-p1-left')(event)" list="keyboard-buttons" id="config-p1-left" value="${config["config-p1-left"]}" /></div>
        <div>ROTATE: <input onkeyup="configItem('config-p1-rotate')(event)" list="keyboard-buttons" id="config-p1-rotate" value${config["config-p1-rota"]}" /></div>
        <div class="start-button" onclick="closeConfigureModal()" style="margin-top: 30px">Continue</div>
      </div>
      <div class="config-p2" style="margin-left: 5px">
        <div>PLAYER 2</div>
        <div>UP: <input onkeyup="configItem('config-p2-up')(event)" list="keyboard-buttons" id="config-p2-up" value="${config["config-p2-up"]}" /></div>
        <div>DOWN: <input onkeyup="configItem('config-p2-down')(event)" list="keyboard-buttons" id="config-p2-down" value="${config["config-p2-down"]}" /></div>
        <div>LEFT: <input onkeyup="configItem('config-p2-right')(event)" list="keyboard-buttons" id="config-p2-right" value="${config["config-p2-right"]}" /></div>
        <div>RIGHT: <input onkeyup="configItem('config-p2-left')(event)" list="keyboard-buttons" id="config-p2-left" value="${config["config-p2-left"]}" /></div>
        <div>ROTATE: <input onkeyup="configItem('config-p2-rotate')(event)" list="keyboard-buttons" id="config-p2-rotate" value="${config["config-p2-rotate"]}" /></div>
        <div class="endless-button" onclick="restart()" style="margin-top: 30px">Restart Match</div>
      </div>
    <div>
  </div>
`

const createConfigureModal = () => {
  pauseGame();
  try { socketPause(); } catch (e) { /* ignore */ }
  const modal = document.createElement('div');
  modal.innerHTML = configModal();
  document.body.appendChild(modal);
  modalEle = document.querySelector('.modal');
  setTimeout(() => modalEle.classList.remove('show-modal'), 100);
  setTimeout(() => showTitle(), 500);
  const soundEle = document.querySelector('#config-sound');
  soundEle.addEventListener('change', (evt) => {
    setAudioVolumeAndSettings(evt.target.value)
    try {
      localStorage.setItem('config-sound', evt.target.value);
    } catch (e) {
      // do nothing
    }
  })
  const colorBlindEle = document.querySelector('#config-color-blind');
  colorBlindEle.addEventListener('change', (evt) => {
    try {
      const root = document.documentElement;
      root.style.setProperty('--color-blind-mode', evt.target.checked ? 1 : 0);
      localStorage.setItem('config-color-blind', evt.target.checked ? 1 : 0);
      config['config-color-blind'] = evt.target.checked ? 1 : 0;
    } catch (e) {
      // do nothing
    }
  })
}

const closeConfigureModal = () => {
  unpauseGame();
  try { socketUnpause(); } catch (e) { /* ignore */ }
  modalEle = document.querySelector('.modal');
  modalEle.classList.add('show-modal');
  setTimeout(() => { modalEle.remove() }, 500);
}

const configItem = (key) => (evt) => {
  if (evt.key == "Escape") { return; }
  const itemInput = document.getElementById(key);
  if (itemInput && evt.key) {
    config[key] = evt.key;
    localStorage.setItem(key, evt.key);
    itemInput.value = evt.key;
  }
}

document.addEventListener('keydown', (evt) => {
  const modalEle = document.querySelector('.modal');
  if (evt.key == "Escape" && !modalEle) {
    createConfigureModal();
  }
  if (evt.key == "Escape" && modalEle) {
    closeConfigureModal();
  }
})

const restart = () => {
  window.location.href = "";
}

const createConfigModalButton = () => {
  const modalButton = document.createElement('div');
  modalButton.classList.add('config-modal-button');
  modalButton.textContent = '⚙️';
  modalButton.onclick = () => {
    const modalEle = document.querySelector('.modal');
    if (modalEle && modalEle.classList.contains('config-modal')) {
      closeConfigureModal();
      return;
    }
    if (modalEle) {
      modalEle.remove();
    }
    createConfigureModal();
  };
  document.body.appendChild(modalButton);
}

createConfigModalButton();
const checkForCPUConfig = (playerId) => {
  const searchParams = new URLSearchParams(window.location.search);
  const cpuLevel = searchParams.get(`cpu${playerId}`);
  return Number(cpuLevel);
}

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
    "config-cpu-1": checkForCPUConfig(1) || localStorage.getItem("config-cpu-1") || "0",
    "config-cpu-2": checkForCPUConfig(2) || localStorage.getItem("config-cpu-2") || "0",
    "config-color-theme": localStorage.getItem("config-color-theme"),
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
    "config-cpu-1": checkForCPUConfig(1) || "0",
    "config-cpu-2": checkForCPUConfig(2) || "0",
    "config-color-theme": "color-theme-1",
  }
}

const configModal = () => `
  <div class="modal show-modal config-modal">
    <div class="title" style="display:flex; justify-content: center; margin-bottom: 30px">
    ${[..."Settings"].map(c => `<span class="title-block" style="margin-right: 5px">${c}</span>`).join("")}
    </div>
    <div class="config-color-theme">
    <span class="config-label">Color Theme</span><br />
    <input type="radio" id="color-theme-1" name="age" ${config['config-color-theme'] === 'color-theme-1' ? 'checked' : ''} onclick="updateColorTheme('color-theme-1')">
    <label for="color-theme-1">Standard</label>
    <input type="radio" id="color-theme-4" name="age" ${config['config-color-theme'] === 'color-theme-4' ? 'checked' : ''} onclick="updateColorTheme('color-theme-4')">
    <label for="color-theme-4">Flat</label>
    <input type="radio" id="color-theme-2" name="age" ${config['config-color-theme'] === 'color-theme-2' ? 'checked' : ''} onclick="updateColorTheme('color-theme-2')">
    <label for="color-theme-2">Puyo-Puyo</label>  
    <input type="radio" id="color-theme-3" name="age" ${config['config-color-theme'] === 'color-theme-3' ? 'checked' : ''} onclick="updateColorTheme('color-theme-3')">
    <label for="color-theme-3">Rubik's</label>
    </div>
    <div class="config-color-blind">Color Blind <input type="checkbox" id="config-color-blind" ${config['config-color-blind'] != '0' ? 'checked' : ''} />
      <div class="cellfake color1" style="position: inherit;"></div>
      <div class="cellfake color2" style="position: inherit;"></div>
      <div class="cellfake color3" style="position: inherit;"></div>
      <div class="cellfake color4" style="position: inherit;"></div>
    </div>
    <div class="config-sound">Sound <input type="range" id="config-sound" min="0" max="1" step="0.1" value=${localStorage.getItem('config-sound') || 0.5} /></div>
    <div class="instructions-button" onclick="closeConfigureModal(); createWelcomeModal()" style="margin-top: 30px">Open Instructions</div>
    <div class="config">
      <div class="config-p1" style="margin-right: 5px">
        <div>PLAYER 1</div>
        ${isTwoPlayer ? `<div class="config-cpu"><span class="config-cpu-level">CPU 1</span> <span id="cpu-1-level">(${config["config-cpu-1"] || "OFF"})</span><input type="range" id="config-cpu-1" min="0" max="11" step="1" value=${config["config-cpu-1"]} /></div>` : ''}
        <div>UP: <input onkeyup="configItem('config-p1-up')(event)" list="keyboard-buttons" id="config-p1-up" value="${config["config-p1-up"]}" /></div>
        <div>DOWN: <input onkeyup="configItem('config-p1-down')(event)" list="keyboard-buttons" id="config-p1-down" value="${config["config-p1-down"]}" /></div>
        <div>LEFT: <input onkeyup="configItem('config-p1-right')(event)" list="keyboard-buttons" id="config-p1-right" value="${config["config-p1-right"]}" /></div>
        <div>RIGHT: <input onkeyup="configItem('config-p1-left')(event)" list="keyboard-buttons" id="config-p1-left" value="${config["config-p1-left"]}" /></div>
        <div>ROTATE: <input onkeyup="configItem('config-p1-rotate')(event)" list="keyboard-buttons" id="config-p1-rotate" value${config["config-p1-rota"]}" /></div>
        <div class="start-button" onclick="closeConfigureModal()" style="margin-top: 30px">Continue</div>
      </div>
      <div class="config-p2" style="margin-left: 5px">
        <div>PLAYER 2</div>
        ${isTwoPlayer ? `<div class="config-cpu"><span class="config-cpu-level">CPU 2</span> <span id="cpu-2-level">(${config["config-cpu-2"] || "OFF"})</span><input type="range" id="config-cpu-2" min="0" max="11" step="1" value=${config["config-cpu-2"]} /></div>` : ''}
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
  if (isTwoPlayer) {
    const configCPU1 = document.querySelector('#config-cpu-1');
    configCPU1.addEventListener('input', (evt) => {
      config['config-cpu-1'] = (evt.target.value)
      document.querySelector("#cpu-1-level").innerHTML = `(${Number(config['config-cpu-1']) || 'OFF'})`;
      checkForCPU(1);
      try {
        localStorage.setItem('config-cpu-1', evt.target.value);
      } catch (e) {
        // do nothing
      }
    })
    const configCPU2 = document.querySelector('#config-cpu-2');
    configCPU2.addEventListener('input', (evt) => {
      config['config-cpu-2'] = (evt.target.value)
      document.querySelector("#cpu-2-level").innerHTML = `(${Number(config['config-cpu-2']) || 'OFF'})`;
      checkForCPU(2);
      try {
        localStorage.setItem('config-cpu-2', evt.target.value);
      } catch (e) {
        // do nothing
      }
    })
  }
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

const updateColorTheme = (theme) => {
  if (!theme) {
    theme = config['config-color-theme'] || 'color-theme-1';
  }
  config['config-color-theme'] = theme;
  document.documentElement.className = theme;
  try {
    localStorage.setItem('config-color-theme', theme);
  } catch (e) {
    // do nothing
  }
}

updateColorTheme(); // should run at start
createConfigModalButton();
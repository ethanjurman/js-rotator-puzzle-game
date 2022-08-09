const makeChainCounter = (appendItem = document.querySelector('.grid')) => {
  const chainElement = document.createElement('div');
  chainElement.classList.add('chain-counter');
  appendItem.appendChild(chainElement);
}

const showChainElement = (query = '.chain-counter') => {
  const chainElement = document.querySelector(query);
  chainElement.textContent = 'x1';
  chainElement.style.fontSize = '52px';
  chainElement.classList.remove('hide-chain-counter');
  chainElement.classList.add('show-chain-counter');
}

let hideChainTimeout;
const hideChainElement = (query = '.chain-counter') => {
  clearTimeout(hideChainTimeout);
  const chainElement = document.querySelector(query);
  chainElement.classList.add('hide-chain-counter');
  hideChainTimeout = setTimeout(() => {
    chainElement.classList.remove('hide-chain-counter');
    chainElement.classList.remove('show-chain-counter');
  }, 3000)
}

const increaseChainElement = (chainCount, query = '.chain-counter') => {
  const chainElement = document.querySelector(query);
  chainElement.classList.add('bump-chain-counter');
  chainElement.textContent = `x${chainCount}`;
  chainElement.style.fontSize = `${44 + 8 * chainCount}px`;
  setTimeout(() => chainElement.classList.remove('bump-chain-counter'), 1000)
}
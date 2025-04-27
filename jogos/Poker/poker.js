const cards = [
    { symbol: '🂡', value: 14, suit: 'Espadas' },
    { symbol: '🂢', value: 2, suit: 'Espadas' },
    { symbol: '🂣', value: 3, suit: 'Espadas' },
    { symbol: '🂤', value: 4, suit: 'Espadas' },
    { symbol: '🂥', value: 5, suit: 'Espadas' },
    { symbol: '🂦', value: 6, suit: 'Espadas' },
    { symbol: '🂧', value: 7, suit: 'Espadas' },
    { symbol: '🂨', value: 8, suit: 'Espadas' },
    { symbol: '🂩', value: 9, suit: 'Espadas' },
    { symbol: '🂪', value: 10, suit: 'Espadas' },
    { symbol: '🂫', value: 11, suit: 'Espadas' },
    { symbol: '🂭', value: 12, suit: 'Espadas' },
    { symbol: '🂮', value: 13, suit: 'Espadas' },
  
    { symbol: '🂱', value: 14, suit: 'Copas' },
    { symbol: '🂲', value: 2, suit: 'Copas' },
    { symbol: '🂳', value: 3, suit: 'Copas' },
    { symbol: '🂴', value: 4, suit: 'Copas' },
    { symbol: '🂵', value: 5, suit: 'Copas' },
    { symbol: '🂶', value: 6, suit: 'Copas' },
    { symbol: '🂷', value: 7, suit: 'Copas' },
    { symbol: '🂸', value: 8, suit: 'Copas' },
    { symbol: '🂹', value: 9, suit: 'Copas' },
    { symbol: '🂺', value: 10, suit: 'Copas' },
    { symbol: '🂻', value: 11, suit: 'Copas' },
    { symbol: '🂽', value: 12, suit: 'Copas' },
    { symbol: '🂾', value: 13, suit: 'Copas' }
  ];
  
  let playerHand = [];
  const playerHandDiv = document.getElementById('player-hand');
  const dealButton = document.getElementById('deal-button');
  const drawButton = document.getElementById('draw-button');
  const resultDiv = document.getElementById('result');
  
  function shuffle(deck) {
    return deck.sort(() => Math.random() - 0.5);
  }
  
  function dealHand() {
    const deck = shuffle([...cards]);
    playerHand = deck.slice(0, 5);
    renderHand();
    dealButton.style.display = 'none';
    drawButton.style.display = 'inline-block';
    resultDiv.textContent = '';
  }
  
  function renderHand() {
    playerHandDiv.innerHTML = '';
    playerHand.forEach((card, index) => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');
      cardDiv.textContent = card.symbol;
      cardDiv.addEventListener('click', () => toggleSelect(cardDiv, index));
      playerHandDiv.appendChild(cardDiv);
    });
  }
  
  function toggleSelect(cardDiv, index) {
    cardDiv.classList.toggle('selected');
    playerHand[index].selected = !playerHand[index].selected;
  }
  
  function drawCards() {
    const deck = shuffle([...cards]);
    let newCards = deck.filter(c => !playerHand.some(h => h.symbol === c.symbol));
    
    playerHand = playerHand.map(card => {
      if (card.selected) return card;
      return newCards.pop();
    });
  
    renderHand();
    drawButton.style.display = 'none';
    dealButton.style.display = 'inline-block';
    checkHand();
  }
  
  function checkHand() {
    const values = playerHand.map(card => card.value).sort((a, b) => a - b);
    const suits = playerHand.map(card => card.suit);
  
    const counts = {};
    values.forEach(v => counts[v] = (counts[v] || 0) + 1);
  
    const uniqueValues = Object.keys(counts).length;
    const hasPair = Object.values(counts).includes(2);
    const hasThree = Object.values(counts).includes(3);
    const hasFour = Object.values(counts).includes(4);
  
    const isFlush = suits.every(s => s === suits[0]);
    const isStraight = values.every((v, i, arr) => i === 0 || v === arr[i-1] + 1);
  
    let result = "Nada... tente de novo! 🌸";
  
    if (isFlush && isStraight) result = "Straight Flush!! 💖";
    else if (hasFour) result = "Quadra! ✨";
    else if (hasThree && hasPair) result = "Full House!! 💕";
    else if (isFlush) result = "Flush! 🌈";
    else if (isStraight) result = "Sequência! 🎀";
    else if (hasThree) result = "Trinca! 💖";
    else if (hasPair && uniqueValues === 3) result = "Dois Pares! 🌸";
    else if (hasPair) result = "Um Par! 🎀";
  
    resultDiv.textContent = result;
  }
  
  dealButton.addEventListener('click', dealHand);
  drawButton.addEventListener('click', drawCards);
  
  let coins = 100;
const coinsDiv = document.getElementById('coins');

function updateCoins() {
  coinsDiv.textContent = `💰 Moedas: ${coins}`;
}

function dealHand() {
  if (coins < 5) {
    resultDiv.textContent = "Você ficou sem moedinhas! 🥺 Clique para ganhar +50!";
    dealButton.textContent = "Ganhar Moedas";
    dealButton.onclick = () => {
      coins += 50;
      updateCoins();
      dealButton.textContent = "Distribuir Cartas";
      dealButton.onclick = dealHand;
      resultDiv.textContent = "";
    };
    return;
  }

  coins -= 5;
  updateCoins();

  const deck = shuffle([...cards]);
  playerHand = deck.slice(0, 5);
  renderHand();
  dealButton.style.display = 'none';
  drawButton.style.display = 'inline-block';
  resultDiv.textContent = '';
}

function checkHand() {
  const values = playerHand.map(card => card.value).sort((a, b) => a - b);
  const suits = playerHand.map(card => card.suit);

  const counts = {};
  values.forEach(v => counts[v] = (counts[v] || 0) + 1);

  const uniqueValues = Object.keys(counts).length;
  const hasPair = Object.values(counts).includes(2);
  const hasThree = Object.values(counts).includes(3);
  const hasFour = Object.values(counts).includes(4);

  const isFlush = suits.every(s => s === suits[0]);
  const isStraight = values.every((v, i, arr) => i === 0 || v === arr[i-1] + 1);

  let result = "Nada... tente de novo! 🌸";
  let reward = 0;

  if (isFlush && isStraight) {
    result = "Straight Flush!! 💖 +100 moedas!";
    reward = 100;
  } else if (hasFour) {
    result = "Quadra! ✨ +75 moedas!";
    reward = 75;
  } else if (hasThree && hasPair) {
    result = "Full House!! 💕 +50 moedas!";
    reward = 50;
  } else if (isFlush) {
    result = "Flush! 🌈 +40 moedas!";
    reward = 40;
  } else if (isStraight) {
    result = "Sequência! 🎀 +30 moedas!";
    reward = 30;
  } else if (hasThree) {
    result = "Trinca! 💖 +20 moedas!";
    reward = 20;
  } else if (hasPair && uniqueValues === 3) {
    result = "Dois Pares! 🌸 +15 moedas!";
    reward = 15;
  } else if (hasPair) {
    result = "Um Par! 🎀 +10 moedas!";
    reward = 10;
  }

  coins += reward;
  updateCoins();
  resultDiv.textContent = result;
}
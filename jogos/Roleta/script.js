const symbols = [
  { name: "Astolfo", img: "imagens/Astolfo.png" },
  { name: "Felix", img: "imagens/felix.png" },
  { name: "Haku", img: "imagens/Haku.png" },
  { name: "Hideri", img: "imagens/Hideri.png" },
  { name: "Nagisa", img: "imagens/nagisa.png" },
  { name: "Rimuru", img: "imagens/rimuru.png" },
];

let coins = 1000;
let plays = 0;
let lineWins = 0;
let jackpots = 0;
let losses = 0;
let currentChance = 70;
let currentBet = 50;

const clickSound = document.getElementById("click-sound");
const winSound = document.getElementById("win-sound");

// 💾 Carrega dados do localStorage
function loadGameData() {
  const savedData = localStorage.getItem("slotGameData");
  if (savedData) {
    const data = JSON.parse(savedData);
    //coins = data.coins ?? 1000;
    plays = data.plays ?? 0;
    lineWins = data.lineWins ?? 0;
    jackpots = data.jackpots ?? 0;
    losses = data.losses ?? 0;
  }
}

// 💾 Salva dados no localStorage
function saveGameData() {
  const data = {
    coins,
    plays,
    lineWins,
    jackpots,
    losses
  };
  localStorage.setItem("slotGameData", JSON.stringify(data));
}

function playConfetti() {
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#ffb3ef', '#b3d1ff', '#ffffff']
  });
}

function updateCoins() {
  document.getElementById("coins").textContent = `Moedas: ${coins} 🪙`;
}

function updateStatsDisplay() {
  document.getElementById("plays").textContent = plays;
  document.getElementById("lineWins").textContent = lineWins;
  document.getElementById("jackpots").textContent = jackpots;
  document.getElementById("losses").textContent = losses;
}

function setChance(chance, bet) {
  currentChance = chance;
  currentBet = bet;
  spin(); // Já gira assim que escolhe!
}
function spin() {
  const result = document.getElementById("result");

  if (coins < currentBet) {
    result.textContent = "❌ Sem moedas suficientes!";
    return;
  }

  clickSound.play();
  coins -= currentBet;
  updateCoins();
  result.textContent = "";

  const reels = [
    document.getElementById("r1"),
    document.getElementById("r2"),
    document.getElementById("r3"),
    document.getElementById("r4"),
    document.getElementById("r5"),
    document.getElementById("r6"),
  ];

  const values = [];

  setTimeout(() => {
    for (let i = 0; i < reels.length; i++) {
      let symbol;
      // Aplica chance de vitória
      if (Math.random() * 100 < currentChance) {
        // Mais chance de sair igual nos três primeiros
        symbol = symbols[Math.floor(Math.random() * symbols.length)];
      } else {
        symbol = symbols[Math.floor(Math.random() * symbols.length)];
      }
      reels[i].innerHTML = `<img src="${symbol.img}" class="reel-img">`;
      values.push(symbol.name);
    }

    plays++;
    let isJackpot = false;
    let isLineWin = false;

    const container = document.querySelector(".reel-container");
    const allEqual = values.every(v => v === values[0]);

    if (allEqual) {
      result.textContent = `🌈 JACKPOT! Você ganhou ${currentBet * 20} moedas! ✨`;
      coins += currentBet * 200;
      jackpots++;
      winSound.play();
      playConfetti();
      container.classList.add("glow");
    } else if (
      values.slice(0, 3).every(v => v === values[0]) ||
      values.slice(3, 6).every(v => v === values[3])
    ) {
      result.textContent = `🎉 Linha igual! +${currentBet * 2} moedas!`;
      coins += currentBet * 2;
      lineWins++;
      winSound.play();
      playConfetti();
      container.classList.add("glow");
    } else {
      result.textContent = "😢 Tente novamente!";
      losses++;
    }

    updateCoins();
    updateStatsDisplay();
    saveGameData();
    checkAchievements();

    setTimeout(() => {
      container.classList.remove("glow");
    }, 2000);
  }, 800);
}

const achievements = [
  { id: 'firstPlay', name: 'Primeira Jogada', desc: 'Dê seu primeiro spin', condition: () => plays >= 1 },

  // 🆕 Conquistas de número de giros
  { id: 'tenPlays', name: 'Femboy iniciante', desc: 'Jogue 100 vezes', condition: () => plays >= 100 },
  { id: 'tenPlays', name: 'Femboy intermediário', desc: 'Jogue 500 vezes', condition: () => plays >= 500 },
  { id: 'mestreFemboy', name: 'Mestre Femboy', desc: 'Alcance 1000 giros', condition: () => plays >= 1000 },
  { id: 'hyperFemboy', name: 'Hyper Femboy', desc: 'Alcance 2000 giros', condition: () => plays >= 2000 },
  { id: 'ultraMasterFemboy', name: 'Ultra Master Femboy', desc: 'Alcance 10000 giros', condition: () => plays >= 10000 },

  // 🆕 Conquistas de jackpot por personagem
  { id: 'firstLineWin', name: 'Linha Premiada', desc: 'Ganhe sua primeira linha', condition: () => lineWins >= 1 },
  { id: 'firstJackpot', name: 'JACKPOT!', desc: 'Ganhe seu primeiro jackpot', condition: () => jackpots >= 1 },
  { id: 'jackpotAstolfo', name: 'Jackpot de Astolfo', desc: 'Jackpot com Astolfo', condition: () => lastJackpotWas('Astolfo') },
  { id: 'jackpotFelix', name: 'Jackpot de Felix', desc: 'Jackpot com Felix', condition: () => lastJackpotWas('Felix') },
  { id: 'jackpotHaku', name: 'Jackpot de Haku', desc: 'Jackpot com Haku', condition: () => lastJackpotWas('Haku') },
  { id: 'jackpotHideri', name: 'Jackpot de Hideri', desc: 'Jackpot com Hideri', condition: () => lastJackpotWas('Hideri') },
  { id: 'jackpotNagisa', name: 'Jackpot de Nagisa', desc: 'Jackpot com Nagisa', condition: () => lastJackpotWas('Nagisa') },
  { id: 'jackpotRimuru', name: 'Jackpot de Rimuru', desc: 'Jackpot com Rimuru', condition: () => lastJackpotWas('Rimuru') },
];

function lastLineIs(symbolsArray) {
  const reels = [
    document.getElementById("r1"),
    document.getElementById("r2"),
    document.getElementById("r3"),
  ];
  return reels.every(reel => reel.innerHTML.includes(symbolsArray[0]));
}

function lastJackpotWas(symbolName) {
  const reels = [
    document.getElementById("r1"),
    document.getElementById("r2"),
    document.getElementById("r3"),
    document.getElementById("r4"),
    document.getElementById("r5"),
    document.getElementById("r6"),
  ];
  return reels.every(reel => reel.innerHTML.includes(symbolName));
}

function getUnlockedAchievements() {
  return JSON.parse(localStorage.getItem("unlockedAchievements") || "[]");
}

function unlockAchievement(id) {
  const unlocked = getUnlockedAchievements();
  if (!unlocked.includes(id)) {
    unlocked.push(id);
    localStorage.setItem("unlockedAchievements", JSON.stringify(unlocked));
    showAchievementPopup(id);
    renderAchievements();
  }
}

function checkAchievements() {
  achievements.forEach(a => {
    if (a.condition()) unlockAchievement(a.id);
  });
}

function renderAchievements() {
  const unlocked = getUnlockedAchievements();
  const list = document.getElementById("achievementsList");
  list.innerHTML = "";

  achievements.forEach(a => {
    const li = document.createElement("li");
    li.textContent = `${a.name} – ${a.desc}`;
    if (!unlocked.includes(a.id)) li.classList.add("locked");
    list.appendChild(li);
  });
}

function showAchievementPopup(id) {
  const achievement = achievements.find(a => a.id === id);
  const popup = document.createElement("div");
  popup.textContent = `🏆 Conquista desbloqueada: ${achievement.name}!`;
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #fff3d1;
    border: 2px solid gold;
    padding: 10px 15px;
    border-radius: 10px;
    z-index: 9999;
    font-weight: bold;
    box-shadow: 0 0 10px #ffc;
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

// Evento do botão
document.getElementById("achievementsBtn").addEventListener("click", () => {
  document.getElementById("achievementsSidebar").classList.toggle("open");
});

// Atualiza ao carregar
renderAchievements();

// Inicialização
loadGameData();
updateCoins();
updateStatsDisplay();
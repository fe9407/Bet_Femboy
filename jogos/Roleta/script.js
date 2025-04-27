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

function spin() {
  const result = document.getElementById("result");

  if (coins < 50) {
    result.textContent = "❌ Sem moedas suficientes!";
    return;
  }

  clickSound.play();
  coins -= 50;
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
      let symbol = symbols[Math.floor(Math.random() * symbols.length)];
      reels[i].innerHTML = `<img src="${symbol.img}" class="reel-img">`;
      values.push(symbol.name);
    }

    plays++;
    let isJackpot = false;
    let isLineWin = false;

    const container = document.querySelector(".reel-container");
    const allEqual = values.every(v => v === values[0]);

    if (allEqual) {
      result.textContent = "🌈 JACKPOT! Você ganhou 1000 moedas! ✨";
      coins += 1000;
      jackpots++;
      winSound.play();
      playConfetti();
      container.classList.add("glow");
    } else if (
      values.slice(0, 3).every(v => v === values[0]) ||
      values.slice(3, 6).every(v => v === values[3])
    ) {
      result.textContent = "🎉 Linha igual! +100 moedas!";
      coins += 100;
      lineWins++;
      isLineWin = true;
      winSound.play();
      playConfetti();
      container.classList.add("glow");
    } else {
      result.textContent = "😢 Tente novamente!";
      losses++;
    }

    updateCoins();
    updateStatsDisplay();
    saveGameData(); // 💾 Salva após a rodada
    checkAchievements();

    // Remove o brilho após 2 segundos
    setTimeout(() => {
      container.classList.remove("glow");
    }, 2000);
  }, 800);
}

const achievements = [
  { id: 'firstPlay', name: 'Primeira Jogada', desc: 'Dê seu primeiro spin', condition: () => plays >= 1 },
  { id: 'firstLineWin', name: 'Linha Premiada', desc: 'Ganhe sua primeira linha', condition: () => lineWins >= 1 },
  { id: 'firstJackpot', name: 'JACKPOT!', desc: 'Ganhe seu primeiro jackpot', condition: () => jackpots >= 1 },
  { id: 'tenPlays', name: 'Persistente', desc: 'Jogue 10 vezes', condition: () => plays >= 10 },
  { id: 'astolfoWin', name: 'Fã de Astolfo', desc: '3 Astolfos em linha', condition: () => lastLineIs(['Astolfo']) },
];

function lastLineIs(symbolsArray) {
  const reels = [
    document.getElementById("r1"),
    document.getElementById("r2"),
    document.getElementById("r3"),
  ];
  return reels.every(reel => reel.innerHTML.includes(symbolsArray[0]));
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
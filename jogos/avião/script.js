let multiplier = 1.00;
let interval;
let inGame = false;
let crashed = false;
let saldo = 100.00;
let apostaAtual = 0;

const multiplierDisplay = document.getElementById("multiplier");
const betBtn = document.getElementById("betBtn");
const cashoutBtn = document.getElementById("cashoutBtn");
const resultDisplay = document.getElementById("result");
const saldoDisplay = document.getElementById("saldo");
const valorApostaInput = document.getElementById("valorAposta");
const plane = document.getElementById("plane");
const gameArea = document.getElementById("game-area");

function atualizarSaldo() {
  saldoDisplay.textContent = `💰 Saldo: R$ ${saldo.toFixed(2)}`;
}

function startGame() {
  apostaAtual = parseFloat(valorApostaInput.value);

  if (isNaN(apostaAtual) || apostaAtual <= 0) {
    alert("Digite um valor de aposta válido.");
    return;
  }

  if (apostaAtual > saldo) {
    alert("Saldo insuficiente para essa aposta.");
    return;
  }

  saldo -= apostaAtual;
  atualizarSaldo();

  multiplier = 1.00;
  crashed = false;
  inGame = true;
  resultDisplay.textContent = "";
  betBtn.style.display = "none";
  cashoutBtn.style.display = "inline-block";
  multiplierDisplay.style.color = "#00ffcc";
  plane.style.bottom = "0px";  
  plane.style.display = "block";

  interval = setInterval(() => {
    multiplier += 0.01 + multiplier * 0.02;
    multiplierDisplay.textContent = multiplier.toFixed(2) + "x";
    const maxHeight = gameArea.clientHeight - 50; // altura máxima do avião (de 0 até topo)
    const percent = Math.min(multiplier / 10, 1); // limitar crescimento
    const newBottom = percent * maxHeight;
    plane.style.bottom = `${newBottom}px`;

    if (Math.random() < 0.01 + multiplier / 100) {
      crash();
    }
  }, 100);
}

function crash() {
  clearInterval(interval);
  crashed = true;
  inGame = false;
  multiplierDisplay.style.color = "#ff4d4d";
  resultDisplay.textContent = `💥 Explodiu em ${multiplier.toFixed(2)}x! Você perdeu R$ ${apostaAtual.toFixed(2)}.`;
  betBtn.style.display = "inline-block";
  cashoutBtn.style.display = "none";
  plane.style.display = "none";
}

function cashout() {
  if (inGame && !crashed) {
    clearInterval(interval);
    inGame = false;
    const ganho = apostaAtual * multiplier;
    saldo += ganho;
    atualizarSaldo();
    multiplierDisplay.style.color = "#00ffcc";
    resultDisplay.textContent = `✅ Você sacou em ${multiplier.toFixed(2)}x e ganhou R$ ${ganho.toFixed(2)}!`;
    betBtn.style.display = "inline-block";
    cashoutBtn.style.display = "none";
    plane.style.display = "none";
  }
}

betBtn.addEventListener("click", startGame);
cashoutBtn.addEventListener("click", cashout);

atualizarSaldo();
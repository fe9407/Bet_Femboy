document.addEventListener('DOMContentLoaded', function() {
    const balanceElement = document.getElementById('balance');
    const betAmountInput = document.getElementById('betAmount');
    const spinButton = document.getElementById('spinButton');
    const clearBetsButton = document.getElementById('clearBets');
    const resultElement = document.getElementById('result');
    const wheel = document.querySelector('.wheel');
    
    let balance = 1000;
    let currentBet = 0;
    let bets = [];
    
    // Cores dos números na roleta (0 é verde, outros alternam entre vermelho e preto)
    const numberColors = {
        0: 'green',
        1: 'red', 2: 'black', 3: 'red', 4: 'black', 5: 'red', 6: 'black', 7: 'red', 8: 'black',
        9: 'red', 10: 'black', 11: 'black', 12: 'red', 13: 'black', 14: 'red', 15: 'black',
        16: 'red', 17: 'black', 18: 'red', 19: 'red', 20: 'black', 21: 'red', 22: 'black',
        23: 'red', 24: 'black', 25: 'red', 26: 'black', 27: 'red', 28: 'black', 29: 'black',
        30: 'red', 31: 'black', 32: 'red', 33: 'black', 34: 'red', 35: 'black', 36: 'red'
    };
    
    // Criar números na roda da roleta
    for (let i = 0; i <= 36; i++) {
        const angle = (i / 37) * 360;
        const numberElement = document.createElement('div');
        numberElement.className = 'wheel-number';
        numberElement.textContent = i;
        numberElement.style.backgroundColor = numberColors[i];
        numberElement.style.transform = `rotate(${angle}deg) translate(120px) rotate(-${angle}deg)`;
        wheel.appendChild(numberElement);
    }
    
    // Selecionar números ou apostas
    document.querySelectorAll('.number, .bet-section').forEach(element => {
        element.addEventListener('click', function() {
            const betAmount = parseInt(betAmountInput.value);
            
            if (isNaN(betAmount)) {
                alert('Por favor, insira um valor válido para a aposta.');
                return;
            }
            
            if (betAmount > balance) {
                alert('Saldo insuficiente para esta aposta.');
                return;
            }
            
            // Verificar se já existe uma aposta neste elemento
            const existingBetIndex = bets.findIndex(bet => bet.element === this);
            
            if (existingBetIndex !== -1) {
                // Aumentar aposta existente
                bets[existingBetIndex].amount += betAmount;
                this.textContent = `${this.dataset.number || this.dataset.bet} ($${bets[existingBetIndex].amount})`;
            } else {
                // Criar nova aposta
                const bet = {
                    element: this,
                    type: this.classList.contains('number') ? 'number' : this.dataset.bet,
                    value: this.dataset.number || 
                           this.dataset.range || 
                           this.dataset.type || 
                           this.dataset.color || 
                           this.dataset.column,
                    amount: betAmount
                };
                
                bets.push(bet);
                this.textContent = `${this.dataset.number || this.dataset.bet} ($${betAmount})`;
                this.classList.add('selected');
            }
            
            currentBet += betAmount;
            balance -= betAmount;
            balanceElement.textContent = balance;
        });
    });
    
    // Girar a roleta
    spinButton.addEventListener('click', function() {
        if (bets.length === 0) {
            alert('Por favor, faça pelo menos uma aposta antes de girar a roleta.');
            return;
        }
        
        spinButton.disabled = true;
        resultElement.textContent = '';
        
        // Animação de giro
        const spinDuration = 3000 + Math.random() * 2000; // 3-5 segundos
        const spins = 5 + Math.random() * 5; // 5-10 rotações completas
        const targetAngle = Math.floor(Math.random() * 37); // Número aleatório de 0 a 36
        const finalAngle = spins * 360 + (targetAngle * (360 / 37));
        
        let startTime = null;
        
        function animateSpin(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / spinDuration;
            
            if (progress < 1) {
                // Easing function para desacelerar no final
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                wheel.style.transform = `rotate(${easedProgress * finalAngle}deg)`;
                requestAnimationFrame(animateSpin);
            } else {
                wheel.style.transform = `rotate(${finalAngle}deg)`;
                setTimeout(() => showResult(targetAngle), 500);
            }
        }
        
        requestAnimationFrame(animateSpin);
    });
    
    // Mostrar resultado e calcular ganhos
    function showResult(number) {
        resultElement.textContent = `Número sorteado: ${number}`;
        
        let totalWin = 0;
        
        bets.forEach(bet => {
            let win = 0;
            
            switch(bet.type) {
                case 'number':
                    if (parseInt(bet.value) === number) {
                        win = bet.amount * 35;
                    }
                    break;
                    
                case 'even':
                    if (number !== 0 && number % 2 === 0) {
                        win = bet.amount * 1;
                    }
                    break;
                    
                case 'odd':
                    if (number % 2 === 1) {
                        win = bet.amount * 1;
                    }
                    break;
                    
                case 'red':
                    if (numberColors[number] === 'red') {
                        win = bet.amount * 1;
                    }
                    break;
                    
                case 'black':
                    if (numberColors[number] === 'black') {
                        win = bet.amount * 1;
                    }
                    break;
                    
                case '1-18':
                    if (number >= 1 && number <= 18) {
                        win = bet.amount * 1;
                    }
                    break;
                    
                case '19-36':
                    if (number >= 19 && number <= 36) {
                        win = bet.amount * 1;
                    }
                    break;
                    
                case '1st-12':
                    if (number >= 1 && number <= 12) {
                        win = bet.amount * 2;
                    }
                    break;
                    
                case '2nd-12':
                    if (number >= 13 && number <= 24) {
                        win = bet.amount * 2;
                    }
                    break;
                    
                case '3rd-12':
                    if (number >= 25 && number <= 36) {
                        win = bet.amount * 2;
                    }
                    break;
                    
                case '2to1-1':
                    if (number % 3 === 1) { // Coluna 1: 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34
                        win = bet.amount * 2;
                    }
                    break;
                    
                case '2to1-2':
                    if (number % 3 === 2) { // Coluna 2: 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35
                        win = bet.amount * 2;
                    }
                    break;
                    
                case '2to1-3':
                    if (number % 3 === 0 && number !== 0) { // Coluna 3: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36
                        win = bet.amount * 2;
                    }
                    break;
            }
            
            totalWin += win;
            
            if (win > 0) {
                bet.element.style.boxShadow = '0 0 15px gold, 0 0 15px gold';
            }
        });
        
        if (totalWin > 0) {
            resultElement.textContent += ` - Você ganhou $${totalWin}!`;
            balance += totalWin;
        } else {
            resultElement.textContent += ' - Você perdeu esta rodada.';
        }
        
        balanceElement.textContent = balance;
        spinButton.disabled = false;
        
        // Limpar apostas após 3 segundos
        setTimeout(clearBets, 3000);
    }
    
    // Limpar apostas
    clearBetsButton.addEventListener('click', clearBets);
    
    function clearBets() {
        bets.forEach(bet => {
            bet.element.textContent = bet.element.dataset.number || bet.element.dataset.bet;
            bet.element.classList.remove('selected');
            bet.element.style.boxShadow = '';
        });
        
        bets = [];
        currentBet = 0;
    }
});
var $inner = $('.inner'),
    $spin = $('#spin'),
    $reset = $('#reset'),
    $data = $('.data'),
    $mask = $('.mask'),
    maskDefault = 'Place Your Bets',
    timer = 9000;

var red = [32,19,21,25,34,27,36,30,23,5,16,1,14,9,18,7,12,3];
var column1 = [1,4,7,10,13,16,19,22,25,28,31,34];
var column2 = [2,5,8,11,14,17,20,23,26,29,32,35];
var column3 = [3,6,9,12,15,18,21,24,27,30,33,36];

// Game state
var gameState = {
    balance: 1000,
    currentBetAmount: 5,
    totalBet: 0,
    bets: [],
    spinning: false
};

// Initialize the game
function initGame() {
    updateUI();
    $('.chip').first().addClass('selected');
    
    // Chip selection
    $('.chip').on('click', function() {
        $('.chip').removeClass('selected');
        $(this).addClass('selected');
        gameState.currentBetAmount = parseInt($(this).data('value'));
        updateUI();
    });
    
    // Bet placement
    $('.bet-btn').on('click', function() {
        if (gameState.spinning) return;
        
        var betType = $(this).data('bet');
        var betValue = $(this).data('value');
        var payout = calculatePayout(betType);
        
        // Check if bet already exists
        var existingBetIndex = gameState.bets.findIndex(bet => 
            bet.type === betType && bet.value === betValue
        );
        
        if (existingBetIndex >= 0) {
            // Increase existing bet
            gameState.bets[existingBetIndex].amount += gameState.currentBetAmount;
        } else {
            // Add new bet
            gameState.bets.push({
                type: betType,
                value: betValue,
                amount: gameState.currentBetAmount,
                payout: payout
            });
        }
        
        gameState.totalBet += gameState.currentBetAmount;
        gameState.balance -= gameState.currentBetAmount;
        
        updateUI();
        updateBetMarkers();
    });
    
    // Clear bets
    $('#clear-bets').on('click', function() {
        if (gameState.spinning) return;
        
        gameState.balance += gameState.totalBet;
        gameState.bets = [];
        gameState.totalBet = 0;
        
        updateUI();
        $('.bet-marker').remove();
    });
    
    // Spin button
    $spin.on('click', function() {
        if (gameState.spinning || gameState.bets.length === 0) return;
        
        gameState.spinning = true;
        var randomNumber = Math.floor(Math.random() * 37);
        var color = null;
        
        $inner.attr('data-spinto', randomNumber).find('li:nth-child('+ (randomNumber + 1) +') input').prop('checked','checked');
        $(this).hide();
        $reset.addClass('disabled').prop('disabled','disabled').show();
        $('.placeholder').remove();
        
        setTimeout(function() {
            $mask.text('No More Bets');
        }, timer/2);
        
        setTimeout(function() {
            $mask.text(maskDefault);
        }, timer+500);
        
        setTimeout(function() {
            $reset.removeClass('disabled').prop('disabled','');
            
            if($.inArray(randomNumber, red) !== -1){ color = 'red'; } 
            else { color = 'black'; }
            if(randomNumber == 0){ color = 'green'; }
            
            $('.result-number').text(randomNumber);
            $('.result-color').text(color);
            $('.result').css({'background-color': ''+color+''});
            $data.addClass('reveal');
            $inner.addClass('rest');
            
            $thisResult = '<li class="previous-result color-'+ color +'"><span class="previous-number">'+ randomNumber +'</span><span class="previous-color">'+ color +'</span></li>';
            $('.previous-list').prepend($thisResult);
            
            // Calculate winnings
            calculateWinnings(randomNumber, color);
            gameState.spinning = false;
        }, timer);
    });
    
    // Reset button
    $reset.on('click', function() {
        $inner.attr('data-spinto','').removeClass('rest');
        $(this).hide();
        $spin.show();
        $data.removeClass('reveal');
    });
    
    // Swipe functionality
    var myElement = document.getElementById('plate');
    var mc = new Hammer(myElement);
    mc.on("swipe", function(ev) {
        if(!$reset.hasClass('disabled')){
            if($spin.is(':visible')){
                $spin.click();  
            } else {
                $reset.click();
            }
        }  
    });
}

// Update UI elements
function updateUI() {
    $('#current-bet-amount').text(gameState.currentBetAmount);
    $('#balance').text(gameState.balance);
    $('#total-bet').text(gameState.totalBet);
    
    // Update bets list
    var betsList = $('#bets-list');
    betsList.empty();
    
    gameState.bets.forEach(bet => {
        var betText = getBetDescription(bet.type, bet.value) + ' - ' + bet.amount;
        betsList.append('<li>' + betText + '</li>');
    });
}

// Calculate payout multiplier for bet type
function calculatePayout(betType) {
    switch(betType) {
        case 'straight': return 35;
        case 'split': return 17;
        case 'street': return 11;
        case 'corner': return 8;
        case 'line': return 5;
        case 'dozen': return 2;
        case 'column': return 2;
        case 'lowhigh': return 1;
        case 'evenodd': return 1;
        case 'color': return 1;
        default: return 0;
    }
}

// Get human-readable bet description
function getBetDescription(betType, betValue) {
    switch(betType) {
        case 'straight': return 'Número ' + betValue;
        case 'dozen': 
            if (betValue === '1') return '1ª Dúzia (1-12)';
            if (betValue === '2') return '2ª Dúzia (13-24)';
            return '3ª Dúzia (25-36)';
        case 'column': 
            if (betValue === '1') return '1ª Coluna';
            if (betValue === '2') return '2ª Coluna';
            return '3ª Coluna';
        case 'lowhigh': 
            return betValue === '1-18' ? 'Baixo (1-18)' : 'Alto (19-36)';
        case 'evenodd': 
            return betValue === 'even' ? 'Par' : 'Ímpar';
        case 'color': 
            return betValue === 'red' ? 'Vermelho' : 'Preto';
        default: return 'Aposta';
    }
}

// Calculate winnings after spin
function calculateWinnings(number, color) {
    var winnings = 0;
    
    gameState.bets.forEach(bet => {
        if (isWinningBet(bet, number, color)) {
            winnings += bet.amount * (bet.payout + 1);
        }
    });
    
    if (winnings > 0) {
        gameState.balance += winnings;
        alert('Você ganhou ' + winnings + '!');
    } else {
        alert('Não foi dessa vez! Tente novamente.');
    }
    
    // Reset bets for next round
    gameState.bets = [];
    gameState.totalBet = 0;
    $('.bet-marker').remove();
    updateUI();
}

// Check if a bet is a winner
function isWinningBet(bet, number, color) {
    switch(bet.type) {
        case 'straight':
            return parseInt(bet.value) === number;
        case 'dozen':
            var dozen = parseInt(bet.value);
            return (dozen === 1 && number >= 1 && number <= 12) ||
                   (dozen === 2 && number >= 13 && number <= 24) ||
                   (dozen === 3 && number >= 25 && number <= 36);
        case 'column':
            var col = parseInt(bet.value);
            return (col === 1 && column1.includes(number)) ||
                   (col === 2 && column2.includes(number)) ||
                   (col === 3 && column3.includes(number));
        case 'lowhigh':
            return (bet.value === '1-18' && number >= 1 && number <= 18) ||
                   (bet.value === '19-36' && number >= 19 && number <= 36);
        case 'evenodd':
            return (bet.value === 'even' && number % 2 === 0 && number !== 0) ||
                   (bet.value === 'odd' && number % 2 === 1);
        case 'color':
            return bet.value === color;
        default:
            return false;
    }
}

// Update bet markers on the wheel
function updateBetMarkers() {
    // Clear existing markers
    $('.bet-marker').remove();
    
    // Add markers for straight bets
    gameState.bets.filter(bet => bet.type === 'straight').forEach(bet => {
        var number = parseInt(bet.value);
        if (number >= 0 && number <= 36) {
            // Find the position on the wheel (adjust for 0-based index)
            var position = number === 0 ? 36 : number - 1;
            var $numberElement = $('.number').eq(position);
            
            // Create and position the marker
            var $marker = $('<div class="bet-marker">' + bet.amount + '</div>');
            $numberElement.append($marker);
        }
    });
}

// Initialize the game when ready
$(document).ready(function() {
    initGame();
    $reset.hide();
    $mask.text(maskDefault);
});
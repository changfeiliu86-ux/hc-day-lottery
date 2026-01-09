// Prize configuration
const prizes = [
    { level: 'grand', name: 'Power bank', nameZh: '充电宝', range: [1001, 1006], color: '#ffd700', type: 'black/white', typeZh: '黑色/白色' },
    { level: 'grand', name: 'HC mug', nameZh: 'HC 马克杯', range: [981, 1000], color: '#ffd700', type: 'dark grey/white', typeZh: '深灰色/白色' },
    { level: 'medium', name: 'Towel', nameZh: '毛巾', range: [931, 980], color: '#667eea', type: '', typeZh: '' },
    { level: 'medium', name: 'Canvas bag', nameZh: '帆布袋', range: [901, 930], color: '#667eea', type: 'white', typeZh: '白色' },
    { level: 'medium', name: 'Silver luggage tag', nameZh: '银色行李牌', range: [851, 900], color: '#667eea', type: '', typeZh: '' },
    { level: 'medium', name: 'Pen', nameZh: '笔', range: [801, 850], color: '#667eea', type: '', typeZh: '' },
    { level: 'small', name: 'Folding cup', nameZh: '折叠杯', range: [751, 800], color: '#48bb78', type: '', typeZh: '' },
    { level: 'small', name: 'Plastic folder', nameZh: '塑料文件夹', range: [451, 750], color: '#48bb78', type: 'purple', typeZh: '紫色' },
    { level: 'small', name: 'Environmental bag', nameZh: '环保袋', range: [401, 450], color: '#48bb78', type: 'grey', typeZh: '灰色' },
    { level: 'small', name: 'Plastic folder', nameZh: '塑料文件夹', range: [201, 400], color: '#48bb78', type: '', typeZh: '' },
    { level: 'small', name: 'Paper folder', nameZh: '纸质文件夹', range: [1, 200], color: '#48bb78', type: '', typeZh: '' }
];

// Language configuration
const translations = {
    zh: {
        title: '🎉 HC Day 幸运抽奖 🎉',
        numberLabel: '🎯 你的幸运号码是',
        prizeName: '✨ 点击按钮开始抽奖吧！',
        drawButton: '🎲 开始抽奖',
        remainingLabel: '剩余号码',
        allDrawn: '🎊 所有号码已抽完！',
        drawing: '🎰 正在抽奖中...',
        nextRound: '✨ 开启下一轮',
        level: {
            grand: '🎁 大奖',
            medium: '🎁 中奖',
            small: '🎁 小奖'
        }
    },
    en: {
        title: '🎉 HC Day Lucky Draw 🎉',
        numberLabel: '🎯 Your Lucky Number',
        prizeName: '✨ Click the button to start!',
        drawButton: '🎲 Draw Number',
        remainingLabel: 'Remaining Numbers',
        allDrawn: '🎊 All numbers have been drawn!',
        drawing: '🎰 Drawing...',
        nextRound: '✨ Next Round',
        level: {
            grand: '🎁 Grand Prize',
            medium: '🎁 Medium Prize',
            small: '🎁 Small Prize'
        }
    }
};

// Application state
let drawnNumbers = new Set();
let currentLanguage = 'zh';
let history = [];

// Load data from localStorage
function loadStoredData() {
    const data = localStorage.getItem('lotteryData');
    if (data) {
        const parsed = JSON.parse(data);
        drawnNumbers = new Set(parsed.drawnNumbers || []);
        history = parsed.history || [];
    }
}

// Save data to localStorage
function saveData() {
    const data = {
        drawnNumbers: Array.from(drawnNumbers),
        history: history
    };
    localStorage.setItem('lotteryData', JSON.stringify(data));
}

// Initialize available numbers (1-1006)
const totalNumbers = 1006;
const availableNumbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);

// DOM elements
const elements = {
    title: document.getElementById('title'),
    langToggle: document.getElementById('langToggle'),
    numberDisplay: document.getElementById('drawnNumber'),
    numberLabel: document.getElementById('numberLabel'),
    prizeInfo: document.getElementById('prizeName'),
    drawButton: document.getElementById('drawButton'),
    drawButtonText: document.getElementById('drawButtonText'),
    nextRoundButton: document.getElementById('nextRoundButton'),
    nextRoundButtonText: document.getElementById('nextRoundButtonText')
};

// Get prize for a number
function getPrizeForNumber(number) {
    for (const prize of prizes) {
        if (number >= prize.range[0] && number <= prize.range[1]) {
            return prize;
        }
    }
    return null;
}

// Format prize name
function formatPrizeName(prize, lang) {
    if (!prize) return '';
    
    const name = lang === 'zh' ? prize.nameZh : prize.name;
    const type = lang === 'zh' ? prize.typeZh : prize.type;
    const level = translations[lang].level[prize.level];
    
    let result = `${level}：${name}`;
    if (type) {
        result += ` (${type})`;
    }
    return result;
}

// Draw a random number
function drawNumber() {
    const remaining = availableNumbers.filter(n => !drawnNumbers.has(n));
    
    if (remaining.length === 0) {
        alert(translations[currentLanguage].allDrawn);
        return null;
    }
    
    const randomIndex = Math.floor(Math.random() * remaining.length);
    const drawnNumber = remaining[randomIndex];
    
    drawnNumbers.add(drawnNumber);
    return drawnNumber;
}

// Update UI
function updateUI() {
    const lang = currentLanguage;
    const t = translations[lang];
    
    // Update text elements
    elements.title.textContent = t.title;
    elements.numberLabel.textContent = t.numberLabel;
    elements.drawButtonText.textContent = t.drawButton;
    elements.nextRoundButtonText.textContent = t.nextRound;
    
    // Update button state
    elements.drawButton.disabled = drawnNumbers.size >= totalNumbers;
}

// Reset for next round
function resetForNextRound() {
    elements.numberDisplay.textContent = '?';
    elements.prizeInfo.textContent = translations[currentLanguage].prizeName;
    elements.drawButton.style.display = 'block';
    elements.nextRoundButton.style.display = 'none';
    elements.drawButton.disabled = drawnNumbers.size >= totalNumbers;
}


// Handle draw button click
function handleDraw() {
    if (drawnNumbers.size >= totalNumbers) {
        alert(translations[currentLanguage].allDrawn);
        return;
    }
    
    // Disable button during drawing
    elements.drawButton.disabled = true;
    elements.drawButtonText.textContent = translations[currentLanguage].drawing;
    
    // Start rolling animation
    elements.numberDisplay.textContent = '?';
    elements.numberDisplay.classList.add('rolling');
    elements.prizeInfo.textContent = translations[currentLanguage].drawing;
    
    // Roll for 2-3 seconds to build suspense
    const rollDuration = 2000 + Math.random() * 1000; // 2-3 seconds
    const updateInterval = 50; // Update every 50ms
    let elapsed = 0;
    
    const rollTimer = setInterval(() => {
        elapsed += updateInterval;
        
        // Show random numbers while rolling
        const remaining = availableNumbers.filter(n => !drawnNumbers.has(n));
        if (remaining.length > 0) {
            const randomIndex = Math.floor(Math.random() * remaining.length);
            elements.numberDisplay.textContent = remaining[randomIndex];
        }
        
        if (elapsed >= rollDuration) {
            clearInterval(rollTimer);
            
            // Draw the actual number
            const number = drawNumber();
            const prize = getPrizeForNumber(number);
            const prizeName = formatPrizeName(prize, currentLanguage);
            
            // Remove rolling class and add reveal animation
            elements.numberDisplay.classList.remove('rolling');
            elements.numberDisplay.classList.add('reveal');
            
            // Update display with final number
            setTimeout(() => {
                elements.numberDisplay.textContent = number;
                elements.prizeInfo.textContent = prizeName;
                
                // Add to history and save
                history.push({ 
                    number: number, 
                    prize: prize, 
                    timestamp: Date.now() 
                });
                saveData();
                
                // Remove reveal class after animation
                setTimeout(() => {
                    elements.numberDisplay.classList.remove('reveal');
                    
                    // Hide draw button and show next round button
                    elements.drawButton.style.display = 'none';
                    elements.nextRoundButton.style.display = 'block';
                }, 800);
            }, 100);
            
            // Update UI
            updateUI();
        }
    }, updateInterval);
}

// Handle next round button click
function handleNextRound() {
    resetForNextRound();
}

// Toggle language
function toggleLanguage() {
    currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
    elements.langToggle.textContent = currentLanguage === 'zh' ? 'English' : '中文';
    
    // Update current display if there's a drawn number
    if (elements.numberDisplay.textContent !== '?' && !isNaN(parseInt(elements.numberDisplay.textContent))) {
        const currentNumber = parseInt(elements.numberDisplay.textContent);
        const prize = getPrizeForNumber(currentNumber);
        if (prize) {
            elements.prizeInfo.textContent = formatPrizeName(prize, currentLanguage);
        }
    } else {
        elements.prizeInfo.textContent = translations[currentLanguage].prizeName;
    }
    
    updateUI();
}

// Handle keyboard shortcuts
function handleKeyboard(event) {
    // Only trigger if spacebar is pressed and not in an input field
    if (event.code === 'Space' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault(); // Prevent page scroll
        
        // Check which button is visible and enabled
        if (elements.drawButton.style.display !== 'none' && !elements.drawButton.disabled) {
            handleDraw();
        } else if (elements.nextRoundButton.style.display !== 'none') {
            handleNextRound();
        }
    }
}

// Event listeners
elements.drawButton.addEventListener('click', handleDraw);
elements.nextRoundButton.addEventListener('click', handleNextRound);
elements.langToggle.addEventListener('click', toggleLanguage);

// Add keyboard event listener
document.addEventListener('keydown', handleKeyboard);

// Ensure admin link works
const adminLink = document.getElementById('adminLink');
if (adminLink) {
    adminLink.addEventListener('click', function(e) {
        window.location.href = 'admin.html';
    });
}

// Initialize
loadStoredData();
updateUI();


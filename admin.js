// Prize configuration (same as main script)
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

const totalNumbers = 1006;

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
function formatPrizeName(prize) {
    if (!prize) return '未知';
    return `${prize.nameZh}${prize.typeZh ? ' (' + prize.typeZh + ')' : ''}`;
}

// Load data from localStorage
function loadData() {
    const data = localStorage.getItem('lotteryData');
    if (!data) {
        return {
            drawnNumbers: [],
            history: []
        };
    }
    return JSON.parse(data);
}

// Get all records
function getAllRecords() {
    const data = loadData();
    return data.history || [];
}

// Update statistics
function updateStatistics() {
    const data = loadData();
    const drawnNumbers = new Set(data.drawnNumbers || []);
    const history = data.history || [];
    
    document.getElementById('drawnCount').textContent = drawnNumbers.size;
    document.getElementById('remainingCount').textContent = totalNumbers - drawnNumbers.size;
    document.getElementById('drawTimes').textContent = history.length;
    
    // Update prize summary
    updatePrizeSummary(history);
}

// Update prize summary
function updatePrizeSummary(history) {
    const summary = {};
    
    history.forEach(record => {
        const prize = getPrizeForNumber(record.number);
        if (prize) {
            const key = `${prize.level}-${prize.nameZh}`;
            if (!summary[key]) {
                summary[key] = {
                    prize: prize,
                    count: 0
                };
            }
            summary[key].count++;
        }
    });
    
    const summaryContainer = document.getElementById('prizeSummary');
    summaryContainer.innerHTML = '';
    
    if (Object.keys(summary).length === 0) {
        summaryContainer.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">暂无奖品统计</div>';
        return;
    }
    
    Object.values(summary).forEach(item => {
        const div = document.createElement('div');
        div.className = `prize-summary-item ${item.prize.level}`;
        div.innerHTML = `
            <div class="prize-summary-name">${formatPrizeName(item.prize)}</div>
            <div class="prize-summary-count">已抽: ${item.count} 个</div>
        `;
        summaryContainer.appendChild(div);
    });
}

// Display records
function displayRecords(records = null) {
    const allRecords = records || getAllRecords();
    const tableBody = document.getElementById('recordsTable');
    
    if (allRecords.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #999;">
                    暂无抽奖记录
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = '';
    
    // Sort by timestamp (newest first)
    const sortedRecords = [...allRecords].sort((a, b) => b.timestamp - a.timestamp);
    
    sortedRecords.forEach((record, index) => {
        const prize = getPrizeForNumber(record.number);
        const row = document.createElement('tr');
        
        const date = new Date(record.timestamp);
        const timeString = date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        row.innerHTML = `
            <td>${sortedRecords.length - index}</td>
            <td><strong>#${record.number}</strong></td>
            <td>
                <span class="prize-badge ${prize ? prize.level : ''}">
                    ${prize ? (prize.level === 'grand' ? '大奖' : prize.level === 'medium' ? '中奖' : '小奖') : '未知'}
                </span>
            </td>
            <td>${formatPrizeName(prize)}</td>
            <td>${timeString}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Filter records
function filterRecords() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const allRecords = getAllRecords();
    
    if (!searchTerm) {
        displayRecords();
        return;
    }
    
    const filtered = allRecords.filter(record => {
        const number = record.number.toString();
        const prize = getPrizeForNumber(record.number);
        const prizeName = formatPrizeName(prize).toLowerCase();
        
        return number.includes(searchTerm) || prizeName.includes(searchTerm);
    });
    
    displayRecords(filtered);
}

// Export data
function exportData() {
    const data = loadData();
    const history = data.history || [];
    
    if (history.length === 0) {
        alert('暂无数据可导出');
        return;
    }
    
    // Create CSV content
    let csv = '序号,号码,奖品等级,奖品名称,抽奖时间\n';
    
    const sortedRecords = [...history].sort((a, b) => b.timestamp - a.timestamp);
    
    sortedRecords.forEach((record, index) => {
        const prize = getPrizeForNumber(record.number);
        const date = new Date(record.timestamp);
        const timeString = date.toLocaleString('zh-CN');
        const level = prize ? (prize.level === 'grand' ? '大奖' : prize.level === 'medium' ? '中奖' : '小奖') : '未知';
        const prizeName = formatPrizeName(prize);
        
        csv += `${sortedRecords.length - index},${record.number},${level},${prizeName},${timeString}\n`;
    });
    
    // Download CSV
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `抽奖记录_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Clear all data
function clearAllData() {
    if (confirm('确定要清空所有抽奖数据吗？此操作不可恢复！')) {
        localStorage.removeItem('lotteryData');
        alert('数据已清空');
        refreshData();
    }
}

// Refresh data
function refreshData() {
    updateStatistics();
    displayRecords();
}

// Initialize
refreshData();


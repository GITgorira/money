let currentPage = 'chart';
let chart;
let balance = 0;
let timer;
let multipliers = [];

function showPage(page) {
    document.getElementById(`${currentPage}-page`).style.display = 'none';
    document.getElementById(`${page}-page`).style.display = 'block';
    currentPage = page;
}

function deposit() {
    const amount = parseFloat(document.getElementById('amount').value);
    if (isNaN(amount) || amount <= 0) {
        alert("有効な金額を入力してください");
        return;
    }
    balance += amount;
    document.getElementById('balance').innerText = `残高: ${balance}`;
    startChart(amount);
}

function withdraw() {
    const amount = parseFloat(document.getElementById('amount').value);
    if (isNaN(amount) || amount <= 0) {
        alert("有効な金額を入力してください");
        return;
    }
    if (amount > balance * 0.5) {
        freezeAccount();
        return;
    }
    balance -= amount;
    document.getElementById('balance').innerText = `残高: ${balance}`;
}

function freezeAccount() {
    const notice = document.getElementById('freeze-notice');
    notice.style.display = 'block';
    setTimeout(() => {
        notice.style.display = 'none';
    }, 5000);
}

function startChart(initialAmount) {
    const ctx = document.getElementById('chart').getContext('2d');
    const data = [initialAmount];
    const labels = ['0s'];
    multipliers = [1];

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '金額',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    clearInterval(timer);
    timer = setInterval(() => {
        if (labels.length >= 12) {
            clearInterval(timer);
            return;
        }
        const lastAmount = data[data.length - 1];
        const multiplier = 0.67 + Math.random() * (1.98 - 0.67);
        const newAmount = lastAmount * multiplier;
        data.push(newAmount.toFixed(2));
        labels.push(`${labels.length * 5}s`);
        multipliers.push(multiplier.toFixed(2));
        chart.update();
        updateMultipliers();
        if (labels.length === 12) {
            data[data.length - 1] = (initialAmount * 2.15).toFixed(2);
            chart.update();
            balance = parseFloat(data[data.length - 1]);
            document.getElementById('balance').innerText = `残高: ${balance}`;
        }
    }, 5000);
}

function updateMultipliers() {
    const multipliersDiv = document.getElementById('multipliers');
    multipliersDiv.innerHTML = multipliers.map((multiplier, index) => `<p>${index * 5}s: ${multiplier}倍</p>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    showPage('chart');
});

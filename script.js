document.addEventListener('DOMContentLoaded', function() {
    const chartButton = document.getElementById('chartButton');
    const accountButton = document.getElementById('accountButton');
    const chartPage = document.getElementById('chartPage');
    const accountPage = document.getElementById('accountPage');
    const depositButton = document.getElementById('depositButton');
    const withdrawButton = document.getElementById('withdrawButton');
    const depositAmount = document.getElementById('depositAmount');
    const withdrawAmount = document.getElementById('withdrawAmount');
    const accountBalance = document.getElementById('accountBalance');
    const freezeMessage = document.getElementById('freezeMessage');
    const chartCanvas = document.getElementById('chartCanvas');
    const ctx = chartCanvas.getContext('2d');
    let balance = 0;
    let chartData = [];
    let chart;

    function showPage(page) {
        chartPage.style.display = 'none';
        accountPage.style.display = 'none';
        page.style.display = 'block';
    }

    chartButton.addEventListener('click', function() {
        showPage(chartPage);
    });

    accountButton.addEventListener('click', function() {
        showPage(accountPage);
    });

    depositButton.addEventListener('click', function() {
        const amount = parseFloat(depositAmount.value);
        if (isNaN(amount) || amount <= 0) return;

        balance = amount;
        accountBalance.textContent = `¥${balance.toFixed(2)}`;
        freezeMessage.style.display = 'none';
        chartData = generateChartData(amount);
        updateChart();
    });

    withdrawButton.addEventListener('click', function() {
        const amount = parseFloat(withdrawAmount.value);
        if (isNaN(amount) || amount <= 0) return;

        if (amount > balance * 0.5) {
            freezeMessage.style.display = 'block';
            setTimeout(() => {
                freezeMessage.style.display = 'none';
            }, 5000);
        } else {
            balance -= amount;
            accountBalance.textContent = `¥${balance.toFixed(2)}`;
        }
    });

    function generateChartData(amount) {
        const data = [];
        const steps = 12;
        const interval = 5;
        const maxMultiplier = 2.15;
        for (let i = 0; i <= steps; i++) {
            const multiplier = 1 + (maxMultiplier - 1) * (i / steps);
            const value = amount * multiplier;
            data.push({ time: i * interval, value: value });
        }
        return data;
    }

    function updateChart() {
        if (chart) {
            chart.destroy();
        }
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.map(point => point.time + 's'),
                datasets: [{
                    label: '金額',
                    data: chartData.map(point => point.value.toFixed(2)),
                    borderColor: 'blue',
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: '時間 (秒)' } },
                    y: { title: { display: true, text: '金額 (¥)' } }
                }
            }
        });
    }
});

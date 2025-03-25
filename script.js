document.addEventListener('DOMContentLoaded', () => {
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');
    const toAccount = document.getElementById('toAccount');
    const toChart = document.getElementById('toChart');
    const amountForm = document.getElementById('amountForm');
    const withdrawForm = document.getElementById('withdrawForm');
    const balanceElement = document.getElementById('balance');
    const freezeMessage = document.getElementById('freezeMessage');
    const chartElement = document.getElementById('chart');
    const chartInfo = document.getElementById('chart-info');
    let balance = 0;
    let chartValues = [];
    let initialAmount = 0;
    let finalAmount = 0;

    const showPage = (page) => {
        page1.style.display = 'none';
        page2.style.display = 'none';
        page.style.display = 'flex';
    };

    const updateChart = () => {
        const ctx = chartElement.getContext('2d');
        ctx.clearRect(0, 0, chartElement.width, chartElement.height);

        ctx.beginPath();
        ctx.moveTo(0, chartElement.height - (chartValues[0] / finalAmount * chartElement.height));
        chartValues.forEach((value, index) => {
            const x = (index / (chartValues.length - 1)) * chartElement.width;
            const y = chartElement.height - (value / finalAmount * chartElement.height);
            ctx.lineTo(x, y);
        });
        ctx.stroke();

        chartInfo.innerHTML = chartValues.map((value, index) => `<p>${index * 5}秒: ${value.toFixed(2)}円</p>`).join('');
    };

    const startChart = (amount) => {
        chartValues = [];
        initialAmount = amount;
        finalAmount = amount * 2.15;
        const stepCount = 12; // 5秒ごとに1分間のグラフを表示（12ステップ）
        const stepIncrease = (finalAmount - initialAmount) / stepCount;

        for (let i = 0; i <= stepCount; i++) {
            const randomFactor = 0.67 + Math.random() * (1.98 - 0.67);
            const value = initialAmount + i * stepIncrease * randomFactor;
            chartValues.push(value);
        }

        updateChart();
    };

    toAccount.addEventListener('click', () => showPage(page2));
    toChart.addEventListener('click', () => showPage(page1));

    amountForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('amount').value);
        balance += amount;
        balanceElement.textContent = balance.toFixed(2);
        startChart(amount);
        showPage(page1);
    });

    withdrawForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const withdrawAmount = parseFloat(document.getElementById('withdrawAmount').value);
        if (withdrawAmount > balance) {
            freezeMessage.style.display = 'block';
        } else {
            balance -= withdrawAmount;
            balanceElement.textContent = balance.toFixed(2);
        }
    });

    showPage(page1);
});

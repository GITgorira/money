document.addEventListener('DOMContentLoaded', function() {
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');
    const toAccountButton = document.getElementById('toAccount');
    const toChartButton = document.getElementById('toChart');
    const depositButton = document.getElementById('deposit');
    const withdrawButton = document.getElementById('withdraw');
    const amountInput = document.getElementById('amount');
    const balanceDisplay = document.getElementById('balance');
    const withdrawAmountInput = document.getElementById('withdrawAmount');
    const freezeMessage = document.getElementById('freezeMessage');
    let balance = 0;

    toAccountButton.addEventListener('click', () => {
        page1.style.display = 'none';
        page2.style.display = 'flex';
    });

    toChartButton.addEventListener('click', () => {
        page1.style.display = 'flex';
        page2.style.display = 'none';
    });

    depositButton.addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            alert('正しい金額を入力してください');
            return;
        }
        balance += amount;
        balanceDisplay.textContent = balance.toFixed(2);
        startChart(amount);
    });

    withdrawButton.addEventListener('click', () => {
        const withdrawAmount = parseFloat(withdrawAmountInput.value);
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            alert('正しい金額を入力してください');
            return;
        }
        if (withdrawAmount > balance * 0.5) {
            freezeMessage.style.display = 'block';
            setTimeout(() => {
                freezeMessage.style.display = 'none';
            }, 5000);
            return;
        }
        balance -= withdrawAmount;
        balanceDisplay.textContent = balance.toFixed(2);
    });

    const ctx = document.getElementById('chart').getContext('2d');
    let chart;

    function startChart(initialAmount) {
        if (chart) {
            chart.destroy();
        }
        let labels = ['0秒', '5秒', '10秒', '15秒', '20秒', '25秒', '30秒', '35秒', '40秒', '45秒', '50秒', '55秒', '60秒'];
        let data = [initialAmount];
        let currentAmount = initialAmount;

        for (let i = 1; i < labels.length; i++) {
            let multiplier = 1 + (Math.random() * (2.15 - 1) * (60 - i * 5) / 60);
            currentAmount = (initialAmount * multiplier).toFixed(2);
            data.push(currentAmount);
        }

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '金額変動',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                animation: {
                    duration: 0
                }
            }
        });

        let index = 1;
        const interval = setInterval(() => {
            if (index >= data.length) {
                clearInterval(interval);
                balance = parseFloat(data[data.length - 1]);
                balanceDisplay.textContent = balance.toFixed(2);
                return;
            }
            chart.data.datasets[0].data[index] = data[index];
            chart.update();
            index++;
        }, 5000);
    }
});

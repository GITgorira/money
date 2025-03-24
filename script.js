document.getElementById('startButton').addEventListener('click', function() {
    const inputValue = Number(document.getElementById('inputValue').value);
    if (isNaN(inputValue) || inputValue <= 0) {
        alert('有効な数値を入力してください。');
        return;
    }

    const ctx = document.getElementById('investmentChart').getContext('2d');
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: '投資の成長',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '時間 (秒)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '価値'
                    },
                    beginAtZero: true
                }
            }
        }
    });

    let startTime = Date.now();
    let duration = 60000; // 1分 = 60000ミリ秒
    let endValue = inputValue * 2.5;

    function updateChart() {
        let elapsedTime = Date.now() - startTime;
        let progress = elapsedTime / duration;
        let currentValue = inputValue + (endValue - inputValue) * progress;

        chart.data.labels.push((elapsedTime / 1000).toFixed(1));
        chart.data.datasets[0].data.push(currentValue.toFixed(2));
        chart.update();

        if (elapsedTime < duration) {
            requestAnimationFrame(updateChart);
        }
    }

    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    updateChart();
});

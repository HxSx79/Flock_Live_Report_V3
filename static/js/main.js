// Initialize charts
function initializeCharts() {
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour',
                    displayFormats: {
                        hour: 'HH:mm'
                    }
                }
            },
            y: {
                beginAtZero: true
            }
        }
    };

    // Line 1 Chart
    const line1Ctx = document.getElementById('line1-chart').getContext('2d');
    const line1Chart = new Chart(line1Ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Parts/Hour',
                    borderColor: 'rgb(54, 162, 235)',
                    data: []
                },
                {
                    label: 'Total Quantity',
                    borderColor: 'rgb(75, 192, 192)',
                    data: []
                }
            ]
        },
        options: commonOptions
    });

    // Line 2 Chart
    const line2Ctx = document.getElementById('line2-chart').getContext('2d');
    const line2Chart = new Chart(line2Ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Parts/Hour',
                    borderColor: 'rgb(54, 162, 235)',
                    data: []
                },
                {
                    label: 'Total Quantity',
                    borderColor: 'rgb(75, 192, 192)',
                    data: []
                }
            ]
        },
        options: commonOptions
    });

    return { line1Chart, line2Chart };
}

// Update production data
function updateProductionData() {
    fetch('/production_data')
        .then(response => response.json())
        .then(data => {
            // Update line 1 data
            document.getElementById('part-number-1').textContent = data.line1.part.number;
            document.getElementById('part-name-1').textContent = data.line1.part.name;
            document.getElementById('quantity-1').textContent = data.line1.production.quantity;
            document.getElementById('delta-1').textContent = data.line1.production.delta;
            document.getElementById('pph-1').textContent = data.line1.production.pph;
            document.getElementById('scrap-1').textContent = data.line1.scrap.total;
            document.getElementById('scrap-rate-1').textContent = data.line1.scrap.rate + '%';

            // Update line 2 data
            document.getElementById('part-number-2').textContent = data.line2.part.number;
            document.getElementById('part-name-2').textContent = data.line2.part.name;
            document.getElementById('quantity-2').textContent = data.line2.production.quantity;
            document.getElementById('delta-2').textContent = data.line2.production.delta;
            document.getElementById('pph-2').textContent = data.line2.production.pph;
            document.getElementById('scrap-2').textContent = data.line2.scrap.total;
            document.getElementById('scrap-rate-2').textContent = data.line2.scrap.rate + '%';

            // Update totals
            document.getElementById('total-quantity').textContent = data.totals.quantity;
            document.getElementById('total-delta').textContent = data.totals.delta;
            document.getElementById('total-scrap').textContent = data.totals.scrap;
            document.getElementById('average-scrap-rate').textContent = data.totals.scrapRate + '%';

            // Update production details
            const detailsList = document.getElementById('production-details');
            detailsList.innerHTML = data.productionDetails.map(detail => 
                `<div>${detail.partNumber} - ${detail.quantity}</div>`
            ).join('');

            // Update charts
            updateCharts(data.charts);
        });
}

// Handle video upload
document.getElementById('video-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('video', file);

        fetch('/upload_video', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Video uploaded successfully');
            } else {
                alert('Error uploading video');
            }
        });
    }
});

// Initialize application
const charts = initializeCharts();
setInterval(updateProductionData, 5000); // Update every 5 seconds
updateProductionData(); // Initial update
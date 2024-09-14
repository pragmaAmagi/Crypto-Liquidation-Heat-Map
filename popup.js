document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#crypto-table tbody');
    const errorMessage = document.getElementById('error-message');

    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data);
            if (data.length === 0) {
                throw new Error('No data received from API');
            }
            tableBody.innerHTML = '';
            data.forEach(coin => {
                const priceChange = coin.price_change_percentage_24h;
                const heatmapColor = getHeatmapColor(priceChange);
                const row = `
                    <tr>
                        <td>${coin.name}</td>
                        <td>$${coin.current_price.toFixed(2)}</td>
                        <td class="heatmap-cell" style="background-color: ${heatmapColor}">
                            ${priceChange.toFixed(2)}%
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'Failed to fetch cryptocurrency data. Please try again later.';
        });
});

function getHeatmapColor(percentage) {
    const normalizedPercentage = Math.max(-10, Math.min(10, percentage)) / 10;
    if (normalizedPercentage < 0) {
        const red = Math.round(255 * (-normalizedPercentage));
        return `rgb(${red}, 0, 0)`;
    } else {
        const green = Math.round(255 * normalizedPercentage);
        return `rgb(0, ${green}, 0)`;
    }
}
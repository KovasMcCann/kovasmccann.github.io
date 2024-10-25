// JavaScript for Ticker Price Updates
async function updatePrices() {
    const tickerElements = document.querySelectorAll('.ticker-item');

    for (const tickerElement of tickerElements) {
        const ticker = tickerElement.dataset.ticker;

        try {
            const response = await fetch(`https://generic709.herokuapp.com/stockc/${ticker}`);
            if (!response.ok) {
                console.error(`Error fetching data for ${ticker}: ${response.statusText}`);
                continue;
            }

            const quote = await response.json();
            if (quote && quote.price !== undefined) {
                const newPrice = parseFloat(quote.price.toFixed(2));
                const oldPrice = previousPrices[ticker];

                previousPrices[ticker] = newPrice; // Cache price

                // Remove previous flash classes
                tickerElement.classList.remove('flash-up', 'flash-down');

                if (oldPrice !== undefined) {
                    const hasIncreased = newPrice > oldPrice;
                    const hasDecreased = newPrice < oldPrice;

                    if (hasIncreased) {
                        tickerElement.classList.add('flash-up');
                    } else if (hasDecreased) {
                        tickerElement.classList.add('flash-down');
                    }
                }

                tickerElement.innerHTML = `<span style="color: #FF00FF;">${ticker}</span> - ${newPrice}`;
            }
        } catch (error) {
            console.error(`Error updating ${ticker}:`, error);
        }
    }
}

// Initialize ticker items and start price updates
initializeTickerDisplay();
setInterval(updatePrices, 500);

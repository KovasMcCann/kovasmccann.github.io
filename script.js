// Based off of https://github.com/martinshkreli/stocks
// Cache to store previous prices
const previousPrices = {};

// Fetch and update ticker prices
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

                // Add price to cache for future comparisons
                previousPrices[ticker] = newPrice;

                // Determine if price has increased or decreased
                if (oldPrice !== undefined) {
                    const hasIncreased = newPrice > oldPrice;
                    const hasDecreased = newPrice < oldPrice;

                    // Remove any previous flash classes
                    tickerElement.classList.remove('flash-up', 'flash-down');

                    // Apply the correct flash class based on price change
                    if (hasIncreased) {
                        tickerElement.classList.add('flash-up');
                    } else if (hasDecreased) {
                        tickerElement.classList.add('flash-down');
                    }
                }

                // Update ticker display with new price
                tickerElement.innerHTML = `<span style="color: #FF00FF;">${ticker}</span> - ${newPrice}`;
            }
        } catch (error) {
            console.error(`Error updating ${ticker}:`, error);
        }
    }
}

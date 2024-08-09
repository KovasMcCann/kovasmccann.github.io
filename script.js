// Based off of https://github.com/martinshkreli/stocks
const tickers = [ 'AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA', 'FB', 'NVDA', 'PYPL', 'NFLX', 'INTC', 'CSCO', 'CMCSA', 'PEP', 'ADBE', 'AVGO', 'TMUS', 'COST', 'QCOM', 'AMGN', 'TXN', 'SBUX', 'INTU', 'AMD', 'ISRG', 'GILD', 'MU', 'ADP', 'BKNG' ];

let count = 0;
const startTime = Date.now();
const randchars = ['*', '%', '$', '&', '@', '!', '^', '~', '+', '?', '/', '|', '<', '>'];

function drawScreen() {
    const container = document.getElementById('ticker-container');
    container.innerHTML = '';
    tickers.forEach(ticker => {
        const item = document.createElement('div');
        item.className = 'ticker-item';
        item.dataset.ticker = ticker;
        
        // Set initial styles for the ticker item
        item.style.fontFamily = "'Courier New', Courier, monospace";
        item.style.color = '#00FF00'; // Neon green
        item.style.backgroundColor = '#000000'; // Black background
        item.style.padding = '5px';
        item.style.borderRadius = '3px';
        item.style.border = '1px solid #00FF00'; // Neon green border
        
        item.textContent = `${ticker} - `;
        container.appendChild(item);
    });
}

async function grab() {
    for (const singleticker of tickers) {
        try {
            const response = await fetch(`https://generic709.herokuapp.com/stockc/${singleticker}`);
            const quote = await response.json();
            if (!quote || !quote.price) continue;

            const item = Array.from(document.querySelectorAll('.ticker-item'))
                .find(el => el.dataset.ticker === singleticker);
            
            if (item) {
                const price = quote.price.toFixed(2);
                const char = randchars[Math.floor(Math.random() * randchars.length)];
                
                // Apply styles directly to the text content
                item.innerHTML = `<span style="color: #FF00FF;">${singleticker}</span> - ${price}${char}`;
            }

            count++;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

drawScreen();
setInterval(grab, 500);

// Based off of https://github.com/martinshkreli/stocks

/* const tickers = [
    'AAPL', 'ABBV', 'AMD', 'BA', 'BABA', 'BAC', 'BAX', 'BBY', 'BDX', 'BIDU', 'BIIB',
    'BMY', 'BP', 'BRK.A', 'BRK.B', 'BSX', 'C', 'CL', 'CLFD', 'DIS', 'EA', 'F', 'GM',
    'GS', 'HD', 'IBM', 'JNJ', 'KO', 'LMT', 'LOW', 'META', 'MSFT', 'NFLX', 'NKE',
    'NOK', 'NVDA', 'ORCL', 'OXY', 'PFE', 'PG', 'PYPL', 'QCOM', 'RBLX', 'REGN',
    'SBUX', 'SHOP', 'SQ', 'T', 'TSLA', 'U', 'UNH', 'V', 'VZ', 'WMT', 'XOM', 'ZM'
]; */

const tickers = [ 'AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA', 'FB', 'NVDA', 'PYPL', 'NFLX', 'INTC', 'CSCO', 'CMCSA', 'PEP', 'ADBE', 'AVGO', 'TMUS', 'COST', 'QCOM', 'AMGN', 'TXN', 'SBUX', 'INTU', 'AMD', 'ISRG', 'GILD', 'MU', 'ADP', 'BKNG', 'FISV', 'MDLZ', 'REGN', 'ATVI' ];

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
            /*
            if (count % 250 === 0 && count > 1) {
                const endTime = Date.now();
                const elapsedTime = (endTime - startTime) / 1000;
                const seconds = Math.floor(elapsedTime % 60);
                const minutes = Math.floor(elapsedTime / 60);
                const rate = Math.floor(count / elapsedTime);

                const status = document.getElementById('status');
                status.style.position = 'fixed';
                status.style.bottom = '10px';
                status.style.left = '10px';
                status.style.color = '#FF00FF'; // Neon pink
                status.style.backgroundColor = '#000000'; // Black background
                status.style.padding = '10px';
                status.style.borderRadius = '5px';
                status.innerHTML = `
                    Data Received: ${count} <br>
                    Time Elapsed: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} <br>
                    Rate: ${rate}x
                `;
            }
            */
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

drawScreen();
setInterval(grab, 500);
